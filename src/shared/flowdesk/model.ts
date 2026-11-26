import {
  businessLines,
  departments,
  lines,
  people,
  sampleText,
  sourceDate,
} from './fixtures';

export const fields = [
  'title',
  'owner',
  'department',
  'due',
  'priority',
  'source',
] as const;
export type Field = (typeof fields)[number];
export type Evidence = { value: string; sentence: string };
export type Match = {
  status: 'matched' | 'ambiguous' | 'not_found';
  ids: string[];
  via: 'employee' | 'full' | 'short' | 'alias' | 'none';
};
export type DateResult = { date: string; end?: string; ambiguous?: boolean };
export type MentionRoles = {
  contact: Evidence;
  participants: Evidence[];
};
export type ConversationInsight = {
  text: string;
  evidence: string;
};
export type ConversationAnalysis = {
  sourceName: string;
  summary: string;
  participants: string[];
  decisions: ConversationInsight[];
  constraints: ConversationInsight[];
  openQuestions: ConversationInsight[];
};
export type Draft = {
  id: string;
  line: string;
  raw: string;
  context: string;
  reference: string;
  values: Record<Field, Evidence>;
  match: Match;
  contactMatch: Match;
  mentions: MentionRoles;
  dates: DateResult;
  alternatives: Partial<Record<Field, string[]>>;
  evidence?: Partial<Record<Field, string[]>>;
  edits: Partial<Record<Field, string>>;
  extractionSource?: 'ai' | 'rule';
  confidence?: number;
  separate?: boolean;
};
export type Action = Draft & {
  closed: boolean;
  sources: string[];
  history: Entry[];
};
export type Entry = {
  kind: 'sample' | 'created' | 'merged' | 'closed' | 'undone';
  at: string;
  source?: 'fixture' | 'system' | 'user';
};
type Undo = {
  itemId: string;
  previous: Action;
  removed?: Action;
  draft?: Draft;
  kind: 'merged' | 'closed';
};
export type Workspace = {
  context: string;
  input: string;
  reference: string;
  line: string;
  customLines: string[];
  drafts: Draft[];
  items: Action[];
  undo: Undo[];
  analysis?: ConversationAnalysis;
  lastExtraction?: {
    source: 'ai' | 'rule';
    at: string;
  };
};
export function detectBusinessLine(raw: string, fallback: string) {
  const input = raw.toLowerCase();
  return (
    businessLines.find((line) =>
      line.aliases.some((alias) => input.includes(alias.toLowerCase()))
    )?.short ?? fallback
  );
}
export function matchOwner(value: string): Match {
  const clean = value.replace(/[·\s-]/g, '').trim();
  const lower = clean.toLowerCase();
  const dept = departments.find((d) => lower.includes(d.toLowerCase()));
  const name = dept
    ? clean.replace(
        new RegExp(dept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        ''
      )
    : clean;
  const lowerName = name.toLowerCase();
  const group = people.filter((p) => !dept || p.dept === dept);
  const levels = [
    [
      'employee',
      people.filter((p) =>
        new RegExp('(?:^|[^0-9])' + p.id + '(?:$|[^0-9])').test(clean)
      ),
    ],
    ['full', people.filter((p) => lower.includes(p.name.toLowerCase()))],
    [
      'short',
      group.filter((p) =>
        p.short.some((short) => short.toLowerCase() === lowerName)
      ),
    ],
    [
      'alias',
      group.filter((p) => p.aliases.some((a) => a.toLowerCase() === lowerName)),
    ],
  ] as const;
  for (const [via, found] of levels)
    if (found.length)
      return {
        status: found.length === 1 ? 'matched' : 'ambiguous',
        via,
        ids: found.map((p) => p.id),
      };
  return { status: 'not_found', via: 'none', ids: [] };
}
const dayMs = 86400000;
export function normalizeDate(raw: string, ref: string): DateResult {
  const start = Date.parse(ref + 'T00:00:00Z');
  if (!Number.isFinite(start)) return { date: '' };
  const day = (offset: number) =>
    new Date(start + offset * dayMs).toISOString().slice(0, 10);
  const weekday = (new Date(start).getUTCDay() + 6) % 7;
  const absolute = raw.match(/(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?/);
  if (absolute) {
    const candidate = [
      absolute[1],
      absolute[2].padStart(2, '0'),
      absolute[3].padStart(2, '0'),
    ].join('-');
    const parsed = Date.parse(candidate + 'T00:00:00Z');
    return {
      date:
        Number.isFinite(parsed) &&
        new Date(parsed).toISOString().slice(0, 10) === candidate
          ? candidate
          : '',
    };
  }
  const yearless = raw.match(/(?:^|[^\d])(\d{1,2})[\/月](\d{1,2})日?/);
  if (yearless) {
    const reference = new Date(start);
    const month = Number(yearless[1]);
    const date = Number(yearless[2]);
    let year = reference.getUTCFullYear();
    // A December conversation that schedules January usually means next year.
    if (reference.getUTCMonth() + 1 - month > 6) year += 1;
    const candidate = [
      String(year),
      String(month).padStart(2, '0'),
      String(date).padStart(2, '0'),
    ].join('-');
    const parsed = Date.parse(candidate + 'T00:00:00Z');
    return {
      date:
        Number.isFinite(parsed) &&
        new Date(parsed).toISOString().slice(0, 10) === candidate
          ? candidate
          : '',
    };
  }
  if (/下周|next week/i.test(raw)) {
    const specific = raw.match(/下周([一二三四五六日天])/);
    if (specific)
      return {
        date: day(
          7 -
            weekday +
            '一二三四五六日'.indexOf(specific[1].replace('天', '日'))
        ),
      };
    return { date: day(7 - weekday), end: day(13 - weekday), ambiguous: true };
  }
  if (/这周|本周|this week/i.test(raw))
    return { date: day(-weekday), end: day(6 - weekday), ambiguous: true };
  const w = raw.match(/周([一二三四五六日天])/);
  if (w)
    return {
      date: day(
        ('一二三四五六日'.indexOf(w[1].replace('天', '日')) - weekday + 7) % 7
      ),
    };
  if (/明天|tomorrow/i.test(raw)) return { date: day(1) };
  if (/今天|today/i.test(raw)) return { date: day(0) };
  if (/后天/.test(raw)) return { date: day(2) };
  return { date: '' };
}
const duePattern =
  /(?:\d{4}[-/年]\d{1,2}[-/月]\d{1,2}日?|下周(?:找个时间|[一二三四五六日天])?|这周|本周|周[一二三四五六日天]|明天|今天|后天|tomorrow|today|this week|next week)/i;
// Keep separators so evidence can reconstruct the exact pasted message.
export function sourceFragments(raw: string): string[] {
  return (
    raw.match(/[^。！？!？.?；;\n]+[。！？!？.?；;]?|[。！？!？.?；;\n]/g) ?? []
  );
}
function findValues(sentences: string[], pattern: RegExp): Evidence[] {
  return sentences.flatMap((sentence) => {
    const m = sentence.match(pattern);
    return m ? [{ value: m[1].trim(), sentence }] : [];
  });
}
export function splitSourceBlocks(raw: string): string[] {
  const numbered = raw
    .replace(/(^|\n)\s*\d+[、.．]\s*/g, '$1\n\n')
    .replace(/([^\n])\s+\d+[、.．]\s*/g, '$1\n\n');
  const paragraphs = numbered
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  const lines = raw
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[、.．]\s*/, '').trim())
    .filter(Boolean);
  return lines.length > 1 ? lines : paragraphs;
}
export function extract(
  raw: string,
  line: string,
  reference: string,
  context = ''
): Draft[] {
  return raw.trim()
    ? splitSourceBlocks(raw).map((block, index) => {
        const sentences = sourceFragments(block)
          .map((s) => s.trim())
          .filter(Boolean);
        const data: Record<Field, Evidence[]> = {
          title: findValues(sentences, /[「“]([^」”]+)[」”]/),
          owner: [],
          department: findValues(
            sentences,
            /(?:协办部门|协办|support)\s*[:：]\s*([^。，；;.]+)/i
          ),
          due: [],
          priority: findValues(
            sentences,
            /(?:优先级|priority)\s*[:：]\s*(高|中|低|high|medium|low)/i
          ),
          source: findValues(sentences, /【([^】]+)】/),
        };
        if (!data.title.length)
          data.title = findValues(
            sentences,
            /(?:事项(?:标题)?|title)\s*[:：]\s*([^。；;.]+)/i
          );
        if (!data.title.length) {
          const appointment = sentences
            .map((sentence) => ({
              sentence,
              match: sentence.match(/跟([^，,]+秘书)约下时间/),
            }))
            .find((item) => item.match);
          if (appointment?.match)
            data.title = [
              {
                value: `联系${appointment.match[1].trim()}，预约立项沟通时间`,
                sentence: appointment.sentence,
              },
            ];
        }
        if (!data.title.length) {
          const briefing = sentences
            .map((sentence) => ({
              sentence,
              match: sentence.match(
                /(?:这周要)?跟([^，,]+?)交流一下([^，,]+?)(?:的事情)?(?:，|,|$)/
              ),
            }))
            .find((item) => item.match);
          if (briefing?.match)
            data.title = [
              {
                value:
                  '与' +
                  briefing.match[1].trim() +
                  '沟通' +
                  briefing.match[2].trim().replace(/的事情$/, ''),
                sentence: briefing.sentence,
              },
            ];
        }
        if (!data.title.length) {
          data.title = findValues(
            sentences,
            /(?:这周要)?((?:跟[^。，,；;.!?]+交流)(?:一下)?)/
          );
        }
        if (!data.title.length) {
          data.title = findValues(
            sentences,
            /(?:请|需要|负责|帮忙|前)(?:先|完成)?((?:核对|提交|整理|确认|复核|补齐|更新|交付|汇总|发送|预定)[^。，,；;.!?]+)/
          );
        }
        if (!data.source.length)
          data.source = findValues(
            sentences,
            /(?:来源|source)\s*[:：]\s*([^。；;.]+)/i
          );
        for (const sentence of sentences) {
          const content = sentence.replace(/【[^】]+】/g, '').trim();
          const explicit = content.match(
            /(?:负责人|owner)\s*[:：]\s*([^，。,；;.]+)/i
          );
          const terms = people
            .flatMap((person) => [
              person.name,
              ...person.short,
              ...person.aliases,
            ])
            .sort((a, b) => b.length - a.length);
          const responsibility = terms.find((term) => {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(
              `(?:${escaped}.{0,6}(?:负责|推进|跟进|处理)|(?:请|由|让).{0,4}${escaped}.{0,4}(?:负责|推进|跟进|处理))`,
              'i'
            ).test(content);
          });
          const owner = explicit?.[1] || responsibility;
          if (owner) data.owner.push({ value: owner.trim(), sentence });
          const due =
            content.match(duePattern)?.[0] ||
            content.match(/(?:截止(?:时间)?|due)\s*[:：]\s*([^。；;.]+)/i)?.[1];
          if (due) data.due.push({ value: due, sentence });
        }
        const values = {} as Draft['values'],
          alternatives: Draft['alternatives'] = {};
        const evidence: Draft['evidence'] = {};
        for (const f of fields) {
          evidence[f] = data[f].map((hit) => hit.sentence);
          values[f] = data[f][0] ?? { value: '', sentence: '' };
          const distinct = [...new Set(data[f].map((v) => v.value))];
          if (distinct.length > 1) alternatives[f] = distinct;
        }
        const contact = sentences
          .map((sentence) => ({
            sentence,
            value: sentence.match(/跟([^，,]+秘书)约下时间/)?.[1]?.trim() ?? '',
          }))
          .find((item) => item.value) ?? { value: '', sentence: '' };
        const participants = sentences.flatMap((sentence) => {
          const participant = sentence
            .match(/跟([^，,]+?)交流一下/)?.[1]
            ?.trim();
          return participant ? [{ value: participant, sentence }] : [];
        });
        return {
          id: 'draft-' + index,
          line: detectBusinessLine(block, line),
          raw: block,
          context,
          reference,
          values,
          match: matchOwner(values.owner.value),
          contactMatch: matchOwner(contact.value),
          mentions: { contact, participants },
          dates: normalizeDate(values.due.value, reference),
          alternatives,
          evidence,
          edits: {},
          extractionSource: 'rule',
        };
      })
    : [];
}
export function ownerId(d: Draft) {
  return d.edits.owner ?? (d.match.status === 'matched' ? d.match.ids[0] : '');
}
export function dueDate(d: Draft) {
  return d.edits.due ?? (d.dates.ambiguous ? '' : d.dates.date);
}
export function value(d: Draft, field: Field) {
  return d.edits[field] ?? d.values[field].value;
}
export function duplicates(d: Draft, items: Action[]) {
  return items.filter(
    (i) =>
      !i.closed &&
      i.id !== d.id &&
      ownerId(d) &&
      ownerId(i) === ownerId(d) &&
      dueDate(d) &&
      dueDate(i) === dueDate(d) &&
      value(i, 'title').trim() === value(d, 'title').trim()
  );
}
export function issues(d: Draft, items: Action[]) {
  const out: string[] = [];
  if (!value(d, 'title').trim()) out.push('title');
  if (!ownerId(d))
    out.push(
      !d.values.owner.value
        ? 'missing'
        : d.match.status === 'ambiguous'
          ? 'ambiguous'
          : 'unknown'
    );
  if (!dueDate(d)) out.push(d.dates.ambiguous ? 'vague' : 'date');
  if (fields.some((f) => d.alternatives[f] && !d.edits[f]))
    out.push('conflict');
  if (!d.separate && duplicates(d, items).length) out.push('duplicate');
  return out;
}
export function status(item: Action, today: string) {
  return item.closed
    ? 'closed'
    : dueDate(item) && dueDate(item) < today
      ? 'overdue'
      : 'open';
}
export function initialWorkspace(): Workspace {
  const drafts = extract(sampleText, lines[0], sourceDate);
  const make = (d: Draft, id: string): Action => ({
    ...d,
    id,
    closed: false,
    sources: [d.raw],
    history: [{ kind: 'sample', at: sourceDate, source: 'fixture' }],
  });
  const confirmed: Draft = {
    ...drafts[0],
    edits: { ...drafts[0].edits, owner: '0001', due: '2026-11-29' },
  };
  return {
    context: '',
    input: sampleText,
    reference: sourceDate,
    line: '计算',
    customLines: [],
    drafts,
    items: [make(confirmed, 'sample')],
    undo: [],
    lastExtraction: { source: 'rule', at: sourceDate },
  };
}
export function writeDraft(state: Workspace, d: Draft): Workspace {
  if (
    !state.drafts.some((draft) => draft.id === d.id) ||
    issues(d, state.items).length
  )
    return state;
  const entry: Entry = {
    kind: 'created',
    at: new Date().toISOString(),
    source: 'user',
  };
  const item: Action = {
    ...d,
    id: crypto.randomUUID(),
    closed: false,
    sources: [d.raw],
    history: [entry],
  };
  return {
    ...state,
    items: [item, ...state.items],
    drafts: state.drafts.filter((x) => x.id !== d.id),
  };
}
export function changeAction(
  state: Workspace,
  targetId: string,
  kind: 'closed' | 'merged',
  source?: Draft
): Workspace {
  const target = state.items.find((i) => i.id === targetId);
  if (!target || target.closed) return state;
  if (
    kind === 'merged' &&
    (!source ||
      !duplicates(source, [target]).length ||
      issues({ ...source, separate: true }, []).length)
  )
    return state;
  const removed = state.items.find((i) => i.id === source?.id);
  const entry: Entry = { kind, at: new Date().toISOString(), source: 'user' };
  const updated: Action = {
    ...target,
    closed: kind === 'closed',
    history: [...target.history, entry],
    sources: [
      ...new Set([
        ...target.sources,
        ...(removed?.sources ?? (source ? [source.raw] : [])),
      ]),
    ],
  };
  return {
    ...state,
    items: state.items
      .filter((i) => i.id !== removed?.id)
      .map((i) => (i.id === targetId ? updated : i)),
    drafts: state.drafts.filter((d) => d.id !== source?.id),
    undo: [
      ...state.undo,
      {
        kind,
        itemId: targetId,
        previous: target,
        removed,
        draft: removed ? undefined : source,
      },
    ],
  };
}
export function undoAction(state: Workspace, id: string): Workspace {
  const last = state.undo.at(-1),
    target = state.items.find((i) => i.id === id);
  if (!last || last.itemId !== id || !target) return state;
  const restored: Action = {
    ...last.previous,
    history: [
      ...target.history,
      { kind: 'undone', at: new Date().toISOString(), source: 'user' },
    ],
  };
  const draft = last.draft
    ? { ...last.draft, id: crypto.randomUUID() }
    : undefined;
  return {
    ...state,
    items: [
      ...state.items.map((i) => (i.id === id ? restored : i)),
      ...(last.removed ? [last.removed] : []),
    ],
    drafts: [...state.drafts, ...(draft ? [draft] : [])],
    undo: state.undo.slice(0, -1),
  };
}
