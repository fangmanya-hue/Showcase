import { getTranslations } from 'next-intl/server';

export async function accountMessage(key: string) {
  const t = await getTranslations('account.message');
  return t(key);
}
