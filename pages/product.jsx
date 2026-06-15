const { useState, useEffect, useRef } = React;
const { ArkimFixedHeader } = window;
const ArkimFooter = window.ArkimFooter;
const useArkimTheme = window.useArkimTheme;
const usePrefersReducedMotion = window.usePrefersReducedMotion;
const HeroBgVideo = window.HeroBgVideo;

// ── Shared helpers ────────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/** Viewport ≤ breakpoint: single-column grids + tighter section padding (matches nav @768) */
function useIsNarrowLayout(breakpointPx = 768) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpointPx}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const update = () => setNarrow(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpointPx]);
  return narrow;
}

function FadeIn({ children, delay = 0, y = 28, style = {} }) {
  const [ref, vis] = useFadeIn();
  const reducedMotion = usePrefersReducedMotion();
  const effectiveDelay = reducedMotion ? 0 : delay;
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: reducedMotion ? 'none' : (vis ? 'none' : `translateY(${y}px)`),
      transition: reducedMotion
        ? 'none'
        : `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${effectiveDelay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${effectiveDelay}s`,
      ...style,
    }}>{children}</div>
  );
}
function Eyebrow({ children, accent = false, center = false }) {
  const className = [
    'arkim-section-caption',
    !accent && 'arkim-section-caption--muted',
    center && 'arkim-section-caption--center',
  ].filter(Boolean).join(' ');
  return <div className={className}>{children}</div>;
}
function DemoBtn({ label = 'Request a Demo' }) {
  return (
    <a href="/contactus/" className="arkim-btn-primary">{label} →</a>
  );
}
function SectionImg({ label, height = '55vh', src = null, videoSrc = null, alt = '', objectFit = 'cover' }) {
  const narrow = useIsNarrowLayout();
  if (videoSrc) {
    return (
      <div
        style={{
          width: '100%',
          margin: 0,
          padding: 0,
          background: '#050505',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          lineHeight: 0,
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            maxWidth: '1120px',
            margin: '0 auto',
            padding: narrow ? '32px 16px 40px' : '48px 24px 56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={alt || label}
            title={label}
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              maxHeight: narrow ? 'min(44vh, 380px)' : 'min(50vh, 480px)',
              objectFit: 'contain',
              display: 'block',
              background: '#000',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>
    );
  }
  if (src) {
    if (objectFit === 'contain') {
      return (
        <div style={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--media-bg, var(--bg))',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: narrow ? 'min(72vh, 480px)' : 'clamp(560px, 92vh, 980px)',
          padding: 'clamp(32px, 5vw, 80px) clamp(16px, 4vw, 48px)',
        }}>
          <img
            src={src}
            alt={alt || label}
            loading="lazy"
            decoding="async"
            style={{
              display: 'block',
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: 'min(90vh, 880px)',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </div>
      );
    }
    return (
      <div style={{
        width: '100%', height, position: 'relative', overflow: 'hidden',
        background: 'var(--media-bg, #000)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
    );
  }
  return (
    <div style={{
      width: '100%', height, position: 'relative', overflow: 'hidden',
      background: 'repeating-linear-gradient(45deg, #111 0, #111 16px, #0e0e0e 16px, #0e0e0e 32px)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10, color: 'rgba(245,242,237,0.15)', fontFamily: 'monospace', fontSize: '13px', textAlign: 'center', padding: '32px',
      }}>
        <div style={{ fontSize: 40, opacity: 0.2 }}>◻</div>
        <div>{label}</div>
      </div>
    </div>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const narrow = useIsNarrowLayout();
  const reducedMotion = usePrefersReducedMotion();
  const heroFade = (delay, children) => (
    <div style={{ animation: reducedMotion ? 'none' : `fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}>
      {children}
    </div>
  );
  return (
    <div className="hero-cinematic hero-cinematic--video-bg" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: narrow ? 'calc(120px + var(--arkim-nav-offset)) 16px 72px' : 'calc(140px + var(--arkim-nav-offset)) 48px 80px', overflow: 'hidden' }}>
      <HeroBgVideo
        src="https://assets.arkim.ai/arkim-banner-video-product.mp4"
        poster="https://assets.arkim.ai/arkim-banner-video-product-poster.webp"
        reducedMotion={reducedMotion}
      />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', width: '100%', textAlign: 'center' }}>
        {heroFade(0.1, (
          <>
            <h1 className="hero-h1">
              <span style={{ color: 'var(--hero-title)', display: 'block' }}>Maintenance solutions</span>
              <span style={{ color: 'var(--hero-title)', display: 'block' }}>for any facility</span>
            </h1>
            <p className="hero-lead arkim-subhead">
              Capture knowledge automatically. Diagnose faster. Stop downtime before it starts.
            </p>
          </>
        ))}
        {heroFade(0.35, (
          <div
            className="hero-panel-grid"
            style={{
              gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)',
              width: '100%',
              maxWidth: narrow ? '100%' : '740px',
            }}
          >
            {[
              { num: '01', label: 'Diagnose faster', id: 's01' },
              { num: '02', label: 'Capture knowledge', id: 's02' },
              { num: '03', label: 'Your existing tools', id: 's03' },
            ].map((item, i) => (
              <a key={i} href={`#${item.id}`} className="hero-panel-cell" style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                padding: narrow ? '16px 18px' : '20px 24px',
              }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: '0.1em', color: 'var(--accent)', fontWeight: 500 }}>{item.num}</span>
                <span style={{ fontFamily: 'var(--body)', fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 400, lineHeight: 1.3 }}>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STICKY ANCHOR NAV (shows when hero nav scrolls away) ─────────────────────
function StickyAnchorNav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(null);
  const narrow = useIsNarrowLayout();
  useEffect(() => {
    const sectionIds = ['s01','s02','s03'];
    const fn = () => {
      setShow(window.scrollY > window.innerHeight * 0.7);
      const found = sectionIds.slice().reverse().find(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top <= 120;
      });
      setActive(found || null);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!show) return null;
  const items = [
    { num: '01', label: 'Diagnose faster', id: 's01' },
    { num: '02', label: 'Capture knowledge', id: 's02' },
    { num: '03', label: 'Your existing tools', id: 's03' },
  ];
  return (
    <div style={{
      position: 'fixed',
      top: 'calc(68px + env(safe-area-inset-top, 0px))',
      left: 0,
      right: 0,
      zIndex: 150,
      background: 'var(--nav-scrim)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
      justifyContent: narrow ? 'flex-start' : 'center',
      overflowX: narrow ? 'auto' : 'visible',
      WebkitOverflowScrolling: 'touch',
      touchAction: 'pan-x',
      padding: narrow ? '0 10px' : '0 48px', height: '52px', gap: 0,
      transition: 'opacity 0.3s',
    }}>
      {items.map((item, i) => (
        <a key={i} href={`#${item.id}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          flexShrink: 0,
          padding: narrow ? '0 14px' : '0 28px', alignSelf: 'stretch', textDecoration: 'none',
          borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          borderBottom: active === item.id ? `2px solid var(--accent)` : '2px solid transparent',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--subnav-hover-bg)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
        }}
        >
          <span style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', lineHeight: 1, color: active === item.id ? 'var(--accent)' : 'var(--fg-muted)', fontWeight: 600, letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase' }}>{item.num}</span>
          <span style={{ fontFamily: 'var(--body)', fontSize: '13px', lineHeight: 1, color: active === item.id ? 'var(--fg)' : 'var(--fg-muted)', fontWeight: 400 }}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

// ── FEATURE PILLS ─────────────────────────────────────────────────────────────
function FeaturePills({ items }) {
  const narrow = useIsNarrowLayout();
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
      gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          background: 'var(--bg-card)', padding: narrow ? '22px 20px' : '32px 36px',
          transition: 'background 0.25s, box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--card-hover)';
          e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.18)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <h3 style={{ fontSize: 'var(--title-h3-sm)', fontWeight: 600, color: 'var(--fg)', marginBottom: '10px' }}>{item.title}</h3>
          <div style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, textWrap: 'pretty' }}>{item.body}</div>
        </div>
      ))}
    </div>
  );
}

// ── STAT BLOCK ────────────────────────────────────────────────────────────────
function StatBlock({ num, label, sub }) {
  return (
    <div style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-stat-md)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1, letterSpacing: 'var(--title-stat-letter-spacing)', marginBottom: '12px' }}>{num}</div>
      <div style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 500, color: 'var(--fg)', marginBottom: '8px' }}>{label}</div>
      {sub && <div style={{ fontFamily: 'var(--body)', fontSize: '15px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.6, maxWidth: '560px', textWrap: 'pretty' }}>{sub}</div>}
    </div>
  );
}

function ZeroDayTechnicianDiagram() {
  const narrow = useIsNarrowLayout();
  const steps = [
    {
      tag: 'The gap',
      title: 'Veteran know-how retires',
      body: 'Machine quirks, shortcuts, failure sounds, and quick fixes leave with senior technicians.',
    },
    {
      tag: 'Arkim captures',
      title: 'A digital brain forms',
      body: 'Manuals, maintenance logs, asset history, and expert notes become one searchable knowledge layer.',
    },
    {
      tag: 'AI assistant',
      title: 'Answers at the machine',
      body: 'A new technician asks in plain language and gets the likely cause plus the exact next steps.',
    },
    {
      tag: 'Day zero',
      title: 'Senior-level execution',
      body: 'Decades of experience show up in the first shift, reducing search time and guesswork.',
    },
  ];

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-card))',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: narrow ? '24px 20px' : '30px 34px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: narrow ? 'column' : 'row',
        gap: narrow ? 12 : 28,
        justifyContent: 'space-between',
        alignItems: narrow ? 'flex-start' : 'center',
      }}>
        <div>
          <div className="arkim-section-caption">How it works</div>
          <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-lg)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h3-letter-spacing)', color: 'var(--fg)', textWrap: 'balance' }}>
            From tribal knowledge to first-day expertise.
          </h3>
        </div>
        <p style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, maxWidth: narrow ? '100%' : 360, textWrap: 'pretty' }}>
          Arkim turns scattered maintenance experience into guided action, so a new hire can diagnose and repair with the context of your best people.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : 'repeat(4, minmax(0, 1fr))',
        gap: '1px',
        background: 'var(--border)',
      }}>
        {steps.map((step, i) => (
          <div key={step.tag} style={{ position: 'relative', background: 'var(--bg-card)', padding: narrow ? '24px 20px' : '28px 24px', minHeight: narrow ? 'auto' : 240 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '1px solid var(--accent-border)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--sans)',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: 22,
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            {!narrow && i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: 45, right: -13, zIndex: 2, color: 'var(--accent)', fontFamily: 'var(--sans)', fontSize: 22, lineHeight: 1 }}>
                →
              </div>
            )}
            <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>
              {step.tag}
            </div>
            <div style={{ fontFamily: 'var(--body)', fontSize: narrow ? '17px' : '19px', fontWeight: 600, lineHeight: 1.3, letterSpacing: 'normal', color: 'var(--fg)', marginBottom: 12, textWrap: 'balance' }}>
              {step.title}
            </div>
            <p style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, textWrap: 'pretty' }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
      <div style={{ padding: narrow ? '22px 20px' : '24px 34px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 8, flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--body)', fontSize: '15px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.7, textWrap: 'pretty', maxWidth: 760 }}>
          The result is a "0-day technician": someone who can act with senior context on day one because Arkim has already synthesized the facility's history, documentation, and expert intuition.
        </p>
      </div>
    </div>
  );
}

// ── SECTION WRAPPER ───────────────────────────────────────────────────────────
function Section({ id, eyebrow, headline, sub, imageLabel, imageSrc = null, imageAlt = '', imageHeight = '55vh', imageObjectFit = 'cover', imageSlot = null, sideBySideGifs = null, imageBelowSplit = false, stretchSplitMediaHeight = false, splitMediaMatchTable = false, splitIntroAlign = 'center', mobileMediaFirst = false, children, statNum, statLabel, statSub, afterStatContent = null, showDemoButton = true }) {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  const hasSplit = Array.isArray(sideBySideGifs) && sideBySideGifs.length > 0;
  const stretchDesktop = stretchSplitMediaHeight && !narrow;
  const matchTableHeight = splitMediaMatchTable && !narrow && hasSplit;
  const gifsFillRow = stretchDesktop || matchTableHeight;
  const introSplitCentered = splitIntroAlign !== 'left';
  const phonePairMobile = narrow && hasSplit && sideBySideGifs.length > 1 && sideBySideGifs.every((g) => g.phoneMockup);
  const mediaFirstOnMobile = narrow && mobileMediaFirst;

  const introBlock = (
    <>
      <Eyebrow accent>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '24px', maxWidth: '800px', textWrap: 'balance' }}>{headline}</h2>
      <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '640px', textWrap: 'pretty', marginBottom: '60px' }}>{sub}</p>
    </>
  );

  const introBlockSplit = (
    <div style={{ textAlign: introSplitCentered ? 'center' : 'left', marginBottom: narrow ? 32 : 44 }}>
      <Eyebrow accent>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', margin: introSplitCentered ? '0 auto 24px' : '0 0 24px', maxWidth: '900px', textWrap: 'balance' }}>{headline}</h2>
      <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '680px', margin: introSplitCentered ? '0 auto' : '0', textWrap: 'pretty' }}>{sub}</p>
    </div>
  );

  const gifsInner = hasSplit ? (
    <div
      className={phonePairMobile ? 'arkim-phone-mockup-row' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: phonePairMobile ? 14 : (narrow ? 10 : 14),
        justifyContent: 'center',
        alignItems: gifsFillRow ? 'stretch' : 'center',
        width: '100%',
        flex: gifsFillRow ? 1 : undefined,
        minHeight: gifsFillRow ? 0 : undefined,
        height: gifsFillRow ? '100%' : undefined,
        padding: phonePairMobile ? '4px 0 8px' : undefined,
      }}
    >
      {sideBySideGifs.map((g, i) => {
        const phoneClipRadius = g.phoneMockup
          ? (narrow ? 'clamp(22px, 5.5vw, 28px)' : 'clamp(16px, 2.2vw, 26px)')
          : 'clamp(16px, 2.2vw, 26px)';
        const fillMediaItem = stretchDesktop || (matchTableHeight && g.ingestLightFrame);
        const imgStyle = fillMediaItem ? {
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          objectPosition: 'center',
          borderRadius: g.phoneMockup ? phoneClipRadius : undefined,
        } : phonePairMobile ? {
          display: 'block',
          width: 'auto',
          height: 'auto',
          maxWidth: 'min(47vw, 220px)',
          maxHeight: 'min(60vh, 500px)',
          objectFit: 'contain',
          objectPosition: 'center',
          borderRadius: phoneClipRadius,
        } : {
          width: narrow ? '100%' : 'auto',
          maxWidth: narrow ? (sideBySideGifs.length > 1 ? '50%' : '100%') : 'none',
          height: 'auto',
          maxHeight: narrow
            ? 'min(52vh, 420px)'
            : (g.ingestLightFrame ? 'min(40vh, 340px)' : 'min(58vh, 520px)'),
          objectFit: 'contain',
          objectPosition: 'center top',
          display: 'block',
          borderRadius: g.phoneMockup ? phoneClipRadius : undefined,
        };
        const mediaSrc = g.videoSrc || g.src;
        const isVideo = Boolean(g.videoSrc || (mediaSrc && /\.(mp4|webm)(\?|$)/i.test(mediaSrc)));
        const media = isVideo ? (
          <video
            src={mediaSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={g.alt || ''}
            style={imgStyle}
          />
        ) : (
          <img
            src={g.src}
            alt={g.alt || ''}
            loading="lazy"
            decoding="async"
            style={imgStyle}
          />
        );
        if (g.ingestLightFrame) {
          return (
            <div
              key={i}
              className="arkim-ingestion-frame"
              style={{
                flex: narrow ? '1 1 auto' : (fillMediaItem ? '1 1 0%' : '0 1 auto'),
                minWidth: 0,
                minHeight: fillMediaItem ? 0 : undefined,
                height: fillMediaItem ? '100%' : undefined,
                maxWidth: narrow ? '100%' : (fillMediaItem ? 460 : 380),
                width: fillMediaItem ? '100%' : undefined,
                alignSelf: fillMediaItem ? 'stretch' : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {media}
            </div>
          );
        }
        return (
          <div
            key={i}
            className={g.phoneMockup ? 'arkim-phone-mockup' : undefined}
            style={{
              flex: phonePairMobile ? '0 0 auto' : (narrow ? '1 1 0' : '0 1 auto'),
              minWidth: 0,
              width: phonePairMobile ? 'auto' : undefined,
              borderRadius: phoneClipRadius,
              overflow: 'hidden',
              lineHeight: 0,
            }}
          >
            {media}
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <div id={id} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px 60px` }}>
        {hasSplit ? (
          <>
            <FadeIn>{introBlockSplit}</FadeIn>
            <FadeIn delay={0.1}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: narrow ? 'column' : 'row',
                  justifyContent: 'center',
                  alignItems: narrow ? 'stretch' : (gifsFillRow ? 'stretch' : 'flex-start'),
                  gap: narrow ? 28 : 48,
                  width: '100%',
                }}
              >
                <div style={{
                  flex: narrow ? 'none' : (stretchDesktop ? '1 1 58%' : '0 1 520px'),
                  minWidth: 0,
                  minHeight: narrow ? undefined : (matchTableHeight ? 0 : undefined),
                  maxWidth: narrow ? '100%' : (stretchDesktop ? 'none' : 560),
                  width: narrow ? '100%' : 'auto',
                  order: mediaFirstOnMobile ? 2 : 1,
                }}
                >
                  {children}
                </div>
                <div style={{
                  flex: narrow ? 'none' : (stretchDesktop ? '1 1 34%' : (matchTableHeight ? '1 1 0%' : '0 1 auto')),
                  minWidth: narrow ? undefined : (stretchDesktop ? 240 : (matchTableHeight ? 0 : 0)),
                  minHeight: narrow ? undefined : (gifsFillRow ? 0 : undefined),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: narrow ? (phonePairMobile ? 'center' : 'stretch') : (gifsFillRow ? 'stretch' : 'center'),
                  width: narrow ? '100%' : 'auto',
                  maxWidth: narrow ? '100%' : (matchTableHeight ? 'min(40vw, 380px)' : undefined),
                  alignSelf: narrow ? 'stretch' : (gifsFillRow ? 'stretch' : 'flex-start'),
                  order: mediaFirstOnMobile ? 1 : 2,
                  marginBottom: mediaFirstOnMobile ? 4 : undefined,
                }}
                >
                  {gifsInner}
                </div>
              </div>
            </FadeIn>
          </>
        ) : (
          <>
            <FadeIn>{introBlock}</FadeIn>
            <FadeIn delay={0.1}>{children}</FadeIn>
          </>
        )}
      </div>
      {(!hasSplit || (imageBelowSplit && imageSrc)) && (
        <FadeIn>
          {imageSlot ? (
            imageSlot
          ) : (
            <SectionImg label={imageLabel} height={imageHeight} src={imageSrc} alt={imageAlt} objectFit={imageObjectFit} />
          )}
        </FadeIn>
      )}
      {statNum && (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `0 ${gx}px` }}>
          <FadeIn delay={0.1}>
            <StatBlock num={statNum} label={statLabel} sub={statSub} />
          </FadeIn>
        </div>
      )}
      {afterStatContent && (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `24px ${gx}px ${showDemoButton ? 36 : 80}px` }}>
          <FadeIn>
            {afterStatContent}
          </FadeIn>
        </div>
      )}
      {showDemoButton && (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${afterStatContent ? 0 : 40}px ${gx}px 80px` }}>
          <FadeIn>
            <DemoBtn />
          </FadeIn>
        </div>
      )}
    </div>
  );
}

// ── SECTION 01 — DIAGNOSE FASTER ─────────────────────────────────────────────
function DiagnoseModalitiesTable() {
  const narrow = useIsNarrowLayout();
  const rows = [
    { title: 'Video capture', body: 'Hold your phone up to a machine. Arkim reads smoke, cracks, vibration, and fluid leaks from the video automatically.' },
    { title: 'Audio capture', body: 'Unusual sound from a pump? Arkim listens to the frequency and compares it to what healthy equipment should sound like.' },
    { title: 'AI chat assistant', body: "Ask Arkim what's wrong in plain language. It pulls from the equipment manual, your past repair logs, and asset history to give you an answer in seconds." },
    { title: 'Pre-diagnosed repair summary', body: "Before a technician touches the machine, they already know what's wrong, what part is needed, and what the manual says to do." },
  ];
  return (
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-card)' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th
                scope="row"
                style={{
                  padding: narrow ? '18px 14px' : '22px 20px',
                  fontFamily: 'var(--sans)',
                  fontSize: narrow ? '17px' : '18px',
                  fontWeight: 600,
                  color: 'var(--fg)',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  width: narrow ? '38%' : '34%',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                  borderRight: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                }}
              >{row.title}</th>
              <td
                style={{
                  padding: narrow ? '18px 14px' : '22px 22px',
                  fontFamily: 'var(--body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--fg-muted)',
                  lineHeight: 1.65,
                  verticalAlign: 'top',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                  background: 'var(--bg-card)',
                  textWrap: 'pretty',
                }}
              >{row.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function S01() {
  return (
    <Section
      id="s01"
      splitIntroAlign="left"
      eyebrow="01 — Diagnose Faster"
      headline="Your team already has everything they need to diagnose equipment. They just need Arkim."
      sub="The phone in your technician's pocket is a diagnostic sensor. Point it at a machine, describe what you're hearing or seeing, and Arkim tells you what's wrong — and what to do about it."
      splitMediaMatchTable
      showDemoButton={false}
      sideBySideGifs={[
        {
          videoSrc: 'https://assets.arkim.ai/how-it-works-funnel-blk.mp4',
          alt: 'Diagram: video, audio, and chat inputs converging into Arkim data ingestion',
          ingestLightFrame: true,
        },
      ]}
    >
      <DiagnoseModalitiesTable />
    </Section>
  );
}

// ── SECTION 02 — CAPTURE KNOWLEDGE ───────────────────────────────────────────
function S02() {
  return (
    <Section
      id="s02"
      splitIntroAlign="left"
      mobileMediaFirst
      eyebrow="02 — Capture Knowledge Automatically"
      headline="Every repair your team does is a permanent company asset. Right now, most of it disappears when they clock out."
      sub="Arkim captures every repair, every inspection, every compliance check — automatically. When your most experienced technician retires, their knowledge stays."
      sideBySideGifs={[
        { src: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/mobile-2.gif', alt: 'Arkim mobile capture workflow', phoneMockup: true },
        { src: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/mobile-1.gif', alt: 'Arkim mobile app on the plant floor', phoneMockup: true },
      ]}
      statNum="The 0-day technician."
      statLabel="Any technician, from day one."
      statSub="With Arkim, any technician can execute at a senior level on their first day — using the knowledge your best people built over years."
      afterStatContent={<ZeroDayTechnicianDiagram />}
      showDemoButton={false}
    >
      <FeaturePills items={[
        { title: 'Repair documentation', body: 'Every repair is logged as it happens. No paperwork. No end-of-shift data entry.' },
        { title: 'Equipment manual ingestion', body: 'Arkim reads your equipment manuals, wiring schematics, and parts lists and makes them searchable in plain language.' },
        { title: 'Daily compliance checks', body: 'Operators complete digital checklists on their phone, with photo and video attached. Every check is logged and searchable.' },
        { title: 'Tribal knowledge capture', body: 'The way your senior technician would diagnose a specific machine quirk? That lives in Arkim now, not just in their head.' },
      ]} />
    </Section>
  );
}

// ── SECTION 03 — EXISTING TOOLS ───────────────────────────────────────────────
const ASSETS = 'https://assets.arkim.ai/integrations';
const INTEGRATION_LOGOS = [
  { name: 'IBM Maximo', src: `${ASSETS}/IBMmaximo-logo.png`, treatment: 'mono' },
  { name: 'Oracle EAM', src: `${ASSETS}/Oracle-Logo.png`, treatment: 'mono' },
  { name: 'Salesforce', src: `${ASSETS}/Salesforce.com_logo.svg`, treatment: 'brand' },
  { name: 'Brightly', src: `${ASSETS}/brightly-logo.png`, treatment: 'mono' },
  { name: 'Fiix', src: `${ASSETS}/fiix-logo.png`, treatment: 'mono' },
  { name: 'Fleetio', src: `${ASSETS}/fleetio-edit-logo.svg`, treatment: 'mono' },
  { name: 'Limble CMMS', src: `${ASSETS}/limble-logo.svg`, treatment: 'mono' },
  {
    name: 'MaintainX',
    lightSrc: `${ASSETS}/maintainx-logo%402x.png`,
    darkSrc: `${ASSETS}/maintainx-wht%402x.png`,
    treatment: 'swap',
  },
  { name: 'UpKeep', src: `${ASSETS}/upkeep-logo.png`, treatment: 'mono' },
];

function IntegrationLogo({ name, src, lightSrc, darkSrc, treatment }) {
  const isLight = useArkimTheme();
  const imgSrc = treatment === 'swap'
    ? (isLight ? lightSrc : darkSrc)
    : src;
  const className = [
    'arkim-int-carousel__logo',
    treatment === 'mono' && 'arkim-int-carousel__logo--mono',
  ].filter(Boolean).join(' ');
  return (
    <div className="arkim-int-carousel__item" title={name}>
      <img className={className} src={imgSrc} alt={name} loading="lazy" decoding="async" />
    </div>
  );
}

function IntegrationLogoCarousel() {
  const reducedMotion = usePrefersReducedMotion();
  const track = reducedMotion ? INTEGRATION_LOGOS : [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];
  return (
    <div className="arkim-int-carousel" role="region" aria-label="Integration partners">
      <div className="arkim-int-carousel__fade arkim-int-carousel__fade--left" aria-hidden="true" />
      <div className="arkim-int-carousel__fade arkim-int-carousel__fade--right" aria-hidden="true" />
      <div className="arkim-int-carousel__viewport">
        <div className={`arkim-int-carousel__track${reducedMotion ? ' arkim-int-carousel__track--static' : ''}`}>
          {track.map((logo, i) => (
            <IntegrationLogo key={`${logo.name}-${i}`} {...logo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function S04() {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  return (
    <div id="s03" style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px 60px` }}>
        <FadeIn>
          <Eyebrow accent>03 — Works With What You Already Have</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '24px', maxWidth: '800px', textWrap: 'balance' }}>
            No rip and replace. Arkim works alongside the systems your team already uses.
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '640px', textWrap: 'pretty', marginBottom: '60px' }}>
            We connect directly to your existing maintenance software. Your data stays where it is. Your team doesn't have to change how they work.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <IntegrationLogoCarousel />
        </FadeIn>
        <FadeIn delay={0.2}>
          <FeaturePills items={[
            { title: 'Two-way sync', body: 'Arkim reads work orders from your maintenance software and writes completed repairs, compliance checks, and updated schedules back automatically.' },
            { title: 'No migration required', body: 'Your historical data, your asset list, your workflows — they all stay in your existing system. Arkim layers on top.' },
          ]} />
        </FadeIn>
      </div>
    </div>
  );
}

