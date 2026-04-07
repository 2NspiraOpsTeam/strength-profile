'use client';

import { useEffect, useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { BRAND } from '@/lib/brand-config';
import { ASSESSMENT_SECTIONS, SCALE_OPTIONS } from '@/lib/assessment-config';
import { getCollaborationStyle, getEnergyDrivers, getFrictionZones, getWorkFit, scoreAssessment } from '@/lib/scoring';
import { Pill, SectionHeader, StatCard } from '@/components/ui';

const STORAGE_KEY = 'strength-profile-v1';

function getInitialResponses() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
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
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setResponses(getInitialResponses());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                  <div className="eyebrow">{BRAND.company}</div>
                </div>
                <h1 className="hero-title">{BRAND.product}</h1>
                <div className="badge" style={{ background: 'rgba(78,227,193,0.12)', color: '#c9fff4', marginBottom: 14 }}>{BRAND.tagline}</div>
                <p className="muted" style={{ fontSize: 18, lineHeight: 1.85, maxWidth: 760 }}>{BRAND.subtagline}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                  <button className="button-primary" onClick={() => setStarted(true)}>{BRAND.ctaPrimary}</button>
                  <a className="button-secondary" href="#how-it-works">{BRAND.ctaSecondary}</a>
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
            <StatCard label="Output" value="Operating Strengths Profile" helper="Returns a work-oriented profile, energy drivers, friction zones, and collaboration guidance." />
            <StatCard label="Best for" value="Professionals" helper="Useful for self-awareness, role fit, career reflection, and leadership conversations." />
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const chartData = results.dimensions.map((item) => ({ subject: item.shortTitle, score: item.score }));
    const contactHref = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(BRAND.contactSubject)}&body=${encodeURIComponent(`Hello 2Nspira,\n\nI completed the Strength Profile and would like to discuss my results.\n\nPrimary Profile: ${results.profile.label}\nOverall Strength Score: ${results.overallScore}\nCollaboration Style: ${collaborationStyle}\n\nPlease follow up with me.\n`)}`;

    return (
      <div className="page-shell">
        <div className="container grid" style={{ gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow">Assessment complete</div>
            <button className="button-secondary" onClick={() => setShowResults(false)}>Back to assessment</button>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <SectionHeader eyebrow={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />Your professional strengths profile</span>} title={results.profile.label} description={results.profile.summary} actions={<Pill tone="green">Overall Score {results.overallScore}</Pill>} />
            <div className="two-col" style={{ marginTop: 22, alignItems: 'center' }}>
              <div className="three-col">
                <StatCard label="Collaboration style" value={collaborationStyle.split(' — ')[0]} helper={collaborationStyle} />
                <StatCard label="Strongest dimension" value={results.strongest[0]?.title || '—'} helper="Your clearest natural contribution zone." />
                <StatCard label="Best-fit work" value="Work-fit" helper={workFit} />
              </div>
              <div className="panel" style={{ padding: 20, minHeight: 320 }}>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>Strength pattern</div>
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
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Top strengths</div>
              <ul className="list-clean">
                {results.strongest.map((item) => (
                  <li key={item.id}><span className="dot" style={{ background: '#4ee3c1' }} /><div><div style={{ fontWeight: 600 }}>{item.title}</div><div className="muted">Score: {item.score}</div></div></li>
                ))}
              </ul>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Energy drivers</div>
              <ul className="list-clean">
                {energyDrivers.map((item) => (
                  <li key={item}><span className="dot" style={{ background: '#8b7dff' }} /><div className="muted">{item}</div></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="two-col">
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Friction zones</div>
              <ul className="list-clean">
                {frictionZones.map((item) => (
                  <li key={item}><span className="dot" style={{ background: '#f6c66b' }} /><div className="muted">{item}</div></li>
                ))}
              </ul>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>2Nspira follow-up</div>
              <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>Use your profile as a starting point for role-fit reflection, manager conversations, coaching, or team development work.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
                <a className="button-primary" href={contactHref}>Talk with 2Nspira</a>
                <button className="button-secondary" onClick={() => window.print()}>Print / Save</button>
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

        <div className="grid">
          {currentSection.questions.map((question) => (
            <QuestionCard key={question.id} question={question} value={responses[question.id]} onChange={updateResponse} />
          ))}
        </div>

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
