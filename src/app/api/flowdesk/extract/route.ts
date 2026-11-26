import {
  buildCoverageReviewRequest,
  buildExtractionRequest,
  draftsFromAI,
  FLOWDESK_EXTRACTION_PROMPT,
  needsCoverageReview,
  parseAIExtraction,
} from '@/shared/flowdesk/ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const defaultBaseUrl = 'https://direct.evolink.ai';
const fallbackBaseUrl = 'https://api.evolink.ai';
const defaultModel = 'deepseek-v4-pro';
const defaultReviewModel = 'deepseek-v4-pro';
const maxInputLength = 50_000;

type CompletionResponse = {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; type?: string };
};

class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

function completionUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
}

async function requestCompletion(input: {
  baseUrl: string;
  apiKey: string;
  model: string;
  userPrompt: string;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(completionUrl(input.baseUrl), {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${input.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: input.model,
        messages: [
          { role: 'system', content: FLOWDESK_EXTRACTION_PROMPT },
          { role: 'user', content: input.userPrompt },
        ],
        thinking: { type: 'disabled' },
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 7000,
      }),
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as CompletionResponse;
    if (!response.ok) {
      throw new ProviderError(
        data.error?.message || `AI provider returned ${response.status}`,
        response.status
      );
    }
    const content = data.choices?.[0]?.message?.content;
    if (!content)
      throw new ProviderError('AI provider returned no content', 502);
    return { content, usage: data.usage };
  } finally {
    clearTimeout(timeout);
  }
}

async function extractWithFallback(input: {
  apiKey: string;
  model: string;
  baseUrl: string;
  userPrompt: string;
}) {
  try {
    return await requestCompletion(input);
  } catch (error) {
    const shouldRetry =
      input.baseUrl !== fallbackBaseUrl &&
      (!(error instanceof ProviderError) || error.status >= 429);
    if (!shouldRetry) throw error;
    return requestCompletion({ ...input, baseUrl: fallbackBaseUrl });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = typeof body.raw === 'string' ? body.raw.trim() : '';
    const reference =
      typeof body.reference === 'string' ? body.reference.trim() : '';
    const line = typeof body.line === 'string' ? body.line.trim() : '';
    const context = typeof body.context === 'string' ? body.context.trim() : '';
    if (!raw || !reference || !line) {
      return Response.json(
        { ok: false, error: 'missing_required_input' },
        { status: 400 }
      );
    }
    if (raw.length > maxInputLength || context.length > 5_000) {
      return Response.json(
        { ok: false, error: 'input_too_large' },
        { status: 413 }
      );
    }

    const apiKey = process.env.EVOLINK_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        { ok: false, error: 'ai_not_configured' },
        { status: 503 }
      );
    }
    const model = process.env.FLOWDESK_AI_MODEL?.trim() || defaultModel;
    const baseUrl = process.env.FLOWDESK_AI_BASE_URL?.trim() || defaultBaseUrl;
    let result = await extractWithFallback({
      apiKey,
      model,
      baseUrl,
      userPrompt: buildExtractionRequest({ raw, reference, line, context }),
    });
    let extraction = parseAIExtraction(result.content);
    let modelUsed = model;
    let passes = 1;

    if (needsCoverageReview(raw, extraction)) {
      const reviewModel =
        process.env.FLOWDESK_AI_REVIEW_MODEL?.trim() || defaultReviewModel;
      const reviewed = await extractWithFallback({
        apiKey,
        model: reviewModel,
        baseUrl,
        userPrompt: buildCoverageReviewRequest(
          { raw, reference, line, context },
          result.content
        ),
      });
      const reviewedExtraction = parseAIExtraction(reviewed.content);
      passes = 2;
      if (reviewedExtraction.actions.length > extraction.actions.length) {
        extraction = reviewedExtraction;
        result = reviewed;
        modelUsed = reviewModel;
      }
    }
    const mapped = draftsFromAI({
      raw,
      reference,
      fallbackLine: line,
      context,
      extraction,
    });
    if (!mapped.drafts.length) {
      return Response.json(
        { ok: false, error: 'no_actions_found', analysis: mapped.analysis },
        { status: 422 }
      );
    }

    return Response.json({
      ok: true,
      ...mapped,
      meta: {
        model: modelUsed,
        passes,
        usage: result.usage ?? null,
      },
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === 'AbortError' || error.message.includes('aborted'));
    console.error('FlowDesk AI extraction failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return Response.json(
      { ok: false, error: isTimeout ? 'ai_timeout' : 'ai_unavailable' },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
