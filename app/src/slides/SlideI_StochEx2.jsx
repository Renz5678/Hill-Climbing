import React from 'react';
import SimSlide from '../components/SimSlide';
import { stochasticEx2Steps } from '../data/preSteps';

export default function SlideI_StochEx2() {
  return (
    <SimSlide
      slideNum={9}
      title="Stochastic Hill Climbing"
      subtitle="Example 2 — Local Maximum (Goal Not Reached)"
      fnLabel="f(x) = −x² + 6x"
      goalValue={16}
      startX={0}
      steps={stochasticEx2Steps}
      fnId="stochastic2"
      xMin={-1}
      xMax={7}
      accentColor="#004d00"
    />
  );
}
