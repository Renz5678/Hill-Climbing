import React from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { buildCurve } from '../utils/algorithms';
import { useBreakpoint } from '../utils/useResponsive';

/* ─── Colours per phase ─── */
const PHASE_COLOR = {
  init:        '#000080',
  evaluating:  '#7c4a00',
  moving:      '#005a00',
  'no-move':   '#7a0000',
  stuck:       '#7a0000',
  goal:        '#005a00',
  plateau:     '#7c4a00',
};
const PHASE_LABEL = {
  init:        'INITIALISE',
  evaluating:  'EVALUATE',
  moving:      'MOVE',
  'no-move':   'NO MOVE',
  stuck:       'STUCK',
  goal:        'GOAL ✓',
  plateau:     'PLATEAU',
};

/* ─── Sub-phase builder ─── */
function buildSubPhases(step) {
  const { phase, log, x, fx, neighbors } = step;
  const lines = log.split('\n').filter(Boolean);

  if (phase === 'moving' || phase === 'no-move') {
    return [{ label: 'MOVE', icon: '↗', lines, color: PHASE_COLOR[phase] }];
  }
  if (phase === 'goal' || phase === 'stuck' || phase === 'plateau') {
    return [{ label: PHASE_LABEL[phase], icon: phase === 'goal' ? '✓' : '✗', lines, color: PHASE_COLOR[phase] }];
  }

  const subPhases = [];

  // ① Show State
  subPhases.push({
    label: 'SHOW STATE',
    icon: '①',
    lines: [`Current state:  x = ${x}`, `f(x) = ${fx}`],
    color: '#000080',
  });

  // ② Apply Operator
  const applyLines = lines.filter(l => /apply|operator|generate|random/i.test(l));
  if (applyLines.length > 0) {
    const neighbor = neighbors[neighbors.length - 1];
    subPhases.push({
      label: 'APPLY OPERATOR',
      icon: '②',
      lines: applyLines,
      highlight: neighbor ? `→ new x = ${neighbor.x}` : null,
      color: '#7c4a00',
    });
  }

  // ③ Evaluate
  const evalLines = lines.filter(l => !/apply|operator|generate|random/i.test(l));
  if (evalLines.length > 0) {
    const neighbor = neighbors[neighbors.length - 1];
    subPhases.push({
      label: 'EVALUATE',
      icon: '③',
      lines: evalLines,
      highlight: neighbor ? `f(${neighbor.x}) = ${neighbor.fx}` : null,
      color: '#7c4a00',
    });
  }

  return subPhases;
}

/* ─── Graph ─── */
function MiniGraph({ fnId, xMin, xMax, currentState, goalValue, accentColor, compact }) {
  const curve = React.useMemo(() => buildCurve(fnId, xMin, xMax, 300), [fnId, xMin, xMax]);
  const { x, fx, neighbors = [], phase } = currentState;
  const agentColor = PHASE_COLOR[phase] || accentColor;

  const agentDot     = [{ x, y: fx }];
  const neighborDots = neighbors.map(n => ({ x: n.x, y: n.fx }));

  const yVals = curve.map(p => p.y);
  const yMin  = Math.min(...yVals);
  const yMax  = Math.max(...yVals);
  const yPad  = (yMax - yMin) * 0.12 || 5;

  const r = compact ? 7 : 9;

  const AgentShape = ({ cx, cy }) => {
    if (isNaN(cx) || isNaN(cy)) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={agentColor} stroke="#fff" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={agentColor} strokeWidth={1.5} strokeDasharray="3 2" />
      </g>
    );
  };
  const NeighborShape = ({ cx, cy }) => {
    if (isNaN(cx) || isNaN(cy)) return null;
    const s = compact ? 5 : 6;
    return <rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} fill="#cc4400" stroke="#fff" strokeWidth={1.5} />;
  };

  const margin = compact
    ? { top: 8, right: 14, bottom: 16, left: 2 }
    : { top: 12, right: 24, bottom: 20, left: 8 };

  return (
    <div style={{ height: '100%', background: '#f4f4ef', borderTop: '2px solid #d0d0c8' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={margin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="x" type="number" domain={[xMin, xMax]}
            tickCount={xMax - xMin + 1}
            tick={{ fontSize: compact ? 9 : 11 }}
            label={{ value: 'x', position: 'insideBottomRight', offset: -4, fontSize: compact ? 10 : 12 }} />
          <YAxis domain={[yMin - yPad, yMax + yPad]}
            tick={{ fontSize: compact ? 9 : 11 }}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fontSize: compact ? 10 : 12 }} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div style={{ background: '#ffffd0', border: '1px solid #aaa', padding: '2px 8px', fontSize: 11 }}>
                x={typeof d.x === 'number' ? d.x.toFixed(2) : d.x}, f(x)={typeof d.y === 'number' ? d.y.toFixed(2) : d.y}
              </div>
            );
          }} />
          {goalValue !== null && (
            <ReferenceLine y={goalValue} stroke="#006600" strokeDasharray="5 3"
              label={{ value: `goal=${goalValue}`, position: 'right', fontSize: 10, fill: '#006600' }} />
          )}
          <Line data={curve} dataKey="y" dot={false} stroke={accentColor}
            strokeWidth={2.5} type="monotone" isAnimationActive={false} />
          {neighborDots.length > 0 && (
            <Scatter data={neighborDots} dataKey="y" fill="#cc4400"
              shape={<NeighborShape />} isAnimationActive={false} />
          )}
          <Scatter data={agentDot} dataKey="y" fill={agentColor}
            shape={<AgentShape />} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Sub-phase card ─── */
