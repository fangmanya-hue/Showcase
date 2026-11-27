// Public Huawei organization names are paired with concise labels for this
// product demo. The labels are UI shorthand, not a claim of an official list.
export const businessLines = [
  { short: 'ICT', name: 'ICT基础设施业务', aliases: ['ict', 'ict基础设施'] },
  { short: '终端', name: '终端业务', aliases: ['终端', '消费者'] },
  { short: '华为云', name: '云计算业务', aliases: ['华为云', '云计算'] },
  { short: '数能', name: '数字能源业务', aliases: ['数能', '数字能源'] },
  {
    short: '车BU',
    name: '智能汽车解决方案业务',
    aliases: ['车bu', '智能汽车'],
  },
  { short: '海思', name: '芯片与器件业务', aliases: ['海思', '芯片', '器件'] },
  { short: '计算', name: '计算产业', aliases: ['计算', '鲲鹏', '昇腾'] },
  { short: '存储', name: '数据存储产业', aliases: ['存储', '数据存储'] },
  { short: 'HR', name: '人力资源', aliases: ['hr', '人力资源'] },
  { short: '财经', name: '财经', aliases: ['财经', '财务'] },
  {
    short: '流程IT',
    name: '质量与流程IT',
    aliases: ['流程it', 'q&it', '质量与流程it'],
  },
] as const;

export const lines = businessLines.map((line) => line.short);

// Directory entries are deliberately redacted. They exercise the local
// matching rules and do not represent real Huawei employees.
export const people = [
  {
    id: '0001',
    name: '当前操作者',
    dept: '计算',
    short: [],
    aliases: [],
  },
  {
    id: '0231',
    name: '秘书A',
    dept: '计算',
    short: ['义总秘书'],
    aliases: ['义总秘书'],
  },
  {
    id: '0416',
    name: 'HR协调人A',
    dept: 'HR',
    short: ['小王'],
    aliases: ['HR会务'],
  },
  {
    id: '0417',
    name: 'HR协调人B',
    dept: 'HR',
    short: ['小王'],
    aliases: [],
  },
  {
    id: '1101',
    name: '张宁',
    dept: '产品',
    short: ['张'],
    aliases: ['产品-张', '产品张'],
  },
  {
    id: '1201',
    name: '李楠',
    dept: '运营',
    short: ['李'],
    aliases: ['运营-李', '运营李'],
  },
  {
    id: '1301',
    name: '王敏',
    dept: '设计',
    short: ['王'],
    aliases: ['设计-王', '设计王'],
  },
];
export const departments = [...new Set(people.map((person) => person.dept))];
export const sourceDate = '2026-11-23';
export const sampleRequirement =
  '识别部门沟通中需要继续推进的工作，整理为有负责人、有截止时间、可核对和可追踪的事项。';
export const sampleMessages = [
  '今天 10:00\n产品-张：@所有人 大家上午好。为了顺利推进下周二的业务沟通会，咱们今天先把初步议程定下来。我下午建一个共享文档，把大纲放进去。',
  '今天 10:05\n运营-李：收到。我负责讲近期转化数据，明天上午把数据整理好，直接填进文档里。',
  '今天 10:08\n设计-王：会议用的通用PPT模板和主视觉封面图，我今天下班前发到群里。',
  '今天 10:18\n产品-张：好的，辛苦了各位。大家记得把进度和最终文档地址更新在共享表里。',
];
export const sampleText = ['群名:XXXX筹备群', ...sampleMessages].join('\n\n');
export const sampleWorkspaceVersion = 2;

// Stable rule fixtures keep the preloaded review/list states deterministic.
// They are not shown as the intake example.
export const examples = [
  '这周要跟计算义总交流一下立项的事情，跟义总秘书约下时间',
  'hr安排了全员沟通会，需要预定各个地域的会议室，让大家线下参加会议',
];

export const showcase = {
  title: '建立业务沟通会议程共享文档',
  name: '张宁（产品 · 工号 1101）',
  date: '2026-11-23',
  message: sampleMessages[0],
  evidence: '我下午建一个共享文档，把大纲放进去。',
};
