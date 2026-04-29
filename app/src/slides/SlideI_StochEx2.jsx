import React from 'react';
import SimSlide from '../components/SimSlide';
import { stochasticEx2Steps } from '../data/preSteps';

export default function SlideI_StochEx2() {
  return (
    <SimSlide
      slideNum={9}
      title="Stochastic Hill Climbing"
      subtitle="Example 2 — Local Optima (FAILURE)"
      fnLabel="f(x) = −x(x−3)(x−4)(x−8)"
      goalValue={100}
      startX={0}
      steps={stochasticEx2Steps}
      fnId="multimodal"
      xMin={-1}
      xMax={9}
      accentColor="#004d00"
    />
  );
}
