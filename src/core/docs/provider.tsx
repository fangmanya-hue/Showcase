'use client';

import type { ComponentProps } from 'react';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FrameworkProvider } from 'fumadocs-core/framework';
import { RootProvider } from 'fumadocs-ui/provider/base';

import { defaultLocale } from '@/config/locale';

// The document tree uses fully prefixed URLs. The public default-language URL
// omits its prefix, so derive the tree path consistently on server and client.
function useDocumentPath() {
  const { locale, slug } = useParams<{ locale: string; slug?: string[] }>();
  return ['', locale, 'docs', ...(slug ?? [])].join('/');
}
function DocumentLink({ href = '/', ...props }: ComponentProps<'a'>) {
  return <NextLink {...props} href={href} />;
}
export function DocumentProvider(props: ComponentProps<typeof RootProvider>) {
  const router = useRouter(),
    path = useDocumentPath();
  const i18n = {
    ...props.i18n,
    locale: props.i18n?.locale ?? defaultLocale,
    onLocaleChange: (locale: string) => {
      const suffix = path.slice(path.indexOf('/docs'));
      router.push(
        (locale === defaultLocale ? '' : '/' + locale) +
          suffix +
          window.location.search +
          window.location.hash
      );
    },
  };
  return (
    <FrameworkProvider
      usePathname={useDocumentPath}
      useRouter={useRouter}
      useParams={useParams}
      Link={DocumentLink}
    >
      <RootProvider {...props} i18n={i18n} />
    </FrameworkProvider>
  );
}
