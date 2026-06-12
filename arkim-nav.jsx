/**
 * Shared site navigation — loaded before page scripts.
 * Exposes window.useViewport, window.usePrefersReducedMotion, window.useArkimTheme, window.HeroBgVideo, window.ArkimNav
 *
 * Chrome: transparent over heroes, frosted scrim on scroll (arkim-nav.css + :root tokens).
 * Pass heroOverlay on cinematic hero pages; use ArkimFixedHeader for the fixed shell + spacer.
 */
const { useState, useEffect, useRef } = React;

/** Full-bleed muted loop for cinematic heroes (index, product). Respects reduced motion. */
function HeroBgVideo({ src, poster, reducedMotion = false }) {
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
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
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

function useNavScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
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

function ThemeToggle({ overlay = false }) {
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
        color: overlay ? 'var(--nav-overlay-muted)' : 'var(--fg-muted)',
        border: overlay ? '1px solid var(--nav-overlay-border)' : '1px solid var(--border)',
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

function ArkimNav({ activeLabel = null, heroOverlay = false }) {
  const isLightTheme = useArkimTheme();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useNavScrolled();
  const isSolid = scrolled || menuOpen;
  const isOverlay = heroOverlay && !isSolid;

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
    if (isOverlay) {
      return activeLabel === label ? 'var(--nav-overlay-fg)' : 'var(--nav-overlay-muted)';
    }
    return activeLabel === label ? 'var(--fg)' : 'var(--fg-muted)';
  };

  /* Brand: arkim-side-by-side.svg = light theme; arkim-side-by-side-wht.svg = dark theme / hero overlay. */
  const logoLightSurface =
    (window.__resources && window.__resources.logoSideBySide) || '/uploads/arkim-side-by-side.svg';
  const logoDarkSurface =
    (window.__resources && window.__resources.logoSideBySideWht) || '/uploads/arkim-side-by-side-wht.svg';
  const navLogoSrc = isOverlay || !isLightTheme ? logoDarkSurface : logoLightSurface;

  const navClassName = [
    'arkim-site-nav',
    isSolid ? 'arkim-site-nav--scrolled' : '',
    isOverlay ? 'arkim-site-nav--overlay' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClassName}>
      <div className="arkim-site-nav__inner">
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minHeight: 40 }}
        >
          <img src={navLogoSrc} alt="Arkim" width={89} height={28} style={{ height: 28, width: 'auto', display: 'block' }} />
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
                  className={
                    'arkim-site-nav__link' + (activeLabel === l ? ' arkim-site-nav__link--active' : '')
                  }
                  style={{
                    color: linkColor(l),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isOverlay ? 'var(--nav-overlay-fg)' : 'var(--fg)';
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
            <ThemeToggle overlay={isOverlay} />
            <a
              href="/contactus/#arkim-contact-form"
              className="arkim-btn-primary arkim-btn-primary--sm"
            >
              Request Demo
            </a>
          </div>
        ) : (
          <div className="arkim-site-nav__tools">
            <ThemeToggle overlay={isOverlay} />
            <button
              type="button"
              className="arkim-site-nav__menu-btn"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: 'transparent',
                color: isOverlay ? 'var(--nav-overlay-fg)' : 'var(--fg)',
                border: isOverlay ? '1px solid var(--nav-overlay-border)' : '1px solid var(--border)',
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
                  }}
                >
                  {label}
                </a>
              );
            })}
            <a
              href="/contactus/#arkim-contact-form"
              className="arkim-btn-primary arkim-site-nav__drawer-cta"
            >
              Request Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/** Fixed header shell — pass heroOverlay on cinematic hero pages (no spacer; hero clears nav via padding). */
function ArkimFixedHeader({ activeLabel = null, heroOverlay = false, children = null }) {
  return (
    <>
      <div className="arkim-fixed-header">
        {children}
        <ArkimNav activeLabel={activeLabel} heroOverlay={heroOverlay} />
      </div>
      {!heroOverlay && <div className="arkim-fixed-header__spacer" aria-hidden="true" />}
    </>
  );
}

window.useViewport = useViewport;
window.useNavScrolled = useNavScrolled;
window.usePrefersReducedMotion = usePrefersReducedMotion;
window.useArkimTheme = useArkimTheme;
window.HeroBgVideo = HeroBgVideo;
window.ArkimNav = ArkimNav;
window.ArkimFixedHeader = ArkimFixedHeader;
