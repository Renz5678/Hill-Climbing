import React from 'react';
import SimSlide from '../components/SimSlide';
import { simpleEx1Steps } from '../data/preSteps';

export default function SlideB_SimpleEx1() {
  return (
    <SimSlide
      slideNum={2}
      title="Simple Hill Climbing"
      subtitle="Example 1 — Goal State Found"
      fnLabel="f(x) = x² + 2x"
      goalValue={8}
      startX={0}
      steps={simpleEx1Steps}
      fnId="parabola"
      xMin={-2}
      xMax={4}
      accentColor="#000080"
    />
  );
}
