import { redirect } from 'next/navigation';

import { envConfigs } from '@/config';
import { Empty } from '@/shared/blocks/common';
import { accountMessage } from '@/shared/lib/account-message';
import {
  findSubscriptionBySubscriptionNo,
  updateSubscriptionBySubscriptionNo,
} from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { getPaymentService } from '@/shared/services/payment';

export default async function RetrieveBillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subscription_no: string }>;
}) {
  const { locale } = await params;
  const { subscription_no } = await searchParams;

  if (!subscription_no) {
    return <Empty message={await accountMessage('invalidSubscription')} />;
  }

  const user = await getUserInfo();
  if (!user) {
    return <Empty message={await accountMessage('signIn')} />;
  }

  const subscription = await findSubscriptionBySubscriptionNo(subscription_no);
  if (!subscription) {
    return <Empty message={await accountMessage('missingSubscription')} />;
  }

  if (!subscription.paymentProvider || !subscription.paymentUserId) {
    return <Empty message={await accountMessage('missingCustomer')} />;
  }

  if (subscription.userId !== user.id) {
    return <Empty message={await accountMessage('denied')} />;
  }

  const paymentService = await getPaymentService();
  const paymentProvider = paymentService.getProvider(
    subscription.paymentProvider
  );
  if (!paymentProvider) {
    return <Empty message={await accountMessage('missingProvider')} />;
  }

  let billingUrl = '';

  try {
    const billing = await paymentProvider.getPaymentBilling?.({
      customerId: subscription.paymentUserId,
      returnUrl: `${envConfigs.app_url}/settings/billing`,
    });
    if (!billing?.billingUrl) {
      return <Empty message={await accountMessage('billingLink')} />;
    }

    billingUrl = billing.billingUrl;

    await updateSubscriptionBySubscriptionNo(subscription.subscriptionNo, {
      billingUrl: billing.billingUrl,
    });
  } catch (error: any) {
    return (
      <Empty
        message={error.message || (await accountMessage('billingFailed'))}
      />
    );
  }

  if (!billingUrl) {
    return <Empty message={await accountMessage('billingLink')} />;
  }

  redirect(billingUrl);
}
