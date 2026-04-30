import React from 'react';
import PseudocodeSlide from '../components/PseudocodeSlide';

const CODE = `function STOCHASTIC_HILL_CLIMBING(initial_state):
    current_state = initial_state
    evaluate(current_state)
    iterations = 0

    loop:
        if current_state == goal_state:
            return current_state        // solution found

        if termination_condition_met(iterations, max_iterations):
            return current_state        // best solution found so far

        neighbor = generate_random_neighbor(current_state)
        evaluate(neighbor)

        if neighbor == goal_state:
            return neighbor             // solution found

        if neighbor is better than current_state:
            current_state = neighbor    // move to random better neighbor

        iterations = iterations + 1`;

export default function SlideG_Pseudo() {
  return (
    <PseudocodeSlide
      slideNum={7}
      title="Stochastic Hill Climbing"
      subtitle="Algorithm Overview"
      accentColor="#004d00"
      code={CODE}
      citation="Stochastic Hill Climbing | Algorithm Afternoon, 2024"
      description={
        'Stochastic Hill Climbing selects a single random neighbor instead of evaluating all neighbors.\n' +
        'If the random neighbor is better, the algorithm moves to it. Otherwise it tries again.\n' +
        'Key advantage: lower computational cost per iteration compared to Steepest-Ascent.\n' +
        'Still susceptible to local optima, but the random selection can sometimes escape shallow traps.'
      }
    />
  );
}
