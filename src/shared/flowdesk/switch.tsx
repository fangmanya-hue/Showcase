'use client';

import { Globe2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/core/i18n/navigation';
import { localeNames } from '@/config/locale';
import { cacheSet } from '@/shared/lib/cache';

export function LanguageSwitch() {
  const locale = useLocale(),
    router = useRouter(),
    pathname = usePathname(),
    t = useTranslations('desk.nav');
  return (
    <label className="fd-lang">
      <Globe2 size={15} />
      <select
        aria-label={t('language')}
        value={locale}
        onChange={(e) => {
          const next = e.target.value;
          cacheSet('locale', next);
          router.push(
            pathname + window.location.search + window.location.hash,
            { locale: next, scroll: false }
          );
        }}
      >
        {Object.entries(localeNames).map(([key, name]) => (
          <option key={key} value={key}>
            {String(name)}
          </option>
        ))}
      </select>
    </label>
  );
}
