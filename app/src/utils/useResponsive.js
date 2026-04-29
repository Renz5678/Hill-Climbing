import { useState, useEffect } from 'react';

function getSize() {
  return { w: window.innerWidth, h: window.innerHeight };
}

export function useWindowSize() {
  const [size, setSize] = useState(getSize);
  useEffect(() => {
    const handler = () => setSize(getSize());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

export function useBreakpoint() {
  const { w, h } = useWindowSize();
  return {
    isMobile:  w < 640,
    isTablet:  w >= 640 && w < 1024,
    isDesktop: w >= 1024,
    w,
    h,
  };
}
