'use client';

import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { useAppContext } from '@/shared/contexts/app';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { FakeGoogleSignInButton } from './flowdesk-fake-sign-in';

export function SignModal({ callbackUrl = '/' }: { callbackUrl?: string }) {
  const t = useTranslations('common.sign');
  const { isShowSignModal, setIsShowSignModal } = useAppContext();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isShowSignModal} onOpenChange={setIsShowSignModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('fake_title')}</DialogTitle>
            <DialogDescription>{t('fake_description')}</DialogDescription>
          </DialogHeader>
          <FakeGoogleSignInButton callbackUrl={callbackUrl} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isShowSignModal} onOpenChange={setIsShowSignModal}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('fake_title')}</DrawerTitle>
          <DrawerDescription>{t('fake_description')}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <FakeGoogleSignInButton callbackUrl={callbackUrl} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
