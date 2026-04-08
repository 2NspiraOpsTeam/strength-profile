import { ASSESSMENT_SECTIONS, DIMENSIONS } from './assessment-config';
import { PROFILES } from './profile-config';

const SCORE_MAP = { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 };

function round(value) {
  return Math.round(value);
}

export function scoreAssessment(responses) {
  const dimensionMap = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension.id, []]));

  ASSESSMENT_SECTIONS.forEach((section) => {
    section.questions.forEach((question) => {
      const value = responses[question.id];
      if (typeof value === 'number') {
        dimensionMap[question.dimension].push(SCORE_MAP[value] ?? 0);
      }
    });
  });

  const dimensions = DIMENSIONS.map((dimension) => {
    const values = dimensionMap[dimension.id];
    const score = values.length ? round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
    return {
      id: dimension.id,
      title: dimension.title,
      shortTitle: dimension.shortTitle,
      score,
    };
  });

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const overallScore = round(dimensions.reduce((sum, dimension) => sum + dimension.score, 0) / dimensions.length);

  const profile = getPrimaryProfile(sorted);

  return {
    overallScore,
    dimensions,
    strongest: sorted.slice(0, 5),
    weakest: [...sorted].reverse().slice(0, 3),
    profile,
  };
}

export function getPrimaryProfile(sortedDimensions) {
  const topIds = sortedDimensions.slice(0, 2).map((item) => item.id);
  return (
    PROFILES.find((profile) => profile.dimensions.every((dimension) => topIds.includes(dimension))) ||
    PROFILES[0]
  );
}

export function getEnergyDrivers(results) {
  return results.strongest.slice(0, 3).map((item) => {
    const map = {
      strategicInsight: 'Making sense of complexity and connecting ideas',
      creativeExpression: 'Shaping ideas into compelling language or concepts',
      executionDrive: 'Creating momentum and moving work forward',
      operationalReliability: 'Creating order, consistency, and dependable follow-through',
      relationalInfluence: 'Building trust and alignment through people',
      advisoryJudgment: 'Helping others think clearly and make strong decisions',
      adaptiveProblemSolving: 'Responding well to change, pressure, and ambiguity',
      systemsImprovement: 'Improving how work gets done and removing friction',
    };
    return map[item.id] || item.title;
  });
}

export function getFrictionZones(results) {
  return results.weakest.map((item) => {
    const map = {
      strategicInsight: 'Work that leaves little room for reflection or bigger-picture thinking',
      creativeExpression: 'Work that demands output without room for originality or shaping',
      executionDrive: 'Environments that require constant urgency and push without enough clarity',
      operationalReliability: 'Highly repetitive or detail-heavy routines that feel constraining rather than stabilizing',
      relationalInfluence: 'Work that depends heavily on constant relationship management or social energy',
      advisoryJudgment: 'Situations where people need immediate certainty rather than thoughtful perspective',
      adaptiveProblemSolving: 'Environments with constant instability but little support or structure',
      systemsImprovement: 'Work cultures that resist improvement, clarity, or process refinement',
    };
    return map[item.id] || item.title;
  });
}

export function getCollaborationStyle(results) {
  const top = results.strongest[0]?.id;
  const map = {
    strategicInsight: 'Clarifier — helps people see what matters and where things are going',
    creativeExpression: 'Catalyst — helps teams shape ideas and make them compelling',
    executionDrive: 'Momentum builder — helps work move and prevents drift',
    operationalReliability: 'Stabilizer — creates steadiness, structure, and trust',
    relationalInfluence: 'Connector — builds alignment and trust across people',
    advisoryJudgment: 'Guide — helps others think more clearly and decide wisely',
    adaptiveProblemSolving: 'Integrator — helps teams adapt and respond under pressure',
    systemsImprovement: 'Improver — helps teams work more smoothly and effectively',
  };
  return map[top] || 'Collaborative contributor';
}

export function getWorkFit(results) {
  const profile = results.profile?.label;
  const map = {
    'Strategic Synthesizer': 'Thrives in roles that involve direction-setting, pattern recognition, and thoughtful problem solving.',
    'Creative Catalyst': 'Thrives in idea-rich environments where originality, messaging, and concept development matter.',
    'Execution Builder': 'Thrives in fast-moving roles where progress, action, and tangible delivery are valued.',
    'Trusted Operator': 'Thrives in roles that need steadiness, reliability, and strong operational execution.',
    'Relational Driver': 'Thrives in people-centered work where trust, influence, and momentum matter.',
    'Advisory Anchor': 'Thrives in roles where judgment, perspective, and guidance create value for others.',
    'Adaptive Integrator': 'Thrives in change-heavy environments where someone needs to make complexity workable.',
    'Systems Improver': 'Thrives in environments where process, systems, and practical improvement are valued.',
  };
  return map[profile] || 'Thrives in environments aligned with natural strengths and contribution patterns.';
}

export function generatePersonalizedSummary(results, profileInput = {}) {
  const name = profileInput.name?.trim();
  const role = profileInput.role;
  const workContext = profileInput.workContext;
  const goal = profileInput.helpGoal;
  const topStrength = results.strongest[0]?.title || 'natural contribution';
  const prefix = [name, role].filter(Boolean).join(' · ');

  return `${prefix ? `${prefix}: ` : ''}Your results suggest that ${topStrength.toLowerCase()} is one of the clearest ways you create value. ${results.profile.summary}${workContext ? ` In a ${workContext.toLowerCase()} environment, this profile is especially likely to shape how you contribute, influence others, and find energy in your work.` : ''}${goal ? ` Because you want this profile to help you ${goal.toLowerCase()}, the most useful next step is to look at where your strongest contribution patterns are being used well today and where they may still be underutilized.` : ''}`;
}

export function generatePersonalReflections(results, profileInput = {}) {
  const strongest = results.strongest[0]?.title || 'your strongest pattern';
  const weakest = results.weakest[0]?.title || 'misaligned work';
  const drain = profileInput.whatDrainsYou;

  return [
    `When you are at your best, ${strongest.toLowerCase()} is usually one of the clearest ways you help others move forward.`,
    `You may feel underused when your work environment does not give enough room for how you naturally contribute.`,
    drain ? `Because you identified "${drain}" as draining, it will be important to notice whether your current role overemphasizes that pattern.` : `Pay attention to the kinds of work that repeatedly drain you, especially when they conflict with your strongest contribution patterns.`,
    `One potential tension to watch is how ${strongest.toLowerCase()} can be overlooked if your environment overvalues ${weakest.toLowerCase()} instead.`,
  ];
}

export function generateManagerGuidance(results) {
  const top = results.strongest[0]?.id;
  const map = {
    strategicInsight: 'Give this person enough room to think, synthesize, and shape direction before expecting rapid execution.',
    creativeExpression: 'Use this person where ideas need shaping, framing, and compelling communication.',
    executionDrive: 'Give this person ownership of momentum, deadlines, and visible progress.',
    operationalReliability: 'Trust this person with consistency, structure, and follow-through where reliability matters.',
    relationalInfluence: 'Position this person where trust-building and alignment will accelerate results.',
    advisoryJudgment: 'Use this person as a thought partner when decisions require clarity and discernment.',
    adaptiveProblemSolving: 'Bring this person into complex or changing situations where someone needs to make things workable.',
    systemsImprovement: 'Use this person where work needs to become smoother, simpler, and more effective.',
  };
  return map[top] || 'Give this person work that aligns with how they naturally create value.';
}
