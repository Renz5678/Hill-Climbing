// Pre-defined step sequences — exact match to PDF content

// ── Simple HC Example 1: f(x) = x² + 2x, goal = 8 ──
export const simpleEx1Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial state:\nf(0) = (0)² + 2(0) = 0 + 0 = 0\nCurrent state ≠ goal state (0 ≠ 8)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 3 }], phase: 'evaluating',
    log: 'Apply first operator (+1)\nNew state: x + 1 = 0 + 1 = 1\n\nEvaluate new state:\nf(1) = (1)² + 2(1) = 1 + 2 = 3\nCurrent state ≠ goal state (1 ≠ 8)',
  },
  {
    x: 1, fx: 3, neighbors: [], phase: 'moving',
    log: 'f(1) > f(0)\nMake f(1) current state → x = 1',
  },
  {
    x: 1, fx: 3, neighbors: [{ x: 2, fx: 8 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 1 + 1 = 2\n\nEvaluate new state:\nf(2) = (2)² + 2(2) = 4 + 4 = 8\nCurrent state == goal state (8 == 8)\nReturn x = 2',
  },
  {
    x: 2, fx: 8, neighbors: [], phase: 'goal',
    log: 'Goal reached! ✓\nSince we have already reached our goal,\nwe terminate the algorithm.',
  },
];

// ── Simple HC Example 2: f(x) = -x(x-3)(x-4)(x-8), goal = 100 ──
export const simpleEx2Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial state:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nCurrent state ≠ goal state (0 ≠ 100)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 42 }], phase: 'evaluating',
    log: 'Apply first operator (+1)\nNew state: x + 1 = 0 + 1 = 1\n\nEvaluate new state:\nf(1) = -(1)(1-3)(1-4)(1-8) = -(1)(-2)(-3)(-7) = 42\nNew state ≠ goal state (42 ≠ 100)\nf(1) > f(0), make f(1) current state',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'moving',
    log: 'f(1) = 42 > f(0) = 0\nMake f(1) current state → x = 1',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 2, fx: 24 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 1 + 1 = 2\n\nEvaluate new state:\nf(2) = -(2)(2-3)(2-4)(2-8) = -(2)(-1)(-2)(-6) = 24\nNew state ≠ goal state (24 ≠ 100)\nf(1) > f(2), do not move',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 0, fx: 0 }], phase: 'evaluating',
    log: 'Try another operator (-1)\nNew state: x - 1 = 1 - 1 = 0\n\nEvaluate new state:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nNew state ≠ goal state (0 ≠ 100)\nf(1) > f(0), f(1) still the current state.\nNo operators left.',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'stuck',
    log: 'Return x = 1 as the maximum x state.\nYielding f(1) = 42.\n\nEven though our goal is f(x) = 100, we settle\nwith f(1) = 42 because no other operators\nimprove this state.\n\nThe algorithm is trapped at the local maximum\nat x = 1, completely missing the global maximum\nat x = 7 where f(7) = 84.',
  },
];

// ── Steepest-Ascent Example 1: f(x) = x² + 2x, goal = 8 ──
export const steepestEx1Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial state:\nf(0) = (0)² + 2(0) = 0 + 0 = 0\nCurrent state ≠ goal state (0 ≠ 8)\nSet target = NULL',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 3 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 0 + 1 = 1\n\nEvaluate new state:\nf(1) = (1)² + 2(1) = 1 + 2 = 3\nNew state ≠ goal state (3 ≠ 8)\nSet target = new state (x = 1)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 3 }, { x: -1, fx: -1 }], phase: 'evaluating',
    log: 'Apply operator (-1)\nNew state: x - 1 = 0 - 1 = -1\n\nEvaluate new state:\nf(-1) = (-1)² + 2(-1) = 1 - 2 = -1\nNew state ≠ goal state (-1 ≠ 8)\nTarget > f(-1) (3 > -1), target stays the same',
  },
  {
    x: 1, fx: 3, neighbors: [], phase: 'moving',
    log: 'All operators applied.\nBest neighbor: target = x = 1, f(1) = 3\nf(target) = 3 > f(current) = 0\nCurrent state = target → x = 1',
  },
  {
    x: 1, fx: 3, neighbors: [{ x: 2, fx: 8 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 1 + 1 = 2\n\nEvaluate new state:\nf(2) = 2² + 2(2) = 4 + 4 = 8\nNew state == goal state (8 == 8)\nReturn new state (x = 2)',
  },
  {
    x: 2, fx: 8, neighbors: [], phase: 'goal',
    log: 'Goal reached! ✓\nSince we already found our goal,\nwe terminate the algorithm.',
  },
];

// ── Steepest-Ascent Example 2: f(x) = -x(x-3)(x-4)(x-8), goal = 100 ──
export const steepestEx2Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial state:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nInitial state ≠ goal state (0 ≠ 100)\nSet target = NULL',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 42 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 0 + 1 = 1\n\nEvaluate new state:\nf(1) = -(1)(1-3)(1-4)(1-8) = -(1)(-2)(-3)(-7) = 42\nNew state ≠ goal state (42 ≠ 100)\nSet target = new state (x = 1)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 42 }, { x: -1, fx: -180 }], phase: 'evaluating',
    log: 'Apply operator (-1)\nNew state: x - 1 = 0 - 1 = -1\n\nEvaluate new state:\nf(-1) = -(-1)(-1-3)(-1-4)(-1-8)\n       = -(-1)(-4)(-5)(-9) = -180\nNew state ≠ goal state (-180 ≠ 100)\nTarget f(1) = 42 > f(-1) = -180, target stays',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'moving',
    log: 'All operators applied.\nf(target) = 42 > f(current) = 0\nCurrent = target → x = 1',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'evaluating',
    log: 'Evaluate current state:\nf(1) = -(1)(1-3)(1-4)(1-8) = 42\nCurrent state ≠ goal state (42 ≠ 100)\nSet target = NULL',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 2, fx: 24 }], phase: 'evaluating',
    log: 'Apply operator (+1)\nNew state: x + 1 = 1 + 1 = 2\n\nEvaluate new state:\nf(2) = -(2)(2-3)(2-4)(2-8) = -(2)(-1)(-2)(-6) = 24\nNew state ≠ goal state (24 ≠ 100)\nSet target = new state (x = 2)',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 2, fx: 24 }, { x: 0, fx: 0 }], phase: 'evaluating',
    log: 'Apply operator (-1)\nNew state: x - 1 = 1 - 1 = 0\n\nEvaluate new state:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nNew state ≠ goal state (0 ≠ 100)\nTarget f(2) = 24 > f(0) = 0, target stays',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'stuck',
    log: 'All operators applied.\nf(target) = 24 < f(current) = 42\nTarget is not better than current.\n\nNo improvement possible.\nReturn FAILURE\n(local maximum at x = 1, f(1) = 42)',
  },
];

