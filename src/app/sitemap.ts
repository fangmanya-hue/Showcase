import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    ['/', '/docs', '/privacy-policy', '/terms-of-service'].map((path) => ({
      url:
        envConfigs.app_url +
        (locale === defaultLocale ? '' : '/' + locale) +
        path,
    }))
  );
}
