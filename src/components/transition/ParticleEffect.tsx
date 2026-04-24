'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────
   Multi-system particle engine
   Supports: orbit, burst, ambient, confetti, ring
   ────────────────────────────────────────────── */

export interface ParticleSystemConfig {
  type: 'orbit' | 'burst' | 'ambient' | 'confetti' | 'ring';
  count: number;
  delay?: number;
  colors?: string[];
  radius?: number;
  spread?: number;
  gravity?: number;
  speed?: number;
  size?: number;
}

interface ParticleSystemsProps {
  systems: ParticleSystemConfig[];
}

const DEFAULT_COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#818cf8', '#c4b5fd', '#006EFE'];

export function ParticleSystems({ systems }: ParticleSystemsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {systems.map((sys, i) => (
        <ParticleSystemRenderer key={`${sys.type}-${i}`} config={sys} />
      ))}
    </div>
  );
}

function ParticleSystemRenderer({ config }: { config: ParticleSystemConfig }) {
  const [active, setActive] = useState(!config.delay);

  useEffect(() => {
    if (config.delay && config.delay > 0) {
      const timer = setTimeout(() => setActive(true), config.delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [config.delay]);

  if (!active) return null;

  switch (config.type) {
    case 'orbit':
      return <OrbitSystem config={config} />;
    case 'burst':
      return <BurstSystem config={config} />;
    case 'ambient':
      return <AmbientSystem config={config} />;
    case 'confetti':
      return <ConfettiSystem config={config} />;
    case 'ring':
      return <RingSystem config={config} />;
    default:
      return null;
  }
}

/* ── Orbit System ─────────────────────────────── */
function OrbitSystem({ config }: { config: ParticleSystemConfig }) {
  const colors = config.colors || DEFAULT_COLORS;
  const baseRadius = config.radius || 80;
  const baseSpeed = config.speed || 4;

  const [particles] = useState(() =>
    Array.from({ length: config.count }, (_, i) => ({
      id: i,
      angle: (i / config.count) * 360,
      radius: baseRadius + (Math.random() - 0.5) * baseRadius * 0.8,
      duration: baseSpeed + Math.random() * 3,
      size: (config.size || 4) + Math.random() * 3,
      color: colors[i % colors.length],
      opacity: 0.4 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ width: p.radius * 2, height: p.radius * 2 }}
          initial={{ rotate: p.angle }}
          animate={{ rotate: p.angle + 360 }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              top: 0,
              left: '50%',
              marginLeft: -p.size / 2,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}40`,
            }}
            animate={{ opacity: [p.opacity, p.opacity * 0.4, p.opacity], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Burst System (one-shot radial explosion) ─── */
function BurstSystem({ config }: { config: ParticleSystemConfig }) {
  const colors = config.colors || DEFAULT_COLORS;
  const spread = config.spread || 200;

  const [particles] = useState(() =>
    Array.from({ length: config.count }, (_, i) => {
      const angle = (i / config.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = spread * (0.5 + Math.random() * 0.5);
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: (config.size || 3) + Math.random() * 4,
        color: colors[i % colors.length],
      };
    })
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}60`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 12,
            mass: 0.5 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ambient System (drifting dust motes) ─────── */
function AmbientSystem({ config }: { config: ParticleSystemConfig }) {
  const colors = config.colors || ['#8b5cf6', '#a78bfa', '#c4b5fd'];
  const spread = config.spread || 500;

  const [particles] = useState(() =>
    Array.from({ length: config.count }, (_, i) => ({
      id: i,
      startX: (Math.random() - 0.5) * spread * 2,
      startY: Math.random() * spread,
      drift: (Math.random() - 0.5) * 40,
      size: 1 + Math.random() * 2.5,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      color: colors[i % colors.length],
      opacity: 0.1 + Math.random() * 0.25,
    }))
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: p.startX, y: p.startY, opacity: 0 }}
          animate={{
            x: p.startX + p.drift,
            y: p.startY - spread,
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ── Confetti System (gravity + 3D tumble) ────── */
function ConfettiSystem({ config }: { config: ParticleSystemConfig }) {
  const colors = config.colors || ['#8b5cf6', '#6366f1', '#a78bfa', '#006EFE', '#818cf8', '#c4b5fd', '#e0e7ff', '#5326BD'];
  const spread = config.spread || 350;

  const [particles] = useState(() =>
    Array.from({ length: config.count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.5 + Math.random() * 0.8;
      return {
        id: i,
        targetX: Math.cos(angle) * spread * velocity,
        peakY: -(100 + Math.random() * 200),
        finalY: 300 + Math.random() * 200,
        width: 6 + Math.random() * 8,
        height: 4 + Math.random() * 5,
        color: colors[i % colors.length],
        rotation: Math.random() * 720 - 360,
        duration: 2.5 + Math.random() * 2,
        delay: Math.random() * 0.8,
      };
    })
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scaleX: 1 }}
          animate={{
            x: p.targetX,
            y: [0, p.peakY, p.finalY],
            opacity: [0, 1, 1, 0],
            rotate: p.rotation,
            scaleX: [1, -1, 1, -1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ring System (expanding pulse rings) ──────── */
function RingSystem({ config }: { config: ParticleSystemConfig }) {
  const colors = config.colors || ['#8b5cf6', '#006EFE'];
  const baseSpeed = config.speed || 2;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: config.count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100,
            height: 100,
            border: `1.5px solid ${colors[i % colors.length]}`,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: [0, 2.5], opacity: [0.6, 0] }}
          transition={{
            duration: baseSpeed,
            delay: i * (baseSpeed / config.count),
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Legacy export for backward compatibility ──── */
export function ParticleEffect({ count = 30, spread = 300, type = 'sparkle' }: { count?: number; spread?: number; type?: 'sparkle' | 'confetti' }) {
  const systems: ParticleSystemConfig[] = type === 'confetti'
    ? [{ type: 'confetti', count, spread }]
    : [{ type: 'burst', count, spread }];
  return <ParticleSystems systems={systems} />;
}
