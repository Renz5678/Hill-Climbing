import React from 'react';
import GraphVisualizer from '../components/GraphVisualizer';
import StepLog from '../components/StepLog';
import { buildStochasticHCSteps } from '../utils/algorithms';

// Random sequences exactly matching the PDF examples
const EXAMPLES = [
  {
    id: 'st-ex1',
    title: 'Example 1 — Goal Reached',
    fnId: 'parabola',
    fnLabel: 'f(x) = x² + 2x',
    startX: 0,
    goalValue: 8,
    xMin: -2,
    xMax: 4,
    randomSequence: [1, 2],
  },
  {
    id: 'st-ex2',
    title: 'Example 2 — Local Maximum (Goal Not Reached)',
    fnId: 'stochastic2',
    fnLabel: 'f(x) = −x² + 6x',
    startX: 0,
    goalValue: 16,
    xMin: -1,
    xMax: 7,
    randomSequence: [1, 2, 3, 4, 2],
  },
];

function ExampleSim({ ex }) {
  const steps = React.useMemo(() =>
    buildStochasticHCSteps({
      fnId: ex.fnId,
      startX: ex.startX,
      goalValue: ex.goalValue,
      randomSequence: ex.randomSequence,
    }),
    [ex]
  );
  const [idx, setIdx] = React.useState(0);
  const current = steps[idx];
  const done = idx >= steps.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      <div className="panel-raised" style={{ padding: '4px 10px', background: '#e0f0e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 12, color: '#004d00' }}>{ex.title}</span>
          <span style={{ marginLeft: 12, fontSize: 11, fontFamily: 'Courier New', color: '#333' }}>{ex.fnLabel}</span>
          <span style={{ marginLeft: 10, fontSize: 10, color: '#555' }}>Goal: f(x) = {ex.goalValue} &nbsp;|&nbsp; Start: x = {ex.startX}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{
            padding: '2px 8px', fontSize: 10, fontWeight: 'bold',
            background: current.phase === 'goal' ? '#006600' : current.phase === 'stuck' ? '#800000' : '#004d00',
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

export default function Slide3Stochastic() {
  const [activeEx, setActiveEx] = React.useState(0);
  const ex = EXAMPLES[activeEx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 10, gap: 6, background: '#fff' }}>
      <div style={{ borderBottom: '2px solid #004d00', paddingBottom: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#004d00', fontFamily: 'Times New Roman, serif' }}>
            Stochastic Hill Climbing
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            Picks a <em>random</em> uphill neighbor instead of evaluating all. Reduces evaluation cost; still vulnerable to local optima.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {EXAMPLES.map((e, i) => (
            <button key={i} className="btn-win"
              style={{ background: activeEx === i ? '#004d00' : undefined, color: activeEx === i ? '#fff' : undefined }}
              onClick={() => setActiveEx(i)}
            >
              EX {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-inset" style={{ padding: '4px 8px', background: '#f0fff4', fontSize: 10, lineHeight: 1.6, flexShrink: 0 }}>
        <strong>Algorithm:</strong>&nbsp;
        (1) Evaluate current solution.&nbsp;
        (2) Generate a random neighbor; if it improves, move immediately.&nbsp;
        (3) Stop when termination condition is met (no improvement found after a number of attempts).&nbsp;
        <strong>Key advantage:</strong> Lower cost per iteration vs. Steepest-Ascent since only ONE random neighbor is evaluated.
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ExampleSim key={ex.id} ex={ex} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #808080', paddingTop: 3, fontSize: 9, color: '#888' }}>
        <span>DAA — Heuristics: Hill Climbing</span>
        <span>SLIDE 3</span>
      </div>
    </div>
  );
}
