import React from 'react';

const SLIDE_LABELS = [
  { label: 'Simple HC — Pseudocode',        group: 'Simple HC',       color: '#000080' },
  { label: 'Simple HC — Example 1',          group: 'Simple HC',       color: '#000080' },
  { label: 'Simple HC — Example 2',          group: 'Simple HC',       color: '#000080' },
  { label: 'Steepest-Ascent — Pseudocode',   group: 'Steepest-Ascent', color: '#4a0080' },
  { label: 'Steepest-Ascent — Example 1',    group: 'Steepest-Ascent', color: '#4a0080' },
  { label: 'Steepest-Ascent — Example 2',    group: 'Steepest-Ascent', color: '#4a0080' },
  { label: 'Stochastic HC — Pseudocode',     group: 'Stochastic HC',   color: '#004d00' },
  { label: 'Stochastic HC — Example 1',      group: 'Stochastic HC',   color: '#004d00' },
  { label: 'Stochastic HC — Example 2',      group: 'Stochastic HC',   color: '#004d00' },
];

export default function Sidebar({ currentSlide, onSelect }) {
  let lastGroup = null;

  return (
    <div style={{
      width: 200,
      background: '#c0c0c0',
      borderRight: '2px solid #808080',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#000080', color: '#fff',
        padding: '4px 8px', fontSize: 12, fontWeight: 'bold', letterSpacing: 1,
        borderBottom: '1px solid #000',
        flexShrink: 0,
      }}>
        SLIDE SORTER
      </div>
      <div style={{ fontSize: 11, color: '#444', padding: '2px 8px 4px', borderBottom: '1px solid #808080', flexShrink: 0 }}>
        Presentation Index
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4 }}>
        {SLIDE_LABELS.map((s, i) => {
          const active = currentSlide === i;
          const showGroup = s.group !== lastGroup;
          lastGroup = s.group;

          return (
            <React.Fragment key={i}>
              {showGroup && (
                <div style={{
                  fontSize: 9, fontWeight: 'bold', color: s.color,
                  padding: '6px 8px 2px',
                  borderTop: i > 0 ? '1px solid #aaa' : 'none',
                  textTransform: 'uppercase', letterSpacing: 1,
                }}>
                  {s.group}
                </div>
              )}
              <div
                onClick={() => onSelect(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '4px 8px 4px 14px',
                  cursor: 'pointer',
                  background: active ? s.color : 'transparent',
                  color: active ? '#fff' : '#000',
                  borderTop:    active ? '2px solid #808080' : '2px solid transparent',
                  borderBottom: active ? '2px solid #fff'    : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#b0b8cc'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 20, height: 14, flexShrink: 0,
                  border: `2px solid ${active ? '#fff' : s.color}`,
                  background: active ? 'rgba(255,255,255,0.3)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 'bold',
                  color: active ? '#fff' : s.color,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 12 }}>{s.label}</span>
              </div>
            </React.Fragment>
          );
        })}

        <div style={{ borderTop: '1px solid #808080', marginTop: 6 }} />
        {['OUTLINE', 'NOTES'].map(tab => (
          <div key={tab} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', opacity: 0.5, fontSize: 10 }}>
            <span>{tab === 'OUTLINE' ? '≡' : '📄'}</span>
            <span>{tab}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
