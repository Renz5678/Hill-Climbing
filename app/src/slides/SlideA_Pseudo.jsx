import React from 'react';
import PseudocodeSlide from '../components/PseudocodeSlide';

const CODE = `function SIMPLE_HILL_CLIMBING(initial_state):
    current_state = initial_state
    evaluate(current_state)

    loop:
        if current_state == goal_state:
            return current_state       // solution found

        operator = select_next_unapplied_operator(current_state)

        if operator == NULL:
            return FAILURE             // no operators left

        new_state = apply(operator, current_state)
        evaluate(new_state)

        if new_state == goal_state:
            return new_state           // solution found

        if new_state is better than current_state:
            current_state = new_state  // move to better state`;

export default function SlideA_Pseudo() {
  return (
    <PseudocodeSlide
      slideNum={1}
      title="Simple Hill Climbing"
      subtitle="Algorithm Overview"
      accentColor="#000080"
      code={CODE}
      citation="Hill Climbing Algorithm, 2026"
      description={
        'Simple Hill Climbing is a local search algorithm that evaluates one neighboring state at a time.\n' +
        'It immediately moves to a better neighbor as soon as one is found — without examining all neighbors first.\n' +
        'It stops when it reaches a goal state, or when no operator can improve the current state (local maximum).'
      }
    />
  );
}
