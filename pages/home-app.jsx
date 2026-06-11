const { useState, useEffect, useRef } = React;
const {
  useViewport,
  ArkimNav,
  ArkimFooter,
  ArkimHero,
  ArkimIndustriesStrip,
  ArkimTheLever,
  ArkimPersonas,
  ArkimTimeToValue,
  ArkimComplianceTrust,
  ArkimFinalCTA,
} = window;

function AnnouncementBar({ onDismiss }) {
  const { isMobile } = useViewport();
  return (
    <div style={{
      background: 'var(--announce-bg)', borderBottom: '1px solid var(--announce-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '10px 44px 10px 16px' : '10px 48px', gap: 12, position: 'relative',
      minHeight: 44,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-caption)', color: 'var(--fg-muted)', lineHeight: 1.45 }}>
        Arkim AI joins the{' '}
        <a href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          NVIDIA Inception Program
        </a>
        {' '}for AI-driven industrial startups
      </span>
      <span style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-micro)', color: 'var(--accent)' }}>→</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss announcement" style={{
        position: 'absolute', right: 20, background: 'none',
        border: 'none', color: 'var(--fg-muted)', cursor: 'pointer',
        fontSize: '18px', lineHeight: 1, padding: '8px', minWidth: 44, minHeight: 44,
      }}>×</button>
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--border)', margin: '0' }} />;
}

function App() {
  const headerRef = useRef(null);
  const [announceVisible, setAnnounceVisible] = useState(false);
  const [announceHeight, setAnnounceHeight] = useState(0);

  useEffect(() => {
    if (!announceVisible || !headerRef.current) {
      setAnnounceHeight(0);
      return;
    }
    const readHeight = () => {
      setAnnounceHeight(headerRef.current ? headerRef.current.getBoundingClientRect().height : 0);
    };
    readHeight();
    const observer = new ResizeObserver(readHeight);
    observer.observe(headerRef.current);
    window.addEventListener('resize', readHeight, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', readHeight);
    };
  }, [announceVisible]);

  return (
    <div>
      <div ref={headerRef} className="arkim-fixed-header">
        {announceVisible && <AnnouncementBar onDismiss={() => setAnnounceVisible(false)} />}
        <ArkimNav heroOverlay={!announceVisible} />
      </div>
      {announceVisible && announceHeight > 0 && (
        <div style={{ height: announceHeight }} aria-hidden="true" />
      )}
      <ArkimHero />
      <ArkimIndustriesStrip />
      <ArkimTheLever />
      <Divider />
      <ArkimPersonas />
      <Divider />
      <ArkimTimeToValue />
      <ArkimComplianceTrust />
      <ArkimFinalCTA />
      <ArkimFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
