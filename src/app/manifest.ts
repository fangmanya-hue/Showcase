import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: envConfigs.app_name,
    short_name: envConfigs.app_name,
    lang: envConfigs.locale,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfd',
    theme_color: '#145ce5',
    icons: [
      { src: '/logo.png', sizes: '128x128', type: 'image/png' },
      { src: '/favicon.ico', sizes: '64x64', type: 'image/x-icon' },
    ],
  };
}
