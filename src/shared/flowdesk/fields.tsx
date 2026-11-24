'use client';

import { useTranslations } from 'next-intl';

import { people } from './fixtures';
import {
  dueDate,
  fields,
  ownerId,
  sourceFragments,
  value,
  type Draft,
  type Field,
} from './model';

export function EvidenceFields({ draft }: { draft: Draft }) {
  const t = useTranslations();
  const person = people.find((p) => p.id === ownerId(draft));
  return (
    <div>
      {fields.map((field: Field) => {
        const e = draft.values[field];
        const hits =
          draft.evidence?.[field] ?? (e.sentence ? [e.sentence] : []);
        const confirmed =
          draft.edits[field] &&
          (field === 'owner' ? person?.name : value(draft, field));
        return (
          <details className="fd-evidence" key={field}>
            <summary>
              <span className="fd-field-name">{t('work.field.' + field)}</span>
              <span>{confirmed || e.value || t('work.field.empty')}</span>
              {(confirmed || e.value) && (
                <small className="fd-chip">
                  {t(confirmed ? 'work.field.manual' : 'work.field.ai')}
                </small>
              )}
            </summary>
            <p>{t('work.field.evidence')}</p>
            {!hits.length ? (
              <p>{t('work.field.noEvidence')}</p>
            ) : (
              <blockquote>
                {sourceFragments(draft.raw).map((part, index) =>
                  hits.includes(part.trim()) ? (
                    <mark key={index}>{part}</mark>
                  ) : (
                    part
                  )
                )}
              </blockquote>
            )}
            {draft.edits[field] && (
              <p>
                {t('work.field.manual')} ·{' '}
                {field === 'owner' ? person?.name : value(draft, field)}
              </p>
            )}
          </details>
        );
      })}
      <div className="fd-fields">
        <div>
          <small>
            {t('work.field.owner')} · {t('match.status.' + draft.match.status)}
          </small>
          <p>
            {draft.values.owner.value || t('work.field.empty')} →{' '}
            {person
              ? person.name +
                ' (' +
                person.dept +
                ' · ' +
                t('work.field.employee', { id: person.id }) +
                ')'
              : t('work.field.none')}
          </p>
          <small>
            {draft.edits.owner
              ? t('work.field.manual')
              : t('match.method.' + draft.match.via)}
          </small>
        </div>
        <div>
          <small>{t('work.field.rule')}</small>
          <p>
            {draft.dates.ambiguous
              ? t('review.choice.ruleRange', {
                  start: draft.dates.date,
                  end: draft.dates.end!,
                })
              : draft.dates.date || t('review.choice.noDate')}
          </p>
          {draft.edits.due && (
            <small>
              {t('work.field.manual')} · {dueDate(draft)}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
