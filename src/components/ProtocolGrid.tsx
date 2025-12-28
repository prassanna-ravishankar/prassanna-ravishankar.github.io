import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const ProtocolGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const gridSize = 40; // Size of the grid cells
    
    // Theme colors (we'll detect theme or default to teal/amber)
    // We can use the CSS variables effectively by reading computed styles if needed,
    // but hardcoding the brand RGBs for canvas is smoother for performance.
    const colors = [
      'rgba(47, 168, 152, 0.8)', // Teal
      'rgba(47, 168, 152, 0.4)', // Teal dim
      'rgba(217, 128, 52, 0.8)', // Amber
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 800; // Hero height
    };

    const createParticle = (): Particle => {
      const isHorizontal = Math.random() > 0.5;
      // Snap to grid
      const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
      
      const speed = 2; // Pixels per frame
      
      return {
        x,
        y,
        vx: isHorizontal ? (Math.random() > 0.5 ? speed : -speed) : 0,
        vy: isHorizontal ? 0 : (Math.random() > 0.5 ? speed : -speed),
        life: 0,
        maxLife: Math.random() * 200 + 100, // Frames to live
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // Initial population
    for (let i = 0; i < 20; i++) {
      particles.push(createParticle());
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.05)'; // Very faint grid
      ctx.lineWidth = 1;
      
      // Draw grid lines
      /*
      // Optional: Draw the full grid. Can be noisy. 
      // Let's draw mostly intersections to keep it clean.
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      */
      
      // Instead of full grid, let's draw subtle "+" at intersections
      ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          if (Math.random() > 0.95) { // Random flickering dots/crosses
             ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw static background elements
      drawGrid();

      // Manage particles
      if (particles.length < 25) { // Keep roughly 25 agents active
        if (Math.random() > 0.9) particles.push(createParticle());
      }

      particles.forEach((p, index) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Random turn at grid intersection
        if (p.x % gridSize === 0 && p.y % gridSize === 0) {
          if (Math.random() > 0.7) { // 30% chance to turn
            if (p.vx !== 0) {
              // Moving horizontal, turn vertical
              p.vx = 0;
              p.vy = Math.random() > 0.5 ? 2 : -2;
            } else {
              // Moving vertical, turn horizontal
              p.vy = 0;
              p.vx = Math.random() > 0.5 ? 2 : -2;
            }
          }
        }

        // Kill if out of bounds or old
        if (
          p.life > p.maxLife || 
          p.x < 0 || p.x > canvas.width || 
          p.y < 0 || p.y > canvas.height
        ) {
          particles.splice(index, 1);
          return;
        }

        // Draw Trail (The "Protocol")
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 5, p.y - p.vy * 5); // Short trail
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife); // Fade out over time
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw Head (The "Agent")
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; // White hot center
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-60">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Gradient mask to fade out bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
};
