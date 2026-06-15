// Arkim Homepage — Section Components
// Exports all sections to window for use in main HTML file
// Typography: Acumin Extra Condensed headings (uppercase) + Proxima Nova body/subtext; sizes from :root tokens (--title-display, --title-section, --title-card, --text-body, …).

const { useState, useEffect, useRef } = React;
const useViewport = window.useViewport;
const usePrefersReducedMotion = window.usePrefersReducedMotion;
const useArkimTheme = window.useArkimTheme;
const HeroBgVideo = window.HeroBgVideo;

// ─── UTILS ──────────────────────────────────────────────────────────────────

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
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
      ...style
    }}>{children}</div>
  );
}

function Eyebrow({ children, accent = true, center = false }) {
  const className = [
    'arkim-section-caption',
    !accent && 'arkim-section-caption--muted',
    center && 'arkim-section-caption--center',
  ].filter(Boolean).join(' ');
  return <div className={className}>{children}</div>;
}

function ListCheckIcon({ color = 'currentColor', size = 20 }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} style={{ flexShrink: 0, display: 'block' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ListXIcon({ color = 'currentColor', size = 20 }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} style={{ flexShrink: 0, display: 'block' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

// ─── DEMO VIDEO MODAL ───────────────────────────────────────────────────────

const VIMEO_DEMO_ID = '1177525108';
const vimeoDemoEmbedUrl = (autoplay) =>
  `https://player.vimeo.com/video/${VIMEO_DEMO_ID}?autoplay=${autoplay ? 1 : 0}&playsinline=1&title=0&byline=0&portrait=0&color=3C7AAC`;

function DemoVideoModal({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="arkim-video-modal" onClick={onClose}>
      <div
        className="arkim-video-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Arkim product demo video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="arkim-video-modal__close"
          onClick={onClose}
          aria-label="Close video"
        >×</button>
        <div className="arkim-video-modal__frame">
          <iframe
            src={vimeoDemoEmbedUrl(true)}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Arkim AI Product Demo"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── PARTNERS ───────────────────────────────────────────────────────────────

const BACKED_BY_PARTNERS = [
  { href: 'https://www.nvidia.com/en-us/startups/', label: 'NVIDIA Inception', logo: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/nvidia-inception.png' },
  { href: 'https://www.databricks.com/build-and-launch/startups', label: 'Databricks for Startups', logo: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/databricks-logo.svg' },
  { href: 'https://aws.amazon.com/activate/', label: 'AWS Activate', logo: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/aws-activate.svg' },
];

// ─── HERO ───────────────────────────────────────────────────────────────────

function Hero() {
  const { isMobile, isTablet } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  const [demoOpen, setDemoOpen] = useState(false);
  const heroPad = isMobile
    ? 'calc(120px + var(--arkim-nav-offset)) 20px 72px'
    : isTablet
      ? 'calc(132px + var(--arkim-nav-offset)) 40px 80px'
      : 'calc(140px + var(--arkim-nav-offset)) 48px 84px';
  return (
    <div className="hero-cinematic hero-cinematic--video-bg" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: heroPad,
      overflow: 'hidden',
    }}>
      <HeroBgVideo
        src="https://assets.arkim.ai/arkim-banner-video-home.mp4"
        poster="https://assets.arkim.ai/arkim-banner-video-home-poster.webp"
        reducedMotion={reducedMotion}
      />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', width: '100%', textAlign: 'center' }}>
        <FadeIn delay={0.1}>
          <h1 className="hero-h1">
            <span style={{ color: 'var(--hero-title)', display: 'block' }}>Industrial maintenance,</span>
            <span style={{ color: 'var(--hero-title)', display: 'block' }}>re-leveraged.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.25}>
          <p className="hero-lead arkim-subhead">
            Arkim gives any technician senior-level knowledge from day one — using the phone in their pocket as the diagnostic sensor.
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="arkim-btn-primary" onClick={() => setDemoOpen(true)}>
              PLAY VIDEO
            </button>
            <a
              href="https://show.arkim.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="arkim-btn-outline arkim-btn-outline--pill"
            >
              Product Deck
            </a>
          </div>
        </FadeIn>
      </div>
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

// ─── BACKED BY ──────────────────────────────────────────────────────────────

function BackedByStrip() {
  return (
    <section className="arkim-backed-by" aria-label="Backed by">
      <div className="arkim-backed-by__inner">
        <p className="arkim-backed-by__label">Backed by</p>
        <ul className="arkim-backed-by__logos">
          {BACKED_BY_PARTNERS.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                className="arkim-backed-by__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.label}
              >
                <img src={p.logo} alt="" width={112} height={22} loading="lazy" decoding="async" />
                <span className="arkim-backed-by__name">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── INDUSTRIES STRIP ───────────────────────────────────────────────────────

function IndustriesStrip() {
  const reducedMotion = usePrefersReducedMotion();
  const items = ['Pharmaceutical CDMOs', 'Food & Beverage Producers', 'Contract Manufacturers', 'Industrial OEMs', 'Maintenance Service Companies', 'Chemical Processing Plants', 'Automotive Suppliers', 'Energy & Utilities'];
  const all = [...items, ...items, ...items];
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 0', overflow: 'hidden' }}>
      <Eyebrow center>Built For</Eyebrow>
      {reducedMotion ? (
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '10px 18px', padding: '0 16px', maxWidth: '920px', margin: '0 auto',
        }}>
          {items.map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
              color: 'var(--fg-muted)', textAlign: 'center',
            }}>{item}</span>
          ))}
        </div>
      ) : (
      <div style={{ display: 'flex', gap: '48px', width: 'max-content', animation: 'marquee 50s linear infinite' }}>
        {all.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
            color: 'var(--fg-muted)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{item}</span>
        ))}
      </div>
      )}
    </div>
  );
}

// ─── THE LEVER ──────────────────────────────────────────────────────────────

function TheLever() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  return (
    <section style={{ padding: `96px ${sectionPaddingX}px`, maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '42px' : '100px', alignItems: 'start' }}>
        <FadeIn>
          <div>
            <Eyebrow>Why Arkim</Eyebrow>
            <h2 style={{
              fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-display)',
              lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
              color: 'var(--fg)', textWrap: 'balance',
            }}>
              The maintenance<br />workforce is shrinking.<br />
              <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>The equipment isn't.</em>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ paddingTop: '8px' }}>
            <p style={{
              fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
              color: 'var(--p-fg)', lineHeight: 1.75, marginBottom: '28px', textWrap: 'pretty',
            }}>
              Senior technicians are retiring. Tribal knowledge is walking out the door. New hires take years to reach journey-level. Meanwhile, every facility is asked to do more with less.
            </p>
            <p style={{
              fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
              color: 'var(--p-fg)', lineHeight: 1.75, textWrap: 'pretty',
            }}>
              Arkim is the lever — any technician, on their first day, executes with the knowledge your most experienced people spent years building. The phone in their pocket is the sensor. The platform is the brain.
            </p>
            <div
              style={{ marginTop: '48px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}
              onMouseEnter={e => {
                const im = e.currentTarget.querySelector('img');
                if (im) im.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={e => {
                const im = e.currentTarget.querySelector('img');
                if (im) im.style.transform = 'none';
              }}
            >
              <img
                src="https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/technician-plc.webp"
                alt="Technician operating industrial PLC panel"
                width={395}
                height={222}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'block',
                  transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── DOWNTIME → DIAGNOSE → FIX (animated) ───────────────────────────────────

function DowntimeResolveAnimation({ reducedMotion }) {
  const modeClass = reducedMotion
    ? 'arkim-downtime-anim arkim-downtime-anim--static'
    : 'arkim-downtime-anim arkim-downtime-anim--playing';

  return (
    <div
      className={modeClass}
      role="img"
      aria-label="Line down, capture on phone, Arkim diagnoses, right part and fix"
    >
      <div className="arkim-flow" aria-hidden="true">
        <div className="arkim-flow-step">
          <span className="arkim-flow-icon arkim-flow-icon--down" />
          <span className="arkim-flow-label">Line down</span>
        </div>
        <div className="arkim-flow-line" />
        <div className="arkim-flow-step">
          <span className="arkim-flow-icon arkim-flow-icon--phone" />
          <span className="arkim-flow-label">Capture</span>
        </div>
        <div className="arkim-flow-line" />
        <div className="arkim-flow-step">
          <span className="arkim-flow-logo-wrap" aria-hidden="true">
            <img
              className="arkim-flow-logo arkim-flow-logo--light"
              src="https://assets.arkim.ai/hollow-screw-logo%404x.png"
              alt=""
              width={60}
              height={60}
              decoding="async"
            />
            <img
              className="arkim-flow-logo arkim-flow-logo--dark"
              src="https://assets.arkim.ai/hollow-screw-logo-wht%404x.png"
              alt=""
              width={60}
              height={60}
              decoding="async"
            />
          </span>
          <span className="arkim-flow-label">Diagnose</span>
        </div>
        <div className="arkim-flow-line" />
        <div className="arkim-flow-step arkim-flow-step--last">
          <span className="arkim-flow-icon arkim-flow-icon--fix" />
          <span className="arkim-flow-label">Right part + fix</span>
        </div>
      </div>
      <p className="arkim-flow-caption" aria-hidden="true">
        <span className="arkim-flow-cap-1">Something breaks on the floor.</span>
        <span className="arkim-flow-cap-2">Symptoms captured on a phone.</span>
        <span className="arkim-flow-cap-3">Arkim finds the fault.</span>
        <span className="arkim-flow-cap-4">Right part in hand. Line back up.</span>
      </p>
    </div>
  );
}

function DowntimeResolve() {
  const { isMobile, isTablet } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;

  return (
    <section style={{
      padding: isMobile ? `72px ${sectionPaddingX}px` : `96px ${sectionPaddingX}px`,
      maxWidth: '1300px',
      margin: '0 auto',
      borderTop: '1px solid var(--border)',
    }}>
      <div
        className="arkim-downtime-resolve-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: isMobile ? '36px' : '64px',
          alignItems: 'stretch',
        }}
      >
        <FadeIn style={{ order: isMobile ? 2 : 1, display: 'flex', minHeight: isMobile ? undefined : '100%' }}>
          <DowntimeResolveAnimation reducedMotion={reducedMotion} />
        </FadeIn>
        <FadeIn delay={0.1} style={{ order: isMobile ? 1 : 2 }}>
          <div>
            <Eyebrow accent>How it works</Eyebrow>
            <h2 style={{
              fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)',
              lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
              color: 'var(--fg)', textWrap: 'balance', marginBottom: '16px',
            }}>
              Diagnose before you dispatch.<br />
              <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Fix with the right part.</em>
            </h2>
            <p style={{
              fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
              color: 'var(--p-fg)', lineHeight: 1.75, margin: 0, textWrap: 'pretty',
              maxWidth: isMobile ? 'none' : '480px',
            }}>
              When a line stops, guesswork costs hours — wrong diagnosis, wrong parts, another wait. Arkim turns what the operator sees and hears into a clear repair plan before the technician rolls a cart.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── PERSONAS ───────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    role: 'Operators',
    context: 'Front-line workers on the floor',
    image: 'https://assets.arkim.ai/industrial-operator-2.webp',
    imagePosition: 'center 20%',
    outcomes: [
      'Troubleshoot minor events with the AI assistant — in plain language',
      'Capture symptoms via phone: video, audio, photo in seconds',
      'Raise a work order directly from the floor — symptoms, photos, and audio already attached',
    ],
  },
  {
    role: 'Technicians',
    context: 'Maintenance teams doing the repair',
    image: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/siemans-tech-ss.webp',
    imagePosition: 'center 30%',
    outcomes: [
      'Receive pre-diagnosed work orders — the diagnostic work is done before you touch the machine',
      'Hands-free guidance during active repairs',
      'Document fixes once. That knowledge is reused forever.',
    ],
  },
  {
    role: 'Management',
    context: 'Plant managers and ops leadership',
    image: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/facility-manager.webp',
    imagePosition: 'center 25%',
    outcomes: [
      'Equipment onboarding and OEM baseline scheduling out of the box',
      'Maintenance frequency optimization across the full asset base',
      'Asset intelligence dashboards — reliability, trends, cost',
    ],
  },
];

function Personas() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  const columns = isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(3, minmax(0, 1fr))';
  const cardPad = isMobile ? '24px' : '28px';
  return (
    <section style={{ padding: `96px ${sectionPaddingX}px`, maxWidth: '1300px', margin: '0 auto' }}>
      <FadeIn>
        <Eyebrow>Who Uses Arkim</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)',
          lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
          marginBottom: isMobile ? '40px' : '56px', textWrap: 'balance', maxWidth: '720px',
        }}>
          Operators. Technicians.<br />
          Management. <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>One platform.</em>
        </h2>
      </FadeIn>
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns,
        gap: isMobile ? '20px' : '24px',
        alignItems: 'stretch',
      }}>
        {PERSONAS.map((p, i) => (
          <FadeIn key={p.role} delay={i * 0.1}>
            <article
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '5 / 3', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={p.image}
                  alt=""
                  width={400}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: p.imagePosition || 'center center',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{
                padding: cardPad,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 'var(--title-h3-md)',
                      fontWeight: 700,
                      letterSpacing: 'var(--title-h3-letter-spacing)',
                      lineHeight: 'var(--heading-line-height)',
                      color: 'var(--fg)',
                      marginBottom: '6px',
                    }}>{p.role}</h3>
                    <p style={{
                      fontFamily: 'var(--body)',
                      fontSize: 'var(--text-caption)',
                      fontWeight: 400,
                      color: 'var(--fg-muted)',
                      lineHeight: 1.45,
                    }}>{p.context}</p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 'var(--text-eyebrow-size)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <ul style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}>
                  {p.outcomes.map((o, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'flex-start',
                        paddingTop: j > 0 ? '16px' : 0,
                        marginTop: j > 0 ? '16px' : 0,
                        borderTop: j > 0 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <span style={{
                        width: '3px',
                        alignSelf: 'stretch',
                        minHeight: '20px',
                        borderRadius: '2px',
                        background: 'var(--accent)',
                        flexShrink: 0,
                        marginTop: '3px',
                      }} aria-hidden="true" />
                      <p style={{
                        fontFamily: 'var(--body)',
                        fontSize: 'var(--text-body)',
                        fontWeight: 400,
                        color: 'var(--p-fg)',
                        lineHeight: 1.6,
                        textWrap: 'pretty',
                        margin: 0,
                      }}>{o}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── INTEGRATION STRIP ──────────────────────────────────────────────────────

function IntegrationStrip() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  const systems = ['IBM Maximo', 'Fiix', 'UpKeep', 'Limble CMMS', 'MaintainX', 'Oracle EAM', 'Fleetio', 'Brightly', 'SAP PM', 'eMaint'];
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `0 ${sectionPaddingX}px`, marginBottom: '48px' }}>
        <FadeIn>
          <Eyebrow>Coexists With Your Stack</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)',
            lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
            marginBottom: '16px', textWrap: 'balance',
          }}>No rip and replace.</h2>
          <p style={{
            fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
            color: 'var(--p-fg)', lineHeight: 1.7, maxWidth: '560px', textWrap: 'pretty',
          }}>
            Read/write integration with the legacy CMMS and ERP systems your team already runs. Arkim layers on top — your existing data, processes, and workflows stay intact.
          </p>
        </FadeIn>
      </div>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `0 ${sectionPaddingX}px` }}>
        <FadeIn delay={0.1}>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: '1px', background: 'var(--border)',
            border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
          }}>
            {systems.map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', padding: '32px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
                color: 'var(--fg-ghost)', textAlign: 'center',
                transition: 'color 0.25s, background 0.25s', cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--card-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-ghost)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >{s}</div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── TIME TO VALUE ──────────────────────────────────────────────────────────

