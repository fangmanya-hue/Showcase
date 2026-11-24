import { DeskPage } from '@/shared/flowdesk/workspace';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  metadataKey: 'items.page',
  canonicalUrl: '/items',
  noIndex: true,
});
export default function Page() {
  return <DeskPage view="list" />;
}
