import { redirect } from 'next/navigation';

import { Empty } from '@/shared/blocks/common';
import { accountMessage } from '@/shared/lib/account-message';
import {
  findOrderByOrderNo,
  Order,
  updateOrderByOrderNo,
} from '@/shared/models/order';
import { getUserInfo } from '@/shared/models/user';
import { getPaymentService } from '@/shared/services/payment';

export default async function RetrieveInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order_no: string }>;
}) {
  const { locale } = await params;
  const { order_no } = await searchParams;

  if (!order_no) {
    return <Empty message={await accountMessage('invalidOrder')} />;
  }

  const user = await getUserInfo();
  if (!user) {
    return <Empty message={await accountMessage('signIn')} />;
  }

  const order = await findOrderByOrderNo(order_no);
  if (!order) {
    return <Empty message={await accountMessage('missingOrder')} />;
  }

  if (!order.paymentProvider || !order.invoiceId) {
    return <Empty message={await accountMessage('missingInvoice')} />;
  }

  if (order.userId !== user.id) {
    return <Empty message={await accountMessage('denied')} />;
  }

  const paymentService = await getPaymentService();
  const paymentProvider = paymentService.getProvider(order.paymentProvider);
  if (!paymentProvider) {
    return <Empty message={await accountMessage('missingProvider')} />;
  }

  let invoiceUrl = '';

  try {
    const invoice = await paymentProvider.getPaymentInvoice?.({
      invoiceId: order.invoiceId,
    });
    if (!invoice?.invoiceUrl) {
      return <Empty message={await accountMessage('invoiceLink')} />;
    }

    invoiceUrl = invoice.invoiceUrl;

    await updateOrderByOrderNo(order.orderNo, {
      invoiceUrl: invoiceUrl,
    });
  } catch (error: any) {
    return (
      <Empty
        message={error.message || (await accountMessage('invoiceFailed'))}
      />
    );
  }

  if (!invoiceUrl) {
    return <Empty message={await accountMessage('invoiceLink')} />;
  }

  redirect(invoiceUrl);
}
