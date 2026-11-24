import moment from 'moment';
import { getTranslations } from 'next-intl/server';

import { Empty } from '@/shared/blocks/common';
import { FormCard } from '@/shared/blocks/form';
import { accountMessage } from '@/shared/lib/account-message';
import {
  findSubscriptionBySubscriptionNo,
  SubscriptionStatus,
  updateSubscriptionBySubscriptionNo,
} from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { getPaymentService } from '@/shared/services/payment';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function CancelBillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subscription_no: string }>;
}) {
  const t = await getTranslations('settings.billing.cancel');
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

  if (!subscription.paymentProvider || !subscription.subscriptionId) {
    return <Empty message={await accountMessage('missingSubscriptionId')} />;
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

  const crumb: Crumb[] = [
    {
      title: t('crumbs.settings'),
      url: '/settings',
    },
    {
      title: t('crumbs.billing'),
      url: '/settings/billing',
    },
    {
      title: t('crumbs.cancel'),
      is_active: true,
    },
  ];

  const handleCancelSubscription = async (data: FormData, passby: any) => {
    'use server';

    const { subscription, user } = passby;
    if (!user) {
      throw new Error(await accountMessage('signIn'));
    }

    if (!subscription || !subscription.subscriptionId) {
      throw new Error(await accountMessage('invalidSubscription'));
    }

    if (subscription.userId !== user.id) {
      throw new Error(await accountMessage('denied'));
    }

    if (
      subscription.status !== SubscriptionStatus.ACTIVE &&
      subscription.status !== SubscriptionStatus.TRIALING
    ) {
      throw new Error(await accountMessage('inactive'));
    }

    const paymentService = await getPaymentService();
    const paymentProvider = paymentService.getProvider(
      subscription.paymentProvider
    );

    const result = await paymentProvider?.cancelSubscription?.({
      subscriptionId: subscription.subscriptionId,
    });
    if (!result) {
      throw new Error(await accountMessage('cancelFailed'));
    }

    await updateSubscriptionBySubscriptionNo(subscription.subscriptionNo, {
      status: SubscriptionStatus.CANCELED,
    });

    return {
      status: 'success' as const,
      message: await accountMessage('canceled'),
      redirect_url: '/settings/billing',
    };
  };

  const form: Form = {
    fields: [
      {
        name: 'subscriptionNo',
        title: t('fields.subscription_no'),
        type: 'text',
        attributes: { disabled: true },
      },
      {
        name: 'subAmount',
        title: t('fields.subscription_amount'),
        value: `${subscription.amount ? subscription.amount / 100 : 0} ${subscription.currency}`,
        attributes: { disabled: true },
      },
      {
        name: 'intervalTip',
        title: t('fields.interval_cycle'),
        value: `every ${subscription.intervalCount} ${subscription.interval}`,
        attributes: { disabled: true },
      },
      {
        name: 'subscriptionCreatedAt',
        title: t('fields.subscription_created_at'),
        value: moment(subscription.createdAt).format('YYYY-MM-DD'),
        attributes: { disabled: true },
      },
      {
        name: 'currentPeriod',
        title: t('fields.current_period'),
        value: `${moment(subscription.currentPeriodStart).format('YYYY-MM-DD')} ~ ${moment(subscription.currentPeriodEnd).format('YYYY-MM-DD')}`,
        attributes: { disabled: true },
      },
    ],
    data: subscription,
    passby: {
      subscription: subscription,
      user: user,
    },
    submit: {
      handler: handleCancelSubscription,
      button: {
        title: t('buttons.confirm_cancel'),
        variant: 'destructive',
      },
    },
  };

  return (
    <div className="space-y-8">
      <FormCard
        title={t('title')}
        description={t('description')}
        form={form}
        crumbs={crumb}
      />
    </div>
  );
}
