import React from 'react';

const phaseColors = {
  init:       '#000080',
  evaluating: '#b85c00',
  moving:     '#006600',
  'no-move':  '#800000',
  stuck:      '#8b0000',
  goal:       '#006600',
  plateau:    '#b85c00',
};

const phaseLabels = {
  init:       '⬛ INITIALIZING',
  evaluating: '🔍 EVALUATING NEIGHBOR',
  moving:     '✅ MOVING TO NEIGHBOR',
  'no-move':  '🚫 NO MOVE — WORSE STATE',
  stuck:      '⚠️  LOCAL MAXIMUM REACHED',
  goal:       '🎯 GOAL STATE REACHED',
  plateau:    '🟧 PLATEAU DETECTED',
};

export default function SimSlide({
  slideNum, title, subtitle, fnLabel, goalValue, startX,
  steps, fnId, xMin, xMax,
  accentColor = '#000080',
}) {
  const [idx, setIdx] = React.useState(0);
  const current = steps[idx];
  const done = idx >= steps.length - 1;
  const phase = current.phase;
  const color = phaseColors[phase] || '#333';

  const GraphVisualizer = React.lazy(() => import('./GraphVisualizer'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif', background: '#fff' }}>

      {/* ══ TOP BANNER — Algorithm + Function ══ */}
      <div style={{
        background: accentColor,
        padding: '10px 20px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', fontFamily: 'Times New Roman, serif', letterSpacing: 0.5 }}>
            {title}
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{subtitle}</div>
        </div>
        {/* Function — very prominent */}
        <div style={{
          background: '#fff',
          border: `3px solid rgba(255,255,255,0.6)`,
          textAlign: 'center',
          minWidth: 260,
          position: 'relative',
          overflow: 'visible',
        }}>
          {/* Label tag */}
          <div style={{
            background: '#fff',
            color: accentColor,
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 3,
            padding: '3px 14px',
            borderBottom: `2px solid ${accentColor}`,
            textTransform: 'uppercase',
          }}>
            ƒ &nbsp; Function
          </div>
          <div style={{ padding: '8px 20px 10px' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', fontFamily: 'Courier New, monospace', color: accentColor, letterSpacing: 1 }}>
              {fnLabel}
            </div>
            <div style={{ fontSize: 15, color: '#555', marginTop: 3 }}>
              Goal: <strong>f(x) = {goalValue}</strong> &nbsp;|&nbsp; Start: <strong>x = {startX}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN BODY ══ */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* LEFT — Current step text — BIG */}
        <div style={{
          flex: '0 0 62%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '3px solid #e0e0e0',
          padding: '14px 20px',
          overflowY: 'auto',
        }}>
          {/* Phase badge */}
          <div style={{
            display: 'inline-block',
            background: color,
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 1,
            padding: '6px 18px',
            marginBottom: 14,
          }}>
            {phaseLabels[phase] || phase.toUpperCase()}
          </div>

          {/* ── THE STEP TEXT — primary content ── */}
          <div style={{
            fontSize: 30,
            lineHeight: 2.0,
            color: '#111',
            fontFamily: 'Courier New, Consolas, monospace',
            fontWeight: 'bold',
            whiteSpace: 'pre-wrap',
            background: '#fffef0',
            border: `3px solid ${color}`,
            borderLeft: `8px solid ${color}`,
            padding: '14px 20px',
            marginBottom: 14,
            flexShrink: 0,
          }}>
            {current.log}
          </div>

          {/* History — smaller but readable */}
          {idx > 0 && (
            <div style={{ borderTop: '2px solid #eee', paddingTop: 10 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 6, color: '#666', fontSize: 14, letterSpacing: 1 }}>— PREVIOUS STEPS —</div>
              {steps.slice(0, idx).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start' }}>
                  <span style={{
                    color: phaseColors[s.phase] || '#555',
                    fontWeight: 'bold',
                    fontSize: 15,
                    minWidth: 24,
                    fontFamily: 'Courier New, Consolas, monospace',
                  }}>
                    {i}.
                  </span>
                  <span style={{ fontFamily: 'Courier New, Consolas, monospace', fontSize: 15, color: '#555' }}>
                    {s.log.split('\n')[0]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Compact graph */}
        <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', padding: '10px 12px', background: '#fafafa' }}>
          {/* Agent state */}
          <div style={{
            padding: '8px 14px',
            background: '#e8e8f0',
            border: `2px solid ${color}`,
            fontSize: 17,
            marginBottom: 10,
            flexShrink: 0,
            fontFamily: 'Courier New, Consolas, monospace',
            fontWeight: 'bold',
          }}>
            x = {current.x} &nbsp;|&nbsp; f(x) = {current.fx}
            {current.neighbors.length > 0 && (
              <div style={{ color: '#cc0000', fontSize: 14, fontWeight: 'normal', marginTop: 4 }}>
                ▶ Evaluating: x = {current.neighbors.map(n => `${n.x} [f=${n.fx}]`).join(', ')}
              </div>
            )}
          </div>

          {/* Graph */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <React.Suspense fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: 16 }}>
                Loading graph...
              </div>
            }>
              <GraphVisualizer fnId={fnId} xMin={xMin} xMax={xMax} currentState={current} goalValue={goalValue} />
            </React.Suspense>
          </div>

          {/* Step counter */}
          <div style={{ fontSize: 14, color: '#666', textAlign: 'right', marginTop: 6, fontWeight: 'bold', flexShrink: 0 }}>
            Step {idx} / {steps.length - 1}
          </div>
        </div>
      </div>

      {/* ══ CONTROLS BAR ══ */}
      <div style={{
        borderTop: '3px solid #ccc',
        padding: '8px 20px',
        background: '#ececec',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <button
          className="btn-win"
          style={{ fontSize: 16, padding: '7px 22px', fontWeight: 'bold' }}
          onClick={() => setIdx(0)}
        >
          ↺ Reset
        </button>
        <button
          className="btn-win"
          disabled={done}
          style={{
            fontSize: 16, padding: '7px 28px', fontWeight: 'bold',
            background: done ? '#aaa' : accentColor,
            color: done ? '#666' : '#fff',
          }}
          onClick={() => setIdx(i => Math.min(i + 1, steps.length - 1))}
        >
          ▶ Step
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, marginLeft: 10 }}>
          <div style={{ height: 12, background: '#ccc', border: '1px solid #aaa' }}>
            <div style={{
              height: '100%',
              width: `${(idx / Math.max(steps.length - 1, 1)) * 100}%`,
              background: color,
              transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ fontSize: 13, color: '#777', marginTop: 2 }}>
            {idx} of {steps.length - 1} steps
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#888', textAlign: 'right' }}>
          SLIDE {slideNum} / 9 &nbsp;|&nbsp; DAA — Heuristics
        </div>
      </div>
    </div>
  );
}
