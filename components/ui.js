export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: 760 }}>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="section-title" style={{ marginTop: 14, marginBottom: 10 }}>{title}</h2>
        {description ? <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, helper }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8, letterSpacing: '-0.04em' }}>{value}</div>
      {helper ? <div className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>{helper}</div> : null}
    </div>
  );
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: { background: 'rgba(255,255,255,0.07)', color: '#d9e1f8' },
    blue: { background: 'rgba(139,125,255,0.16)', color: '#efeaff' },
    green: { background: 'rgba(78,227,193,0.14)', color: '#c7fff4' },
    gold: { background: 'rgba(246,198,107,0.12)', color: '#ffe7b3' },
  };
  return <span className="badge" style={tones[tone] || tones.default}>{children}</span>;
}
