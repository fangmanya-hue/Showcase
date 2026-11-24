import {
  FileCheck2,
  Fingerprint,
  MessageSquareText,
  ScanText,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { showcase } from './fixtures';

export async function Preview() {
  const t = await getTranslations('home.preview');
  return (
    <aside className="fd-preview">
      <div className="fd-preview-bar">
        <b>
          <ScanText />
          {t('label')}
        </b>
        <small>{t('sample')}</small>
      </div>
      <div className="fd-preview-body">
        <p className="fd-preview-label">
          <MessageSquareText />
          {t('message')}
        </p>
        <blockquote>{showcase.message}</blockquote>
        <div className="fd-paper">
          <p className="fd-kicker">
            <FileCheck2 />
            {t('draft')}
          </p>
          <h3>{showcase.title}</h3>
          <dl>
            <div>
              <dt>{t('owner')}</dt>
              <dd>
                {showcase.name}
                <small>{t('ai')}</small>
              </dd>
            </div>
            <div>
              <dt>{t('due')}</dt>
              <dd>
                {showcase.date}
                <small>{t('rule')}</small>
              </dd>
            </div>
          </dl>
          <details>
            <summary>
              <Fingerprint size={15} />
              {t('evidence')}
            </summary>
            <mark>{showcase.evidence}</mark>
          </details>
        </div>
      </div>
    </aside>
  );
}