function TimeToValue() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  return (
    <section style={{ padding: `96px ${sectionPaddingX}px`, maxWidth: '1300px', margin: '0 auto' }}>
      <FadeIn>
        <Eyebrow>Why Not Sensors</Eyebrow>
        <h2 style={{
          fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)',
          lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
          marginBottom: '64px', textWrap: 'balance',
        }}>ROI in week one.<br />Not month six.</h2>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
        {[
          {
            label: 'Legacy platforms',
            accent: false,
            items: [
              ['Months of hardware installation', false],
              ['Quarters of data collection before value', false],
              ['Value at month 6+', false],
              ['Significant upfront capital expenditure', false],
            ],
          },
          {
            label: 'Arkim',
            accent: true,
            items: [
              ['Days to deploy — no hardware at all', true],
              ['Knowledge capture from day one', true],
              ['Value in week one: training acceleration, downtime reduction, repair documentation', true],
              ['No upfront hardware cost', true],
            ],
          },
        ].map((col, ci) => (
          <FadeIn key={ci} delay={ci * 0.15}>
            <div style={{
              background: col.accent ? 'var(--accent-soft)' : 'var(--bg-card)',
              border: `1px solid ${col.accent ? 'var(--accent-border)' : 'var(--border)'}`,
              borderRadius: '16px', padding: '48px 40px', height: '100%',
            }}>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)',
                textTransform: 'uppercase', color: col.accent ? 'var(--accent)' : 'var(--fg-muted)',
                marginBottom: '28px', fontWeight: 500,
              }}>{col.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {col.items.map(([text, good], ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0 }} aria-hidden="true">
                      {col.accent && good
                        ? <ListCheckIcon color="var(--accent)" />
                        : <ListXIcon color="#e85d5d" />}
                    </div>
                    <p style={{
                      fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
                      color: 'var(--fg)',
                      lineHeight: 1.6, textWrap: 'pretty',
                    }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── COMPLIANCE & TRUST ──────────────────────────────────────────────────────

const TRUST_CARDS = [
  {
    badge: '21 CFR Part 11 Ready',
    title: 'Pharma Ready',
    body: 'Validation documentation, IQ/OQ/PQ templates, and audit-trail logging built for regulated pharmaceutical environments. Every action is timestamped, attributed, and exportable for inspection.',
  },
  {
    badge: 'FSMA & HACCP',
    title: 'Food & Beverage',
    body: 'Sanitary equipment checks, corrective actions, and maintenance records structured for FDA food safety audits — not buried in binders on the plant floor.',
  },
  {
    badge: 'OSHA / EPA Aligned',
    title: 'Chemical & Process',
    body: 'PSM-covered assets demand documented inspections and traceable repairs. Arkim logs every diagnostic, work order, and compliance check for safety and environmental review.',
  },
  {
    badge: 'Audit-Ready Documentation',
    title: 'Full Traceability',
    body: 'Every repair, every check, every diagnostic event — fully logged, attributed, and exportable. Nothing falls through the cracks when regulators or customers ask for proof.',
  },
];

function ComplianceTrust() {
  const { isMobile, isTablet } = useViewport();
  const reducedMotion = usePrefersReducedMotion();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => {
    if (reducedMotion) return;
    timerRef.current = setInterval(() => setActive(a => (a + 1) % TRUST_CARDS.length), 3000);
    return () => clearInterval(timerRef.current);
  }, [reducedMotion]);
  const handleClick = (i) => {
    clearInterval(timerRef.current);
    setActive(i);
    if (!reducedMotion) {
      timerRef.current = setInterval(() => setActive(a => (a + 1) % TRUST_CARDS.length), 3000);
    }
  };
  const card = TRUST_CARDS[active];
  return (
    <div style={{ padding: '120px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${sectionPaddingX}px` }}>
        <FadeIn style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Eyebrow center>Enterprise Ready</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)', letterSpacing: 'var(--title-h2-letter-spacing)', lineHeight: 'var(--heading-line-height)', textWrap: 'balance' }}>Built for regulated industries.</h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            {TRUST_CARDS.map((c, i) => (
              <button key={c.badge} onClick={() => handleClick(i)} style={{
                background: active === i ? 'var(--accent-soft)' : 'transparent',
                border: 'none', cursor: 'pointer', padding: '22px 28px',
                borderBottom: i < TRUST_CARDS.length - 1 ? '1px solid var(--border)' : 'none',
                borderLeft: active === i ? '3px solid var(--accent)' : '3px solid transparent',
                textAlign: 'left', transition: 'background 0.15s',
              }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: active === i ? 'var(--accent)' : 'var(--fg-muted)', fontWeight: 500, marginBottom: '6px' }}>{c.badge}</div>
                <div style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 500, color: active === i ? 'var(--fg)' : 'var(--fg-muted)', lineHeight: 1.35, letterSpacing: 'normal' }}>{c.title}</div>
                {active === i && (
                  <div style={{ marginTop: 10, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div key={active} style={{
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 2,
                      width: reducedMotion ? '100%' : undefined,
                      animation: reducedMotion ? 'none' : 'trustProgress 3s linear forwards',
                    }} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '320px' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 500, marginBottom: '16px' }}>{card.badge}</div>
            <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-card)', fontWeight: 700, letterSpacing: 'var(--title-h3-letter-spacing)', lineHeight: 'var(--heading-line-height)', marginBottom: '20px' }}>{card.title}</div>
            <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, textWrap: 'pretty', maxWidth: '480px' }}>{card.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP TEASE ───────────────────────────────────────────────────────────

function RoadmapTease() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  return (
    <section style={{ padding: `96px ${sectionPaddingX}px`, maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '100px', alignItems: 'center' }}>
        <FadeIn>
          <Eyebrow>What's Next</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-section)',
            lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '24px', textWrap: 'balance',
          }}>Coming next:<br /><em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>agentic procurement.</em></h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', border: '1px solid var(--border)',
            borderRadius: '100px', fontFamily: 'var(--body)', fontSize: 'var(--text-micro)',
            color: 'var(--fg-muted)', marginTop: '24px',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-dot)' }} />
            In development
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p style={{
            fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
            color: 'var(--p-fg)', lineHeight: 1.75, textWrap: 'pretty',
          }}>
            Once Arkim diagnoses a root cause, the next logical step is sourcing the part. Our procurement agent prototype scores replacement options on total cost of acquisition and total lifecycle value, preserves OEM warranty by routing through authorized distributors, and updates inventory in your CMMS automatically.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  const { isMobile, isTablet } = useViewport();
  const sectionPaddingX = isMobile ? 20 : isTablet ? 40 : 80;
  return (
    <div id="cta" style={{
      borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(to bottom, var(--final-cta-1), var(--final-cta-2))',
    }}>
      <div style={{
        maxWidth: '1300px', margin: '0 auto', padding: `96px ${sectionPaddingX}px`,
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '42px' : '100px', alignItems: 'center',
        position: 'relative',
      }}>
        <FadeIn>
          <div className="arkim-cta-photo">
            <img
              src="https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/tom-pfp-1500px.webp"
              alt="Tom Dickie, CEO, Arkim AI"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: '20px', fontFamily: 'var(--body)', fontSize: 'var(--text-caption)', color: 'var(--fg-muted)' }}>
            Tom Dickie, CEO, Arkim AI
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Eyebrow>Let's Talk</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-display)',
            lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)',
            marginBottom: '24px', textWrap: 'balance',
          }}>Tell us about<br />your facility.</h2>
          <p style={{
            fontFamily: 'var(--body)', fontSize: 'var(--text-body)', fontWeight: 400,
            color: 'var(--p-fg)', lineHeight: 1.7, marginBottom: '40px', textWrap: 'pretty',
          }}>
            A 30-minute conversation about your current maintenance operation, where Arkim could fit, and what a deployment would look like. No pitch deck.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
            <a href="/contactus/" className="arkim-btn-primary">Book a Consultation →</a>
            <span style={{
              fontFamily: 'var(--body)', fontSize: 'var(--text-caption)',
              color: 'var(--fg-muted)',
            }}>or email <a href="mailto:info@arkim.ai" style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>info@arkim.ai</a></span>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

Object.assign(window, {
  ArkimHero: Hero,
  ArkimBackedByStrip: BackedByStrip,
  ArkimIndustriesStrip: IndustriesStrip,
  ArkimTheLever: TheLever,
  ArkimDowntimeResolve: DowntimeResolve,
  ArkimPersonas: Personas,
  ArkimIntegrationStrip: IntegrationStrip,
  ArkimTimeToValue: TimeToValue,
  ArkimComplianceTrust: ComplianceTrust,
  ArkimRoadmapTease: RoadmapTease,
  ArkimFinalCTA: FinalCTA,
});
