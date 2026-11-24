import { getTranslations } from 'next-intl/server';

import { Empty } from '@/shared/blocks/common';
import { FormCard } from '@/shared/blocks/form';
import { accountMessage } from '@/shared/lib/account-message';
import {
  ApikeyStatus,
  findApikeyById,
  updateApikey,
  UpdateApikey,
} from '@/shared/models/apikey';
import { getUserInfo } from '@/shared/models/user';
import { Crumb } from '@/shared/types/blocks/common';
import { Form as FormType } from '@/shared/types/blocks/form';

export default async function DeleteApiKeyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apikey = await findApikeyById(id);
  if (!apikey) {
    return <Empty message={await accountMessage('missingKey')} />;
  }

  const user = await getUserInfo();
  if (!user) {
    return <Empty message={await accountMessage('signIn')} />;
  }

  if (apikey.userId !== user.id) {
    return <Empty message={await accountMessage('denied')} />;
  }

  const t = await getTranslations('settings.apikeys');

  const form: FormType = {
    title: t('delete.title'),
    fields: [
      {
        name: 'title',
        title: t('fields.title'),
        type: 'text',
        placeholder: '',
        validation: { required: true },
        attributes: {
          disabled: true,
        },
      },
      {
        name: 'key',
        title: t('fields.key'),
        type: 'text',
        placeholder: '',
        validation: { required: true },
        attributes: {
          disabled: true,
        },
      },
    ],
    passby: {
      user: user,
      apikey: apikey,
    },
    data: apikey,
    submit: {
      handler: async (data: FormData, passby: any) => {
        'use server';

        const { user, apikey } = passby;

        if (!apikey) {
          throw new Error(await accountMessage('missingKey'));
        }

        if (!user) {
          throw new Error(await accountMessage('signIn'));
        }

        if (apikey.userId !== user.id) {
          throw new Error(await accountMessage('denied'));
        }

        const title = data.get('title') as string;
        if (!title?.trim()) {
          throw new Error(await accountMessage('title'));
        }

        const updatedApikey: UpdateApikey = {
          status: ApikeyStatus.DELETED,
          deletedAt: new Date(),
        };

        await updateApikey(apikey.id, updatedApikey);

        return {
          status: 'success',
          message: await accountMessage('keyDeleted'),
          redirect_url: '/settings/apikeys',
        };
      },
      button: {
        title: t('delete.buttons.submit'),
        variant: 'destructive',
        icon: 'RiDeleteBinLine',
      },
    },
  };

  const crumbs: Crumb[] = [
    {
      title: t('delete.crumbs.apikeys'),
      url: '/settings/apikeys',
    },
    {
      title: t('delete.crumbs.delete'),
      is_active: true,
    },
  ];

  return (
    <div className="space-y-8">
      <FormCard title={t('delete.crumbs.delete')} crumbs={crumbs} form={form} />
    </div>
  );
}
