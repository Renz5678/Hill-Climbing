import React from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { buildCurve } from '../utils/algorithms';
import { useBreakpoint } from '../utils/useResponsive';

/* ─── Phase colours & labels ─── */
const PHASE_COLOR = {
  init:       '#000080',
  evaluating: '#7c4a00',
  moving:     '#005a00',
  'no-move':  '#7a0000',
  stuck:      '#7a0000',
  goal:       '#005a00',
  plateau:    '#7c4a00',
};
const PHASE_LABEL = {
  init:       'INITIALISE',
  evaluating: 'EVALUATING',
  moving:     'MOVE',
  'no-move':  'NO MOVE',
  stuck:      'STUCK',
  goal:       'GOAL ✓',
  plateau:    'PLATEAU',
};

/* ─── CHECK line pattern ─── */
const CHECK_RE = /≠|goal state|move to|target|return|stay|better|improve|set target|make.*current|do not/i;

/* ─── Build 3-phase sub-steps for an evaluating step ─── */
function buildSubPhases(step) {
  const { phase, log, x, fx, neighbors } = step;
  const lines = log.split('\n').filter(Boolean);

  /* Terminal / simple phases → one card */
  if (phase === 'init') {
    return [{ label: 'INITIALISE', icon: '①', lines, color: '#000080' }];
  }
  if (phase === 'moving' || phase === 'no-move') {
    return [{ label: PHASE_LABEL[phase], icon: '↗', lines, color: PHASE_COLOR[phase] }];
  }
  if (phase === 'goal' || phase === 'stuck' || phase === 'plateau') {
    return [{ label: PHASE_LABEL[phase], icon: phase === 'goal' ? '✓' : '✗', lines, color: PHASE_COLOR[phase] }];
  }

  /* evaluating → NEW OPERATOR | EVALUATE | CHECK */
  const evalIdx = lines.findIndex(l => /^evaluate/i.test(l));

  let operatorLines = [];
  let evaluateLines = [];
  let checkLines    = [];

  if (evalIdx >= 0) {
    operatorLines    = lines.slice(0, evalIdx);
    const afterEval  = lines.slice(evalIdx);
    const checkIdx   = afterEval.findIndex(l => CHECK_RE.test(l));
    if (checkIdx >= 0) {
      evaluateLines = afterEval.slice(0, checkIdx);
      checkLines    = afterEval.slice(checkIdx);
    } else {
      evaluateLines = afterEval;
    }
  } else {
    /* Fallback: classify by pattern */
    lines.forEach(l => {
      if (/^apply|^generate|^random|new state:/i.test(l)) operatorLines.push(l);
      else if (CHECK_RE.test(l)) checkLines.push(l);
      else evaluateLines.push(l);
    });
  }

  const nb   = neighbors[neighbors.length - 1];
  const subs = [];

  if (operatorLines.length > 0) {
    subs.push({
      label: 'NEW OPERATOR', icon: '①', color: '#000080',
      lines: operatorLines,
      highlight: nb ? `→ new x = ${nb.x}` : null,
    });
  }
  if (evaluateLines.length > 0) {
    subs.push({
      label: 'EVALUATE', icon: '②', color: '#7c4a00',
      lines: evaluateLines,
      highlight: nb ? `f(${nb.x}) = ${nb.fx}` : null,
    });
  }
  if (checkLines.length > 0) {
    subs.push({
      label: 'CHECK', icon: '③', color: '#005a00',
      lines: checkLines,
    });
  }
  return subs;
}

function stepSummary(step) {
  return step.log.split('\n').filter(Boolean)[0] || '';
}

