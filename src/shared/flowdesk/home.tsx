import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { flowdeskPaths as paths } from '@/config/flowdesk';

import {
  FeatureDiagram,
  HeroRouteMap,
  ProblemDiagram,
  TrustLedger,
  WorkflowGlyph,
  type FeatureVisual,
  type WorkflowVisual,
} from './visuals';

export async function FlowdeskHome() {
  const t = await getTranslations('home');
  const steps: WorkflowVisual[] = ['intake', 'review', 'list', 'detail'];
  const features = [
    'context',
    'extract',
    'evidence',
    'match',
    'rules',
    'track',
  ] satisfies FeatureVisual[];
  const principles = ['evidence', 'missing', 'confirm'] as const;
  return (
    <main className="fd-home">
      <section className="fd-hero">
        <div className="fd-wrap">
          <div className="fd-hero-grid">
            <div className="fd-hero-copy">
              <h1 className="fd-hero-title" data-enter="title">
                <span>{t('hero.lead')}</span>
                <span className="fd-hero-title-emphasis">
                  {t('hero.title')}
                </span>
              </h1>
              <p className="fd-lede" data-enter="copy">
                {t('hero.sub')}
              </p>
              <div className="fd-actions" data-enter="actions">
                <Link className="fd-btn" href={paths.intake}>
                  {t('hero.start')}
                  <ArrowRight />
                </Link>
                <Link className="fd-btn fd-secondary" href="/#workflow">
                  {t('hero.workflow')}
                </Link>
              </div>
              <p className="fd-hero-boundary" data-enter="boundary">
                <ShieldCheck />
                {t('hero.boundary')}
              </p>
            </div>
            <aside
              className="fd-system-preview"
              aria-label={t('visual.label')}
              data-enter="product"
            >
              <HeroRouteMap className="fd-hero-routes" />
              <div className="fd-system-head">
                <div>
                  <span className="fd-status-dot" />
                  {t('visual.label')}
                </div>
                <small>{t('visual.ready')}</small>
              </div>
              <div className="fd-system-flow">
                <div className="fd-system-source">
                  <p>{t('visual.source')}</p>
                  <div className="fd-source-row">
                    <span className="fd-source-icon">
                      <ScanLine />
                    </span>
                    <span>
                      <strong>{t('visual.requirement')}</strong>
                      <small>{t('visual.requirementState')}</small>
                    </span>
                  </div>
                  <div className="fd-source-row">
                    <span className="fd-source-icon">
                      <MessageSquareText />
                    </span>
                    <span>
                      <strong>{t('visual.conversation')}</strong>
                      <small>{t('visual.conversationState')}</small>
                    </span>
                  </div>
                </div>
                <div className="fd-system-process">
                  <ScanLine />
                  <span>{t('visual.interpretation')}</span>
                </div>
                <div className="fd-system-draft">
                  <div className="fd-draft-head">
                    <p>{t('visual.draft')}</p>
                    <span>{t('visual.review')}</span>
                  </div>
                  <div>
                    <span>{t('visual.owner')}</span>
                    <small>{t('visual.ai')}</small>
                  </div>
                  <div>
                    <span>{t('visual.due')}</span>
                    <small>{t('visual.rule')}</small>
                  </div>
                  <div>
                    <span>{t('visual.evidence')}</span>
                    <CheckCircle2 />
                  </div>
                  <div className="fd-draft-open">
                    <span>{t('visual.status')}</span>
                    <small>{t('visual.pending')}</small>
                  </div>
                </div>
              </div>
              <div className="fd-system-foot">
                <span>{t('visual.trace')}</span>
                <span>{t('visual.confirm')}</span>
              </div>
            </aside>
          </div>
          <div className="fd-principles" data-enter="principles">
            {principles.map((key) => (
              <div key={key}>
                <ShieldCheck />
                <div>
                  <strong>{t('principles.' + key)}</strong>
                  <span>{t('principles.' + key + 'Text')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fd-section fd-problem">
        <div className="fd-wrap fd-split">
          <div className="fd-section-heading">
            <h2>{t('problem.title')}</h2>
            <span>{t('problem.label')}</span>
          </div>
          <div>
            <p className="fd-paragraph">{t('problem.body')}</p>
            <div className="fd-problem-path" aria-hidden="true">
              <ProblemDiagram />
              <div className="fd-problem-stages">
                <span>{t('visual.conversation')}</span>
                <span>{t('visual.draft')}</span>
                <span>{t('visual.confirm')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="fd-band">
        <div className="fd-wrap fd-section">
          <div className="fd-section-heading fd-section-heading-row">
            <h2>{t('workflow.title')}</h2>
            <span>{t('workflow.label')}</span>
          </div>
          <div className="fd-steps">
            {steps.map((key, index) => (
              <Link key={key} href={paths[key]}>
                <div className="fd-step-head">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <WorkflowGlyph kind={key} />
                </div>
                <div>
                  <h3>{t('workflow.' + key)}</h3>
                  <p>{t('workflow.' + key + 'Text')}</p>
                </div>
                <ArrowRight className="fd-step-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="fd-wrap fd-section">
        <div className="fd-section-heading fd-feature-heading">
          <div>
            <h2>{t('features.title')}</h2>
            <span>{t('features.label')}</span>
          </div>
          <p className="fd-section-intro">{t('features.intro')}</p>
        </div>
        <div className="fd-feature-grid">
          {features.map((key, index) => (
            <article
              key={key}
              className={index < 2 ? 'fd-feature-primary' : ''}
            >
              <FeatureDiagram className="fd-feature-visual" kind={key} />
              <div>
                <h3>{t('features.' + key)}</h3>
                <p>{t('features.' + key + 'Text')}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fd-trust">
        <div className="fd-wrap fd-section fd-split">
          <div className="fd-section-heading">
            <h2>{t('trust.title')}</h2>
            <span>{t('trust.label')}</span>
          </div>
          <div className="fd-trust-copy">
            <TrustLedger />
            <div>
              <ShieldCheck />
              <p>{t('trust.body')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fd-wrap fd-section fd-end">
        <div>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.text')}</p>
        </div>
        <Link className="fd-btn" href={paths.intake}>
          {t('cta.button')}
        </Link>
      </section>
    </main>
  );
}
