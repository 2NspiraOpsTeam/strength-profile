'use client';

import { useEffect, useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { BRAND } from '@/lib/brand-config';
import { ASSESSMENT_SECTIONS, SCALE_OPTIONS } from '@/lib/assessment-config';
import { CAREER_STAGE_OPTIONS, DRAIN_OPTIONS, HELP_GOAL_OPTIONS, ROLE_OPTIONS, WORK_CONTEXT_OPTIONS } from '@/lib/profile-input-config';
import {
  generateManagerGuidance,
  generatePersonalizedSummary,
  generatePersonalReflections,
  getCollaborationStyle,
  getEnergyDrivers,
  getFrictionZones,
  getWorkFit,
  scoreAssessment,
} from '@/lib/scoring';
import { Pill, SectionHeader, StatCard } from '@/components/ui';

const STORAGE_KEY = 'strength-profile-v1';
const EMPTY_PROFILE = {
  name: '',
  role: '',
  careerStage: '',
  workContext: '',
  email: '',
  helpGoal: '',
  whatDrainsYou: '',
};

function getInitialState() {
  if (typeof window === 'undefined') return { responses: {}, profileInput: EMPTY_PROFILE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { responses: {}, profileInput: EMPTY_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      responses: parsed.responses || {},
      profileInput: { ...EMPTY_PROFILE, ...(parsed.profileInput || {}) },
    };
  } catch {
    return { responses: {}, profileInput: EMPTY_PROFILE };
  }
}

function ProfileInputStep({ profileInput, setProfileInput }) {
  function update(field, value) {
    setProfileInput((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <SectionHeader eyebrow="Profile context" title="Make this feel more like you" description="Add a little context so your results reflect not just your strengths, but how they show up in your actual work life." />
      <div className="three-col" style={{ marginTop: 20 }}>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Name</div>
          <input value={profileInput.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: 'rgba(255,255,255,0.04)', color: '#edf2ff', padding: '0 14px' }} />
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Role</div>
          <select value={profileInput.role} onChange={(e) => update('role', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select role</option>
            {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Career stage</div>
          <select value={profileInput.careerStage} onChange={(e) => update('careerStage', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select stage</option>
            {CAREER_STAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Work context</div>
          <select value={profileInput.workContext} onChange={(e) => update('workContext', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select work context</option>
            {WORK_CONTEXT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>What do you want help with?</div>
          <select value={profileInput.helpGoal} onChange={(e) => update('helpGoal', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select goal</option>
            {HELP_GOAL_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>What tends to drain you?</div>
          <select value={profileInput.whatDrainsYou} onChange={(e) => update('whatDrainsYou', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select one</option>
            {DRAIN_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Email (optional)</div>
          <input value={profileInput.email} onChange={(e) => update('email', e.target.value)} placeholder="name@example.com" style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: 'rgba(255,255,255,0.04)', color: '#edf2ff', padding: '0 14px' }} />
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, value, onChange }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>{question.prompt}</div>
      <div className="choice-grid">
        {SCALE_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button key={option.value} type="button" className={`choice-pill ${active ? 'active' : ''}`} onClick={() => onChange(question.id, option.value)}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{option.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{option.shortLabel}</div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StrengthProfileApp() {
  const [started, setStarted] = useState(false);
  const [responses, setResponses] = useState({});
  const [profileInput, setProfileInput] = useState(EMPTY_PROFILE);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const initial = getInitialState();
    setResponses(initial.responses || {});
    setProfileInput(initial.profileInput || EMPTY_PROFILE);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, profileInput }));
  }, [responses, profileInput]);

  const currentSection = ASSESSMENT_SECTIONS[currentStep];
  const isLastStep = currentStep === ASSESSMENT_SECTIONS.length - 1;
  const totalQuestions = ASSESSMENT_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  const results = useMemo(() => scoreAssessment(responses), [responses]);
  const energyDrivers = useMemo(() => getEnergyDrivers(results), [results]);
  const frictionZones = useMemo(() => getFrictionZones(results), [results]);
  const collaborationStyle = useMemo(() => getCollaborationStyle(results), [results]);
  const workFit = useMemo(() => getWorkFit(results), [results]);
  const personalizedSummary = useMemo(() => generatePersonalizedSummary(results, profileInput), [results, profileInput]);
  const personalReflections = useMemo(() => generatePersonalReflections(results, profileInput), [results, profileInput]);
  const managerGuidance = useMemo(() => generateManagerGuidance(results), [results]);

  function updateResponse(questionId, value) {
    setResponses((current) => ({ ...current, [questionId]: value }));
  }

  if (!started) {
    return (
      <div className="page-shell">
        <div className="container grid" style={{ gap: 28 }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="hero-grid" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: '50%' }} />
                    <div className="eyebrow">{BRAND.company}</div>
                  </div>
                </div>
                <h1 className="hero-title">{BRAND.product}</h1>
                <div className="badge" style={{ background: 'rgba(78,227,193,0.12)', color: '#c9fff4', marginBottom: 14 }}>{BRAND.tagline}</div>
                <p className="muted" style={{ fontSize: 18, lineHeight: 1.85, maxWidth: 760 }}>{BRAND.subtagline}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                  <button className="button-primary" onClick={() => setStarted(true)}>{BRAND.ctaPrimary}</button>
                  <a className="button-secondary" href="#methodology">{BRAND.ctaSecondary}</a>
                </div>
              </div>
              <div className="panel" style={{ padding: 24 }}>
                <div className="eyebrow">Professional strengths and work-fit assessment</div>
                <ul className="list-clean" style={{ marginTop: 16 }}>
                  {[
                    'Identify your natural operating strengths',
                    'Understand what kinds of work give you energy',
                    'See how you naturally collaborate and contribute',
                    'Learn where you are most likely to thrive professionally',
                    'Get a practical strengths and work-fit profile',
                  ].map((item) => (
                    <li key={item}><span className="dot" style={{ background: '#8b7dff' }} /><div className="muted" style={{ lineHeight: 1.65 }}>{item}</div></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div id="how-it-works" className="three-col">
            <StatCard label="Assessment length" value="24 Questions" helper="Short enough to complete quickly, long enough to reveal meaningful operating patterns." />
            <StatCard label="Output" value="Top 5 Strengths" helper="Returns your Top 5 Natural Operating Strengths with a deeper work-fit profile." />
            <StatCard label="Best for" value="Professionals" helper="Useful for self-awareness, role fit, career reflection, and leadership conversations." />
          </div>

          <div id="methodology" className="panel" style={{ padding: 24 }}>
            <div className="eyebrow">Methodology & 2Nspira perspective</div>
            <p style={{ margin: '14px 0 0', lineHeight: 1.8, maxWidth: 980 }}>
              This assessment is designed to identify natural operating strengths in a professional context. It focuses on how people naturally create value, how they work with others, what energizes them, and where they are most likely to thrive.
            </p>
          </div>

          <ProfileInputStep profileInput={profileInput} setProfileInput={setProfileInput} />
        </div>
      </div>
    );
  }

  if (showResults) {
    const chartData = results.dimensions.map((item) => ({ subject: item.shortTitle, score: item.score }));
    const contactHref = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(BRAND.contactSubject)}&body=${encodeURIComponent(`Hello 2Nspira,\n\nI completed the Strength Profile and would like to discuss my results.\n\nName: ${profileInput.name || ''}\nRole: ${profileInput.role || ''}\nCareer Stage: ${profileInput.careerStage || ''}\nWork Context: ${profileInput.workContext || ''}\nGoal: ${profileInput.helpGoal || ''}\nWhat Drains Me: ${profileInput.whatDrainsYou || ''}\nEmail: ${profileInput.email || ''}\nPrimary Profile: ${results.profile.label}\nOverall Strength Score: ${results.overallScore}\nTop Strengths: ${results.strongest.map((item) => item.title).join(', ')}\nCollaboration Style: ${collaborationStyle}\n\nPlease follow up with me.\n`)}`;
    const reportRequestHref = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent('2Nspira Strength Profile Report Request')}&body=${encodeURIComponent(`Hello 2Nspira,\n\nPlease send me a follow-up regarding my Strength Profile results.\n\nName: ${profileInput.name || ''}\nRole: ${profileInput.role || ''}\nCareer Stage: ${profileInput.careerStage || ''}\nWork Context: ${profileInput.workContext || ''}\nGoal: ${profileInput.helpGoal || ''}\nWhat Drains Me: ${profileInput.whatDrainsYou || ''}\nEmail: ${profileInput.email || ''}\nPrimary Profile: ${results.profile.label}\nOverall Strength Score: ${results.overallScore}\nTop Strengths: ${results.strongest.map((item) => item.title).join(', ')}\n\nThank you.\n`)}`;

    return (
      <div className="page-shell">
        <div className="container grid" style={{ gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow">Assessment complete</div>
            <button className="button-secondary" onClick={() => setShowResults(false)}>Back to assessment</button>
          </div>

          <div className="four-col">
            <StatCard label="Name" value={profileInput.name || 'Not provided'} helper={profileInput.role || 'Role not provided'} />
            <StatCard label="Career stage" value={profileInput.careerStage || 'Not provided'} helper={profileInput.workContext || 'Work context not provided'} />
            <StatCard label="What you want help with" value={profileInput.helpGoal || 'Not provided'} helper={profileInput.whatDrainsYou || 'Draining work not provided'} />
            <StatCard label="Top profile" value={results.profile.label} helper="Your strongest overall work-fit signature." />
          </div>

          <div className="card" style={{ padding: 28 }}>
            <SectionHeader eyebrow={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '50%' }} />Your professional strengths profile</span>} title="Your Top 5 Natural Operating Strengths" description={personalizedSummary} actions={<Pill tone="green">Overall Score {results.overallScore}</Pill>} />
            <div className="two-col" style={{ marginTop: 22, alignItems: 'center' }}>
              <div className="three-col">
                <StatCard label="Collaboration style" value={collaborationStyle.split(' — ')[0]} helper={collaborationStyle} />
                <StatCard label="Strongest dimension" value={results.strongest[0]?.title || '—'} helper="Your clearest natural contribution zone." />
                <StatCard label="Best-fit work" value="Work-fit" helper={workFit} />
              </div>
              <div className="panel" style={{ padding: 20, minHeight: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700 }}>Strength pattern</div>
                  <div className="badge" style={{ background: 'rgba(139,125,255,0.12)', color: '#efeaff' }}>{results.profile.label}</div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart outerRadius="72%" data={chartData}>
                    <PolarGrid stroke="rgba(148,163,184,0.22)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a8b3cf', fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="score" stroke="#8b7dff" fill="#8b7dff" fillOpacity={0.24} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="two-col">
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Top 5 Natural Operating Strengths</div>
                <Pill tone="gold">{results.profile.label}</Pill>
              </div>
              <div className="grid">
                {results.strongest.map((item, index) => (
                  <div key={item.id} className="panel" style={{ padding: 16, display: 'grid', gridTemplateColumns: '56px 1fr', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'rgba(139,125,255,0.14)', fontSize: 22, fontWeight: 700, color: '#efeaff' }}>{index + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{item.title}</div>
                      <div className="muted" style={{ marginTop: 4 }}>Strength score: {item.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Energy drivers</div>
              <ul className="list-clean">{energyDrivers.map((item) => <li key={item}><span className="dot" style={{ background: '#8b7dff' }} /><div className="muted">{item}</div></li>)}</ul>
            </div>
          </div>

          <div className="two-col">
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>When this profile feels most true</div>
              <ul className="list-clean">{personalReflections.map((item) => <li key={item}><span className="dot" style={{ background: '#4ee3c1' }} /><div className="muted">{item}</div></li>)}</ul>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Friction zones</div>
              <ul className="list-clean">{frictionZones.map((item) => <li key={item}><span className="dot" style={{ background: '#f6c66b' }} /><div className="muted">{item}</div></li>)}</ul>
            </div>
          </div>

          <div className="two-col">
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>How you naturally create value</div>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>{results.profile.summary}</p>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 18, marginBottom: 8 }}>Manager / team guidance</div>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>{managerGuidance}</p>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>2Nspira next step</div>
              <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>Use your profile as a starting point for role-fit reflection, manager conversations, coaching, or team development work.</p>
              <div className="two-col" style={{ marginTop: 18 }}>
                <div className="panel" style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Request a follow-up</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>Send your results to 2Nspira and request a strengths-based coaching or advisory follow-up.</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                    <a className="button-primary" href={reportRequestHref}>Email me my follow-up</a>
                  </div>
                </div>
                <div className="panel" style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Talk with 2Nspira</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>Use your profile results as the starting point for a coaching, leadership, or role-fit conversation.</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                    <a className="button-primary" href={contactHref}>Talk with 2Nspira</a>
                    <button className="button-secondary" onClick={() => window.print()}>Print / Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container grid" style={{ gap: 22 }}>
        <ProfileInputStep profileInput={profileInput} setProfileInput={setProfileInput} />

        <div className="card" style={{ padding: 24 }}>
          <SectionHeader eyebrow={`Assessment section ${currentStep + 1} of ${ASSESSMENT_SECTIONS.length}`} title={currentSection.title} description={currentSection.description} actions={<Pill tone="blue">{progress}% complete</Pill>} />
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><div className="muted">Overall progress</div><div>{answeredQuestions} / {totalQuestions}</div></div>
            <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="four-col" style={{ marginTop: 20 }}>
            {ASSESSMENT_SECTIONS.map((section, index) => {
              const answered = section.questions.filter((question) => responses[question.id] !== undefined).length;
              const percent = Math.round((answered / section.questions.length) * 100);
              return (
                <button key={section.id} type="button" className="panel" onClick={() => setCurrentStep(index)} style={{ padding: 16, textAlign: 'left', borderColor: index === currentStep ? 'rgba(139,125,255,0.45)' : undefined, background: index === currentStep ? 'rgba(139,125,255,0.08)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><div style={{ fontWeight: 700 }}>{section.title}</div><div className="muted" style={{ fontSize: 12 }}>{percent}%</div></div>
                  <div className="progress-bar" style={{ marginTop: 10 }}><span style={{ width: `${percent}%` }} /></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid">{currentSection.questions.map((question) => <QuestionCard key={question.id} question={question} value={responses[question.id]} onChange={updateResponse} />)}</div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="muted" style={{ maxWidth: 720, lineHeight: 1.7 }}>This assessment is designed to reflect your natural work patterns, not just your technical skills or job title.</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="button-ghost" onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))} disabled={currentStep === 0}>Previous</button>
              <button className="button-primary" onClick={() => isLastStep ? setShowResults(true) : setCurrentStep((step) => Math.min(step + 1, ASSESSMENT_SECTIONS.length - 1))}>{isLastStep ? 'View Results' : 'Next Section'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
