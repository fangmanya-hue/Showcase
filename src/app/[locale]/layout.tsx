import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { ThemeProvider } from '@/core/theme/provider';
import { flowdeskFeatures } from '@/config/flowdesk';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppContextProvider } from '@/shared/contexts/app';
import { getMetadata } from '@/shared/lib/seo';

export async function generateMetadata(
  props: Parameters<ReturnType<typeof getMetadata>>[0]
) {
  const metadata = await getMetadata()(props);
  return {
    ...metadata,
    title: { default: metadata.title, template: '%s · FlowDesk' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const all = await getMessages();
  // Legacy sales catalogs and showcase content are server-side data.
  const { landing, pages, ...shared } = all;
  const messages = flowdeskFeatures.showScaffoldEntries
    ? all
    : {
        ...shared,
        pages: {
          blog: { messages: pages.blog.messages },
          pricing: { messages: pages.pricing.messages },
        },
      };
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AppContextProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AppContextProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
