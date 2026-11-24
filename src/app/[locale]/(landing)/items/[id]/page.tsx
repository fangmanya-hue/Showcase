import { DeskPage } from '@/shared/flowdesk/workspace';
import { getMetadata } from '@/shared/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return getMetadata({
    metadataKey: 'detail.page',
    canonicalUrl: '/items/' + encodeURIComponent(id),
    noIndex: true,
  })({ params });
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeskPage view="detail" id={id} />;
}
