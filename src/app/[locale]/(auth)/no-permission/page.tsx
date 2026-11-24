import { getTranslations } from 'next-intl/server';

export default async function NoPermissionPage() {
  const t = await getTranslations('desk.error');
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-normal">{t('denied')}</h1>
    </div>
  );
}
