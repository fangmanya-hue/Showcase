'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

const simulatedGoogleDelayMs = 5000;

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.24-.2-1.8H12v3.4h5.52a4.74 4.74 0 0 1-2.05 3.02l-.02.11 2.98 2.3.2.02c1.84-1.7 2.97-4.2 2.97-7.05Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.16-2.43c-.85.57-1.98.97-3.46.97a6 6 0 0 1-5.67-4.15l-.11.01-3.1 2.4-.04.1A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.33 13.97A6.16 6.16 0 0 1 6 12c0-.69.12-1.35.32-1.97v-.12L3.18 7.47l-.1.05A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.48l3.25-2.51Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.88c1.88 0 3.15.81 3.88 1.48l2.8-2.73A9.48 9.48 0 0 0 12 2a10 10 0 0 0-8.92 5.52l3.24 2.51A6.03 6.03 0 0 1 12 5.88Z"
      />
    </svg>
  );
}

export function FakeGoogleSignInButton({
  callbackUrl = '/',
}: {
  callbackUrl?: string;
}) {
  const t = useTranslations('common.sign');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  function beginFakeSignIn() {
    if (loading) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      const query = new URLSearchParams({ callbackUrl });
      router.push(`/sign-in-unavailable?${query.toString()}`);
    }, simulatedGoogleDelayMs);
  }

  return (
    <div>
      <Button
        type="button"
        size="lg"
        className="h-12 w-full gap-3 rounded-xl text-base shadow-[0_8px_24px_rgba(30,99,219,0.2)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(30,99,219,0.25)]"
        disabled={loading}
        aria-busy={loading}
        onClick={beginFakeSignIn}
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <GoogleMark />}
        <span>{t(loading ? 'fake_connecting' : 'google_sign_in_title')}</span>
      </Button>
      <div className="min-h-7 pt-2 text-center" aria-live="polite">
        {loading && (
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {t('fake_wait_hint')}
          </p>
        )}
      </div>
    </div>
  );
}

export function FlowdeskFakeSignIn({
  callbackUrl = '/',
}: {
  callbackUrl?: string;
}) {
  const t = useTranslations('common.sign');
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_24px_70px_rgba(41,65,104,0.12)] sm:p-9 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-7 max-w-sm">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-slate-950 dark:text-white">
          {t('fake_title')}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          {t('fake_description')}
        </p>
      </div>
      <FakeGoogleSignInButton callbackUrl={callbackUrl} />
    </section>
  );
}
