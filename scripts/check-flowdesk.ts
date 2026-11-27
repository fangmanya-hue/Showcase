import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  draftsFromAI,
  FLOWDESK_EXTRACTION_PROMPT,
  needsCoverageReview,
  parseAIExtraction,
} from '../src/shared/flowdesk/ai';
import {
  businessLines,
  examples,
  sampleText,
  sourceDate,
} from '../src/shared/flowdesk/fixtures';
import {
  valueOnIntakeBlur,
  valueOnIntakeFocus,
} from '../src/shared/flowdesk/input-state';
import {
  changeAction,
  detectBusinessLine,
  extract,
  initialWorkspace,
  issues,
  matchOwner,
  normalizeDate,
  sourceFragments,
  splitSourceBlocks,
  status,
  undoAction,
  writeDraft,
} from '../src/shared/flowdesk/model';
import { isValidGoogleClientId } from '../src/shared/lib/google-auth';

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
assert.equal(
  isValidGoogleClientId(
    '123456789012-exampleclientidentifier.apps.googleusercontent.com'
  ),
  true
);
assert.equal(isValidGoogleClientId('.apps.googleusercontent.com'), false);
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
assert.match(sampleText, /^群名:XXXX筹备群/);
assert.equal(detectBusinessLine('计算团队需要继续推进这项工作', 'ICT'), '计算');
assert.equal(detectBusinessLine('hr 安排全员沟通会', 'ICT'), 'HR');
assert.equal(valueOnIntakeFocus(sampleText), '');
assert.equal(valueOnIntakeFocus('用户已经输入的内容'), '用户已经输入的内容');
assert.equal(valueOnIntakeBlur(''), sampleText);
assert.equal(valueOnIntakeBlur('   '), sampleText);
assert.equal(valueOnIntakeBlur('用户已经输入的内容'), '用户已经输入的内容');
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
assert.equal(matchOwner('产品-张').ids[0], '1101');
assert.equal(matchOwner('运营-李').ids[0], '1201');
assert.equal(matchOwner('设计-王').ids[0], '1301');
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
assert.equal(normalizeDate('11/27 18:00', '2026-11-26').date, '2026-11-27');
assert.equal(
  normalizeDate('12月1日周二14:00到16:30', '2026-11-26').date,
  '2026-12-01'
);
assert.equal(sourceFragments(sampleText).join(''), sampleText);
assert.equal(
  splitSourceBlocks(`1、${examples[0]} 2、${examples[1]}`).length,
  2
);
const state = initialWorkspace(),
  [documentDraft, dataDraft, designDraft, tableDraft] = state.drafts,
  [compute, hr] = extract(examples.join('\n\n'), 'ICT', sourceDate);
assert.deepEqual(state.customLines, []);
assert.equal(state.context, '');
assert.equal(state.lastExtraction?.source, 'ai');
assert.equal(state.analysis?.sourceName, 'XXXX筹备群');
assert.equal(state.drafts.length, 4);
assert.equal(state.items.length, 3);
assert.deepEqual(
  state.drafts.map((draft) => draft.values.title.value),
  [
    '建立业务沟通会议程共享文档并补充大纲',
    '整理近期转化数据并填写共享文档',
    '发送会议PPT模板和主视觉封面图',
    '在共享表更新进度和最终文档地址',
  ]
);
assert.deepEqual(
  state.drafts.map((draft) => issues(draft, state.items)),
  [[], [], [], ['missing', 'date']]
);
assert.equal(documentDraft.match.ids[0], '1101');
assert.equal(dataDraft.match.ids[0], '1201');
assert.equal(designDraft.match.ids[0], '1301');
assert.equal(documentDraft.dates.date, sourceDate);
assert.equal(dataDraft.dates.date, '2026-11-24');
assert.equal(designDraft.dates.date, sourceDate);
assert.equal(tableDraft.values.owner.value, '');
assert.equal(tableDraft.values.due.value, '');
for (const draft of state.drafts)
  for (const sentences of Object.values(draft.evidence ?? {}))
    for (const sentence of sentences ?? [])
      assert.ok(draft.raw.includes(sentence));
assert.deepEqual(
  [compute, hr].map((draft) => issues(draft, [])),
  [
    ['missing', 'vague'],
    ['missing', 'date'],
  ]
);
assert.equal(compute.line, '计算');
assert.equal(compute.values.title.value, '联系义总秘书，预约立项沟通时间');
assert.equal(compute.values.owner.value, '');
assert.equal(compute.match.status, 'not_found');
assert.equal(compute.mentions.contact.value, '义总秘书');
assert.equal(compute.contactMatch.status, 'matched');
assert.deepEqual(
  compute.mentions.participants.map((item) => item.value),
  ['计算义总']
);
assert.equal(compute.values.due.value, '这周');
assert.equal(hr.line, 'HR');
assert.equal(hr.values.title.value, '预定各个地域的会议室');
assert.equal(writeDraft(state, tableDraft), state);
const saved = writeDraft(state, {
  ...tableDraft,
  edits: { owner: '0001', due: '2026-11-27' },
});
assert.equal(saved.items[0].edits.owner, '0001');
const duplicate = {
  ...documentDraft,
  separate: false,
};
assert.deepEqual(issues(duplicate, state.items), ['duplicate']);
const merged = changeAction(state, 'sample', 'merged', duplicate);
assert.equal(merged.items[0].history.at(-1)?.kind, 'merged');
assert.equal(merged.items[0].history.at(-1)?.source, 'user');
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