function SubPhaseCard({ sub, isNew, compact }) {
  return (
    <div style={{
      animation: isNew ? 'fadeSlideIn 0.28s ease' : 'none',
      borderLeft: `5px solid ${sub.color}`,
      background: '#fafaf5',
      padding: compact ? '10px 12px' : '14px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          width: compact ? 24 : 28, height: compact ? 24 : 28,
          borderRadius: '50%',
          background: sub.color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 11 : 13, fontWeight: 'bold', flexShrink: 0,
          fontFamily: 'Tahoma, sans-serif',
        }}>{sub.icon}</span>
        <span style={{
          fontFamily: 'Tahoma, sans-serif',
          fontSize: compact ? 10 : 11,
          fontWeight: 'bold',
          letterSpacing: 2,
          color: sub.color,
          textTransform: 'uppercase',
        }}>{sub.label}</span>
      </div>

      {sub.lines.map((l, i) => (
        <div key={i} style={{
          fontFamily: 'Courier New, Consolas, monospace',
          fontSize: compact ? 'clamp(12px, 2.2vw, 15px)' : 'clamp(14px, 1.5vw, 18px)',
          lineHeight: 1.75,
          color: '#111',
          whiteSpace: 'pre-wrap',
          fontWeight: 'bold',
        }}>{l}</div>
      ))}

      {sub.highlight && (
        <div style={{
          marginTop: 8,
          display: 'inline-block',
          background: sub.color, color: '#fff',
          fontFamily: 'Courier New, monospace',
          fontSize: compact ? 12 : 13,
          fontWeight: 'bold',
          padding: compact ? '2px 10px' : '3px 12px',
          letterSpacing: 1,
        }}>{sub.highlight}</div>
      )}
    </div>
  );
}

