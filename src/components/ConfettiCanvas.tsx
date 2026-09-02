import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'star';
}

interface ConfettiCanvasProps {
  trigger: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (trigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#38BDF8', '#F43F5E'];
    const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'circle', 'rect'];

    // Spawn 70 particles from center-bottom / mid-screen
    const newParticles: Particle[] = [];
    const originX = window.innerWidth * 0.5 + (Math.random() * 200 - 100);
    const originY = window.innerHeight * 0.6;

    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * (Math.random() * 1.4 - 1.2)); // upwards burst
      const speed = Math.random() * 14 + 6;
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012; // fade out

        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0 && p.y < canvas.height);

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};
