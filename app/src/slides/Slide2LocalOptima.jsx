import React from 'react';
import GraphVisualizer from '../components/GraphVisualizer';
import StepLog from '../components/StepLog';
import { buildSteepestHCSteps } from '../utils/algorithms';

const OPERATORS = [
  { label: '+1 (move right)', delta: 1 },
  { label: '-1 (move left)', delta: -1 },
];

const EXAMPLES = [
  {
    id: 'sa-ex1',
    title: 'Example 1 — Goal Reached',
    fnId: 'parabola',
    fnLabel: 'f(x) = x² + 2x',
    startX: 0,
    goalValue: 8,
    xMin: -2,
    xMax: 4,
  },
  {
    id: 'sa-ex2',
    title: 'Example 2 — Local Optima (FAILURE)',
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
    buildSteepestHCSteps({ fnId: ex.fnId, startX: ex.startX, goalValue: ex.goalValue, operators: OPERATORS }),
    [ex]
  );
  const [idx, setIdx] = React.useState(0);
  const current = steps[idx];
  const done = idx >= steps.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      <div className="panel-raised" style={{ padding: '4px 10px', background: '#e8e0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 12, color: '#4a0080' }}>{ex.title}</span>
          <span style={{ marginLeft: 12, fontSize: 11, fontFamily: 'Courier New', color: '#333' }}>{ex.fnLabel}</span>
          <span style={{ marginLeft: 10, fontSize: 10, color: '#555' }}>Goal: f(x) = {ex.goalValue} &nbsp;|&nbsp; Start: x = {ex.startX}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{
            padding: '2px 8px', fontSize: 10, fontWeight: 'bold',
            background: current.phase === 'goal' ? '#006600' : current.phase === 'stuck' ? '#800000' : '#4a0080',
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

      <div style={{ flex: 1, display: 'flex', gap: 4, minHeight: 0 }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <GraphVisualizer fnId={ex.fnId} xMin={ex.xMin} xMax={ex.xMax} currentState={current} goalValue={ex.goalValue} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <StepLog steps={steps} currentIdx={idx} />
        </div>
      </div>

      <div style={{ fontSize: 10, color: '#555', textAlign: 'right', paddingRight: 4 }}>
        Step {idx} / {steps.length - 1}
      </div>
    </div>
  );
}

export default function Slide2LocalOptima() {
  const [activeEx, setActiveEx] = React.useState(0);
  const ex = EXAMPLES[activeEx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 10, gap: 6, background: '#fff' }}>
      <div style={{ borderBottom: '2px solid #4a0080', paddingBottom: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#4a0080', fontFamily: 'Times New Roman, serif' }}>
            Steepest-Ascent Hill Climbing & The Local Optima Problem
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            Evaluates ALL neighboring states before moving. Still vulnerable to local optima traps.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {EXAMPLES.map((e, i) => (
            <button key={i} className="btn-win"
              style={{ background: activeEx === i ? '#4a0080' : undefined, color: activeEx === i ? '#fff' : undefined }}
              onClick={() => setActiveEx(i)}
            >
              EX {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-inset" style={{ padding: '4px 8px', background: '#fff0f8', fontSize: 10, lineHeight: 1.6, flexShrink: 0 }}>
        <strong>Key difference from Simple HC:</strong>&nbsp;
        (1) Set target = NULL.&nbsp;
        (2) Apply ALL operators; track the best neighbor as <em>target</em>.&nbsp;
        (3) Only move after all operators are evaluated — move to <em>target</em> if better than current.&nbsp;
        <strong>Local Optima:</strong> a state where all neighbors are worse — algorithm returns FAILURE.
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ExampleSim key={ex.id} ex={ex} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #808080', paddingTop: 3, fontSize: 9, color: '#888' }}>
        <span>DAA — Heuristics: Hill Climbing</span>
        <span>SLIDE 2</span>
      </div>
    </div>
  );
}
