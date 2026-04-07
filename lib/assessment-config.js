export const SCALE_OPTIONS = [
  { value: 1, label: '1', shortLabel: 'Rarely me', description: 'This feels uncharacteristic or draining.' },
  { value: 2, label: '2', shortLabel: 'Sometimes', description: 'This shows up occasionally, but not consistently.' },
  { value: 3, label: '3', shortLabel: 'Often', description: 'This is a meaningful part of how I work.' },
  { value: 4, label: '4', shortLabel: 'Usually', description: 'This is a reliable part of how I naturally contribute.' },
  { value: 5, label: '5', shortLabel: 'Strongly me', description: 'This is one of the clearest ways I create value.' },
];

export const DIMENSIONS = [
  { id: 'strategicInsight', title: 'Strategic Insight', shortTitle: 'Insight' },
  { id: 'creativeExpression', title: 'Creative Expression', shortTitle: 'Creative' },
  { id: 'executionDrive', title: 'Execution Drive', shortTitle: 'Execution' },
  { id: 'operationalReliability', title: 'Operational Reliability', shortTitle: 'Reliability' },
  { id: 'relationalInfluence', title: 'Relational Influence', shortTitle: 'Relational' },
  { id: 'advisoryJudgment', title: 'Advisory Judgment', shortTitle: 'Advisory' },
  { id: 'adaptiveProblemSolving', title: 'Adaptive Problem Solving', shortTitle: 'Adaptive' },
  { id: 'systemsImprovement', title: 'Systems Improvement', shortTitle: 'Systems' },
];

export const ASSESSMENT_SECTIONS = [
  {
    id: 'howYouThink',
    title: 'How You Think',
    description: 'How you interpret complexity, ideas, judgment, and direction.',
    questions: [
      { id: 'q1', dimension: 'strategicInsight', prompt: 'I naturally spot patterns, themes, or implications that others miss.' },
      { id: 'q2', dimension: 'advisoryJudgment', prompt: 'People often rely on me for perspective before making an important decision.' },
      { id: 'q3', dimension: 'strategicInsight', prompt: 'I enjoy stepping back to understand the bigger picture before acting.' },
      { id: 'q4', dimension: 'advisoryJudgment', prompt: 'I often ask questions that help others think more clearly.' },
      { id: 'q5', dimension: 'adaptiveProblemSolving', prompt: 'I stay mentally engaged when the situation is changing or unclear.' },
      { id: 'q6', dimension: 'systemsImprovement', prompt: 'I quickly notice where processes, handoffs, or decisions are creating friction.' },
    ],
  },
  {
    id: 'howYouCreate',
    title: 'How You Create',
    description: 'How you generate, shape, and improve ideas and work.',
    questions: [
      { id: 'q7', dimension: 'creativeExpression', prompt: 'I enjoy turning rough ideas into concepts that feel clear, compelling, or original.' },
      { id: 'q8', dimension: 'systemsImprovement', prompt: 'I naturally think about how to make work smoother, simpler, or more effective.' },
      { id: 'q9', dimension: 'creativeExpression', prompt: 'I bring fresh language, framing, or originality to projects.' },
      { id: 'q10', dimension: 'strategicInsight', prompt: 'I often connect unrelated ideas into something useful.' },
      { id: 'q11', dimension: 'systemsImprovement', prompt: 'I am energized by improving existing systems rather than just accepting them.' },
      { id: 'q12', dimension: 'creativeExpression', prompt: 'I am at my best when I can shape ideas into something people can understand or use.' },
    ],
  },
  {
    id: 'howYouExecute',
    title: 'How You Execute',
    description: 'How you create progress, consistency, and follow-through.',
    questions: [
      { id: 'q13', dimension: 'executionDrive', prompt: 'I naturally create momentum and move work forward.' },
      { id: 'q14', dimension: 'operationalReliability', prompt: 'People trust me to create order, structure, or consistency.' },
      { id: 'q15', dimension: 'executionDrive', prompt: 'I get energy from turning plans into visible progress.' },
      { id: 'q16', dimension: 'operationalReliability', prompt: 'I am dependable when a project needs steadiness and follow-through.' },
      { id: 'q17', dimension: 'executionDrive', prompt: 'I would rather make progress than stay in analysis for too long.' },
      { id: 'q18', dimension: 'operationalReliability', prompt: 'I naturally help teams feel less chaotic and more grounded.' },
    ],
  },
  {
    id: 'howYouWorkWithPeople',
    title: 'How You Work With People',
    description: 'How you build trust, influence others, and respond in real situations.',
    questions: [
      { id: 'q19', dimension: 'relationalInfluence', prompt: 'I naturally build trust and connection with others.' },
      { id: 'q20', dimension: 'advisoryJudgment', prompt: 'Others often open up to me because I make them think and feel heard.' },
      { id: 'q21', dimension: 'relationalInfluence', prompt: 'I can often create alignment or momentum through relationships.' },
      { id: 'q22', dimension: 'adaptiveProblemSolving', prompt: 'I stay useful when people or situations become tense, unclear, or fast-moving.' },
      { id: 'q23', dimension: 'relationalInfluence', prompt: 'I notice interpersonal dynamics quickly and usually know how to respond.' },
      { id: 'q24', dimension: 'adaptiveProblemSolving', prompt: 'I can adjust quickly when plans change or new constraints appear.' },
    ],
  },
];
