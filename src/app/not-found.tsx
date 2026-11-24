import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';

export default async function NotFoundPage() {
  const t = await getTranslations('desk.error');
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Image
        src={envConfigs.app_logo}
        alt={envConfigs.app_name}
        width={80}
        height={80}
      />
      <h1 className="text-2xl font-normal">{t('missing')}</h1>
      <Button asChild>
        <Link href="/" className="mt-4">
          <SmartIcon name="ArrowLeft" />
          <span>{t('home')}</span>
        </Link>
      </Button>
    </div>
  );
}
