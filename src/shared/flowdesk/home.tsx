import {
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileSearch2,
  FolderKanban,
  History,
  ListChecks,
  MessageSquareText,
  ScanLine,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { flowdeskPaths as paths } from '@/config/flowdesk';

export async function FlowdeskHome() {
  const t = await getTranslations('home');
  const steps = [
    ['intake', MessageSquareText],
    ['review', ScanLine],
    ['list', FolderKanban],
    ['detail', History],
  ] as const;
  const features = [
    ['context', BrainCircuit],
    ['extract', ListChecks],
    ['evidence', FileSearch2],
    ['match', UserRoundCheck],
    ['rules', CalendarClock],
    ['track', ClipboardCheck],
  ] as const;
  const principles = ['evidence', 'missing', 'confirm'] as const;
  return (
    <main className="fd-home">
      <section className="fd-hero">
        <div className="fd-wrap">
          <div className="fd-hero-grid">
            <div className="fd-hero-copy">
              <h1>
                {t('hero.lead')}
                <br />
                <em>{t('hero.title')}</em>
              </h1>
              <p className="fd-lede">{t('hero.sub')}</p>
              <div className="fd-actions">
                <Link className="fd-btn" href={paths.intake}>
                  {t('hero.start')}
                  <ArrowRight />
                </Link>
                <Link className="fd-btn fd-secondary" href="/#workflow">
                  {t('hero.workflow')}
                </Link>
              </div>
              <p className="fd-hero-boundary">
                <ShieldCheck />
                {t('hero.boundary')}
              </p>
            </div>
            <aside className="fd-system-preview" aria-label={t('visual.label')}>
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
                      <BrainCircuit />
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
          <div className="fd-principles">
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
              <span>{t('visual.conversation')}</span>
              <ArrowRight />
              <span>{t('visual.draft')}</span>
              <ArrowRight />
              <span>{t('visual.confirm')}</span>
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
            {steps.map(([key, Icon], index) => (
              <Link key={key} href={paths[key]}>
                <div className="fd-step-head">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon />
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
          {features.map(([key, Icon], index) => (
            <article
              key={key}
              className={index < 2 ? 'fd-feature-primary' : ''}
            >
              <div className="fd-feature-icon">
                <Icon />
              </div>
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
            <ShieldCheck />
            <p>{t('trust.body')}</p>
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
