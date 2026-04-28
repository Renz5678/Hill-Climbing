import React from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { buildCurve } from '../utils/algorithms';

const AGENT_COLOR    = '#000080';
const NEIGHBOR_COLOR = '#cc0000';
const GOAL_COLOR     = '#006600';
const PLATEAU_COLOR  = '#ff8800';

export default function GraphVisualizer({ fnId, xMin, xMax, currentState, goalValue }) {
  const curve = React.useMemo(() => buildCurve(fnId, xMin, xMax, 400), [fnId, xMin, xMax]);

  const { x, fx, neighbors = [], phase } = currentState;

  const agentDot = [{ x, y: fx }];
  const neighborDots = neighbors.map(n => ({ x: n.x, y: n.fx }));
  const goalDots = goalValue !== null
    ? curve.filter(p => Math.abs(p.y - goalValue) < 0.5).slice(0, 1)
    : [];

  const agentColor =
    phase === 'goal'    ? GOAL_COLOR    :
    phase === 'stuck'   ? '#800000'     :
    phase === 'plateau' ? PLATEAU_COLOR :
    AGENT_COLOR;

  const CustomAgentDot = (props) => {
    const { cx, cy } = props;
    if (isNaN(cx) || isNaN(cy)) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={agentColor} stroke="#fff" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={12} fill="none" stroke={agentColor} strokeWidth={1.5} strokeDasharray="3 2" />
      </g>
    );
  };

  const CustomNeighborDot = (props) => {
    const { cx, cy } = props;
    if (isNaN(cx) || isNaN(cy)) return null;
    return <rect x={cx - 6} y={cy - 6} width={12} height={12} fill={NEIGHBOR_COLOR} stroke="#fff" strokeWidth={1.5} />;
  };

  const yMin = Math.min(...curve.map(p => p.y));
  const yMax = Math.max(...curve.map(p => p.y));
  const yPad = (yMax - yMin) * 0.1 || 5;

  return (
    <div className="panel-inset" style={{ background: '#f8f8f0', padding: 4, height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 16, right: 20, bottom: 24, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin, xMax]}
            tickCount={xMax - xMin + 1}
            label={{ value: 'x', position: 'insideBottomRight', offset: -4, fontSize: 13 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[yMin - yPad, yMax + yPad]}
            tick={{ fontSize: 12 }}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fontSize: 13 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="panel-raised" style={{ background: '#ffffd0', padding: '3px 7px', fontSize: 10 }}>
                  x = {typeof d.x === 'number' ? d.x.toFixed(2) : d.x}, f(x) = {typeof d.y === 'number' ? d.y.toFixed(2) : d.y}
                </div>
              );
            }}
          />
          {goalValue !== null && (
            <ReferenceLine
              y={goalValue}
              stroke={GOAL_COLOR}
              strokeDasharray="6 3"
              label={{ value: `goal = ${goalValue}`, position: 'right', fontSize: 10, fill: GOAL_COLOR }}
            />
          )}
          <Line
            data={curve}
            dataKey="y"
            dot={false}
            stroke="#000080"
            strokeWidth={2}
            type="monotone"
            isAnimationActive={false}
          />
          {neighborDots.length > 0 && (
            <Scatter
              data={neighborDots}
              dataKey="y"
              fill={NEIGHBOR_COLOR}
              shape={<CustomNeighborDot />}
              isAnimationActive={false}
            />
          )}
          <Scatter
            data={agentDot}
            dataKey="y"
            fill={agentColor}
            shape={<CustomAgentDot />}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
