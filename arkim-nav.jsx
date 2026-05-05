/**
 * Shared site navigation — loaded before page scripts.
 * Exposes window.useViewport, window.usePrefersReducedMotion, window.ArkimNav
 *
 * Full-width frosted bar (institutional / fund-site style); inner row max 1400px.
 */
const { useState, useEffect, useRef } = React;

const NAV_SCROLL_PX = 40;

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
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function ThemeToggle({ mobile = false, lightOnDarkHero = false }) {
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
        color: lightOnDarkHero ? 'rgba(245, 242, 237, 0.78)' : 'var(--fg-muted)',
        border: lightOnDarkHero ? '1px solid rgba(245, 242, 237, 0.35)' : '1px solid var(--border)',
        padding: mobile ? '10px 12px' : '8px 12px',
        minWidth: mobile ? 44 : undefined,
        minHeight: 44,
        fontFamily: 'var(--sans)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

function ArkimNav({ variant = 'internal', activeLabel = null }) {
  const isHome = variant === 'home';
  const { isMobile } = useViewport();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > NAV_SCROLL_PX
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightOnDarkHero, setLightOnDarkHero] = useState(() => {
    if (!isHome || typeof window === 'undefined') return false;
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const vh = window.innerHeight || 800;
    const overHero = window.scrollY < vh * 0.92;
    const transparentBar = window.scrollY <= NAV_SCROLL_PX;
    return light && overHero && transparentBar;
  });

  const links = [
    { label: 'Product', href: 'Arkim Product.html' },
    { label: 'About Us', href: 'Arkim About.html' },
    { label: 'Resources', href: 'Arkim Resources.html' },
    { label: 'Contact Us', href: 'Arkim Contact.html' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > NAV_SCROLL_PX);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sync = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const vh = window.innerHeight || 800;
      const overHero = window.scrollY < vh * 0.92;
      const transparentBar = window.scrollY <= NAV_SCROLL_PX && !menuOpen;
      setLightOnDarkHero(light && overHero && transparentBar);
    };
    sync();
    const onScroll = () => sync();
    const onTheme = () => sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('arkim-theme', onTheme);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('arkim-theme', onTheme);
    };
  }, [menuOpen, isHome]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const linkColor = (label) => {
    const isActive = activeLabel === label;
    if (lightOnDarkHero) {
      return isActive ? '#f5f2ed' : 'rgba(245, 242, 237, 0.78)';
    }
    return isActive ? 'var(--fg)' : 'var(--fg-muted)';
  };

  const linkWeight = (label) => (activeLabel === label ? 600 : 500);

  const emailColor = lightOnDarkHero ? 'rgba(245, 242, 237, 0.72)' : undefined;

  return (
    <nav
      className="arkim-site-nav"
      data-scrolled={scrolled ? 'true' : 'false'}
      data-menu-open={menuOpen ? 'true' : 'false'}
    >
      <div className="arkim-site-nav__inner">
        <a
          href="index.html"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minHeight: 44 }}
        >
          <img
            src={(window.__resources && window.__resources.logoMark) || 'https://www.arkim.ai/logo-arkim.png'}
            alt="Arkim"
            style={{ height: 28, filter: lightOnDarkHero ? 'brightness(0) invert(1)' : 'none' }}
          />
          <img
            src={(window.__resources && window.__resources.logoText) || 'https://www.arkim.ai/arkim-text-logo.png'}
            alt="Arkim"
            style={{
              height: 17,
              opacity: 0.9,
              filter: lightOnDarkHero ? 'brightness(0) invert(1)' : 'none',
            }}
          />
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
                    e.currentTarget.style.color = lightOnDarkHero ? '#f5f2ed' : 'var(--fg)';
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
            <ThemeToggle lightOnDarkHero={lightOnDarkHero} />
            <span className="arkim-site-nav__email" style={emailColor ? { color: emailColor } : undefined}>
              info@arkim.ai
            </span>
            <span className="arkim-site-nav__rule" aria-hidden="true" />
            <a
              href="https://www.arkim.ai/contact?tab=demo"
              target="_blank"
              rel="noopener noreferrer"
              className="arkim-site-nav__cta"
              style={{
                background: 'var(--accent)',
                color: lightOnDarkHero ? '#000' : 'var(--btn-fg)',
              }}
            >
              Request Demo
            </a>
          </div>
        ) : (
          <div className="arkim-site-nav__tools">
            <ThemeToggle mobile lightOnDarkHero={lightOnDarkHero} />
            <button
              type="button"
              className="arkim-site-nav__menu-btn"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: 'transparent',
                color: lightOnDarkHero ? '#f5f2ed' : 'var(--fg)',
                border: lightOnDarkHero ? '1px solid rgba(245, 242, 237, 0.35)' : '1px solid var(--border)',
                padding: '10px 12px',
                minWidth: 44,
                minHeight: 44,
                fontFamily: 'var(--sans)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.09em',
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
              href="https://www.arkim.ai/contact?tab=demo"
              target="_blank"
              rel="noopener noreferrer"
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
window.ArkimNav = ArkimNav;
