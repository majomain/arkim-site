/**
 * Shared site navigation — loaded before page scripts.
 * Exposes window.useViewport, window.usePrefersReducedMotion, window.useArkimTheme, window.HeroBgVideo, window.ArkimNav
 *
 * All chrome is universal: appearance comes from arkim-nav.css + :root theme tokens
 * (index.html or arkim-theme.css). Pages only pass activeLabel for the current route.
 */
const { useState, useEffect, useRef } = React;

const HERO_BG_VIDEO_SRC = 'https://assets.arkim.ai/ARKIM-Main-Edit-NO-COPY-NO-AUDIO.mp4';

/** Full-bleed muted loop for cinematic heroes (index, product). Respects reduced motion. */
function HeroBgVideo({ reducedMotion = false }) {
  const videoRef = useRef(null);

  const tryPlay = () => {
    const v = videoRef.current;
    if (!v || reducedMotion) return;
    v.muted = true;
    v.play().catch(() => {});
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
      return;
    }
    tryPlay();
    v.addEventListener('loadeddata', tryPlay, { once: true });
    v.addEventListener('canplay', tryPlay, { once: true });
    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="hero-bg-video-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-bg-video"
          src={HERO_BG_VIDEO_SRC}
          muted
          loop
          playsInline
          autoPlay
          preload={reducedMotion ? 'metadata' : 'auto'}
          tabIndex={-1}
          onCanPlay={tryPlay}
        />
      </div>
      <div className="hero-cinematic-scrim" aria-hidden="true" />
    </>
  );
}

function useViewport() {
  const getWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    isMobile: width <= 768,
    isTablet: width <= 1024,
    isNarrowLayout: width <= 900,
  };
}

function usePrefersReducedMotion() {
  const getInitial = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

function useArkimTheme() {
  const [isLight, setIsLight] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
  );
  useEffect(() => {
    const sync = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    sync();
    window.addEventListener('arkim-theme', sync);
    return () => window.removeEventListener('arkim-theme', sync);
  }, []);
  return isLight;
}

function DayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function NightIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window.__applyArkimTheme === 'function') {
      window.__applyArkimTheme(next);
    }
  };
  return (
    <button
      type="button"
      className="arkim-site-nav__theme"
      onClick={toggle}
      aria-pressed={theme === 'light'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'transparent',
        color: 'var(--fg-muted)',
        border: '1px solid var(--border)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {theme === 'dark' ? <DayIcon /> : <NightIcon />}
    </button>
  );
}

function ArkimNav({ activeLabel = null }) {
  const isLightTheme = useArkimTheme();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Product', href: '/product/' },
    { label: 'About Us', href: '/about/' },
    { label: 'Resources', href: '/resources/' },
    { label: 'Contact Us', href: '/contactus/' },
  ];

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const linkColor = (label) => {
    const isActive = activeLabel === label;
    return isActive ? 'var(--fg)' : 'var(--fg-muted)';
  };

  const linkWeight = (label) => (activeLabel === label ? 600 : 500);

  /* Brand: arkim-side-by-side.svg = light theme; arkim-side-by-side-wht.svg = dark theme. */
  const logoLightSurface =
    (window.__resources && window.__resources.logoSideBySide) || '/uploads/arkim-side-by-side.svg';
  const logoDarkSurface =
    (window.__resources && window.__resources.logoSideBySideWht) || '/uploads/arkim-side-by-side-wht.svg';
  const navLogoSrc = isLightTheme ? logoLightSurface : logoDarkSurface;

  return (
    <nav className="arkim-site-nav">
      <div className="arkim-site-nav__inner">
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minHeight: 40 }}
        >
          <img src={navLogoSrc} alt="Arkim" style={{ height: 28, width: 'auto', display: 'block' }} />
        </a>

        {!isMobile && (
          <div className="arkim-site-nav__links">
            {links.map(({ label: l, href }) => {
              const isExternal = /^https?:\/\//.test(href);
              return (
                <a
                  key={l}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="arkim-site-nav__link"
                  style={{
                    color: linkColor(l),
                    fontWeight: linkWeight(l),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--fg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor(l);
                  }}
                >
                  {l}
                </a>
              );
            })}
          </div>
        )}

        {!isMobile ? (
          <div className="arkim-site-nav__tools">
            <ThemeToggle />
            <a
              href="/contactus/#arkim-contact-form"
              className="arkim-site-nav__cta"
              style={{
                background: 'var(--accent)',
                color: 'var(--btn-fg)',
              }}
            >
              Request Demo
            </a>
          </div>
        ) : (
          <div className="arkim-site-nav__tools">
            <ThemeToggle />
            <button
              type="button"
              className="arkim-site-nav__menu-btn"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: 'transparent',
                color: 'var(--fg)',
                border: '1px solid var(--border)',
                padding: '8px 10px',
                minWidth: 40,
                minHeight: 40,
                fontFamily: 'var(--sans)',
                fontSize: 'var(--text-micro, 11px)',
                fontWeight: 600,
                letterSpacing: 'var(--text-eyebrow-tracking, 0.09em)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div className="arkim-site-nav__drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {links.map(({ label, href }) => {
              const isExternal = /^https?:\/\//.test(href);
              return (
                <a
                  key={label}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="arkim-site-nav__drawer-link"
                  style={{
                    color: 'var(--fg)',
                    fontWeight: activeLabel === label ? 600 : 500,
                  }}
                >
                  {label}
                </a>
              );
            })}
            <a
              href="/contactus/#arkim-contact-form"
              className="arkim-site-nav__drawer-cta"
              style={{
                background: 'var(--accent)',
                color: 'var(--btn-fg)',
              }}
            >
              Request Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

window.useViewport = useViewport;
window.usePrefersReducedMotion = usePrefersReducedMotion;
window.useArkimTheme = useArkimTheme;
window.HeroBgVideo = HeroBgVideo;
window.ArkimNav = ArkimNav;
