'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap/dist/gsap';

/*  ═══════════════════════════════════════════════════
    BRAND 2 BRAND – CINEMATIC LOGO INTRO
    Dynamic logo reveal with particles, light streaks,
    rugged energy, and a mass cinematic BGM score.

    Audio auto-plays if browser allows. Falls back to
    unlocking on first user interaction (mouse/touch).
    NO gate button — intro starts instantly.
    ═══════════════════════════════════════════════════ */

/* ── Cinematic BGM Score Engine ── */
function createBGM() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);

  // Compressor for that punchy "mass" feel
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -15;
  comp.knee.value = 10;
  comp.ratio.value = 8;
  comp.attack.value = 0.003;
  comp.release.value = 0.15;
  comp.connect(master);

  // Reverb using convolver
  const convolver = ctx.createConvolver();
  const reverbLen = ctx.sampleRate * 1.5;
  const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = reverbBuf.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.6));
    }
  }
  convolver.buffer = reverbBuf;
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.15;
  convolver.connect(reverbGain);
  reverbGain.connect(master);

  function tone(t, dur, freq, vol, type, dest = comp) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(dest);
    g.connect(convolver);
    o.start(t);
    o.stop(t + dur);
  }

  function noise(t, dur, freq, vol, filterType = 'lowpass') {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(comp);
    src.start(t);
  }

  function sweep(t, dur, f1, f2, vol) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const bf = ctx.createBiquadFilter();
    bf.type = 'bandpass';
    bf.frequency.setValueAtTime(f1, t);
    bf.frequency.exponentialRampToValueAtTime(f2, t + dur);
    bf.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(bf);
    bf.connect(g);
    g.connect(comp);
    g.connect(convolver);
    o.start(t);
    o.stop(t + dur);
  }

  return {
    ctx,
    // Deep cinematic drone
    drone(t) {
      // Low bass drone – D1 (36.7 Hz) and A1 (55 Hz) power fifth
      tone(t, 2.5, 36.7, 0.35, 'sine');
      tone(t, 2.5, 55, 0.2, 'sine');
      tone(t + 0.3, 2.2, 73.4, 0.1, 'sine'); // octave D2
      // Dark texture
      noise(t, 2.5, 120, 0.04, 'lowpass');
    },
    // Rising tension sweep (strings-like)
    risingSweep(t) {
      sweep(t, 0.6, 200, 3000, 0.1);
      sweep(t + 0.05, 0.55, 300, 4000, 0.06);
      noise(t, 0.5, 5000, 0.08, 'highpass');
    },
    // Whoosh
    whoosh(t, reverse = false) {
      if (reverse) {
        sweep(t, 0.35, 6000, 100, 0.12);
      } else {
        sweep(t, 0.35, 100, 6000, 0.12);
      }
      noise(t, 0.4, 4000, 0.1, 'highpass');
    },
    // Text slam – musical hit on D minor chord
    textSlam(t) {
      // Dm chord: D2, F2, A2
      tone(t, 0.5, 73.4, 0.2, 'sawtooth');
      tone(t, 0.4, 87.3, 0.12, 'square');
      tone(t, 0.35, 110, 0.1, 'sawtooth');
      noise(t, 0.2, 1200, 0.15, 'lowpass');
    },
    // THE MASSIVE IMPACT — bass drop + power chord
    massImpact(t) {
      // Sub-bass foundation
      tone(t, 1.5, 27.5, 0.5, 'sine');   // A0
      tone(t, 1.2, 36.7, 0.45, 'sine');  // D1
      tone(t, 1.0, 55, 0.35, 'sine');    // A1

      // Power chord hit – D2, A2, D3
      tone(t, 0.6, 73.4, 0.3, 'sawtooth');
      tone(t, 0.5, 110, 0.25, 'sawtooth');
      tone(t, 0.5, 146.8, 0.2, 'sawtooth');

      // Distorted crunch – square wave layer
      tone(t, 0.15, 73.4, 0.2, 'square');
      tone(t, 0.12, 110, 0.15, 'square');
      tone(t, 0.1, 220, 0.1, 'square');

      // Impact noise burst
      noise(t, 0.25, 4000, 0.35, 'lowpass');
      noise(t, 0.12, 10000, 0.2, 'highpass');

      // Reverb tail
      noise(t + 0.15, 1.2, 400, 0.06, 'lowpass');

      // Taiko-style hit
      const taiko = ctx.createOscillator();
      taiko.type = 'sine';
      taiko.frequency.setValueAtTime(150, t);
      taiko.frequency.exponentialRampToValueAtTime(40, t + 0.3);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.4, t);
      tg.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      taiko.connect(tg);
      tg.connect(comp);
      taiko.start(t);
      taiko.stop(t + 0.5);
    },
    // Shimmer / sparkle
    shimmer(t) {
      const notes = [587.3, 880, 1174.7, 1760, 2349.3]; // D5, A5, D6, A6, D7
      notes.forEach((f, i) => {
        tone(t + i * 0.06, 0.5, f, 0.025, 'sine');
      });
    },
    // Exit swell – reverse cymbal feel
    exitSwell(t) {
      sweep(t, 1.8, 60, 5000, 0.06);
      tone(t, 2.0, 55, 0.08, 'sine');
      noise(t, 1.5, 2500, 0.04, 'bandpass');
      // Fade out chord: Dmaj → resolution
      tone(t + 0.3, 1.5, 73.4, 0.04, 'sine');
      tone(t + 0.3, 1.5, 110, 0.03, 'sine');
      tone(t + 0.3, 1.5, 146.8, 0.025, 'sine');
    },
    async tryResume() {
      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch (e) { /* */ }
      }
      return ctx.state === 'running';
    },
    close() {
      if (ctx.state !== 'closed') {
        try {
          ctx.close().catch(() => {});
        } catch (e) {
          /* Already closed or missing close method in shim */
        }
      }
    },
  };
}

