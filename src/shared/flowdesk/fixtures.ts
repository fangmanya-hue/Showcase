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
];
export const departments = [...new Set(people.map((person) => person.dept))];
export const sourceDate = '2026-11-23';
export const sampleRequirement =
  '识别部门沟通中需要继续推进的工作，整理为有负责人、有截止时间、可核对和可追踪的事项。';
export const examples = [
  '这周要跟计算义总交流一下立项的事情，跟义总秘书约下时间',
  'hr安排了全员沟通会，需要预定各个地域的会议室，让大家线下参加会议',
];
export const sampleText = examples.join('\n\n');

export const showcase = {
  title: '与计算义总沟通立项',
  name: '秘书A',
  date: '2026-11-23 – 2026-11-29',
  message: examples[0],
  evidence: '跟义总秘书约下时间',
};
