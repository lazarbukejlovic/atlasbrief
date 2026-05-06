import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

const HeroPlaneAnimation = () => {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(232,244,253,0.96)_0%,_rgba(255,247,237,0.96)_50%,_rgba(217,235,255,0.92)_100%)] shadow-card md:h-[420px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,_rgba(255,255,255,0.95),_transparent_30%),radial-gradient(circle_at_75%_35%,_rgba(255,255,255,0.7),_transparent_28%)]" />
      <svg viewBox="0 0 800 420" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(96,165,250,0)" />
            <stop offset="55%" stopColor="rgba(96,165,250,0.55)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0.85)" />
          </linearGradient>
        </defs>
        <path
          d="M 30 320 C 180 120, 360 120, 500 190 S 720 280, 770 80"
          fill="none"
          stroke="url(#trail)"
          strokeDasharray="12 14"
          strokeLinecap="round"
          strokeWidth="7"
          className="animate-trail"
        />
      </svg>
      <motion.div
        className="absolute left-0 top-0"
        animate={{
          x: [30, 180, 360, 520, 710],
          y: [290, 170, 150, 215, 95],
          rotate: [-18, -7, 6, 14, 18],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-sky-accent shadow-card backdrop-blur">
          <Plane className="h-7 w-7" />
        </div>
      </motion.div>
      <div className="absolute bottom-8 left-8 max-w-md">
        <div className="inline-flex rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sand backdrop-blur">
          Live readiness view
        </div>
        <p className="mt-4 text-lg leading-8 text-navy-muted md:text-xl">
          AtlasBrief turns destination volatility into a clean pre-trip signal: costs, safety, local rules, and the practical details that affect how a trip actually feels.
        </p>
      </div>
    </div>
  );
};

export default HeroPlaneAnimation;