// ── Stochastic Example 1: f(x) = x² + 2x, goal = 8 ──
export const stochasticEx1Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial solution:\nf(0) = (0)² + 2(0) = 0 + 0 = 0\nInitial solution ≠ goal state (0 ≠ 8)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 3 }], phase: 'evaluating',
    log: 'Generate random neighbor: x = 1\nEvaluate neighbor:\nf(1) = (1)² + 2(1) = 1 + 2 = 3\nNeighbor ≠ goal state (3 ≠ 8)\nf(1) = 3 > f(0) = 0, move to neighbor (x = 1)',
  },
  {
    x: 1, fx: 3, neighbors: [], phase: 'moving',
    log: 'Moving to neighbor → x = 1',
  },
  {
    x: 1, fx: 3, neighbors: [{ x: 2, fx: 8 }], phase: 'evaluating',
    log: 'Generate random neighbor: x = 2\nEvaluate neighbor:\nf(2) = (2)² + 2(2) = 4 + 4 = 8\nNeighbor == goal state (8 == 8)\nReturn x = 2',
  },
  {
    x: 2, fx: 8, neighbors: [], phase: 'goal',
    log: 'Goal reached! ✓\nReturn x = 2, f(2) = 8',
  },
];

// ── Stochastic Example 2: f(x) = -x(x-3)(x-4)(x-8), goal = 100 ──
export const stochasticEx2Steps = [
  {
    x: 0, fx: 0, neighbors: [], phase: 'init',
    log: 'Evaluate initial solution:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nInitial solution ≠ goal state (0 ≠ 100)',
  },
  {
    x: 0, fx: 0, neighbors: [{ x: 1, fx: 42 }], phase: 'evaluating',
    log: 'Generate random neighbor: x = 1\nEvaluate neighbor:\nf(1) = -(1)(1-3)(1-4)(1-8) = -(1)(-2)(-3)(-7) = 42\nNeighbor ≠ goal state (42 ≠ 100)\nf(1) = 42 > f(0) = 0, move to neighbor (x = 1)',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'moving',
    log: 'Moving to neighbor → x = 1',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 2, fx: 24 }], phase: 'evaluating',
    log: 'Generate random neighbor: x = 2\nEvaluate neighbor:\nf(2) = -(2)(2-3)(2-4)(2-8) = -(2)(-1)(-2)(-6) = 24\nNeighbor ≠ goal state (24 ≠ 100)\nf(2) = 24 < f(1) = 42, do not move',
  },
  {
    x: 1, fx: 42, neighbors: [{ x: 0, fx: 0 }], phase: 'evaluating',
    log: 'Generate random neighbor: x = 0\nEvaluate neighbor:\nf(0) = -(0)(0-3)(0-4)(0-8) = 0\nNeighbor ≠ goal state (0 ≠ 100)\nf(0) = 0 < f(1) = 42, do not move',
  },
  {
    x: 1, fx: 42, neighbors: [], phase: 'stuck',
    log: 'Termination condition met\n(no improvement found)\n\nReturn current solution:\nx = 1, f(1) = 42\n\nAlgorithm is trapped at the local maximum\nat x = 1, completely missing the global\nmaximum at x = 7 where f(7) = 84.',
  },
];
