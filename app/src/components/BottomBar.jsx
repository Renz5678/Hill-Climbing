import React from 'react';
import { useBreakpoint } from '../utils/useResponsive';

export default function BottomBar({ currentSlide, totalSlides, onPrev, onNext }) {
  const { isMobile, isTablet, w } = useBreakpoint();
  const compact = isMobile || isTablet;

  /* Win98 raised border */
  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    background: '#d4d0c8',
    borderTop:    '2px solid #fff',
    borderLeft:   '2px solid #fff',
    borderRight:  '2px solid #808080',
    borderBottom: '2px solid #808080',
    padding: compact ? '5px 14px' : '4px 16px',
    fontSize: compact ? 13 : 12,
    minHeight: 28,
    letterSpacing: 0.3,
  };

  const btnDisabled = {
    ...btnBase,
    opacity: 0.5,
    cursor: 'default',
  };

  /* Slides button — slightly different accent */
  const btnSlides = {
    ...btnBase,
    background: '#c8c4bc',
  };

  return (
    <div style={{
      background: '#c0c0c0',
      borderTop: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      padding: compact ? '5px 10px' : '4px 12px',
      gap: compact ? 6 : 8,
    }}>

      {/* ← Previous */}
      <button
        style={currentSlide === 0 ? btnDisabled : btnBase}
        disabled={currentSlide === 0}
        onClick={onPrev}
      >
        <span style={{ fontSize: compact ? 14 : 13 }}>←</span>
        {!isMobile && <span>Previous</span>}
      </button>

      {/* → Next */}
      <button
        style={currentSlide === totalSlides - 1 ? btnDisabled : btnBase}
        disabled={currentSlide === totalSlides - 1}
        onClick={onNext}
      >
        {!isMobile && <span>Next</span>}
        <span style={{ fontSize: compact ? 14 : 13 }}>→</span>
      </button>

      {/* ⊞ Slides (non-functional, visual anchor) */}
      <button
        style={btnSlides}
        title={`Slide ${currentSlide + 1} of ${totalSlides}`}
      >
        <span style={{ fontSize: compact ? 13 : 12 }}>⊞</span>
        {w >= 480 && <span>Slides</span>}
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Slide dots — show on medium+ screens */}
      {w >= 560 && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <div key={i} style={{
              width: i === currentSlide ? 12 : 9,
              height: i === currentSlide ? 12 : 9,
              background: i === currentSlide ? '#000080' : '#aaa',
              border: '1px solid #666',
              borderRadius: 2,
              transition: 'all 0.2s',
              flexShrink: 0,
            }} />
          ))}
        </div>
      )}

      {/* Status counter */}
      <div style={{
        borderTop: '1px solid #808080', borderLeft: '1px solid #808080',
        borderRight: '1px solid #fff', borderBottom: '1px solid #fff',
        padding: compact ? '4px 10px' : '2px 10px',
        background: '#c0c0c0',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: compact ? 12 : 11,
        color: '#333',
        whiteSpace: 'nowrap',
      }}>
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}