/* ─── Main SimSlide ─── */
export default function SimSlide({
  title, subtitle, fnLabel, goalValue, startX,
  steps, fnId, xMin, xMax,
  accentColor = '#000080',
}) {
  const { isMobile, isTablet } = useBreakpoint();
  const compact = isMobile || isTablet;

  const [stepIdx, setStepIdx] = React.useState(0);
  const [subIdx,  setSubIdx]  = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);

  const currentStep = steps[stepIdx];
  const subPhases   = React.useMemo(() => buildSubPhases(currentStep), [currentStep]);
  const phase       = currentStep.phase;
  const phaseColor  = PHASE_COLOR[phase] || accentColor;

  const isLastStep = stepIdx >= steps.length - 1;
  const isLastSub  = subIdx  >= subPhases.length - 1;
  const isDone     = isLastStep && isLastSub;

  const handleNext = () => {
    if (!isLastSub) { setSubIdx(s => s + 1); setAnimKey(k => k + 1); }
    else if (!isLastStep) { setStepIdx(s => s + 1); setSubIdx(0); setAnimKey(k => k + 1); }
  };
  const handleReset = () => { setStepIdx(0); setSubIdx(0); setAnimKey(k => k + 1); };

  const totalTicks = steps.reduce((a, s) => a + buildSubPhases(s).length, 0);
  const doneTicks  = steps.slice(0, stepIdx).reduce((a, s) => a + buildSubPhases(s).length, 0) + subIdx;
  const progress   = totalTicks > 1 ? (doneTicks / (totalTicks - 1)) * 100 : 100;

  const nextLabel = isDone
    ? '✓ Done'
    : isLastSub
      ? '▶ Next Step'
      : `▶ ${subPhases[subIdx + 1]?.label || 'Next'}`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      fontFamily: 'Tahoma, Arial, sans-serif',
      background: '#ebebeb',
      // On mobile let the content scroll naturally
      overflowY: isMobile ? 'auto' : 'hidden',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: accentColor,
        padding: isMobile ? '8px 12px' : '10px 20px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 6 : 0,
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            color: '#fff',
            fontSize: isMobile ? 16 : 'clamp(15px,1.8vw,22px)',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
          }}>
            {title}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: isMobile ? 11 : 'clamp(11px,1.1vw,14px)',
            marginTop: 2,
          }}>
            {subtitle}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.4)',
          padding: isMobile ? '4px 10px' : '5px 16px',
          color: '#fff',
          fontFamily: 'Courier New, monospace',
          fontSize: isMobile ? 13 : 'clamp(13px,1.4vw,18px)',
          fontWeight: 'bold',
          letterSpacing: 1,
          alignSelf: isMobile ? 'stretch' : 'auto',
        }}>
          {fnLabel}
          <span style={{ fontSize: 11, fontWeight: 'normal', opacity: 0.8, marginLeft: 8 }}>
            goal={goalValue} · x₀={startX}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: 0,
        // on mobile this section grows naturally; on desktop it fills
        overflow: isMobile ? 'visible' : 'hidden',
      }}>

        {/* STEP CARD */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 52%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isMobile ? 'none' : '2px solid #ccc',
          borderBottom: isMobile ? '2px solid #ccc' : 'none',
          background: '#fff',
          // on mobile don't constrain height — let content flow
          minHeight: isMobile ? 0 : 0,
          overflow: 'hidden',
        }}>
          {/* Phase pill row */}
          <div style={{
            padding: isMobile ? '6px 12px' : '8px 18px',
            background: '#f0f0f0',
            borderBottom: '2px solid #ddd',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
            flexWrap: 'wrap',
          }}>
            <div style={{
              background: phaseColor, color: '#fff',
              fontSize: isMobile ? 10 : 11,
              fontWeight: 'bold', letterSpacing: 2,
              padding: '3px 10px', textTransform: 'uppercase',
            }}>{PHASE_LABEL[phase] || phase.toUpperCase()}</div>
            <div style={{
              fontSize: isMobile ? 11 : 12,
              color: '#888',
              fontFamily: 'Courier New, monospace',
            }}>
              Step {stepIdx + 1}/{steps.length}
              <span style={{ margin: '0 6px', color: '#bbb' }}>·</span>
              {subIdx + 1}/{subPhases.length} sub-steps
            </div>
          </div>

          {/* Sub-phase cards */}
          <div style={{
            flex: isMobile ? 'none' : 1,
            overflowY: isMobile ? 'visible' : 'auto',
            padding: isMobile ? '12px' : '18px 20px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subPhases.slice(0, subIdx + 1).map((sub, i) => (
                <SubPhaseCard
                  key={`${stepIdx}-${i}`}
                  sub={sub}
                  isNew={i === subIdx && animKey > 0}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        </div>

        {/* GRAPH PANEL */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          // on mobile: fixed graph height so it doesn't vanish
          height: isMobile ? 240 : undefined,
          minHeight: isMobile ? 240 : 0,
          flexShrink: isMobile ? 0 : 1,
        }}>
          {/* State summary */}
          <div style={{
            padding: isMobile ? '5px 10px' : '8px 14px',
            background: '#f8f8f8',
            borderBottom: '2px solid #ddd',
            fontFamily: 'Courier New, monospace',
            fontSize: isMobile ? 12 : 'clamp(13px,1.3vw,16px)',
            fontWeight: 'bold',
            flexShrink: 0,
            display: 'flex', gap: isMobile ? 8 : 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <span><strong>x</strong> = {currentStep.x}</span>
            <span style={{ color: '#bbb' }}>|</span>
            <span><strong>f(x)</strong> = {currentStep.fx}</span>
            {currentStep.neighbors.length > 0 && (
              <>
                <span style={{ color: '#bbb' }}>|</span>
                <span style={{ color: '#cc4400', fontSize: isMobile ? 11 : 12 }}>
                  ▶ {currentStep.neighbors.map(n => `x=${n.x} [f=${n.fx}]`).join(', ')}
                </span>
              </>
            )}
          </div>

          {/* Graph */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <MiniGraph
              fnId={fnId} xMin={xMin} xMax={xMax}
              currentState={currentStep} goalValue={goalValue}
              accentColor={accentColor}
              compact={compact}
            />
          </div>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div style={{
        borderTop: '2px solid #bbb',
        padding: isMobile ? '10px 12px' : '8px 16px',
        background: '#d8d8d8',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <button
          className="btn-win"
          style={{ padding: isMobile ? '10px 16px' : '6px 16px', fontSize: isMobile ? 15 : 14 }}
          onClick={handleReset}
        >
          ↺ Reset
        </button>

        <button
          className="btn-win"
          disabled={isDone}
          style={{
            padding: isMobile ? '10px 20px' : '6px 24px',
            fontSize: isMobile ? 15 : 14,
            fontWeight: 'bold',
            background: isDone ? '#aaa' : accentColor,
            color: isDone ? '#666' : '#fff',
            border: isDone ? undefined : 'none',
          }}
          onClick={handleNext}
        >
          {nextLabel}
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, marginLeft: 4 }}>
          <div style={{ height: 8, background: '#bbb', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: phaseColor, transition: 'width 0.3s ease',
              borderRadius: 4,
            }} />
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