// ── ENTERPRISE READY CAROUSEL ───────────────────────────────────────────────
const ENTERPRISE_CARDS = [
  {
    id: '21cfr',
    badge: '21 CFR Part 11 Ready',
    title: 'Pharma Ready',
    detail: 'Validation documentation, IQ/OQ/PQ templates, and audit-trail logging built for regulated pharmaceutical environments. Every action is timestamped, attributed, and exportable for inspection.',
  },
  {
    id: 'food',
    badge: 'FSMA & HACCP',
    title: 'Food & Beverage',
    detail: 'Sanitary equipment checks, corrective actions, and maintenance records structured for FDA food safety audits — not buried in binders on the plant floor.',
  },
  {
    id: 'chemical',
    badge: 'OSHA / EPA Aligned',
    title: 'Chemical & Process',
    detail: 'PSM-covered assets demand documented inspections and traceable repairs. Arkim logs every diagnostic, work order, and compliance check for safety and environmental review.',
  },
  {
    id: 'audit',
    badge: 'Audit-Ready Documentation',
    title: 'Full Traceability',
    detail: 'Every repair, every check, every diagnostic event — fully logged, attributed, and exportable. Nothing falls through the cracks when regulators or customers ask for proof.',
  },
];

function EnterpriseReady() {
  const [active, setActive] = useState(0);
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  const card = ENTERPRISE_CARDS[active];
  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px` }}>
        <FadeIn style={{ marginBottom: '60px' }}>
          <Eyebrow accent>Enterprise Ready</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', textWrap: 'balance' }}>
            Built for regulated industries.
          </h2>
        </FadeIn>
        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1fr 1.6fr',
          gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
        }}>
          {/* Tab list */}
          <div style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            {ENTERPRISE_CARDS.map((c, i) => (
              <button key={c.id} onClick={() => setActive(i)} style={{
                background: active === i ? 'var(--accent-soft)' : 'transparent',
                border: 'none', cursor: 'pointer',
                padding: narrow ? '18px 20px' : '22px 28px',
                borderBottom: i < ENTERPRISE_CARDS.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: active === i ? '3px solid var(--accent)' : '3px solid transparent',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: active === i ? 'var(--accent)' : 'var(--fg-muted)', fontWeight: 500, marginBottom: '6px' }}>{c.badge}</div>
                <div style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 500, color: active === i ? 'var(--fg)' : 'var(--fg-muted)', lineHeight: 1.35, letterSpacing: 'normal' }}>{c.title}</div>
              </button>
            ))}
          </div>
          {/* Detail panel */}
          <div style={{ background: 'var(--bg-card)', padding: narrow ? '32px 22px' : '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: narrow ? undefined : '320px' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 500, marginBottom: '16px' }}>{card.badge}</div>
            <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-card)', fontWeight: 700, letterSpacing: 'var(--title-h3-letter-spacing)', lineHeight: 'var(--heading-line-height)', marginBottom: '20px' }}>{card.title}</div>
            <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, textWrap: 'pretty', maxWidth: '480px' }}>{card.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
const KICKOFF_STEPS = [
  {
    num: '01',
    title: 'Connect your systems',
    body: 'We integrate with your existing maintenance software. No hardware to install. No IT project.',
    flowLabel: 'Connect',
    caption: 'Plug into your CMMS — no hardware, no IT project.',
  },
  {
    num: '02',
    title: 'Load your equipment',
    body: 'Upload your equipment manuals or point us at your asset list. Arkim builds the baseline schedule and knowledge base automatically.',
    flowLabel: 'Load',
    caption: 'Manuals and assets become a living knowledge base.',
  },
  {
    num: '03',
    title: 'Put the phone to work',
    body: 'Operators and technicians start capturing on day one — compliance checks, symptoms, repairs. Every interaction builds the knowledge base.',
    flowLabel: 'Capture',
    caption: 'Operators capture on day one from the floor.',
  },
  {
    num: '04',
    title: 'Arkim gets smarter',
    body: 'Every event, every repair, every captured symptom feeds back into the system. The diagnostic accuracy and maintenance schedule improve automatically over time.',
    flowLabel: 'Smarter',
    caption: 'Every repair makes the next diagnosis sharper.',
  },
];

function KickoffStepsAnimation({ reducedMotion }) {
  const modeClass = reducedMotion
    ? 'arkim-kickoff-anim arkim-kickoff-anim--static'
    : 'arkim-kickoff-anim arkim-kickoff-anim--playing';

  return (
    <div
      className={modeClass}
      role="img"
      aria-label="Connect systems, load equipment, capture on phone, Arkim gets smarter"
    >
      <div className="arkim-kickoff-flow" aria-hidden="true">
        <div className="arkim-kickoff-step">
          <span className="arkim-kickoff-icon arkim-kickoff-icon--connect"><span /></span>
          <span className="arkim-kickoff-label">Connect</span>
        </div>
        <div className="arkim-kickoff-line" />
        <div className="arkim-kickoff-step">
          <span className="arkim-kickoff-icon arkim-kickoff-icon--load" />
          <span className="arkim-kickoff-label">Load</span>
        </div>
        <div className="arkim-kickoff-line" />
        <div className="arkim-kickoff-step">
          <span className="arkim-kickoff-icon arkim-kickoff-icon--phone" />
          <span className="arkim-kickoff-label">Capture</span>
        </div>
        <div className="arkim-kickoff-line" />
        <div className="arkim-kickoff-step arkim-kickoff-step--last">
          <span className="arkim-kickoff-logo-wrap" aria-hidden="true">
            <img
              className="arkim-kickoff-logo arkim-kickoff-logo--light"
              src="https://assets.arkim.ai/hollow-screw-logo%404x.png"
              alt=""
              width={50}
              height={50}
              decoding="async"
            />
            <img
              className="arkim-kickoff-logo arkim-kickoff-logo--dark"
              src="https://assets.arkim.ai/hollow-screw-logo-wht%404x.png"
              alt=""
              width={50}
              height={50}
              decoding="async"
            />
          </span>
          <span className="arkim-kickoff-label">Smarter</span>
        </div>
      </div>
      <p className="arkim-kickoff-caption" aria-hidden="true">
        {KICKOFF_STEPS.map((s, i) => (
          <span key={s.num} className={`arkim-kickoff-cap-${i + 1}`}>{s.caption}</span>
        ))}
      </p>
    </div>
  );
}

function HowItWorks() {
  const narrow = useIsNarrowLayout();
  const reducedMotion = usePrefersReducedMotion();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px` }}>
        <FadeIn style={{ marginBottom: narrow ? '40px' : '56px' }}>
          <Eyebrow>From Kickoff to Live</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', textWrap: 'balance' }}>
            Up and running in days.<br /><em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Not months.</em>
          </h2>
        </FadeIn>
        <div className="arkim-kickoff-section">
          <FadeIn delay={0.08}>
            <KickoffStepsAnimation reducedMotion={reducedMotion} />
          </FadeIn>
          <div
            className="arkim-kickoff-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: narrow ? '1fr' : 'repeat(4, minmax(0, 1fr))',
              gap: '1px',
              background: 'var(--border)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {KICKOFF_STEPS.map((s, i) => (
              <div
                key={i}
                className="arkim-kickoff-card"
                style={{
                  padding: narrow ? '28px 22px' : '40px 36px',
                  height: '100%',
                }}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: '0.12em', color: 'var(--accent)', fontWeight: 500, marginBottom: '20px' }}>{s.num}</div>
                <h3 style={{ fontSize: 'var(--title-h3-sm)', fontWeight: 600, marginBottom: '16px', color: 'var(--step-card-title)' }}>{s.title}</h3>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--step-card-body)', lineHeight: 1.65, textWrap: 'pretty' }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────────────────
