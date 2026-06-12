const { useState, useEffect, useRef } = React;
const { ArkimFixedHeader } = window;
const ArkimFooter = window.ArkimFooter;
const useArkimTheme = window.useArkimTheme;

function useFadeIn() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

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

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, vis] = useFadeIn();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>{children}</div>
  );
}
function Eyebrow({ children }) {
  return <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>{children}</div>;
}

function Hero() {
  const narrow = useIsNarrowLayout();
  return (
    <div
      className="hero-cinematic hero-cinematic--static-texture"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: narrow ? 'calc(120px + var(--arkim-nav-offset)) 16px 72px' : 'calc(140px + var(--arkim-nav-offset)) 48px 80px',
        overflow: 'hidden',
        '--hero-static-texture-image': "url('https://assets.arkim.ai/about-us-banner.webp')",
        '--hero-texture-opacity': 0.55,
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px', width: '100%', padding: narrow ? '0 4px' : undefined }}>
        <div style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
          <h1 className="hero-h1">
            We built Arkim because<br />the problem was personal.
          </h1>
        </div>
        <div style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: narrow ? '32px' : '24px',
            marginTop: narrow ? '36px' : '48px',
            flexWrap: 'wrap',
            flexDirection: narrow ? 'column' : 'row',
          }}>
            {[
              { name: 'Tom Dickie', role: 'CEO', photoSrc: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/tom-pfp-thumb.webp', linkedinUrl: 'https://www.linkedin.com/in/tom-dickie-04746a78/' },
              { name: 'Jacob Ogburn', role: 'Co-founder', photoSrc: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/jacob-pfp-bnw.webp', linkedinUrl: 'https://www.linkedin.com/in/jacob-jotech' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <a
                  href={p.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} on LinkedIn`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <img
                    src={p.photoSrc}
                    alt=""
                    width={100}
                    height={100}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--title-h3-sm)', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--fg)' }}>{p.name}</div>
                </a>
                <div style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-caption)', color: 'var(--fg-muted)' }}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TheProblem() {
  const narrow = useIsNarrowLayout();
  const paras = [
    "80% of repair knowledge is never written down. It lives in the heads of your most experienced people — and walks out the door when they retire.",
    "Legacy maintenance software was built for the office, not the factory floor. The people closest to the equipment have the least support.",
    "Facilities are being asked to do more with smaller, less experienced teams. The tools haven't kept up.",
  ];
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: narrow ? '72px 22px' : '100px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 2fr', gap: narrow ? '32px' : '80px', alignItems: 'start' }}>
          <FadeIn>
            <Eyebrow>The Problem We Saw</Eyebrow>
            <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', textWrap: 'balance' }}>
              Why we built it.
            </h2>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '8px' }}>
            {paras.map((p, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, textWrap: 'pretty', paddingBottom: '32px', borderBottom: i < paras.length - 1 ? '1px solid var(--border)' : 'none' }}>{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatWeBuilt() {
  const narrow = useIsNarrowLayout();
  const layers = [
    { num: '01', title: 'Diagnostic sensing', body: 'The phone as the sensor. Video, audio, and photos capture symptoms from equipment in real time — no hardware required. Any technician can diagnose like a senior from day one.' },
    { num: '02', title: 'Knowledge capture', body: 'Every repair, every compliance check, every inspection — captured automatically and made permanently searchable. The knowledge stays when the person leaves.' },
    { num: '03', title: 'Evolutionary maintenance', body: 'The schedule learns from every event. Arkim observes patterns across minor downtime incidents and adjusts maintenance tasks before failures happen.' },
  ];
  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: narrow ? '72px 22px' : '100px 80px' }}>
        <FadeIn style={{ marginBottom: '60px' }}>
          <Eyebrow>What We Built</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', maxWidth: '640px', textWrap: 'balance' }}>
            Three layers. Each valuable alone.<br />
            <em style={{ fontFamily: 'var(--sans)', fontStyle: 'normal', color: 'var(--accent)', fontWeight: 600 }}>Transformative together.</em>
          </h2>
        </FadeIn>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {layers.map((l, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '80px 1fr', gap: narrow ? '12px' : '40px', padding: narrow ? '28px 0' : '40px 0', borderTop: '1px solid var(--border)', alignItems: 'start' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', fontWeight: 500, letterSpacing: '0.12em', color: 'var(--accent)', paddingTop: '4px' }}>{l.num}</div>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-md)', fontWeight: 600, marginBottom: '12px', letterSpacing: 'var(--title-h3-letter-spacing)' }}>{l.title}</div>
                  <p style={{ fontFamily: 'var(--body)', fontSize: '17px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.7, textWrap: 'pretty', maxWidth: '680px' }}>{l.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

function Team() {
  const narrow = useIsNarrowLayout();
  const isLightTheme = useArkimTheme();
  const [hoveredTeamIndex, setHoveredTeamIndex] = useState(null);
  const people = [
    {
      name: 'Tom Dickie',
      role: 'CEO, Arkim AI',
      photoSrc: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/tom-pfp-thumb.webp',
      linkedinUrl: 'https://www.linkedin.com/in/tom-dickie-04746a78/',
      bio: 'Tom brings deep experience in industrial operations and enterprise software. He founded Arkim after watching facilities struggle to retain critical maintenance knowledge as their most experienced technicians retired.',
    },
    {
      name: 'Jacob Ogburn',
      role: 'Co-founder, Arkim AI',
      photoSrc: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/jacob-pfp-bnw.webp',
      linkedinUrl: 'https://www.linkedin.com/in/jacob-jotech',
      bio: 'Jacob leads operational strategy and user success, focusing on the human side of AI adoption. He works hand-in-hand with frontline operators to ensure Arkim\'s platform solves the practical, daily challenges of the modern factory floor.',
    },
  ];
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: narrow ? '72px 22px' : '100px 80px' }}>
        <FadeIn style={{ marginBottom: '60px' }}>
          <Eyebrow>The Team</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)' }}>Built by people who care about the problem.</h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          {people.map((p, i) => {
            const isHovered = hoveredTeamIndex === i;
            const darkHover = isHovered && !isLightTheme;
            const nameColor = darkHover ? '#F5F2ED' : 'var(--fg)';
            const roleColor = darkHover ? '#7AB5E0' : 'var(--accent)';
            const bioColor = darkHover ? 'rgba(245, 242, 237, 0.78)' : 'var(--p-fg)';
            const avatarBorder = darkHover ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid var(--border)';
            const cardBackground = isHovered
              ? (isLightTheme ? 'rgba(20, 115, 204, 0.1)' : '#1a1a1a')
              : 'var(--bg-card)';
            return (
            <FadeIn key={i} delay={i * 0.12}>
              <a
                href={p.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} on LinkedIn`}
                style={{
                  display: 'block',
                  background: cardBackground,
                  padding: narrow ? '28px 22px' : '48px 44px',
                  height: '100%',
                  transition: 'background 0.2s, color 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredTeamIndex(i)}
                onMouseLeave={() => setHoveredTeamIndex(null)}
              >
                <img
                  src={p.photoSrc}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: avatarBorder,
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    marginBottom: '24px',
                  }}
                />
                <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-md)', fontWeight: 700, marginBottom: '6px', letterSpacing: 'var(--title-h3-letter-spacing)', color: nameColor, transition: 'color 0.2s' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--body)', fontSize: '13px', color: roleColor, fontWeight: 500, letterSpacing: '0.04em', marginBottom: '20px', transition: 'color 0.2s' }}>{p.role}</div>
                <p style={{ fontFamily: 'var(--body)', fontSize: '15px', fontWeight: 400, color: bioColor, lineHeight: 1.7, textWrap: 'pretty', margin: 0, transition: 'color 0.2s' }}>{p.bio}</p>
              </a>
            </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Partners() {
  const narrow = useIsNarrowLayout();
  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: narrow ? '48px 22px' : '80px 80px', display: 'flex', alignItems: 'center', gap: narrow ? '28px' : '60px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', letterSpacing: 'var(--text-eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--fg-muted)', flexShrink: 0 }}>Backed & supported by</div>
        {[
          { src: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/nvidia-inception.png', alt: 'NVIDIA Inception', href: 'https://www.nvidia.com/en-us/startups/' },
          { src: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/databricks-logo.svg', alt: 'Databricks', href: 'https://www.databricks.com/product/startups' },
          { src: 'https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/aws-activate.svg', alt: 'AWS Activate', href: 'https://aws.amazon.com/activate/' },
        ].map((p, i) => (
          <a key={i} href={p.href} target="_blank" rel="noopener">
            <img src={p.src} alt={p.alt} style={{
              height: 28,
              width: 'auto',
              display: 'block',
              opacity: 'var(--partner-logo-opacity)',
              filter: 'var(--partner-logo-filter)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { e.target.style.opacity = 'var(--partner-logo-hover-opacity)'; }}
            onMouseLeave={e => { e.target.style.opacity = 'var(--partner-logo-opacity)'; }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

function CTA() {
  const narrow = useIsNarrowLayout();
  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%)',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: narrow ? '72px 22px' : '120px 48px', textAlign: 'center' }}>
        <FadeIn>
          <Eyebrow>See It in Action</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '20px', textWrap: 'balance' }}>
            Come see it in action.
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.7, marginBottom: '40px' }}>A 30-minute conversation. No pitch deck.</p>
          <a href="/contactus/" className="arkim-btn-primary">Request a Demo →</a>
        </FadeIn>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <ArkimFixedHeader activeLabel="About Us" heroOverlay />
      <Hero />
      <TheProblem />
      <WhatWeBuilt />
      <Team />
      <Partners />
      <CTA />
      <ArkimFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
