import React from 'react';
import PseudocodeSlide from '../components/PseudocodeSlide';

const CODE = `function STOCHASTIC_HILL_CLIMBING(initial_solution):
    current_solution = initial_solution
    evaluate(current_solution)

    loop:
        if current_solution == goal_state:
            return current_solution        // solution found

        if no_improvement_detected:
            return current_solution        // no improvement for too long

        neighbor = generate_random_neighbor(current_solution)
        evaluate(neighbor)

        if neighbor == goal_state:
            return neighbor                // solution found

        if neighbor is better than current_solution:
            current_solution = neighbor    // move to random better neighbor`;

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
