import React from 'react';

export default function BottomBar({ currentSlide, totalSlides, onPrev, onNext }) {
  return (
    <div style={{
      background: '#c0c0c0',
      borderTop: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      padding: '4px 8px',
      gap: 8,
    }}>
      <button className="btn-win" style={{ fontSize: 14, padding: '5px 14px', fontWeight: 'bold' }} onClick={onPrev} disabled={currentSlide === 0}>
        ← PREVIOUS
      </button>
      <button className="btn-win" style={{ fontSize: 14, padding: '5px 14px', fontWeight: 'bold' }} onClick={onNext} disabled={currentSlide === totalSlides - 1}>
        → NEXT
      </button>
      <button className="btn-win" style={{ background: '#cc2200', color: '#fff', fontWeight: 'bold', fontSize: 14, padding: '5px 12px' }}>
        ⊞ SLIDES
      </button>

      <div className="status-field" style={{ flex: 1, fontSize: 14, padding: '3px 10px' }}>
        Status: READY &nbsp;|&nbsp; PAGE {currentSlide + 1} OF {totalSlides}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <div key={i} style={{
            width: 14, height: 14,
            background: i === currentSlide ? '#000080' : '#888',
            border: '1px solid #444',
          }} />
        ))}
      </div>

      <button className="btn-win" style={{ fontSize: 14, padding: '5px 12px' }}>? HELP</button>
    </div>
  );
}
