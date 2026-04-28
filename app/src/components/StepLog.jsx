import React from 'react';

const phaseColors = {
  init:        '#000080',
  evaluating:  '#cc6600',
  moving:      '#006600',
  'no-move':   '#800000',
  stuck:       '#ff0000',
  goal:        '#006600',
  plateau:     '#ff8800',
};

export default function StepLog({ steps, currentIdx }) {
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [currentIdx]);

  return (
    <div className="panel-inset" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f0e8' }}>
      <div style={{
        background: '#000080', color: '#fff', fontSize: 10, padding: '2px 6px',
        fontWeight: 'bold', letterSpacing: 1
      }}>
        EXECUTION LOG
      </div>
      <div ref={logRef} className="log-panel" style={{ overflowY: 'auto', flex: 1, padding: 6 }}>
        {steps.slice(0, currentIdx + 1).map((step, i) => {
          const color = phaseColors[step.phase] || '#333';
          const isLatest = i === currentIdx;
          return (
            <div key={i} style={{
              marginBottom: 6,
              borderLeft: isLatest ? `3px solid ${color}` : '3px solid transparent',
              paddingLeft: 5,
              opacity: isLatest ? 1 : 0.55,
            }}>
              <div style={{ color, fontWeight: 'bold', fontSize: 9, marginBottom: 1 }}>
                [{String(i).padStart(2,'0')}] {step.phase.toUpperCase()} — x={step.x}, f(x)={step.fx}
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 9, color: '#111', fontFamily: 'Courier New, monospace' }}>
                {step.log}
              </pre>
            </div>
          );
        })}
        {currentIdx < steps.length - 1 && (
          <div style={{ color: '#888', fontStyle: 'italic', fontSize: 9 }}>
            Press STEP to continue...
          </div>
        )}
      </div>
    </div>
  );
}
