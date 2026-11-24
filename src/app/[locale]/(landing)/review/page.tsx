import { DeskPage } from '@/shared/flowdesk/workspace';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  metadataKey: 'review.page',
  canonicalUrl: '/review',
  noIndex: true,
});
export default function Page() {
  return <DeskPage view="review" />;
}
