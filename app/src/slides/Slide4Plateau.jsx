import React from 'react';
import GraphVisualizer from '../components/GraphVisualizer';
import StepLog from '../components/StepLog';
import { buildPlateauHCSteps } from '../utils/algorithms';

const OPERATORS = [
  { label: '+1 (move right)', delta: 1 },
  { label: '-1 (move left)', delta: -1 },
];

// f(x) = round(-(x²-8x)/5) — plateau at x=3,4,5 where f=3
const EXAMPLES = [
  {
    id: 'pl-ex1',
    title: 'Plateau Problem — Equal Neighbors Block Movement',
    fnId: 'plateau',
    fnLabel: 'f(x) = round(−(x²−8x)/5)',
    startX: 1,
    goalValue: 5,
    xMin: -1,
    xMax: 9,
    description: 'Starting at x=1, the agent climbs to x=3. At x=3, the neighbor x=4 has the same value (f=3), causing a PLATEAU — the algorithm cannot move because there is no strict improvement.',
  },
];

function ExampleSim({ ex }) {
  const steps = React.useMemo(() =>
    buildPlateauHCSteps({ fnId: ex.fnId, startX: ex.startX, goalValue: ex.goalValue, operators: OPERATORS }),
    [ex]
  );
  const [idx, setIdx] = React.useState(0);
  const current = steps[idx];
  const done = idx >= steps.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      <div className="panel-raised" style={{ padding: '4px 10px', background: '#fff0d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: 12, color: '#804000' }}>{ex.title}</span>
          <span style={{ marginLeft: 12, fontSize: 11, fontFamily: 'Courier New', color: '#333' }}>{ex.fnLabel}</span>
          <span style={{ marginLeft: 10, fontSize: 10, color: '#555' }}>Goal: f(x) = {ex.goalValue} &nbsp;|&nbsp; Start: x = {ex.startX}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{
            padding: '2px 8px', fontSize: 10, fontWeight: 'bold',
            background: current.phase === 'goal' ? '#006600'
              : current.phase === 'stuck' ? '#800000'
              : current.phase === 'plateau' ? '#cc6600'
              : '#804000',
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
        <div style={{ flex: 3, minHeight: 0 }}>
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

export default function Slide4Plateau() {
  const ex = EXAMPLES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 10, gap: 6, background: '#fff' }}>
      <div style={{ borderBottom: '2px solid #804000', paddingBottom: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#804000', fontFamily: 'Times New Roman, serif' }}>
            The Plateau & Ridge Problem
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            Flat regions and diagonal ridges that defeat standard Hill Climbing heuristics.
          </div>
        </div>
      </div>



      <div style={{ flex: 1, minHeight: 0 }}>
        <ExampleSim key={ex.id} ex={ex} />
      </div>



      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #808080', paddingTop: 3, fontSize: 9, color: '#888' }}>
        <span>DAA — Heuristics: Hill Climbing</span>
        <span>SLIDE 4</span>
      </div>
    </div>
  );
}
