import React from 'react';
import SimSlide from '../components/SimSlide';
import { steepestEx1Steps } from '../data/preSteps';

export default function SlideE_SteepestEx1() {
  return (
    <SimSlide
      slideNum={5}
      title="Steepest-Ascent Hill Climbing"
      subtitle="Example 1 — Goal State Found"
      fnLabel="f(x) = x² + 2x"
      goalValue={8}
      startX={0}
      steps={steepestEx1Steps}
      fnId="parabola"
      xMin={-2}
      xMax={4}
      accentColor="#4a0080"
    />
  );
}
