import React from 'react';

export default function PseudocodeSlide({ slideNum, title, code, citation, accentColor = '#000080' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Courier New, Consolas, monospace' }}>

      {/* ══ CODE BLOCK — fills everything ══ */}
      <div style={{
        flex: 1,
        background: '#1e1e2e',
        color: '#cdd6f4',
        /* vh-based font so ALL lines fit in the visible area regardless of screen size */
        fontSize: 'clamp(11px, 1.65vh, 20px)',
        lineHeight: 1.85,
        padding: '2.5vh 3vw 1vh',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {code.split('\n').map((line, i) => {
          const isComment  = line.trim().startsWith('//');
          const isKeyword  = /^\s*(function|loop|for|if|return|continue)\b/.test(line);
          const isVar      = /^\s*(new_state|current_state|target|neighbor|current_solution|operator)\b/.test(line);
          return (
            <div key={i} style={{
              color: isComment  ? '#6c7086'
                   : isKeyword  ? '#cba6f7'
                   : isVar      ? '#89dceb'
                   : '#cdd6f4',
              fontStyle: isComment ? 'italic' : 'normal',
              whiteSpace: 'pre',
            }}>
              {line || '\u00A0'}
            </div>
          );
        })}
      </div>

      {/* ══ SLIM FOOTER ══ */}
      <div style={{
        background: '#181825',
        borderTop: `2px solid ${accentColor}`,
        padding: '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 'clamp(10px, 1vw, 13px)', color: '#555', fontStyle: 'italic', fontFamily: 'Tahoma, sans-serif' }}>
          {citation ? `Reference: ${citation}` : ''}
        </div>
        <div style={{ fontSize: 'clamp(10px, 1vw, 13px)', color: '#444', fontFamily: 'Tahoma, sans-serif' }}>
          {title} &nbsp;|&nbsp; SLIDE {slideNum} / 9 &nbsp;|&nbsp; DAA — Heuristics
        </div>
      </div>
    </div>
  );
}
