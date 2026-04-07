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