/* ─── Graph ─── */
function MiniGraph({ fnId, xMin, xMax, currentState, goalValue, accentColor }) {
  const curve = React.useMemo(() => buildCurve(fnId, xMin, xMax, 300), [fnId, xMin, xMax]);
  const { x, fx, neighbors = [], phase } = currentState;
  const agentColor   = PHASE_COLOR[phase] || accentColor;
  const agentDot     = [{ x, y: fx }];
  const neighborDots = neighbors.map(n => ({ x: n.x, y: n.fx }));
  const yVals = curve.map(p => p.y);
  const yMin  = Math.min(...yVals);
  const yMax  = Math.max(...yVals);
  const yPad  = (yMax - yMin) * 0.12 || 5;

  const AgentShape = ({ cx, cy }) => {
    if (isNaN(cx) || isNaN(cy)) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8}  fill={agentColor} stroke="#fff" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={13} fill="none" stroke={agentColor} strokeWidth={1.5} strokeDasharray="3 2" />
      </g>
    );
  };
  const NeighborShape = ({ cx, cy }) => {
    if (isNaN(cx) || isNaN(cy)) return null;
    return <rect x={cx - 6} y={cy - 6} width={12} height={12} fill="#cc4400" stroke="#fff" strokeWidth={1.5} />;
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#f4f4ef', borderTop: '2px solid #d0d0c8' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 20, bottom: 18, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="x" type="number" domain={[xMin, xMax]}
            tickCount={xMax - xMin + 1} tick={{ fontSize: 10 }}
            label={{ value: 'x', position: 'insideBottomRight', offset: -4, fontSize: 11 }} />
          <YAxis domain={[yMin - yPad, yMax + yPad]} tick={{ fontSize: 10 }}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
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

/* ─── Main SimSlide ─── */
export default function SimSlide({
  title, subtitle, fnLabel, goalValue, startX,
  steps, fnId, xMin, xMax,
  accentColor = '#000080',
  initialState, operators,
}) {
  const { isMobile, w } = useBreakpoint();
  const stacked = w < 800;

  const [stepIdx, setStepIdx] = React.useState(0);
  const [subIdx,  setSubIdx]  = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);

  const currentStep = steps[stepIdx];
  const subPhases   = React.useMemo(() => buildSubPhases(currentStep), [currentStep]);
  const phase       = currentStep.phase;
  const phaseColor  = PHASE_COLOR[phase] || accentColor;

  const isLastStep  = stepIdx >= steps.length - 1;
  const isLastSub   = subIdx  >= subPhases.length - 1;
  const isDone      = isLastStep && isLastSub;
  const isFirst     = stepIdx === 0 && subIdx === 0;

  const handleNext = () => {
    if (!isLastSub)  { setSubIdx(s => s + 1); setAnimKey(k => k + 1); }
    else if (!isLastStep) { setStepIdx(s => s + 1); setSubIdx(0); setAnimKey(k => k + 1); }
  };
  const handlePrev = () => {
    if (subIdx > 0) { setSubIdx(s => s - 1); setAnimKey(k => k + 1); }
    else if (stepIdx > 0) {
      const prevSubs = buildSubPhases(steps[stepIdx - 1]);
      setStepIdx(s => s - 1);
      setSubIdx(prevSubs.length - 1);
      setAnimKey(k => k + 1);
    }
  };
  const handleReset = () => { setStepIdx(0); setSubIdx(0); setAnimKey(0); };

  const stepListRef = React.useRef(null);
  React.useEffect(() => {
    if (stepListRef.current) {
      const active = stepListRef.current.querySelector('[data-active="true"]');
      if (active) active.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [stepIdx, subIdx]);

  const visibleSubs = subPhases.slice(0, subIdx + 1);
  const phaseStrip  = `Step ${stepIdx + 1}  ${PHASE_LABEL[phase] || phase.toUpperCase()} :`;

  /* Layout fractions — STEPS dominant */
  const STEPS_FRAC = stacked ? '100%' : '65%';
  const GRAPH_FRAC  = stacked ? '100%' : '35%';
  const STEPS_H     = stacked ? '62%' : '100%';
  const GRAPH_H     = stacked ? '38%' : '100%';

  /* Font scale — min 28px */
  const logFont    = `clamp(28px, 2.4vw, 34px)`;
  const labelFont  = `clamp(13px, 1.1vw, 16px)`;
  const headerFont = `clamp(16px, 1.6vw, 22px)`;
  const metaFont   = `clamp(12px, 1vw, 14px)`;

  const raisedBorder = {
    borderTop: '2px solid #fff', borderLeft: '2px solid #fff',
    borderRight: '2px solid #808080', borderBottom: '2px solid #808080',
  };
  const insetBorder = {
    borderTop: '2px solid #808080', borderLeft: '2px solid #808080',
    borderRight: '2px solid #fff', borderBottom: '2px solid #fff',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      fontFamily: 'Tahoma, Arial, sans-serif',
      background: '#c0c0c0', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-row { cursor: default; border-bottom: 1px solid #d4d0c8; }
        .step-row:hover { background: #e4e0d8; }
      `}</style>

      {/* ══ HEADER ══ */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        background: '#c0c0c0',
        borderBottom: '2px solid #808080',
        minHeight: 60,
      }}>
        {/* Title + fn + state — full width */}
        <div style={{
          flex: 1,
          padding: '8px 14px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'Times New Roman, serif', fontWeight: 'bold',
            fontSize: headerFont, color: '#000080',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              ...insetBorder,
              padding: '2px 10px', background: '#d4d0c8',
              fontFamily: 'Courier New, monospace',
              fontSize: metaFont, fontWeight: 'bold', whiteSpace: 'nowrap',
            }}>{fnLabel}</div>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: metaFont, fontWeight: 'bold', whiteSpace: 'nowrap',
            }}>x = {currentStep.x}&nbsp;&nbsp;|&nbsp;&nbsp;f(x) = {currentStep.fx}</div>
            <div style={{ fontSize: metaFont, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {subtitle}
            </div>
          </div>

          {/* Initial State + Goal State + Operators row */}
          {(initialState !== undefined || goalValue !== null || operators) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
              {initialState !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    fontSize: metaFont, color: '#555', fontWeight: 'bold',
                    textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>Initial State:</span>
                  <span style={{
                    ...insetBorder,
                    padding: '1px 8px', background: '#d4d0c8',
                    fontFamily: 'Courier New, monospace',
                    fontSize: metaFont, fontWeight: 'bold', whiteSpace: 'nowrap',
                  }}>{initialState}</span>
                </div>
              )}
              {goalValue !== null && goalValue !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    fontSize: metaFont, color: '#555', fontWeight: 'bold',
                    textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>Goal State:</span>
                  <span style={{
                    ...insetBorder,
                    padding: '1px 8px', background: '#d4d0c8',
                    fontFamily: 'Courier New, monospace',
                    fontSize: metaFont, fontWeight: 'bold', whiteSpace: 'nowrap',
                  }}>f(x) = {goalValue}</span>
                </div>
              )}
              {operators && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: metaFont, color: '#555', fontWeight: 'bold',
                    textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>Operators:</span>
                  {operators.map((op, i) => (
                    <span key={i} style={{
                      ...insetBorder,
                      padding: '1px 8px', background: '#d4d0c8',
                      fontFamily: 'Courier New, monospace',
                      fontSize: metaFont, fontWeight: 'bold', whiteSpace: 'nowrap',
                    }}>{op}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{
        flex: 1, display: 'flex',
        flexDirection: stacked ? 'column-reverse' : 'row',
        minHeight: 0, overflow: 'hidden',
      }}>

        {/* ── GRAPH column (left / bottom) ── */}
        <div style={{
          width: stacked ? '100%' : GRAPH_FRAC,
          height: stacked ? GRAPH_H : '100%',
          display: 'flex', flexDirection: 'column',
          borderRight: stacked ? 'none' : '2px solid #808080',
          borderTop:   stacked ? '2px solid #808080' : 'none',
          minHeight: 0, overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <MiniGraph fnId={fnId} xMin={xMin} xMax={xMax}
              currentState={currentStep} goalValue={goalValue} accentColor={accentColor} />
          </div>

          {/* Phase strip at graph bottom */}
          <div style={{
            flexShrink: 0, height: 30,
            background: '#d4d0c8', borderTop: '2px solid #808080',
            display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8, overflow: 'hidden',
          }}>
            <div style={{
              background: phaseColor, color: '#fff',
              fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5,
              padding: '2px 7px', textTransform: 'uppercase', flexShrink: 0,
            }}>{PHASE_LABEL[phase] || phase.toUpperCase()}</div>
            <div style={{
              fontFamily: 'Courier New, monospace', fontSize: 10, color: '#333',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{phaseStrip}</div>
          </div>
        </div>

        {/* ── STEPS panel (right / top) — dominant ── */}
        <div style={{
          width: stacked ? '100%' : STEPS_FRAC,
          height: stacked ? STEPS_H : '100%',
          display: 'flex', flexDirection: 'column',
          background: '#ebebeb', minHeight: 0, overflow: 'hidden', flexShrink: 0,
        }}>

          {/* Steps title bar */}
          <div style={{
            flexShrink: 0,
            padding: '5px 12px',
            background: '#c0c0c0',
            borderBottom: '2px solid #808080',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 'bold', fontSize: labelFont }}>Steps</span>
            <span style={{
              fontFamily: 'Courier New, monospace', fontSize: metaFont, color: '#555',
            }}>step {stepIdx + 1} / {steps.length}</span>
          </div>

          {/* Scrollable step list */}
          <div ref={stepListRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, background: '#fff' }}>
            {steps.map((step, si) => {
              const isPast    = si < stepIdx;
              const isCurrent = si === stepIdx;
              const isFuture  = si > stepIdx;

              return (
                <div key={si} data-active={isCurrent ? 'true' : 'false'}
                  className="step-row"
                  style={{
                    padding: isCurrent ? '10px 12px' : '7px 12px',
                    background: isCurrent ? '#f5f2ec' : (isPast ? '#fafaf8' : '#fff'),
                    opacity: isFuture ? 0.4 : 1,
                  }}>

                  {/* Step index row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: labelFont,
                      color: isCurrent ? phaseColor : (isPast ? '#555' : '#aaa'),
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      flexShrink: 0, minWidth: 28,
                    }}>{si})</span>

                    {isCurrent && (
                      <span style={{
                        background: phaseColor, color: '#fff',
                        fontSize: 9, fontWeight: 'bold', letterSpacing: 1,
                        padding: '2px 6px', textTransform: 'uppercase', flexShrink: 0,
                      }}>{PHASE_LABEL[phase] || phase.toUpperCase()}</span>
                    )}

                    <span style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: isCurrent ? labelFont : metaFont,
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      color: isCurrent ? '#000' : (isPast ? '#444' : '#bbb'),
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    }}>{stepSummary(step)}</span>
                  </div>

                  {/* ── Expanded sub-phase cards (current step only) ── */}
                  {isCurrent && (
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {visibleSubs.map((sub, si2) => (
                        <div key={si2} style={{
                          animation: si2 === subIdx && animKey > 0 ? 'fadeSlideIn 0.28s ease' : 'none',
                          borderLeft: `5px solid ${sub.color}`,
                          background: '#fafaf5',
                          padding: '10px 14px',
                        }}>
                          {/* Sub-phase label */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <span style={{
                              width: 26, height: 26, borderRadius: '50%',
                              background: sub.color, color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 'bold', flexShrink: 0,
                            }}>{sub.icon}</span>
                            <span style={{
                              fontSize: labelFont, fontWeight: 'bold',
                              letterSpacing: 2, color: sub.color, textTransform: 'uppercase',
                            }}>{sub.label}</span>
                          </div>

                          {/* Log lines — 28px+ */}
                          {sub.lines.map((line, li) => (
                            <div key={li} style={{
                              fontFamily: 'Courier New, monospace',
                              fontSize: logFont,
                              lineHeight: 1.6,
                              color: '#111',
                              whiteSpace: 'pre-wrap',
                              fontWeight: 'bold',
                            }}>{line}</div>
                          ))}

                          {sub.highlight && (
                            <div style={{
                              marginTop: 8,
                              display: 'inline-block',
                              background: sub.color, color: '#fff',
                              fontFamily: 'Courier New, monospace',
                              fontSize: metaFont, fontWeight: 'bold',
                              padding: '3px 12px', letterSpacing: 1,
                            }}>{sub.highlight}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Past step: completed phase pills */}
                  {isPast && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                      {buildSubPhases(step).map((sub, si2) => (
                        <span key={si2} style={{
                          background: sub.color, color: '#fff',
                          fontSize: 8, padding: '1px 5px', opacity: 0.65,
                        }}>{sub.label}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Controls (reset / previous / next) ── */}
          <div style={{
            flexShrink: 0,
            borderTop: '2px solid #808080',
            background: '#c0c0c0',
            display: 'flex', alignItems: 'center',
            padding: '5px 10px', gap: 8,
            minHeight: 44,
          }}>
            <button className="btn-win"
              style={{ fontSize: labelFont, padding: '4px 12px', minHeight: 'unset' }}
              onClick={handleReset}>reset</button>

            <button className="btn-win"
              disabled={isFirst}
              style={{ fontSize: labelFont, padding: '4px 12px', minHeight: 'unset' }}
              onClick={handlePrev}>previous</button>

            <button className="btn-win"
              disabled={isDone}
              style={{
                fontSize: labelFont, padding: '4px 12px', minHeight: 'unset',
                fontWeight: 'bold', flex: 1,
                background: isDone ? '#aaa' : accentColor,
                color: isDone ? '#666' : '#fff',
                border: isDone ? undefined : 'none',
              }}
              onClick={handleNext}>{isDone ? '✓ done' : 'next'}</button>

            <span style={{
              fontFamily: 'Courier New, monospace', fontSize: metaFont, color: '#555', whiteSpace: 'nowrap',
            }}>step {stepIdx + 1}/{steps.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
