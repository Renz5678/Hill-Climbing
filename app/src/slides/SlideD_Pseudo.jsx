import React from 'react';
import PseudocodeSlide from '../components/PseudocodeSlide';

const CODE = `function STEEPEST_ASCENT_HILL_CLIMBING(initial_state):
    current_state = initial_state
    evaluate(current_state)

    loop:
        if current_state == goal_state:
            return current_state           // solution found

        target = NULL

        for each operator in operators:
            if operator not applicable to current_state:
                continue
            new_state = apply(operator, current_state)
            evaluate(new_state)
            if new_state == goal_state:
                return new_state           // solution found
            if target == NULL or new_state is better than target:
                target = new_state         // track best neighbor

        if target == NULL or target is not better than current_state:
            return FAILURE                 // local maximum or no operators
        current_state = target             // move to steepest neighbor`;

export default function SlideD_Pseudo() {
  return (
    <PseudocodeSlide
      slideNum={4}
      title="Steepest-Ascent Hill Climbing"
      subtitle="Algorithm Overview"
      accentColor="#4a0080"
      code={CODE}
      citation="Anandraj, 2018"
      description={
        'Steepest-Ascent Hill Climbing evaluates ALL neighboring states before making a move.\n' +
        'It tracks the best neighbor (target) across all operators, then moves only to the steepest improvement.\n' +
        'Like Simple HC, it is still vulnerable to local optima — but makes a more informed move each iteration.'
      }
    />
  );
}
