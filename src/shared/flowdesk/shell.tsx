import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { flowdeskFeatures, flowdeskPaths } from '@/config/flowdesk';
import { ThemeToggler } from '@/shared/blocks/common/theme-toggler';
import { SignUser } from '@/shared/blocks/sign/sign-user';

import { LanguageSwitch } from './switch';
import { FlowDeskMark } from './visuals';

import './flowdesk.css';

export async function FlowdeskShell({ children }: { children: ReactNode }) {
  const t = await getTranslations('desk');
  const links = (
    <>
      <Link href="/#features">{t('nav.features')}</Link>
      <Link href="/#workflow">{t('nav.workflow')}</Link>
      <Link href="/docs">{t('nav.docs')}</Link>
    </>
  );
  return (
    <div className="fd-shell">
      <header className="fd-header">
        <div className="fd-wrap fd-header-inner">
          <Link href="/" className="fd-brand">
            <span className="fd-mark">
              <FlowDeskMark />
            </span>
            {t('brand.name')}
          </Link>
          <nav aria-label={t('nav.menu')} className="fd-nav">
            {links}
          </nav>
          <div className="fd-tools">
            <LanguageSwitch />
            {envConfigs.auth_secret ? (
              <SignUser
                enableOneTap={false}
                userNav={{
                  show_name: true,
                  show_credits: true,
                  show_sign_out: true,
                  items: [
                    { title: t('nav.billing'), url: '/settings/billing' },
                  ],
                }}
              />
            ) : (
              <Link className="fd-login" href="/sign-in">
                {t('nav.sign')}
              </Link>
            )}
            <Link className="fd-btn fd-small" href={flowdeskPaths.intake}>
              {t('nav.workspace')}
            </Link>
          </div>
        </div>
        <nav aria-label={t('nav.menu')} className="fd-mobile-nav">
          {links}
        </nav>
      </header>
      {children}
      <footer className="fd-footer">
        <div className="fd-wrap fd-footer-inner">
          <div>
            <b>{t('brand.name')}</b>
            <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          </div>
          <nav>
            <Link href="/docs">{t('nav.docs')}</Link>
            <Link href="/privacy-policy">{t('nav.privacy')}</Link>
            <Link href="/terms-of-service">{t('nav.terms')}</Link>
            {envConfigs.support_email && (
              <a href={'mailto:' + envConfigs.support_email}>
                {t('nav.contact')}
              </a>
            )}
            {flowdeskFeatures.showScaffoldEntries && (
              <a href="https://shipany.ai" rel="noreferrer" target="_blank">
                {t('nav.credit')}
              </a>
            )}
          </nav>
          <ThemeToggler type="toggle" />
        </div>
      </footer>
    </div>
  );
}
