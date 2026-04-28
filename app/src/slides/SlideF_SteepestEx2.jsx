import React from 'react';
import SimSlide from '../components/SimSlide';
import { steepestEx2Steps } from '../data/preSteps';

export default function SlideF_SteepestEx2() {
  return (
    <SimSlide
      slideNum={6}
      title="Steepest-Ascent Hill Climbing"
      subtitle="Example 2 — Local Maximum (FAILURE)"
      fnLabel="f(x) = −x(x−3)(x−4)(x−7)"
      goalValue={100}
      startX={0}
      steps={steepestEx2Steps}
      fnId="multimodal"
      xMin={-2}
      xMax={9}
      accentColor="#4a0080"
    />
  );
}
