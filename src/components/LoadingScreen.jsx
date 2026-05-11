import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = "MOOD INDIGO".split('');

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter | idle | exit
  const [scrambled, setScrambled] = useState(LETTERS.map(() => ''));

  // Scramble / de-scramble effect
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';
    let frame = 0;
    let interval;

    const scramble = () => {
      interval = setInterval(() => {
        frame++;
        setScrambled(prev =>
          LETTERS.map((letter, i) => {
            if (letter === ' ') return ' ';
            if (frame > i * 3 + 8) return letter;
            return chars[Math.floor(Math.random() * chars.length)];
          })
        );
        if (frame > LETTERS.length * 3 + 16) {
          clearInterval(interval);
          setScrambled(LETTERS);
          setTimeout(() => setPhase('exit'), 900);
        }
      }, 45);
    };

    const startTimeout = setTimeout(scramble, 400);
    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(onComplete, 800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: '#080808' }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,20,147,0.6), transparent)',
              animation: 'scan-line 2.5s linear infinite',
            }}
          />

          {/* Corner brackets */}
          {[
            'top-8 left-8 border-t-2 border-l-2',
            'top-8 right-8 border-t-2 border-r-2',
            'bottom-8 left-8 border-b-2 border-l-2',
            'bottom-8 right-8 border-b-2 border-r-2',
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-10 h-10 border-[#ff1493] ${cls}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            />
          ))}

          {/* Year badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono-accent text-xs tracking-[0.5em] mb-8"
            style={{ color: 'var(--accent-pink)' }}
          >
            IITB × 2025
          </motion.div>

          {/* Main title with scramble effect */}
          <div className="flex items-center gap-1 mb-4">
            {scrambled.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03, duration: 0.4 }}
                className="font-mono-accent font-bold"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 5rem)',
                  letterSpacing: '0.08em',
                  color: char === ' ' ? 'transparent' : '#f0f0f0',
                  display: 'inline-block',
                  minWidth: char === ' ' ? '1rem' : 'auto',
                  textShadow: char !== ' ' && char !== LETTERS[i]
                    ? '0 0 20px rgba(255, 20, 147, 0.8)'
                    : 'none',
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-mono-accent text-xs tracking-[0.3em] mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            A VORTEX OF VANDALISM
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="relative w-64 h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{ background: 'linear-gradient(90deg, #ff1493, #b026ff, #00d4ff)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.4 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono-accent text-[10px] tracking-widest mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            LOADING COORDINATOR PORTAL
          </motion.p>

          {/* Add your custom animation below — replace this placeholder */}
          {/* 
            <YourCustomAnimation /> 
          */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
