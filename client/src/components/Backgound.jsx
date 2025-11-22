import React, { useEffect, useRef } from 'react';

const BlackHoleBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef({
    discs: [],
    lines: [],
    particles: [],
    clip: {},
    linesCanvas: null,
    rect: {},
    render: {},
    startDisc: {},
    endDisc: {},
    particleArea: {}
  });

  // Easing functions
  const easeInExpo = (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  const linear = (t) => t;

  const tweenValue = (start, end, p, ease = 'linear') => {
    const delta = end - start;
    const easeFn = ease === 'inExpo' ? easeInExpo : linear;
    return start + delta * easeFn(p);
  };

  const setSize = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    stateRef.current.rect = rect;

    const dpi = window.devicePixelRatio || 1;
    stateRef.current.render = {
      width: rect.width,
      height: rect.height,
      dpi
    };

    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
  };

  const tweenDisc = (disc) => {
    const { startDisc, endDisc } = stateRef.current;
    disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
    disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, 'inExpo');
    disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
    disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);
    return disc;
  };

  const setDiscs = () => {
    const { width, height } = stateRef.current.rect;

    stateRef.current.startDisc = {
      x: width * 0.5,
      y: height * 0.45,
      w: width * 0.75,
      h: height * 0.7
    };

    stateRef.current.endDisc = {
      x: width * 0.5,
      y: height * 0.95,
      w: 0,
      h: 0
    };

    const totalDiscs = 100;
    const discs = [];
    let prevBottom = height;
    let clip = {};

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = tweenDisc({ p, x: 0, y: 0, w: 0, h: 0 });
      const bottom = disc.y + disc.h;

      if (bottom <= prevBottom) {
        clip = {
          disc: { ...disc },
          i
        };
      }

      prevBottom = bottom;
      discs.push(disc);
    }

    const path = new Path2D();
    path.ellipse(clip.disc.x, clip.disc.y, clip.disc.w, clip.disc.h, 0, 0, Math.PI * 2);
    path.rect(clip.disc.x - clip.disc.w, 0, clip.disc.w * 2, clip.disc.y);

    clip.path = path;
    stateRef.current.discs = discs;
    stateRef.current.clip = clip;
  };

  const setLines = () => {
    const { width, height } = stateRef.current.rect;
    const { discs, clip } = stateRef.current;

    // Ensure we have valid dimensions
    if (!width || !height || width <= 0 || height <= 0) return;

    const totalLines = 100;
    const linesAngle = (Math.PI * 2) / totalLines;
    const lines = [];

    for (let i = 0; i < totalLines; i++) {
      lines.push([]);
    }

    discs.forEach((disc) => {
      for (let i = 0; i < totalLines; i++) {
        const angle = i * linesAngle;
        const p = {
          x: disc.x + Math.cos(angle) * disc.w,
          y: disc.y + Math.sin(angle) * disc.h
        };
        lines[i].push(p);
      }
    });

    const linesCanvas = new OffscreenCanvas(Math.floor(width), Math.floor(height));
    const ctx = linesCanvas.getContext('2d');

    lines.forEach((line) => {
      ctx.save();
      let lineIsIn = false;

      line.forEach((p1, j) => {
        if (j === 0) return;

        const p0 = line[j - 1];

        if (!lineIsIn && (ctx.isPointInPath(clip.path, p1.x, p1.y) || ctx.isPointInStroke(clip.path, p1.x, p1.y))) {
          lineIsIn = true;
        } else if (lineIsIn) {
          ctx.clip(clip.path);
        }

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });

      ctx.restore();
    });

    stateRef.current.lines = lines;
    stateRef.current.linesCanvas = linesCanvas;
  };

  const initParticle = (start = false) => {
    const { particleArea } = stateRef.current;
    const sx = particleArea.sx + particleArea.sw * Math.random();
    const ex = particleArea.ex + particleArea.ew * Math.random();
    const dx = ex - sx;
    const y = start ? particleArea.h * Math.random() : particleArea.h;
    const r = 0.5 + Math.random() * 4;
    const vy = 0.5 + Math.random();

    return {
      x: sx,
      sx,
      dx,
      y,
      vy,
      p: 0,
      r,
      c: `rgba(255, 255, 255, ${Math.random()})`
    };
  };

  const setParticles = () => {
    const { width, height } = stateRef.current.rect;
    const { clip } = stateRef.current;

    stateRef.current.particleArea = {
      sw: clip.disc.w * 0.5,
      ew: clip.disc.w * 2,
      h: height * 0.85
    };
    stateRef.current.particleArea.sx = (width - stateRef.current.particleArea.sw) / 2;
    stateRef.current.particleArea.ex = (width - stateRef.current.particleArea.ew) / 2;

    const particles = [];
    const totalParticles = 100;

    for (let i = 0; i < totalParticles; i++) {
      particles.push(initParticle(true));
    }

    stateRef.current.particles = particles;
  };

  const tick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { render, discs, particles, startDisc, clip, linesCanvas, particleArea } = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(render.dpi, render.dpi);

    // Move discs
    discs.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    });

    // Move particles
    particles.forEach((particle) => {
      particle.p = 1 - particle.y / particleArea.h;
      particle.x = particle.sx + particle.dx * particle.p;
      particle.y -= particle.vy;

      if (particle.y < 0) {
        Object.assign(particle, initParticle());
      }
    });

    // Draw discs
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(startDisc.x, startDisc.y, startDisc.w, startDisc.h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    discs.forEach((disc, i) => {
      if (i % 5 !== 0) return;

      if (disc.w < clip.disc.w - 5) {
        ctx.save();
        ctx.clip(clip.path);
      }

      ctx.beginPath();
      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();

      if (disc.w < clip.disc.w - 5) {
        ctx.restore();
      }
    });

    // Draw lines
    if (linesCanvas) {
      ctx.drawImage(linesCanvas, 0, 0);
    }

    // Draw particles
    ctx.save();
    ctx.clip(clip.path);

    particles.forEach((particle) => {
      ctx.fillStyle = particle.c;
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, particle.r, particle.r);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
    ctx.restore();

    animationRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    setSize();
    setDiscs();
    setLines();
    setParticles();
    tick();

    const handleResize = () => {
      setSize();
      setDiscs();
      setLines();
      setParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#141414] overflow-hidden">
      <style>{`
        @keyframes aura-glow {
          0% { background-position: 0 100%; }
          100% { background-position: 0 300%; }
        }
      `}</style>
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 55%, transparent 10%, black 50%)',
        width: '150%',
        height: '140%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2
      }} />
      
      {/* Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full relative z-1" />
      
      {/* Aura */}
      <div className="absolute pointer-events-none" style={{
        top: '-71.5%',
        left: '50%',
        zIndex: 3,
        width: '30%',
        height: '140%',
        background: 'linear-gradient(20deg, #00f8f1, #ffbd1e20 16.5%, #fe848f 33%, #fe848f20 49.5%, #00f8f1 66%, #00f8f160 85.5%, #ffbd1e 100%) 0 100% / 100% 200%',
        borderRadius: '0 0 100% 100%',
        filter: 'blur(50px)',
        mixBlendMode: 'plus-lighter',
        opacity: 0.75,
        transform: 'translate(-50%, 0)',
        animation: 'aura-glow 5s infinite linear'
      }} />
      
      {/* Purple overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 75%, #a900ff 20%, transparent 75%)',
        mixBlendMode: 'overlay',
        zIndex: 5
      }} />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'repeating-linear-gradient(transparent, transparent 1px, white 1px, white 2px)',
        mixBlendMode: 'overlay',
        opacity: 0.5
      }} />
    </div>
  );
};

export default BlackHoleBackground;