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

export type EvidenceTarget = Field | 'contact' | 'participant';

function evidenceHits(draft: Draft, target: EvidenceTarget) {
  if (target === 'contact')
    return draft.mentions.contact.sentence
      ? [draft.mentions.contact.sentence]
      : [];
  if (target === 'participant')
    return draft.mentions.participants.map((item) => item.sentence);
  const item = draft.values[target];
  return draft.evidence?.[target] ?? (item.sentence ? [item.sentence] : []);
}

export function SourceEvidence({
  draft,
  active,
}: {
  draft: Draft;
  active: EvidenceTarget;
}) {
  const t = useTranslations();
  const hits = evidenceHits(draft, active);
  return (
    <section className="fd-source-panel" aria-live="polite">
      <div className="fd-source-panel-head">
        <div>
          <strong>{t('review.page.sourcePanel')}</strong>
          <small>{t('review.page.sourceHelp')}</small>
        </div>
        <span>{t('work.field.' + active)}</span>
      </div>
      <blockquote>
        {sourceFragments(draft.raw).map((part, index) =>
          hits.includes(part.trim()) ? <mark key={index}>{part}</mark> : part
        )}
      </blockquote>
      {!hits.length && <p>{t('work.field.noEvidence')}</p>}
    </section>
  );
}

export function EvidenceFields({
  draft,
  activeField,
  onFieldSelect,
}: {
  draft: Draft;
  activeField?: EvidenceTarget;
  onFieldSelect?: (field: EvidenceTarget) => void;
}) {
  const t = useTranslations();
  const owner = people.find((person) => person.id === ownerId(draft));
  const contact = people.find((person) =>
    draft.contactMatch.ids.includes(person.id)
  );
  const fieldValue = (field: Field) => {
    const extracted = draft.values[field];
    if (field === 'owner')
      return (
        owner?.name ||
        draft.edits.owner ||
        extracted.value ||
        t('work.field.empty')
      );
    return value(draft, field) || extracted.value || t('work.field.empty');
  };

  return (
    <div className="fd-evidence-fields">
      <div className="fd-evidence-list">
        {fields.map((field) => {
          const extracted = draft.values[field];
          const confirmed = Boolean(draft.edits[field]);
          const content = (
            <>
              <span className="fd-field-name">{t('work.field.' + field)}</span>
              <span className="fd-field-value">{fieldValue(field)}</span>
              {(confirmed || extracted.value) && (
                <small className="fd-chip">
                  {t(
                    confirmed
                      ? 'work.field.manual'
                      : draft.extractionSource === 'ai'
                        ? 'work.field.ai'
                        : 'work.field.local'
                  )}
                </small>
              )}
            </>
          );
          return onFieldSelect ? (
            <button
              type="button"
              className="fd-evidence-row"
              aria-pressed={activeField === field}
              key={field}
              onClick={() => onFieldSelect(field)}
            >
              {content}
            </button>
          ) : (
            <details className="fd-evidence" key={field}>
              <summary>{content}</summary>
              <p>{t('work.field.evidence')}</p>
              {!evidenceHits(draft, field).length ? (
                <p>{t('work.field.noEvidence')}</p>
              ) : (
                <blockquote>
                  {sourceFragments(draft.raw).map((part, index) =>
                    evidenceHits(draft, field).includes(part.trim()) ? (
                      <mark key={index}>{part}</mark>
                    ) : (
                      part
                    )
                  )}
                </blockquote>
              )}
            </details>
          );
        })}
      </div>

      <div className="fd-role-map">
        <button
          type="button"
          disabled={!onFieldSelect}
          aria-pressed={activeField === 'owner'}
          onClick={() => onFieldSelect?.('owner')}
        >
          <small>{t('work.field.owner')}</small>
          <strong>{owner?.name || t('work.field.pendingConfirm')}</strong>
          <span>{t('work.field.ownerRole')}</span>
        </button>
        <button
          type="button"
          disabled={!onFieldSelect}
          aria-pressed={activeField === 'contact'}
          onClick={() => onFieldSelect?.('contact')}
        >
          <small>{t('work.field.contact')}</small>
          <strong>
            {draft.mentions.contact.value || t('work.field.empty')}
          </strong>
          <span>
            {contact
              ? t('work.field.personMatch', {
                  name: contact.name,
                  dept: contact.dept,
                  id: contact.id,
                })
              : t('work.field.none')}
          </span>
        </button>
        <button
          type="button"
          disabled={!onFieldSelect}
          aria-pressed={activeField === 'participant'}
          onClick={() => onFieldSelect?.('participant')}
        >
          <small>{t('work.field.participant')}</small>
          <strong>
            {draft.mentions.participants.map((item) => item.value).join('、') ||
              t('work.field.empty')}
          </strong>
          <span>{t('work.field.participantRole')}</span>
        </button>
      </div>

      <div className="fd-rule-row">
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
        </div>
        {draft.edits.due && (
          <small>
            {t('work.field.manual')} · {dueDate(draft)}
          </small>
        )}
      </div>
    </div>
  );
}
