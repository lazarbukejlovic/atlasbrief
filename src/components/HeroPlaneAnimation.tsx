import { motion, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';

const HeroPlaneAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  const planeAnimation = prefersReducedMotion
    ? { x: 575, y: 86, rotate: 16 }
    : {
        x: [40, 180, 340, 510, 640],
        y: [274, 178, 136, 180, 96],
        rotate: [-14, -6, 2, 9, 16],
      };

  const planeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 14, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <div className="relative h-[320px] overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(132deg,_rgba(236,247,255,0.96)_0%,_rgba(255,249,239,0.98)_52%,_rgba(226,240,255,0.95)_100%)] shadow-card md:h-[420px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_23%,_rgba(255,255,255,0.96),_transparent_34%),radial-gradient(circle_at_84%_26%,_rgba(255,255,255,0.76),_transparent_32%),radial-gradient(circle_at_30%_88%,_rgba(212,168,83,0.16),_transparent_35%)]" />
      <div className="hero-cloud hero-cloud-a" />
      <div className="hero-cloud hero-cloud-b" />

      <svg viewBox="0 0 800 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="heroTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.1)" />
            <stop offset="45%" stopColor="rgba(96,165,250,0.62)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0.86)" />
          </linearGradient>
          <linearGradient id="heroTrailSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(96,165,250,0.25)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0.28)" />
          </linearGradient>
          <radialGradient id="heroPinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.58)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0)" />
          </radialGradient>
        </defs>

        <path
          d="M 36 304 C 162 178, 286 120, 416 146 S 644 208, 758 94"
          fill="none"
          stroke="url(#heroTrailSoft)"
          strokeWidth="14"
          strokeLinecap="round"
          className={prefersReducedMotion ? '' : 'hero-trail-soft'}
        />
        <path
          d="M 36 304 C 162 178, 286 120, 416 146 S 644 208, 758 94"
          fill="none"
          stroke="url(#heroTrailGradient)"
          strokeDasharray="10 13"
          strokeLinecap="round"
          strokeWidth="6"
          className={prefersReducedMotion ? '' : 'hero-trail-dash'}
        />

        <g className={prefersReducedMotion ? '' : 'hero-dot-flow'}>
          {[
            { x: 68, y: 282 },
            { x: 154, y: 194 },
            { x: 252, y: 148 },
            { x: 356, y: 136 },
            { x: 470, y: 158 },
            { x: 588, y: 174 },
            { x: 686, y: 144 },
          ].map((dot) => (
            <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r="3" fill="rgba(255,255,255,0.9)" />
          ))}
        </g>

        {[
          { x: 150, y: 240, ringDelay: '0s' },
          { x: 354, y: 232, ringDelay: '1.2s' },
          { x: 616, y: 250, ringDelay: '2.1s' },
        ].map((pin) => (
          <g key={`${pin.x}-${pin.y}`} style={{ animationDelay: pin.ringDelay }} className={prefersReducedMotion ? '' : 'hero-signal-ring'}>
            <circle cx={pin.x} cy={pin.y} r="15" fill="none" stroke="rgba(96,165,250,0.24)" strokeWidth="2" />
            <circle cx={pin.x} cy={pin.y} r="7.5" fill="url(#heroPinGlow)" />
            <circle cx={pin.x} cy={pin.y} r="3" fill="rgba(30,45,74,0.9)" />
          </g>
        ))}
      </svg>

      <motion.div
        className="absolute left-0 top-0"
        animate={planeAnimation}
        transition={planeTransition}
      >
        <div className="hero-plane-wrap">
          <div className="hero-motion-lines" />
          <div className="hero-plane-glow" />
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/75 bg-white/92 text-sky-accent shadow-card backdrop-blur">
            <Plane className="h-7 w-7" />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-6 right-6 max-w-[30rem] rounded-[1.5rem] border border-white/70 bg-white/72 p-4 shadow-soft backdrop-blur md:bottom-8 md:left-8 md:right-auto md:p-5">
        <div className="inline-flex rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sand backdrop-blur">
          Live readiness signal map
        </div>
        <p className="mt-3 text-base leading-7 text-navy-muted md:text-lg md:leading-8">
          AtlasBrief maps route-level readiness signals so you can review cost pressure, local rules, safety context, and recent change velocity before booking.
        </p>
      </div>
    </div>
  );
};

export default HeroPlaneAnimation;