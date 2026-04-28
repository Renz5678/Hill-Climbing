import React from 'react';

export default function PseudocodeSlide({ slideNum, title, subtitle, code, citation, accentColor = '#000080' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif' }}>

      {/* ══ TOP BANNER ══ */}
      <div style={{
        background: accentColor,
        padding: '14px 28px 12px',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', fontWeight: 'bold', color: '#fff', fontFamily: 'Times New Roman, serif' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 'clamp(13px, 1.4vw, 18px)', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{subtitle}</div>
        )}
      </div>

      {/* ══ PSEUDOCODE — fills all remaining space, NO margin, NO border ══ */}
      <div style={{
        flex: 1,
        background: '#1e1e2e',
        color: '#cdd6f4',
        fontFamily: 'Courier New, Consolas, monospace',
        fontSize: 'clamp(13px, 1.5vw, 18px)',
        lineHeight: 1.9,
        padding: '36px 36px 20px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Code block label bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: accentColor,
          color: '#fff',
          fontSize: 'clamp(11px, 1vw, 14px)',
          fontFamily: 'Tahoma, sans-serif',
          fontWeight: 'bold',
          padding: '4px 18px',
          letterSpacing: 2,
        }}>
          PSEUDOCODE — {title.toUpperCase()}
        </div>

        {code.split('\n').map((line, i) => {
          const isComment  = line.trim().startsWith('//');
          const isKeyword  = /^\s*(function|loop|for|if|return|continue)\b/.test(line);
          const isVar      = /^\s*(new_state|current_state|target|neighbor|current_solution|operator)\b/.test(line);
          return (
            <div key={i} style={{
              color: isComment ? '#6c7086'
                   : isKeyword ? '#cba6f7'
                   : isVar     ? '#89dceb'
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
        background: '#1e1e2e',
        borderTop: `2px solid ${accentColor}`,
        padding: '6px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {citation && (
          <div style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', color: '#888', fontStyle: 'italic' }}>
            Reference: {citation}
          </div>
        )}
        <div style={{ fontSize: 'clamp(11px, 1.1vw, 14px)', color: '#555', marginLeft: 'auto' }}>
          SLIDE {slideNum} / 9 &nbsp;|&nbsp; DAA — Heuristics: Hill Climbing
        </div>
      </div>
    </div>
  );
}