/* ── Spark Particle ── */
function SparkParticle({ x, y, size, isCrimson }) {
  return (
    <div className="intro-spark" style={{
      position: 'absolute',
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: isCrimson
        ? 'radial-gradient(circle, #C41230 0%, transparent 70%)'
        : 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
      opacity: 0,
    }} />
  );
}

/* ── Main Intro Component ── */
export default function VizagIntro() {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const audioUnlocked = useRef(false);
  const [introData, setIntroData] = useState(null);
  const show = !!introData;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('vizag-intro-done')) return;

    // Respect OS accessibility setting only
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('vizag-intro-done', '1');
      return;
    }

    // Set all intro data in one go on the client, asynchronously for Next 16 lint
    const timer = setTimeout(() => {
      setIntroData({
        sparks: Array.from({ length: 20 }, (_, i) => ({
          x: (Math.random() - 0.5) * 50,
          y: (Math.random() - 0.5) * 30 - 10,
          size: 3 + Math.random() * 7,
          isCrimson: Math.random() > 0.5,
        })),
        ambientParticles: Array.from({ length: 35 }, (_, i) => ({
          left: `${3 + Math.random() * 94}%`,
          top: `${15 + Math.random() * 70}%`,
          size: 1 + Math.random() * 3,
          isCrimson: Math.random() > 0.55,
        })),
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const sparks = introData?.sparks || [];
  const ambientParticles = introData?.ambientParticles || [];

  // Unlock audio on ANY user interaction
  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current || !audioRef.current) return;
    audioRef.current.tryResume().then((running) => {
      if (running) audioUnlocked.current = true;
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    // Listen for ANY interaction to unlock audio
    const events = ['click', 'touchstart', 'mousemove', 'keydown', 'scroll', 'pointerdown'];
    events.forEach(ev => window.addEventListener(ev, unlockAudio, { once: false, passive: true }));
    return () => {
      events.forEach(ev => window.removeEventListener(ev, unlockAudio));
    };
  }, [show, unlockAudio]);

  useEffect(() => {
    if (!show || !containerRef.current) return;

    document.body.style.overflow = 'hidden';

    // Create audio immediately – try to play
    let audio = null;
    try {
      audio = createBGM();
      audioRef.current = audio;
      audio.tryResume().then((running) => {
        audioUnlocked.current = running;
      });
    } catch (e) {
      audio = null;
    }

    const sfx = (fn) => {
      if (audio && audio.ctx.state === 'running') {
        fn(audio.ctx.currentTime + 0.02);
      }
    };

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        sessionStorage.setItem('vizag-intro-done', '1');
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete: () => {
            setIntroData(null);
            document.body.style.overflow = '';
            if (audio) audio.close();
          },
        });
      },
    });

    // ── ACT 1: Darkness + bass drone ──
    tl.call(() => sfx((t) => audio.drone(t)));
    tl.fromTo('#intro-bg-glow', { opacity: 0 }, {
      opacity: 1, duration: 1.0, ease: 'power2.out',
    });

    // Slight pause for tension build
    tl.to({}, { duration: 0.6 });

    // ── ACT 2: Light streaks + whoosh ──
    tl.call(() => sfx((t) => { audio.risingSweep(t); audio.whoosh(t + 0.1); }));
    tl.fromTo('#light-streak-1', { x: '-120%', opacity: 0 }, {
      x: '120%', opacity: 1, duration: 0.5, ease: 'power4.in',
    });
    tl.call(() => sfx((t) => audio.whoosh(t, true)));
    tl.fromTo('#light-streak-2', { x: '120%', opacity: 0 }, {
      x: '-120%', opacity: 1, duration: 0.4, ease: 'power4.in',
    }, '-=0.25');

    // ── ACT 3: "BRAND" crashes in with chord slam ──
    tl.call(() => sfx((t) => audio.textSlam(t)));
    tl.fromTo('#logo-brand', {
      x: -350, opacity: 0, skewX: -25, filter: 'blur(10px)',
    }, {
      x: 0, opacity: 1, skewX: 0, filter: 'blur(0px)',
      duration: 0.55, ease: 'power4.out',
    });

    // ── ACT 4: THE "2" MASS IMPACT ──
    tl.call(() => sfx((t) => audio.massImpact(t)));
    tl.fromTo('#logo-two', {
      y: -350, opacity: 0, scale: 4, rotation: -40,
    }, {
      y: 0, opacity: 1, scale: 1, rotation: -8,
      duration: 0.45, ease: 'power4.out',
    });

    // Impact flash
    tl.fromTo('#impact-flash', { opacity: 0 }, {
      opacity: 0.95, duration: 0.05,
    }, '-=0.05');
    tl.to('#impact-flash', { opacity: 0, duration: 0.4 });

    // Sparks burst
    tl.fromTo('.intro-spark', {
      opacity: 1, scale: 1,
    }, {
      opacity: 0,
      scale: 0.2,
      x: (i) => {
        const angle = (i * 37 + 10) * (Math.PI / 180);
        return Math.cos(angle) * (130 + Math.random() * 200);
      },
      y: (i) => {
        const angle = (i * 37 + 10) * (Math.PI / 180);
        return Math.sin(angle) * (130 + Math.random() * 200);
      },
      duration: 1.0,
      ease: 'power3.out',
      stagger: 0.015,
    }, '-=0.35');

    // Screen shake – heavier
    tl.to('#intro-stage', {
      x: 8, duration: 0.035, yoyo: true, repeat: 9, ease: 'none',
    }, '-=0.9');

    // ── ACT 5: "BRAND'S" slams in ──
    tl.call(() => sfx((t) => audio.textSlam(t)), [], '-=0.3');
    tl.fromTo('#logo-brands', {
      x: 350, opacity: 0, skewX: 25, filter: 'blur(10px)',
    }, {
      x: 0, opacity: 1, skewX: 0, filter: 'blur(0px)',
      duration: 0.5, ease: 'power4.out',
    }, '-=0.35');

    // ── ACT 6: Underline + shimmer ──
    tl.call(() => sfx((t) => audio.shimmer(t)));
    tl.fromTo('#logo-underline', { scaleX: 0 }, {
      scaleX: 1, duration: 0.6, ease: 'power3.out',
    });

    // ── ACT 7: Subtitle ──
    tl.fromTo('#logo-subtitle', {
      opacity: 0, y: 20, letterSpacing: '0.05em',
    }, {
      opacity: 1, y: 0, letterSpacing: '0.35em',
      duration: 0.8, ease: 'power2.out',
    }, '-=0.3');

    // ── ACT 8: Ambient particles ──
    tl.fromTo('.ambient-particle', {
      opacity: 0, y: 0,
    }, {
      opacity: (i) => 0.15 + Math.random() * 0.3,
      y: () => -(25 + Math.random() * 50),
      duration: 1.5,
      ease: 'power1.out',
      stagger: 0.04,
    }, '-=0.5');

    // ── ACT 9: Hold ──
    tl.to({}, { duration: 1.2 });

    // ── ACT 10: Exit ──
    tl.call(() => sfx((t) => audio.exitSwell(t)));
    tl.to('#intro-stage', {
      scale: 1.1, opacity: 0, filter: 'blur(5px)',
      duration: 0.9, ease: 'power2.in',
    });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
      if (audioRef.current) {
        try { audioRef.current.close(); } catch (e) { /* */ }
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: '#050505',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div id="intro-bg-glow" style={{
        position: 'absolute', inset: 0, opacity: 0,
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(196,18,48,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 40%, rgba(184,134,11,0.05) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 60%, rgba(196,18,48,0.05) 0%, transparent 40%)
        `,
      }} />

      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
      }} />

      {/* Light streaks */}
      <div id="light-streak-1" style={{
        position: 'absolute', top: '42%', left: 0, width: '100%', height: '3px',
        background: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(196,18,48,0.6) 45%, #C41230 50%, rgba(196,18,48,0.6) 55%, transparent 80%, transparent 100%)',
        boxShadow: '0 0 20px rgba(196,18,48,0.3), 0 0 60px rgba(196,18,48,0.1)',
        opacity: 0,
      }} />
      <div id="light-streak-2" style={{
        position: 'absolute', top: '58%', left: 0, width: '100%', height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, transparent 25%, rgba(184,134,11,0.5) 45%, #B8860B 50%, rgba(184,134,11,0.5) 55%, transparent 75%, transparent 100%)',
        boxShadow: '0 0 15px rgba(184,134,11,0.2)',
        opacity: 0,
      }} />

      {/* Main stage */}
      <div id="intro-stage" style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div id="impact-flash" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.95) 0%, transparent 50%)',
          opacity: 0, pointerEvents: 'none',
        }} />

        {sparks.map((s, i) => (
          <SparkParticle key={i} {...s} />
        ))}

        {ambientParticles.map((p, i) => (
          <div key={`ap-${i}`} className="ambient-particle" style={{
            position: 'absolute',
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: p.isCrimson ? '#C41230' : '#B8860B',
            opacity: 0,
          }} />
        ))}

        {/* LOGO */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none',
          width: '100%', padding: '0 16px', boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'center',
            lineHeight: 1, flexWrap: 'nowrap', whiteSpace: 'nowrap',
          }}>
            <span id="logo-brand" style={{
              fontFamily: 'var(--font-logo)',
              fontSize: 'clamp(2rem, 9vw, 7rem)',
              color: '#FAFAFA', letterSpacing: '0.06em', opacity: 0,
              textShadow: '0 0 30px rgba(255,255,255,0.1)',
            }}>BRAND</span>

            <span id="logo-two" style={{
              fontFamily: 'var(--font-logo)',
              fontSize: 'clamp(2.6rem, 12vw, 9rem)',
              color: '#C41230', fontWeight: 700, fontStyle: 'italic',
              margin: '0 -2px', opacity: 0, display: 'inline-block',
              textShadow: '0 0 40px rgba(196,18,48,0.5), 0 0 80px rgba(196,18,48,0.2)',
              filter: 'drop-shadow(0 0 8px rgba(196,18,48,0.4))',
            }}>2</span>

            <span id="logo-brands" style={{
              fontFamily: 'var(--font-logo)',
              fontSize: 'clamp(2rem, 9vw, 7rem)',
              color: '#FAFAFA', letterSpacing: '0.06em', opacity: 0,
              textShadow: '0 0 30px rgba(255,255,255,0.1)',
            }}>BRAND&apos;S</span>
          </div>

          <div id="logo-underline" style={{
            width: 'clamp(160px, 50vw, 500px)', height: '2px',
            background: 'linear-gradient(90deg, transparent, #C41230, #B8860B, #C41230, transparent)',
            marginTop: '8px', transformOrigin: 'center', transform: 'scaleX(0)',
          }} />

          <span id="logo-subtitle" style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: 'clamp(0.55rem, 1.5vw, 1rem)',
            color: '#B8860B', fontStyle: 'italic',
            letterSpacing: 'clamp(0.15em, 1vw, 0.35em)', marginTop: '14px',
            opacity: 0, textTransform: 'uppercase',
          }}>Fashion Store</span>
        </div>
      </div>
    </div>
  );
}
