import { DeskPage } from '@/shared/flowdesk/workspace';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  metadataKey: 'intake.form',
  canonicalUrl: '/intake',
  noIndex: true,
});
export default function Page() {
  return <DeskPage view="intake" />;
}
