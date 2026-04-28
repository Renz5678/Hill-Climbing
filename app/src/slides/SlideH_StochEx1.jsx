import React from 'react';
import SimSlide from '../components/SimSlide';
import { stochasticEx1Steps } from '../data/preSteps';

export default function SlideH_StochEx1() {
  return (
    <SimSlide
      slideNum={8}
      title="Stochastic Hill Climbing"
      subtitle="Example 1 — Goal State Found"
      fnLabel="f(x) = x² + 2x"
      goalValue={8}
      startX={0}
      steps={stochasticEx1Steps}
      fnId="parabola"
      xMin={-2}
      xMax={4}
      accentColor="#004d00"
    />
  );
}
