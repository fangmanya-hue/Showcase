'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { flowdeskFeatures } from '@/config/flowdesk';
import { ChatLibrary } from '@/shared/blocks/chat/library';
import { LocaleDetector } from '@/shared/blocks/common';
import { DashboardLayout } from '@/shared/blocks/dashboard';
import { ChatContextProvider } from '@/shared/contexts/chat';
import { Sidebar as SidebarType } from '@/shared/types/blocks/dashboard';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('ai.chat');

  const sidebar: SidebarType = { ...t.raw('sidebar') };

  if (!flowdeskFeatures.showScaffoldEntries && sidebar.footer?.nav) {
    sidebar.footer = {
      ...sidebar.footer,
      nav: {
        ...sidebar.footer.nav,
        items: sidebar.footer.nav.items.filter((item) => item.url === '/'),
      },
    };
  }

  sidebar.library = <ChatLibrary />;

  return (
    <ChatContextProvider>
      <DashboardLayout sidebar={sidebar}>
        <LocaleDetector />
        {children}
      </DashboardLayout>
    </ChatContextProvider>
  );
}
