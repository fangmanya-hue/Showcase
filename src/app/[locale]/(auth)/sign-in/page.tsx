import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { FlowdeskFakeSignIn } from '@/shared/blocks/sign/flowdesk-fake-sign-in';

function safeInternalPath(raw?: string) {
  if (!raw) return '/';
  if (!raw.startsWith('/')) return '/';
  return raw;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations('common');

  return {
    title: `${t('sign.fake_title')} - ${t('metadata.title')}`,
    alternates: {
      canonical:
        locale !== defaultLocale
          ? `${envConfigs.app_url}/${locale}/sign-in`
          : `${envConfigs.app_url}/sign-in`,
    },
  };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) {
  const { callbackUrl } = await searchParams;
  return <FlowdeskFakeSignIn callbackUrl={safeInternalPath(callbackUrl)} />;
}