function Results() {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  const stats = [
    { num: '65%', label: "of a technician's time is non-wrench time", sub: 'Knowledge gaps and admin burden eat the majority of every shift. Arkim eliminates the search — technicians arrive at the machine knowing exactly what to do.' },
    { num: '80%', label: 'of repair knowledge is undocumented', sub: 'When your best technician leaves, their knowledge leaves with them. Arkim captures every repair in real time and builds a collective memory for every asset.' },
    { num: 'The 0-day technician.', label: 'Any hire. Any experience level.', sub: 'Senior-level knowledge available from the very first shift — not after years on the floor.' },
  ];
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px` }}>
        <FadeIn style={{ marginBottom: '64px' }}>
          <Eyebrow accent>What You Get</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', letterSpacing: 'var(--title-h2-letter-spacing)', lineHeight: 'var(--heading-line-height)', textWrap: 'balance' }}>Results from week one.</h2>
        </FadeIn>
        <div style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{
                background: 'var(--bg-card)', padding: narrow ? '32px 22px' : '48px 40px', height: '100%',
                borderTop: '3px solid var(--accent)',
              }}
              >
                <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-stat-md)', fontWeight: 700, color: 'var(--accent)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-stat-letter-spacing)', marginBottom: '16px' }}>{s.num}</div>
                <h3 style={{ fontSize: 'var(--title-h3-sm)', fontWeight: 600, color: 'var(--fg)', marginBottom: '10px' }}>{s.label}</h3>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, textWrap: 'pretty' }}>{s.sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  const narrow = useIsNarrowLayout();
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="hero-cinematic hero-cinematic--video-bg product-final-cta" style={{
      borderTop: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <HeroBgVideo
        src="https://assets.arkim.ai/factory-video-arkim_1.mp4"
        reducedMotion={reducedMotion}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: narrow ? '72px 22px' : '120px 48px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <FadeIn>
          <Eyebrow center>Let&apos;s Talk</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '20px', textWrap: 'balance', color: 'var(--hero-title)' }}>
            Let&apos;s talk about<br />your facility.
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.7, marginBottom: '40px' }}>
            A 30-minute conversation. We&apos;ll show you exactly what Arkim would look like for your equipment and your team.
          </p>
          <DemoBtn label="Request a Demo" />
          <p style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--p-fg-soft)', marginTop: '20px' }}>No pitch deck. No commitment.</p>
        </FadeIn>
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
// ── APP ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div>
      <ArkimFixedHeader activeLabel="Product" heroOverlay />
      <Hero />
      <StickyAnchorNav />
      <S01 />
      <S02 />
      <S04 />
      <HowItWorks />
      <Results />
      <EnterpriseReady />
      <FinalCTA />
      <ArkimFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
