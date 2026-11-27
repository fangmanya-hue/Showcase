import { WifiOff } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { flowdeskPaths } from '@/config/flowdesk';
import { Link } from '@/core/i18n/navigation';

export async function generateMetadata() {
  const t = await getTranslations('common.sign');
  return { title: t('unavailable_title'), robots: { index: false } };
}

export default async function SignInUnavailablePage() {
  const t = await getTranslations('common.sign');
  return (
    <main className="mx-auto flex min-h-[72vh] w-full max-w-2xl items-center justify-center px-5 py-20">
      <section className="w-full text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <WifiOff aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-balance text-slate-950 sm:text-4xl dark:text-white">
          {t('unavailable_title')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-pretty text-slate-600 sm:text-lg dark:text-slate-300">
          {t('unavailable_description')}
        </p>
        <Link
          href={flowdeskPaths.intake}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-medium text-white shadow-[0_10px_28px_rgba(37,99,235,0.2)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_32px_rgba(37,99,235,0.24)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          {t('back_to_demo')}
        </Link>
      </section>
      <p className="fixed right-5 bottom-5 max-w-xs text-right text-xs leading-5 text-slate-500 max-sm:inset-x-5 max-sm:max-w-none max-sm:text-center dark:text-slate-400">
        {t('network_hint')}
      </p>
    </main>
  );
}
