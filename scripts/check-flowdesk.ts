import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  businessLines,
  examples,
  sampleRequirement,
  sampleText,
  sourceDate,
} from '../src/shared/flowdesk/fixtures';
import {
  changeAction,
  detectBusinessLine,
  extract,
  initialWorkspace,
  issues,
  matchOwner,
  normalizeDate,
  sourceFragments,
  status,
  undoAction,
  writeDraft,
} from '../src/shared/flowdesk/model';

function schema(value: unknown, path = ''): string[] {
  if (!value || typeof value !== 'object') return [path];
  return [
    path,
    ...Object.entries(value).flatMap(([key, child]) =>
      schema(child, path + '.' + key)
    ),
  ].sort();
}
const root = 'src/config/locale/messages';
function resources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((file) =>
      file.isDirectory()
        ? resources(join(dir, file.name)).map((path) => file.name + '/' + path)
        : [file.name]
    )
    .sort();
}
const files = resources(join(root, 'zh'));
assert.deepEqual(files, resources(join(root, 'en')));
for (const file of files) {
  const read = (locale: string) =>
    JSON.parse(readFileSync(join(root, locale, file), 'utf8'));
  assert.deepEqual(schema(read('en')), schema(read('zh')), file);
}

assert.equal(businessLines.length, 11);
assert.deepEqual(
  businessLines.map((line) => line.short),
  [
    'ICT',
    '终端',
    '华为云',
    '数能',
    '车BU',
    '海思',
    '计算',
    '存储',
    'HR',
    '财经',
    '流程IT',
  ]
);
assert.deepEqual(examples, [
  '这周要跟计算义总交流一下立项的事情，跟义总秘书约下时间',
  'hr安排了全员沟通会，需要预定各个地域的会议室，让大家线下参加会议',
]);
assert.equal(detectBusinessLine(examples[0], 'ICT'), '计算');
assert.equal(detectBusinessLine(examples[1], 'ICT'), 'HR');
assert.equal(matchOwner('工号0231 秘书A').via, 'employee');
assert.equal(matchOwner('计算 · 秘书A').via, 'full');
assert.deepEqual(matchOwner('计算义总秘书'), {
  status: 'matched',
  ids: ['0231'],
  via: 'short',
});
assert.equal(matchOwner('HR-HR会务').via, 'alias');
assert.equal(matchOwner('HR小王').status, 'ambiguous');
assert.equal(matchOwner('HR小周').status, 'not_found');
assert.deepEqual(normalizeDate('这周', sourceDate), {
  date: '2026-11-23',
  end: '2026-11-29',
  ambiguous: true,
});
assert.deepEqual(normalizeDate('下周找个时间', sourceDate), {
  date: '2026-11-30',
  end: '2026-12-06',
  ambiguous: true,
});
assert.equal(normalizeDate('下周天', sourceDate).date, '2026-12-06');
assert.equal(normalizeDate('2026-02-30', sourceDate).date, '');
assert.equal(normalizeDate('明天', sourceDate).date, '2026-11-24');
assert.equal(sourceFragments(sampleText).join(''), sampleText);
const state = initialWorkspace(),
  [compute, hr] = state.drafts;
assert.deepEqual(state.customLines, []);
assert.equal(state.context, sampleRequirement);
assert.equal(compute.context, sampleRequirement);
assert.deepEqual(
  [compute, hr].map((draft) => issues(draft, state.items)),
  [['vague'], ['missing', 'date']]
);
assert.equal(compute.line, '计算');
assert.equal(compute.values.title.value, '与计算义总沟通立项');
assert.equal(compute.values.owner.value, '义总秘书');
assert.equal(compute.match.status, 'matched');
assert.equal(compute.values.due.value, '这周');
assert.equal(hr.line, 'HR');
assert.equal(hr.values.title.value, '预定各个地域的会议室');
assert.equal(writeDraft(state, hr), state);
const saved = writeDraft(state, {
  ...hr,
  edits: { owner: '0416', due: '2026-11-27' },
});
assert.equal(saved.items[0].edits.owner, '0416');
const duplicate = { ...compute, edits: { due: '2026-11-29' } };
assert.deepEqual(issues(duplicate, state.items), ['duplicate']);
const merged = changeAction(state, 'sample', 'merged', duplicate);
assert.equal(merged.items[0].history.at(-1)?.kind, 'merged');
assert.equal(merged.drafts.length, state.drafts.length - 1);
const restored = undoAction(merged, 'sample');
assert.equal(restored.items[0].sources.length, 1);
assert.equal(restored.drafts.length, state.drafts.length);
const closed = changeAction(state, 'sample', 'closed');
assert.equal(status(closed.items[0], sourceDate), 'closed');
assert.equal(undoAction(closed, 'sample').items[0].closed, false);
assert.equal(status(state.items[0], sourceDate), 'open');
assert.equal(
  extract('群里只说尽快跟进。', 'ICT', sourceDate)[0].values.owner.value,
  ''
);
console.log(
  'FlowDesk workflow checks passed. Locale resource paths and keys agree (' +
    files.length +
    ' file pairs).'
);
