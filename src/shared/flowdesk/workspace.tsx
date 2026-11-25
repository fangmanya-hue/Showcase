'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link, useRouter } from '@/core/i18n/navigation';
import { flowdeskPaths as paths } from '@/config/flowdesk';

import { EvidenceFields, SourceEvidence, type EvidenceTarget } from './fields';
import {
  businessLines,
  people,
  sampleRequirement,
  sampleText,
  sourceDate,
} from './fixtures';
import {
  changeAction,
  dueDate,
  duplicates,
  extract,
  initialWorkspace,
  issues,
  ownerId,
  status,
  undoAction,
  value,
  writeDraft,
  type Action,
  type Draft,
  type Field,
  type Workspace,
} from './model';

const storageKey = 'flowdesk.workspace.v5';
type View = keyof typeof paths;
type Change = (state: Workspace) => void;
function useLocalWorkspace() {
  const [state, setState] = useState<Workspace | null>(null),
    [warning, setWarning] = useState(false);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      setState(saved ? JSON.parse(saved) : initialWorkspace());
    } catch {
      setState(initialWorkspace());
      setWarning(true);
    }
  }, []);
  const change: Change = (next) => {
    setState(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setWarning(true);
    }
  };
  return { state, change, warning };
}
function currentDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
export function DeskPage({ view, id }: { view: View; id?: string }) {
  const t = useTranslations(),
    { state, change, warning } = useLocalWorkspace();
  return (
    <main className="fd-wrap fd-work">
      <nav className="fd-tabs" aria-label={t('work.nav.label')}>
        {Object.entries(paths).map(([key, url]) => (
          <Link
            key={key}
            href={key === 'detail' && id ? '/items/' + id : url}
            aria-current={view === key ? 'page' : undefined}
          >
            {t('work.nav.' + key)}
          </Link>
        ))}
      </nav>
      <header className="fd-work-heading">
        <h1>
          {t(
            {
              intake: 'intake.form.title',
              review: 'review.page.title',
              list: 'items.page.title',
              detail: 'detail.page.title',
            }[view]
          )}
        </h1>
        <small>{t('work.demo.note')}</small>
      </header>
      {warning && <p role="status">{t('work.demo.storage')}</p>}
      {!state ? (
        <p>{t('work.demo.loading')}</p>
      ) : view === 'intake' ? (
        <Intake state={state} change={change} />
      ) : view === 'review' ? (
        <Review state={state} change={change} />
      ) : view === 'list' ? (
        <ActionList state={state} />
      ) : (
        <Detail state={state} change={change} id={id!} />
      )}
    </main>
  );
}
type Props = { state: Workspace; change: Change };
function Intake({ state, change }: Props) {
  const t = useTranslations(),
    router = useRouter(),
    [addingLine, setAddingLine] = useState(false),
    [newLine, setNewLine] = useState(''),
    [lineNotice, setLineNotice] = useState('');
  const customLines = state.customLines ?? [];
  function addLine() {
    const name = newLine.trim();
    if (!name) return;
    if (
      businessLines.some((line) => line.short === name) ||
      customLines.includes(name)
    ) {
      setLineNotice(t('intake.form.lineExists'));
      return;
    }
    change({
      ...state,
      line: name,
      customLines: [...customLines, name],
    });
    setNewLine('');
    setLineNotice(t('intake.form.lineAdded', { name }));
    setAddingLine(false);
  }
  return (
    <form
      className="fd-card fd-intake-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!state.input.trim()) return;
        change({
          ...state,
          drafts: extract(
            state.input,
            state.line,
            state.reference,
            state.context
          ),
        });
        router.push(paths.review);
      }}
    >
      <div className="fd-intake-lead">
        <p>{t('intake.form.intro')}</p>
        <span>{t('intake.form.defaultGoal')}</span>
      </div>
      <label>
        {t('intake.form.message')}
        <textarea
          required
          rows={14}
          placeholder={t('intake.form.messagePlaceholder')}
          value={state.input}
          onChange={(event) => change({ ...state, input: event.target.value })}
        />
      </label>
      <small>{t('intake.form.hint')}</small>
      {state.drafts.length > 0 && <p>{t('intake.form.replace')}</p>}

      <details className="fd-options">
        <summary>{t('intake.form.options')}</summary>
        <label>
          {t('intake.form.context')}
          <textarea
            rows={3}
            placeholder={t('intake.form.contextPlaceholder')}
            value={state.context}
            onChange={(event) =>
              change({ ...state, context: event.target.value })
            }
          />
        </label>
        <div className="fd-fields">
          <div className="fd-line-picker">
            <label>
              {t('work.field.line')}
              <select
                value={state.line}
                onChange={(e) => change({ ...state, line: e.target.value })}
              >
                {businessLines.map((line) => (
                  <option key={line.short} value={line.short}>
                    {line.short} · {line.name}
                  </option>
                ))}
                {customLines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="fd-link"
              onClick={() => {
                setAddingLine((open) => !open);
                setLineNotice('');
              }}
            >
              {t('intake.form.addLine')}
            </button>
          </div>
          <label>
            {t('intake.form.reference')}
            <input
              required
              type="date"
              value={state.reference}
              onChange={(e) => change({ ...state, reference: e.target.value })}
            />
          </label>
        </div>
        {addingLine && (
          <div className="fd-line-add">
            <label>
              {t('intake.form.lineName')}
              <input
                autoFocus
                value={newLine}
                onChange={(event) => {
                  setNewLine(event.target.value);
                  setLineNotice('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addLine();
                  }
                }}
              />
            </label>
            <div className="fd-actions">
              <button
                type="button"
                className="fd-btn fd-small"
                disabled={!newLine.trim()}
                onClick={addLine}
              >
                {t('intake.form.saveLine')}
              </button>
              <button
                type="button"
                className="fd-link"
                onClick={() => {
                  setAddingLine(false);
                  setNewLine('');
                  setLineNotice('');
                }}
              >
                {t('work.action.cancel')}
              </button>
            </div>
          </div>
        )}
        {lineNotice && <p role="status">{lineNotice}</p>}
      </details>

      <div className="fd-actions">
        <button className="fd-btn" disabled={!state.input.trim()}>
          {t('intake.form.submit')}
        </button>
        <button
          type="button"
          className="fd-link"
          onClick={() =>
            change({
              ...state,
              context: sampleRequirement,
              input: sampleText,
              reference: sourceDate,
            })
          }
        >
          {t('intake.form.reset')}
        </button>
      </div>
    </form>
  );
}
function Review({ state, change }: Props) {
  const t = useTranslations(),
    [notice, setNotice] = useState(''),
    [target, setTarget] = useState('');
  const pendingCount = state.drafts.filter(
    (draft) => issues(draft, state.items).length
  ).length;
  return (
    <>
      <p>{t('review.page.intro')}</p>
      {state.context && (
        <section className="fd-context-card">
          <small>{t('review.page.context')}</small>
          <p>{state.context}</p>
        </section>
      )}
      <section className="fd-review-stats" aria-label={t('review.page.checks')}>
        <div>
          <span>{t('review.page.total')}</span>
          <strong>{state.drafts.length}</strong>
        </div>
        <div>
          <span>{t('review.page.pendingLabel')}</span>
          <strong>{pendingCount}</strong>
        </div>
        <div>
          <span>{t('review.page.readyLabel')}</span>
          <strong>{state.drafts.length - pendingCount}</strong>
        </div>
      </section>
      <p className="fd-summary">
        {t('review.page.pending', { count: pendingCount })}
      </p>
      {notice && (
        <div role="status">
          {t(notice)}{' '}
          {target && (
            <Link className="fd-link" href={'/items/' + target}>
              {t('work.action.inspect')}
            </Link>
          )}
        </div>
      )}
      {!state.drafts.length && (
        <div className="fd-card">
          {t('review.page.empty')}{' '}
          <Link className="fd-link" href={paths.list}>
            {t('work.nav.list')}
          </Link>
        </div>
      )}
      {state.drafts.map((d) => (
        <ReviewCard
          key={d.id}
          draft={d}
          items={state.items}
          update={(next) =>
            change({
              ...state,
              drafts: state.drafts.map((x) => (x.id === d.id ? next : x)),
            })
          }
          save={() => {
            const next = writeDraft(state, d);
            if (next !== state) {
              change(next);
              setTarget(next.items[0].id);
              setNotice('review.page.saved');
            }
          }}
          merge={(id) => {
            const next = changeAction(state, id, 'merged', d);
            if (next !== state) {
              change(next);
              setTarget(id);
              setNotice('review.page.merged');
            }
          }}
        />
      ))}
    </>
  );
}
function ReviewCard({
  draft: d,
  items,
  update,
  save,
  merge,
}: {
  draft: Draft;
  items: Action[];
  update: (d: Draft) => void;
  save: () => void;
  merge: (id: string) => void;
}) {
  const t = useTranslations(),
    [confirm, setConfirm] = useState(''),
    [activeField, setActiveField] = useState<EvidenceTarget>('title'),
    pending = issues(d, items),
    matches = duplicates(d, items);
  function edit(field: Field, v: string) {
    const edits = { ...d.edits };
    if (v) edits[field] = v;
    else delete edits[field];
    update({ ...d, edits, separate: false });
    setConfirm('');
  }
  const lineCandidates = people.filter((person) => person.dept === d.line);
  const candidates =
    d.match.status === 'ambiguous'
      ? people.filter((person) => d.match.ids.includes(person.id))
      : lineCandidates.length
        ? lineCandidates
        : people;
  return (
    <article className="fd-card fd-review-card">
      <div className="fd-row">
        <h2>{value(d, 'title') || t('work.field.empty')}</h2>
        <span className="fd-chip">{d.line}</span>
      </div>
      <div className="fd-review-columns">
        <SourceEvidence draft={d} active={activeField} />
        <div className="fd-review-draft">
          <div className="fd-review-draft-head">
            <strong>{t('review.page.draftPanel')}</strong>
            <span>{t('review.page.clickField')}</span>
          </div>
          <EvidenceFields
            draft={d}
            activeField={activeField}
            onFieldSelect={setActiveField}
          />
          {pending.map((reason) => (
            <div className="fd-warning" key={reason}>
              <p>{t('review.issue.' + reason)}</p>
            </div>
          ))}
          <div className="fd-fields fd-review-inputs">
            {(!d.values.title.value || d.edits.title !== undefined) && (
              <label>
                {t('work.field.title')}
                <input
                  value={d.edits.title || ''}
                  onChange={(e) => edit('title', e.target.value)}
                  onFocus={() => setActiveField('title')}
                />
              </label>
            )}
            {(d.match.status !== 'matched' || d.alternatives.owner) && (
              <label>
                {t('work.field.owner')}
                <select
                  value={d.edits.owner || ''}
                  onChange={(e) => edit('owner', e.target.value)}
                  onFocus={() => setActiveField('owner')}
                >
                  <option value="">{t('work.field.choose')}</option>
                  {candidates.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.dept} · {p.id}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {(d.dates.ambiguous || !d.dates.date || d.alternatives.due) && (
              <label>
                {t('work.field.due')}
                <input
                  type="date"
                  value={d.edits.due || ''}
                  onChange={(e) => edit('due', e.target.value)}
                  onFocus={() => setActiveField('due')}
                />
              </label>
            )}
            {Object.entries(d.alternatives)
              .filter(([f]) => f !== 'owner' && f !== 'due')
              .map(([f, opts]) => (
                <label key={f}>
                  {t('work.field.' + f)}
                  <select
                    value={d.edits[f as Field] || ''}
                    onChange={(e) => edit(f as Field, e.target.value)}
                    onFocus={() => setActiveField(f as Field)}
                  >
                    <option value="">{t('work.field.choose')}</option>
                    {opts.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              ))}
          </div>
        </div>
      </div>
      {matches.length > 0 && (
        <div>
          {matches.map((m) => (
            <div className="fd-row" key={m.id}>
              <span>
                {t('review.choice.target')} ·{' '}
                <Link className="fd-link" href={'/items/' + m.id}>
                  {value(m, 'title')}
                </Link>
              </span>
              <button
                className="fd-link"
                disabled={pending.some((p) => p !== 'duplicate')}
                onClick={() => setConfirm(m.id)}
              >
                {t('work.action.merge')}
              </button>
            </div>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={!!d.separate}
              onChange={(e) => update({ ...d, separate: e.target.checked })}
            />
            {t('review.choice.separate')}
          </label>
        </div>
      )}
      {confirm && (
        <Confirm
          kind="merged"
          yes={() => {
            merge(confirm);
            setConfirm('');
          }}
          no={() => setConfirm('')}
        />
      )}
      <div className="fd-actions">
        <button
          className="fd-btn fd-small"
          disabled={pending.length > 0}
          onClick={save}
        >
          {t('work.action.save')}
        </button>
        {!pending.length && <small>{t('review.page.ready')}</small>}
      </div>
    </article>
  );
}
function Confirm({
  kind,
  yes,
  no,
}: {
  kind: 'closed' | 'merged';
  yes: () => void;
  no: () => void;
}) {
  const t = useTranslations();
  return (
    <div
      className="fd-confirm"
      role="group"
      aria-label={t('work.action.confirm')}
    >
      <p>{t('detail.page.' + kind)}</p>
      <div className="fd-actions">
        <button className="fd-btn fd-small" onClick={yes}>
          {t('work.action.confirm')}
        </button>
        <button className="fd-btn fd-small fd-secondary" onClick={no}>
          {t('work.action.cancel')}
        </button>
      </div>
    </div>
  );
}
function ActionList({ state }: { state: Workspace }) {
  const t = useTranslations(),
    params = useSearchParams(),
    today = currentDate();
  const line = params.get('line') || '',
    owner = params.get('owner') || '',
    stage = params.get('status') || '',
    from = params.get('from') || '',
    to = params.get('to') || '';
  function filter(key: string, v: string) {
    const url = new URL(location.href);
    if (v) url.searchParams.set(key, v);
    else url.searchParams.delete(key);
    window.history.replaceState(null, '', url);
  }
  const actions = state.items.filter(
    (i) =>
      (!line || line === i.line) &&
      (!owner || ownerId(i) === owner) &&
      (!stage || status(i, today) === stage) &&
      (!from || dueDate(i) >= from) &&
      (!to || dueDate(i) <= to)
  );
  return (
    <>
      <p>{t('items.page.intro')}</p>
      <section className="fd-card">
        <div className="fd-filters">
          {(
            [
              [
                'line',
                'work.field.line',
                line,
                [
                  ...businessLines.map((item) => [
                    item.short,
                    item.short + ' · ' + item.name,
                  ]),
                  ...(state.customLines ?? []).map((item) => [item, item]),
                ],
              ],
              [
                'owner',
                'work.field.owner',
                owner,
                people.map((p) => [p.id, p.name]),
              ],
              [
                'status',
                'work.field.status',
                stage,
                ['open', 'overdue', 'closed'].map((s) => [
                  s,
                  t('work.status.' + s),
                ]),
              ],
            ] as const
          ).map(([key, label, v, options]) => (
            <label key={key}>
              {t(label)}
              <select value={v} onChange={(e) => filter(key, e.target.value)}>
                <option value="">{t('items.filter.all')}</option>
                {options.map(([k, text]) => (
                  <option key={k} value={k}>
                    {text}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {(['from', 'to'] as const).map((k) => (
            <label key={k}>
              {t('items.filter.' + k)}
              <input
                type="date"
                value={k === 'from' ? from : to}
                onChange={(e) => filter(k, e.target.value)}
              />
            </label>
          ))}
        </div>
        <button
          className="fd-link"
          onClick={() =>
            window.history.replaceState(null, '', location.pathname)
          }
        >
          {t('items.filter.reset')}
        </button>
      </section>
      <div className="fd-card fd-scroll">
        <table className="fd-list">
          <thead>
            <tr>
              {['title', 'line', 'owner', 'due', 'status'].map((f) => (
                <th key={f}>{t('work.field.' + f)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actions.map((i) => (
              <tr key={i.id}>
                <td>
                  <Link href={'/items/' + i.id}>{value(i, 'title')}</Link>
                </td>
                <td>{i.line}</td>
                <td>{people.find((p) => p.id === ownerId(i))?.name}</td>
                <td>{dueDate(i)}</td>
                <td>
                  <span className="fd-chip">
                    {t('work.status.' + status(i, today))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!actions.length && <p>{t('items.page.empty')}</p>}
      </div>
    </>
  );
}
function Detail({ state, change, id }: Props & { id: string }) {
  const t = useTranslations(),
    [confirm, setConfirm] = useState(''),
    [undone, setUndone] = useState(false);
  const item = state.items.find((i) => i.id === id);
  if (!item)
    return (
      <div className="fd-card">
        {t('detail.page.missing')}{' '}
        <Link className="fd-link" href={paths.list}>
          {t('work.nav.list')}
        </Link>
      </div>
    );
  const sources = [...state.items, ...state.drafts].filter(
    (d) =>
      d.id !== id &&
      duplicates(d, [item]).length &&
      (!('closed' in d) || !d.closed) &&
      !issues({ ...d, separate: true }, []).length
  );
  return (
    <>
      <article className="fd-card">
        <div className="fd-row">
          <h2>{value(item, 'title')}</h2>
          <span className="fd-chip">
            {t('work.status.' + status(item, currentDate()))} ·{' '}
            {t(item.closed ? 'work.field.userAction' : 'work.field.rule')}
          </span>
        </div>
        <p>{item.line}</p>
        {item.context && (
          <div className="fd-context-card">
            <small>{t('detail.page.context')}</small>
            <p>{item.context}</p>
          </div>
        )}
        <h3>{t('detail.page.fields')}</h3>
        <EvidenceFields draft={item} />
        <div className="fd-actions">
          {!item.closed && (
            <button
              className="fd-btn fd-secondary"
              onClick={() => setConfirm('close')}
            >
              {t('work.action.close')}
            </button>
          )}
          {sources.map((s) => (
            <button
              key={s.id}
              className="fd-link"
              onClick={() => setConfirm(s.id)}
            >
              {t('work.action.merge')} · {value(s, 'title')}
            </button>
          ))}
          {state.undo.at(-1)?.itemId === id && (
            <button
              className="fd-link"
              onClick={() => {
                change(undoAction(state, id));
                setUndone(true);
                setConfirm('');
              }}
            >
              {t('work.action.undo')}
            </button>
          )}
        </div>
        {confirm && (
          <Confirm
            kind={confirm === 'close' ? 'closed' : 'merged'}
            no={() => setConfirm('')}
            yes={() => {
              change(
                changeAction(
                  state,
                  id,
                  confirm === 'close' ? 'closed' : 'merged',
                  sources.find((s) => s.id === confirm)
                )
              );
              setConfirm('');
              setUndone(false);
            }}
          />
        )}
        {undone && <p role="status">{t('detail.page.undo')}</p>}
      </article>
      <section className="fd-card">
        <h2>{t('detail.page.sources')}</h2>
        {item.sources.map((s, i) => (
          <blockquote className="fd-source" key={i}>
            {s}
          </blockquote>
        ))}
      </section>
      <section className="fd-card">
        <h2>{t('detail.page.history')}</h2>
        <ol className="fd-history">
          {item.history.map((h, i) => (
            <li key={i}>
              <span>{t('detail.log.' + h.kind)}</span>
              <small className="fd-chip">
                {t(
                  'detail.source.' +
                    (h.source ?? (h.kind === 'sample' ? 'fixture' : 'user'))
                )}
              </small>
              <time>{h.at.replace('T', ' ').slice(0, 19)}</time>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
