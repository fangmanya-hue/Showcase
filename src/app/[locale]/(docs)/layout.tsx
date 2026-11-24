import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { getTranslations } from 'next-intl/server';

import { DocumentProvider } from '@/core/docs/provider';
import { source } from '@/core/docs/source';
import { defaultLocale, localeNames } from '@/config/locale';

import { baseOptions } from './layout.config';

import '@/config/style/docs.css';

export default async function DocsRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale || defaultLocale;
  const t = await getTranslations({ locale: lang, namespace: 'desk' });

  return (
    <DocumentProvider
      i18n={{
        locale: lang,
        locales: Object.entries(localeNames).map(([locale, name]) => ({
          locale,
          name: String(name),
        })),
        translations: t.raw('docs'),
      }}
      search={{
        options: {
          api: '/api/docs/search',
        },
      }}
    >
      <DocsLayout
        {...baseOptions(lang)}
        tree={source.pageTree[lang]}
        nav={{ ...baseOptions(lang).nav, mode: 'top' }}
        sidebar={{
          tabs: [],
        }}
        tabMode="sidebar"
      >
        {children}
      </DocsLayout>
    </DocumentProvider>
  );
}
