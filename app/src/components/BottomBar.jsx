import React from 'react';
import { useBreakpoint } from '../utils/useResponsive';

export default function BottomBar({ currentSlide, totalSlides, onPrev, onNext }) {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      background: '#c0c0c0',
      borderTop: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '6px 10px' : '4px 12px',
      gap: isMobile ? 8 : 10,
    }}>
      {/* Prev / Next — big touch targets on mobile */}
      <button
        className="btn-win"
        style={{
          fontSize: isMobile ? 16 : 13,
          padding: isMobile ? '10px 18px' : '4px 14px',
          fontWeight: 'bold',
          flex: isMobile ? 1 : 'none',
          justifyContent: 'center',
        }}
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        ← {isMobile ? '' : 'Prev'}
      </button>

      {/* Slide dots — hidden on mobile to save space */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <div key={i} style={{
              width: 10, height: 10,
              background: i === currentSlide ? '#000080' : '#aaa',
              border: '1px solid #666',
              borderRadius: 2,
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      )}

      {/* Status text */}
      <div className="status-field" style={{
        flex: 1,
        fontSize: isMobile ? 13 : 12,
        padding: isMobile ? '6px 10px' : '2px 8px',
        textAlign: 'center',
        fontWeight: isMobile ? 'bold' : 'normal',
      }}>
        {isMobile
          ? `${currentSlide + 1} / ${totalSlides}`
          : `Slide ${currentSlide + 1} / ${totalSlides} · DAA — Hill Climbing`}
      </div>

      <button
        className="btn-win"
        style={{
          fontSize: isMobile ? 16 : 13,
          padding: isMobile ? '10px 18px' : '4px 14px',
          fontWeight: 'bold',
          flex: isMobile ? 1 : 'none',
          justifyContent: 'center',
        }}
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
      >
        {isMobile ? '' : 'Next'} →
      </button>
    </div>
  );
}
