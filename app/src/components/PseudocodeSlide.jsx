import React from 'react';
import { useBreakpoint } from '../utils/useResponsive';

export default function PseudocodeSlide({ slideNum, title, code, citation, accentColor = '#000080' }) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: 'Courier New, Consolas, monospace',
    }}>

      {/* ══ CODE BLOCK ══ */}
      <div style={{
        flex: 1,
        background: '#1e1e2e',
        color: '#cdd6f4',
        fontSize: isMobile
          ? 'clamp(12px, 2.8vw, 16px)'
          : 'clamp(11px, 1.65vh, 20px)',
        lineHeight: 1.85,
        padding: isMobile ? '16px 14px 8px' : '2.5vh 3vw 1vh',
        // mobile: scroll horizontally so long lines aren't clipped
        overflowX: isMobile ? 'auto' : 'hidden',
        overflowY: isMobile ? 'auto' : 'hidden',
        position: 'relative',
        WebkitOverflowScrolling: 'touch',
      }}>
        {code.split('\n').map((line, i) => {
          const isComment = line.trim().startsWith('//');
          const isKeyword = /^\s*(function|loop|for|if|return|continue)\b/.test(line);
          const isVar     = /^\s*(new_state|current_state|target|neighbor|current_solution|operator)\b/.test(line);
          return (
            <div key={i} style={{
              color: isComment ? '#6c7086'
                   : isKeyword ? '#cba6f7'
                   : isVar     ? '#89dceb'
                   : '#cdd6f4',
              fontStyle: isComment ? 'italic' : 'normal',
              whiteSpace: isMobile ? 'pre' : 'pre',
            }}>
              {line || '\u00A0'}
            </div>
          );
        })}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        background: '#181825',
        borderTop: `2px solid ${accentColor}`,
        padding: isMobile ? '5px 12px' : '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontSize: isMobile ? 10 : 'clamp(10px,1vw,13px)',
          color: '#555', fontStyle: 'italic',
          fontFamily: 'Tahoma, sans-serif',
        }}>
          {citation ? `Ref: ${citation}` : ''}
        </div>
        <div style={{
          fontSize: isMobile ? 10 : 'clamp(10px,1vw,13px)',
          color: '#444',
          fontFamily: 'Tahoma, sans-serif',
        }}>
          {isMobile
            ? `${title} · ${slideNum}/9`
            : `${title} | SLIDE ${slideNum} / 9 | DAA — Heuristics`}
        </div>
      </div>
    </div>
  );
}
