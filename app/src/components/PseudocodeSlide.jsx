import React from 'react';

export default function PseudocodeSlide({ slideNum, title, subtitle, code, citation, accentColor = '#000080' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif', background: '#fff' }}>

      {/* ══ TOP BANNER ══ */}
      <div style={{
        background: accentColor,
        padding: '12px 24px 10px',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', fontFamily: 'Times New Roman, serif' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>{subtitle}</div>
        )}
      </div>

      {/* ══ PSEUDOCODE — fills all remaining space ══ */}
      <div style={{
        flex: 1,
        background: '#1e1e2e',
        color: '#cdd6f4',
        fontFamily: 'Courier New, Consolas, monospace',
        fontSize: 17,
        lineHeight: 1.85,
        padding: '40px 32px 20px',
        overflow: 'hidden',          /* no scroll */
        position: 'relative',
        margin: '12px 16px 0',
        border: `3px solid ${accentColor}`,
      }}>
        {/* Code block label */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: accentColor,
          color: '#fff',
          fontSize: 13,
          fontFamily: 'Tahoma, sans-serif',
          fontWeight: 'bold',
          padding: '4px 16px',
          letterSpacing: 1,
        }}>
          PSEUDOCODE — {title.toUpperCase()}
        </div>

        {code.split('\n').map((line, i) => {
          const isComment  = line.trim().startsWith('//');
          const isKeyword  = /^\s*(function|loop|for|if|return|continue)\b/.test(line);
          const isOperator = /^\s*(new_state|current_state|target|neighbor|current_solution)\b/.test(line);
          return (
            <div key={i} style={{
              color: isComment  ? '#6c7086'
                   : isKeyword  ? '#cba6f7'
                   : isOperator ? '#89dceb'
                   : '#cdd6f4',
              fontStyle: isComment ? 'italic' : 'normal',
              whiteSpace: 'pre',
            }}>
              {line || '\u00A0'}
            </div>
          );
        })}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        padding: '8px 20px 6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {citation && (
          <div style={{ fontSize: 14, color: '#555', fontStyle: 'italic' }}>
            Reference: {citation}
          </div>
        )}
        <div style={{ fontSize: 14, color: '#888', marginLeft: 'auto' }}>
          SLIDE {slideNum} / 9 &nbsp;|&nbsp; DAA — Heuristics: Hill Climbing
        </div>
      </div>
    </div>
  );
}
