import React from 'react';
import GraphVisualizer from '../components/GraphVisualizer';
import StepLog from '../components/StepLog';
import { buildSimpleHCSteps } from '../utils/algorithms';

const OPERATORS = [
  { label: '+1 (move right)', delta: 1 },
  { label: '-1 (move left)', delta: -1 },
];

const EXAMPLES = [
  {
    id: 'ex1',
    title: 'Example 1 — Finding Goal State',
    fnId: 'parabola',
    fnLabel: 'f(x) = x² + 2x',
    startX: 0,
    goalValue: 8,
    xMin: -2,
    xMax: 4,
  },
  {
    id: 'ex2',
    title: 'Example 2 — Local Optima Trap',
    fnId: 'multimodal',
    fnLabel: 'f(x) = −x(x−3)(x−4)(x−8)',
    startX: 0,
    goalValue: 100,
    xMin: -1,
    xMax: 9,
  },
];

function ExampleSim({ ex }) {
  const steps = React.useMemo(() =>
    buildSimpleHCSteps({ fnId: ex.fnId, startX: ex.startX, goalValue: ex.goalValue, operators: OPERATORS }),
    [ex.fnId, ex.startX, ex.goalValue]
  );
  const [idx, setIdx] = React.useState(0);
  const current = steps[idx];
  const done = idx >= steps.length - 1;
  const endPhase = steps[steps.length - 1]?.phase;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      {/* Header */}
      <div className="panel-raised" style={{ padding: '4px 10px', background: '#e8e8e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 12, color: '#000080' }}>{ex.title}</span>
          <span style={{ marginLeft: 12, fontSize: 11, fontFamily: 'Courier New', color: '#333' }}>{ex.fnLabel}</span>
          <span style={{ marginLeft: 10, fontSize: 10, color: '#555' }}>Goal: f(x) = {ex.goalValue} &nbsp;|&nbsp; Start: x = {ex.startX}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{
            padding: '2px 8px', fontSize: 10, fontWeight: 'bold',
            background: current.phase === 'goal' ? '#006600' : current.phase === 'stuck' ? '#800000' : '#000080',
            color: '#fff',
          }}>
            {current.phase.toUpperCase()}
          </span>
          <button className="btn-win" onClick={() => setIdx(0)}>↺ Reset</button>
          <button className="btn-win" disabled={done} onClick={() => setIdx(i => Math.min(i + 1, steps.length - 1))}>
            ▶ Step
          </button>
        </div>
      </div>

      {/* Body: graph + log */}
      <div style={{ flex: 1, display: 'flex', gap: 4, minHeight: 0 }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <GraphVisualizer
            fnId={ex.fnId}
            xMin={ex.xMin}
            xMax={ex.xMax}
            currentState={current}
            goalValue={ex.goalValue}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <StepLog steps={steps} currentIdx={idx} />
        </div>
      </div>

      {/* Step counter */}
      <div style={{ fontSize: 10, color: '#555', textAlign: 'right', paddingRight: 4 }}>
        Step {idx} / {steps.length - 1}
      </div>
    </div>
  );
}

export default function Slide1Simple() {
  const [activeEx, setActiveEx] = React.useState(0);
  const ex = EXAMPLES[activeEx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 10, gap: 6, background: '#fff' }}>
      {/* Slide title */}
      <div style={{ borderBottom: '2px solid #000080', paddingBottom: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#000080', fontFamily: 'Times New Roman, serif' }}>
            Simple Hill Climbing
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            A local search algorithm that iteratively moves to a better neighboring state.
            Applies operators one at a time and moves immediately on improvement.
          </div>
        </div>
        {/* Example tabs */}
        <div style={{ display: 'flex', gap: 2 }}>
          {EXAMPLES.map((e, i) => (
            <button key={i} className="btn-win"
              style={{ background: activeEx === i ? '#000080' : undefined, color: activeEx === i ? '#fff' : undefined, fontWeight: activeEx === i ? 'bold' : 'normal' }}
              onClick={() => setActiveEx(i)}
            >
              EX {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm description box */}
      <div className="panel-inset" style={{ padding: '4px 8px', background: '#ffffd8', fontSize: 10, lineHeight: 1.6, flexShrink: 0 }}>
        <strong>Algorithm:</strong>&nbsp;
        (1) Evaluate current state.&nbsp;
        (2) Apply first operator → if new state is better, move immediately.&nbsp;
        (3) Repeat until goal found or no operator improves the state (local max).&nbsp;
        <strong>Operators:</strong> x + 1 (move right), x − 1 (move left)
      </div>

      {/* Simulation */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ExampleSim key={ex.id} ex={ex} />
      </div>

      {/* Slide footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #808080', paddingTop: 3, fontSize: 9, color: '#888' }}>
        <span>DAA — Heuristics: Hill Climbing</span>
        <span>SLIDE 1</span>
      </div>
    </div>
  );
}
