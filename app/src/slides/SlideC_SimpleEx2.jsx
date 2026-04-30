import React from 'react';
import SimSlide from '../components/SimSlide';
import { simpleEx2Steps } from '../data/preSteps';

export default function SlideC_SimpleEx2() {
  return (
    <SimSlide
      slideNum={3}
      title="Simple Hill Climbing"
      subtitle="Example 2 — Local Optima Trap"
      fnLabel="f(x) = −x(x−3)(x−4)(x−7)"
      goalValue={100}
      startX={0}
      steps={simpleEx2Steps}
      fnId="multimodal"
      xMin={-1}
      xMax={9}
      accentColor="#000080"
      initialState="x = 0"
      operators={['x + 1', 'x − 1']}
    />
  );
}
