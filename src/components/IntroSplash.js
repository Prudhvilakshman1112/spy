'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0); // 0=scattered, 1=assembling, 2=glow, 3=fadeout

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem('spy-intro-seen')) return;
      sessionStorage.setItem('spy-intro-seen', '1');
    } catch { return; }

    setVisible(true);
    const t1 = setTimeout(() => setPhase(1), 200);   // start assembling
    const t2 = setTimeout(() => setPhase(2), 1800);   // glow pulse
    const t3 = setTimeout(() => setPhase(3), 3200);   // fade out
    const t4 = setTimeout(() => setVisible(false), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!visible) return null;

  // 12 glass shard pieces with irregular clip-paths
  const shards = [
    { clip: 'polygon(0% 0%, 25% 0%, 30% 35%, 10% 40%)', tx: -200, ty: -180, r: -35 },
    { clip: 'polygon(25% 0%, 50% 0%, 45% 30%, 30% 35%)', tx: 60, ty: -220, r: 25 },
    { clip: 'polygon(50% 0%, 75% 0%, 70% 25%, 45% 30%)', tx: 180, ty: -160, r: -40 },
    { clip: 'polygon(75% 0%, 100% 0%, 100% 30%, 70% 25%)', tx: 250, ty: -120, r: 30 },
    { clip: 'polygon(10% 40%, 30% 35%, 35% 60%, 5% 55%)', tx: -220, ty: 50, r: 45 },
    { clip: 'polygon(30% 35%, 45% 30%, 55% 55%, 35% 60%)', tx: 40, ty: 100, r: -20 },
    { clip: 'polygon(45% 30%, 70% 25%, 65% 50%, 55% 55%)', tx: 150, ty: 80, r: 35 },
    { clip: 'polygon(70% 25%, 100% 30%, 100% 55%, 65% 50%)', tx: 280, ty: 60, r: -25 },
    { clip: 'polygon(5% 55%, 35% 60%, 30% 85%, 0% 100%)', tx: -180, ty: 200, r: -30 },
    { clip: 'polygon(35% 60%, 55% 55%, 60% 80%, 30% 85%)', tx: 50, ty: 250, r: 20 },
    { clip: 'polygon(55% 55%, 65% 50%, 100% 55%, 100% 100%, 60% 80%)', tx: 200, ty: 180, r: -45 },
    { clip: 'polygon(0% 100%, 30% 85%, 60% 80%, 100% 100%)', tx: -30, ty: 300, r: 15 },
  ];

  return (
    <div className={`intro-splash ${phase >= 3 ? 'intro-splash--fade' : ''}`}>
      {/* Dark reflective background */}
      <div className="intro-bg-grid" />

      {/* Ambient light rays */}
      <div className={`intro-rays ${phase >= 2 ? 'show' : ''}`} />

      {/* Glass shards container */}
      <div className="intro-shards-container">
        {shards.map((shard, i) => (
          <div
            key={i}
            className={`intro-shard ${phase >= 1 ? 'assembled' : ''}`}
            style={{
              clipPath: shard.clip,
              '--tx': `${shard.tx}px`,
              '--ty': `${shard.ty}px`,
              '--rot': `${shard.r}deg`,
              transitionDelay: `${i * 0.06}s`,
            }}
          >
            <Image src="/images/image.png" alt="" width={500} height={280}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} priority />
          </div>
        ))}

        {/* Glass reflection overlay on assembled logo */}
        <div className={`intro-glass-shine ${phase >= 2 ? 'show' : ''}`} />
      </div>

      {/* Impact flash when assembled */}
      <div className={`intro-impact-flash ${phase >= 1 ? 'show' : ''}`} />

      {/* Tagline */}
      <div className={`intro-tagline ${phase >= 2 ? 'show' : ''}`}>
        Your Fashion Detective
      </div>
    </div>
  );
}
