import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WindowBar from './components/WindowBar';
import BottomBar from './components/BottomBar';
import { useBreakpoint } from './utils/useResponsive';

import SlideA_Pseudo      from './slides/SlideA_Pseudo';
import SlideB_SimpleEx1   from './slides/SlideB_SimpleEx1';
import SlideC_SimpleEx2   from './slides/SlideC_SimpleEx2';
import SlideD_Pseudo      from './slides/SlideD_Pseudo';
import SlideE_SteepestEx1 from './slides/SlideE_SteepestEx1';
import SlideF_SteepestEx2 from './slides/SlideF_SteepestEx2';
import SlideG_Pseudo      from './slides/SlideG_Pseudo';
import SlideH_StochEx1    from './slides/SlideH_StochEx1';
import SlideI_StochEx2    from './slides/SlideI_StochEx2';

const SLIDES = [
  SlideA_Pseudo, SlideB_SimpleEx1, SlideC_SimpleEx2,
  SlideD_Pseudo, SlideE_SteepestEx1, SlideF_SteepestEx2,
  SlideG_Pseudo, SlideH_StochEx1, SlideI_StochEx2,
];

const PSEUDO_INDICES = new Set([0, 3, 6]);
const TOTAL = SLIDES.length;
const MENUS = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools'];

const variants = {
  enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function App() {
  const [slide, setSlide] = React.useState(0);
  const [dir,   setDir]   = React.useState(1);
  const { isMobile, isTablet } = useBreakpoint();
  const isPseudo = PSEUDO_INDICES.has(slide);

  const goTo = React.useCallback((next) => {
    if (next < 0 || next >= TOTAL) return;
    setDir(next > slide ? 1 : -1);
    setSlide(next);
  }, [slide]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(slide + 1);
      if (e.key === 'ArrowLeft')  goTo(slide - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slide, goTo]);

  const SlideComponent = SLIDES[slide];

  // ── Shell sizing ──
  // Mobile: full-screen, no chrome border/shadow
  // Tablet: full-screen, thin border
  // Desktop: slight inset with Win98 border
  const shellStyle = isMobile
    ? {
        width: '100vw', height: '100vh',
        background: '#c0c0c0',
        display: 'flex', flexDirection: 'column',
      }
    : isTablet
    ? {
        width: '100vw', height: '100vh',
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        display: 'flex', flexDirection: 'column',
      }
    : {
        width: '98vw', height: '97vh',
        background: '#c0c0c0',
        border: '3px solid',
        borderColor: '#fff #808080 #808080 #fff',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 4px 0 #000',
      };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: isMobile ? '#c0c0c0' : '#808080',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={shellStyle}>
        <WindowBar title="HILL CLIMBING PRESENTER — DAA Heuristics" menus={MENUS} />

        {/* Slide area */}
        <div style={{
          flex: 1,
          background: isPseudo ? 'transparent' : (isMobile ? '#c0c0c0' : '#a0a0a0'),
          padding: isPseudo ? 0 : (isMobile ? 4 : 8),
          // pseudo slides: no overflow scroll; sim slides: hidden so SimSlide controls its own scroll
          overflow: 'hidden',
          position: 'relative',
        }}>
          {isPseudo ? (
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={slide}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <SlideComponent />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{
              height: '100%',
              border: isMobile ? 'none' : '3px solid',
              borderColor: '#808080 #fff #fff #808080',
              background: '#fff',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={slide}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: 0, overflowY: isMobile ? 'auto' : 'hidden' }}
                >
                  <SlideComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        <BottomBar
          currentSlide={slide}
          totalSlides={TOTAL}
          onPrev={() => goTo(slide - 1)}
          onNext={() => goTo(slide + 1)}
        />
      </div>
    </div>
  );
}
