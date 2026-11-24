import {
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
            <div>
              <p className="fd-kicker">
                <span className="fd-line" />
                {t('hero.eyebrow')}
              </p>
              <h1>
                {t('hero.lead')}
                <br />
                <em>{t('hero.title')}</em>
              </h1>
              <p className="fd-lede">{t('hero.sub')}</p>
              <div className="fd-actions">
                <Link className="fd-btn" href={paths.intake}>
                  <MessageSquareText />
                  {t('hero.start')}
                </Link>
                <Link className="fd-btn fd-secondary" href="/#workflow">
                  {t('hero.workflow')}
                </Link>
              </div>
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
                  <div>
                    <BrainCircuit />
                    <span>{t('visual.requirement')}</span>
                  </div>
                  <div>
                    <MessageSquareText />
                    <span>{t('visual.conversation')}</span>
                  </div>
                </div>
                <div className="fd-system-process">
                  <ScanLine />
                  <strong>{t('visual.interpretation')}</strong>
                </div>
                <div className="fd-system-draft">
                  <p>{t('visual.draft')}</p>
                  {(['owner', 'due', 'evidence', 'status'] as const).map(
                    (field) => (
                      <div key={field}>
                        <CheckCircle2 />
                        <span>{t('visual.' + field)}</span>
                      </div>
                    )
                  )}
                </div>
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

      <section className="fd-wrap fd-section fd-split">
        <div>
          <p className="fd-kicker">{t('problem.label')}</p>
          <h2>{t('problem.title')}</h2>
        </div>
        <p className="fd-paragraph">{t('problem.body')}</p>
      </section>

      <section id="workflow" className="fd-band">
        <div className="fd-wrap fd-section">
          <p className="fd-kicker">{t('workflow.label')}</p>
          <h2>{t('workflow.title')}</h2>
          <div className="fd-steps">
            {steps.map(([key, Icon]) => (
              <Link key={key} href={paths[key]}>
                <Icon />
                <h3>{t('workflow.' + key)}</h3>
                <p>{t('workflow.' + key + 'Text')}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="fd-wrap fd-section">
        <p className="fd-kicker">{t('features.label')}</p>
        <h2>{t('features.title')}</h2>
        <p className="fd-section-intro">{t('features.intro')}</p>
        <div className="fd-feature-grid">
          {features.map(([key, Icon]) => (
            <article key={key}>
              <Icon />
              <h3>{t('features.' + key)}</h3>
              <p>{t('features.' + key + 'Text')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fd-trust">
        <div className="fd-wrap fd-section fd-split">
          <div>
            <p className="fd-kicker">
              <ShieldCheck />
              {t('trust.label')}
            </p>
            <h2>{t('trust.title')}</h2>
          </div>
          <p>{t('trust.body')}</p>
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