const complexChat = `群名:产品运营部Q4复盘暨12月排期会筹备群
11/26 10:02 小李:@所有人先发个会议草案，大家看下有没有冲突。主题是Q4项目复盘暨12月排期会，拟时间12月1日周二14:00到16:30，13:50前入场签到，地点3F-302会议室，腾讯会议同步123456789，密码1201。参会是部门全员加市场、交付、支持接口人，外地或客户现场可以线上，但提前报备。议题收集截止11/27 18:00，材料截止11/30 12:00。先别接龙，我把投票放群里，时间定了再发正式接龙。
11/26 10:05 王姐:收到，周二下午可以，周三下午我有客户会，尽量别排周三。会议必须控时，超时议题转会后小会，不临时加议题。
11/26 10:07 张哥:我周三15:00有客户验收，周二14:00没问题。302够坐吗，接口人来几个?
11/26 10:10 陈晨:302能坐18人左右。建议线上也开，外地同事和客户现场同学方便。投屏接口我确认下，Type-C和HDMI都带转接头。`;
const aiExtraction = parseAIExtraction(
  JSON.stringify({
    conversation: {
      source_name: '产品运营部Q4复盘暨12月排期会筹备群',
      summary: '筹备Q4复盘暨12月排期会并收齐议题和材料。',
      participants: ['小李', '王姐', '张哥', '陈晨'],
      decisions: [
        {
          text: '会议同时开放线上参会',
          evidence: '建议线上也开，外地同事和客户现场同学方便',
        },
      ],
      constraints: [
        {
          text: '不临时增加议题',
          evidence: '会议必须控时，超时议题转会后小会，不临时加议题',
        },
      ],
      open_questions: [
        { text: '确认接口人人数', evidence: '302够坐吗，接口人来几个?' },
      ],
    },
    actions: [
      {
        title: '收集会议议题',
        owner: '',
        contacts: [],
        participants: ['部门全员', '市场接口人', '交付接口人', '支持接口人'],
        department: '',
        due_text: '11/27 18:00',
        priority: '',
        business_line: '',
        source: '产品运营部Q4复盘暨12月排期会筹备群',
        confidence: 0.96,
        needs_confirmation: ['owner'],
        alternatives: {},
        evidence: {
          title: ['议题收集截止11/27 18:00'],
          owner: [],
          due: ['议题收集截止11/27 18:00'],
          participants: ['参会是部门全员加市场、交付、支持接口人'],
          source: ['群名:产品运营部Q4复盘暨12月排期会筹备群'],
        },
      },
      {
        title: '确认投屏接口和转接头',
        owner: '陈晨',
        contacts: [],
        participants: [],
        department: '',
        due_text: '',
        priority: '',
        business_line: '',
        source: '产品运营部Q4复盘暨12月排期会筹备群',
        confidence: 0.98,
        needs_confirmation: ['due'],
        alternatives: {},
        evidence: {
          title: ['投屏接口我确认下，Type-C和HDMI都带转接头'],
          owner: ['陈晨:302能坐18人左右'],
          due: [],
          source: ['群名:产品运营部Q4复盘暨12月排期会筹备群'],
        },
      },
    ],
  })
);
const aiMapped = draftsFromAI({
  raw: complexChat,
  reference: '2026-11-26',
  fallbackLine: 'ICT',
  extraction: aiExtraction,
});
assert.equal(aiMapped.drafts.length, 2);
assert.equal(aiMapped.drafts[0].dates.date, '2026-11-27');
assert.equal(aiMapped.drafts[0].match.status, 'not_found');
assert.equal(aiMapped.drafts[0].extractionSource, 'ai');
assert.equal(aiMapped.drafts[1].values.owner.value, '陈晨');
assert.equal(
  aiMapped.analysis.constraints[0].evidence.includes('会议必须控时'),
  true
);
assert.equal(aiMapped.analysis.openQuestions[0].text, '确认接口人人数');
assert.equal(needsCoverageReview(complexChat, aiExtraction), true);
assert.equal(
  needsCoverageReview(
    complexChat,
    parseAIExtraction(
      JSON.stringify({
        conversation: {},
        actions: Array.from({ length: 5 }, (_, index) => ({
          title: `待办 ${index + 1}`,
          evidence: {},
        })),
      })
    )
  ),
  false
);
assert.match(FLOWDESK_EXTRACTION_PROMPT, /发言人不自动等于 owner/);
assert.match(FLOWDESK_EXTRACTION_PROMPT, /秘书是 contact/);
console.log(
  'FlowDesk workflow checks passed. Locale resource paths and keys agree (' +
    files.length +
    ' file pairs).'
);
