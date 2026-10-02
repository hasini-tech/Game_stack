import React, { useEffect, useRef } from 'react';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface ParticleEffectsProps {
  particles: Particle[];
  onTick?: () => void;
  width: number;
  height: number;
}

export const ParticleEffectsCanvas: React.FC<ParticleEffectsProps> = ({
  particles,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeParticlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (particles.length > 0) {
      activeParticlesRef.current.push(...particles);
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (activeParticlesRef.current.length === 0) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const remaining: Particle[] = [];
      for (const p of activeParticlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          remaining.push(p);
        }
      }

      activeParticlesRef.current = remaining;
      if (remaining.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [particles, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-30"
    />
  );
};
