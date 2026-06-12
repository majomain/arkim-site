const { useState, useEffect, useRef } = React;
const { ArkimFixedHeader } = window;
const ArkimFooter = window.ArkimFooter;
const useArkimTheme = window.useArkimTheme;
const usePrefersReducedMotion = window.usePrefersReducedMotion;

const HERO_IMPACT_STATS = [
  { value: '50%', label: 'Increase in equipment uptime', source: 'Deloitte Insights' },
  { value: '30%', label: 'Increase in technician proficiency', source: 'Boston Consulting Group' },
  { value: '0', label: 'Your data used to train public models', source: 'Arkim guarantee', displayValue: 'Zero' },
];

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
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(28px)',
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
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
function SectionImg({ label, height = '55vh' }) {
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

const ANCHOR_ITEMS = [
  { num: '01', label: 'Featured report', id: 's01' },
  { num: '02', label: 'Comparison', id: 's02' },
  { num: '03', label: 'Industry impact', id: 's03' },
];

function Hero() {
  const narrow = useIsNarrowLayout();
  const reducedMotion = usePrefersReducedMotion ? usePrefersReducedMotion() : false;
  const heroFade = (delay, children) => (
    <div style={{ animation: reducedMotion ? 'none' : `fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}>
      {children}
    </div>
  );
  return (
    <div className="hero-cinematic hero-cinematic--static-texture" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: narrow ? 'calc(120px + var(--arkim-nav-offset)) 16px 72px' : 'calc(140px + var(--arkim-nav-offset)) 48px 80px', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', width: '100%', textAlign: 'center' }}>
        {heroFade(0.08, (
          <>
            <h1 className="hero-h1">
              <span style={{ color: 'var(--hero-title)', display: 'block' }}>The proof is on</span>
              <span style={{ color: 'var(--hero-title)', display: 'block' }}>the shop floor.</span>
            </h1>
            <p className="hero-lead arkim-subhead" style={{ maxWidth: '640px' }}>
              GenAI drives uptime, technician proficiency, and margin. Arkim is the domain-specific copilot that turns those numbers into daily wins—with your manuals, schematics, and tribal knowledge, never the public internet.
            </p>
          </>
        ))}
        {heroFade(0.28, (
          <div className="resources-hero-stats" role="list" aria-label="Industry impact highlights">
            {HERO_IMPACT_STATS.map((stat, i) => (
              <div
                key={i}
                className="resources-hero-stat"
                role="listitem"
              >
                <div className="resources-hero-stat-value">{stat.displayValue || stat.value}</div>
                <div className="resources-hero-stat-label">{stat.label}</div>
                <div className="resources-hero-stat-source">{stat.source}</div>
              </div>
            ))}
          </div>
        ))}
        {heroFade(0.38, (
          <div style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : `repeat(${ANCHOR_ITEMS.length}, 1fr)`,
            width: '100%',
            maxWidth: narrow ? '100%' : '720px',
            border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
            background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(12px)', margin: '0 auto',
          }}>
            {ANCHOR_ITEMS.map((item, i) => (
              <a key={i} href={`#${item.id}`} style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                padding: narrow ? '16px 18px' : '20px 24px', textDecoration: 'none',
                borderRight: !narrow && i < ANCHOR_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
                borderBottom: narrow && i < ANCHOR_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--subnav-hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
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

function ValueProofStrip() {
  const narrow = useIsNarrowLayout();
  const pillars = [
    { title: 'Purpose-built for maintenance', body: 'Not a chatbot. Arkim reads schematics, wiring diagrams, and OEM manuals—the work general AI cannot do reliably.' },
    { title: 'Senior expertise on day one', body: 'Every technician gets instant access to tribal knowledge and procedures your best people already know.' },
    { title: 'ROI from week one', body: 'Costs less than an hour of technician time. Pays back in fewer escalations, shorter downtime, and faster ramp.' },
  ];
  return (
    <section className="resources-proof-strip" aria-label="Why Arkim">
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: narrow ? '48px 22px' : '64px 80px' }}>
        <FadeIn>
          <Eyebrow accent>The Arkim difference</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-md)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '36px', maxWidth: '720px', textWrap: 'balance' }}>
            Research proves the upside. Arkim is how you capture it.
          </h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)', gap: narrow ? '20px' : '28px' }}>
          {pillars.map((p, i) => (
            <FadeIn key={p.title} delay={0.06 * i}>
              <div>
                <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-sm)', fontWeight: 700, color: 'var(--fg)', marginBottom: '10px', letterSpacing: 'var(--title-h3-letter-spacing)' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--body)', fontSize: '15px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{p.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      {ANCHOR_ITEMS.map((item, i) => (
        <a key={i} href={`#${item.id}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          flexShrink: 0,
          padding: narrow ? '0 14px' : '0 28px', alignSelf: 'stretch', textDecoration: 'none',
          borderRight: i < ANCHOR_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
          borderBottom: active === item.id ? `2px solid var(--accent)` : '2px solid transparent',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--subnav-hover-bg)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <span style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-eyebrow-size)', lineHeight: 1, color: active === item.id ? 'var(--accent)' : 'var(--fg-muted)', fontWeight: 500, letterSpacing: '0.08em' }}>{item.num}</span>
          <span style={{ fontFamily: 'var(--body)', fontSize: '13px', lineHeight: 1, color: active === item.id ? 'var(--fg)' : 'var(--fg-muted)', fontWeight: 400 }}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

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
        }}>
          <h3 style={{ fontSize: 'var(--title-h3-sm)', fontWeight: 600, color: 'var(--fg)', marginBottom: '10px' }}>{item.title}</h3>
          <div style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, textWrap: 'pretty' }}>{item.body}</div>
        </div>
      ))}
    </div>
  );
}

function Section({ id, eyebrow, headline, sub, imageLabel = null, imageHeight = '55vh', showDemoButton = true, children }) {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  return (
    <div id={id} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px ${imageLabel || showDemoButton ? '60px' : '80px'}` }}>
        <FadeIn>
          <Eyebrow accent>{eyebrow}</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '24px', maxWidth: '900px', textWrap: 'balance' }}>{headline}</h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '720px', textWrap: 'pretty', marginBottom: children ? '60px' : '0' }}>{sub}</p>
        </FadeIn>
        {children && <FadeIn delay={0.1}>{children}</FadeIn>}
      </div>
      {imageLabel ? (
        <FadeIn>
          <SectionImg label={imageLabel} height={imageHeight} />
        </FadeIn>
      ) : null}
      {showDemoButton ? (
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `40px ${gx}px 80px` }}>
        <FadeIn>
          <DemoBtn />
        </FadeIn>
      </div>
      ) : null}
    </div>
  );
}

const INDUSTRY_RESEARCH = [
  {
    source: 'Deloitte Insights',
    tag: 'Position paper',
    title: 'Predictive Maintenance',
    href: 'https://assets.arkim.ai/Deloitte_Predictive-Maintenance_PositionPaper.pdf',
    stat: '50%',
    statLabel: 'increase in equipment uptime',
    insights: [
      'Predictive maintenance shifts teams from reactive firefighting to data-driven planning.',
      'Sensor and analytics programs reduce unplanned downtime and extend asset life.',
      'Organizations that invest early see compounding gains in reliability and throughput.',
    ],
    arkimTake: 'Arkim surfaces failure patterns from your equipment history and manuals before downtime hits—giving technicians the context to act, not just alerts to ignore.',
  },
  {
    source: 'Boston Consulting Group',
    tag: 'Executive perspectives',
    title: 'Driving Sustainable Cost Advantage with AI',
    href: 'https://assets.arkim.ai/bcg-executive-perspectives-driving-sustainable-cost-adv-with-ai-ep15-20may2025.pdf',
    stat: null,
    statLabel: null,
    insights: [
      'Industrial leaders use AI to unlock durable cost advantages—not one-off savings.',
      'Scaled AI programs tie directly to operational efficiency and margin improvement.',
      'Sustainable gains come from embedding AI in core workflows, not pilot projects alone.',
    ],
    arkimTake: 'Arkim embeds in daily maintenance workflows—search, diagnose, document—so AI savings compound shift over shift instead of stalling in a pilot.',
  },
  {
    source: 'Boston Consulting Group',
    tag: 'Report',
    title: 'How AI Is Paying Off in the Tech Function',
    href: 'https://assets.arkim.ai/how-ai-is-paying-off-in-the-tech-function.pdf',
    stat: '30%',
    statLabel: 'increase in technician proficiency',
    insights: [
      'AI copilots help technicians resolve issues faster with fewer escalations.',
      'Upskilling accelerates when experts’ knowledge is captured and searchable at scale.',
      'Tech-function AI investments translate into measurable productivity on the shop floor.',
    ],
    arkimTake: 'Arkim is that copilot for industrial techs—senior-level answers from your schematics and tribal knowledge, on the device they already carry.',
  },
];

function ResearchArticleCard({ article, narrow }) {
  return (
    <article style={{
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--bg-card)',
    }}
    >
      <div style={{ padding: narrow ? '28px 22px' : '36px 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px 28px', marginBottom: '20px' }}>
          <div>
            <div className="arkim-section-caption">{article.tag}</div>
            <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-sm)', fontWeight: 700, lineHeight: 'var(--heading-line-height)', marginBottom: '8px', letterSpacing: 'var(--title-h3-letter-spacing)', maxWidth: '520px' }}>{article.title}</h3>
            <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--fg-muted)' }}>{article.source}</div>
          </div>
          {article.stat ? (
            <div style={{
              flexShrink: 0,
              padding: '16px 22px',
              borderRadius: '10px',
              background: 'rgba(60, 122, 172, 0.08)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              minWidth: narrow ? '100%' : '160px',
            }}>
              <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-stat-md)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1, letterSpacing: 'var(--title-stat-letter-spacing)' }}>{article.stat}</div>
              <div style={{ fontFamily: 'var(--body)', fontSize: '13px', color: 'var(--fg-muted)', marginTop: '8px', lineHeight: 1.4 }}>{article.statLabel}</div>
            </div>
          ) : null}
        </div>
        <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {article.insights.map((point, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: '8px' }} aria-hidden="true" />
              <span style={{ fontFamily: 'var(--body)', fontSize: '15px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.65, textWrap: 'pretty' }}>{point}</span>
            </li>
          ))}
        </ul>
        <a
          href={article.href}
          target="_blank"
          rel="noopener"
          style={{
            fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >Read full paper (PDF) →</a>
        {article.arkimTake ? (
          <div className="resources-arkim-bridge">
            <div className="resources-arkim-bridge-label">How Arkim delivers this</div>
            <p>{article.arkimTake}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ComparisonTable() {
  const narrow = useIsNarrowLayout();
  const rows = [
    ['Feature', 'Arkim', 'Gemini', 'ChatGPT'],
    ['Uses your data to train their model for other users', 'No', 'Yes', 'Yes'],
    ['Captures tribal knowledge', 'Yes', 'Limited', 'Limited'],
    ['Number of manuals searchable at a time', 'Unlimited', 'Limited', 'Limited'],
    ['Comprehend schematics and wiring diagrams', 'Yes', 'No', 'No'],
    ['Record audio frequencies to diagnose a problem', 'Yes', 'No', 'No'],
  ];
  return (
    <div style={{
      overflowX: narrow ? 'auto' : 'visible',
      WebkitOverflowScrolling: 'touch',
      touchAction: narrow ? 'pan-x' : 'auto',
      marginBottom: '48px',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)',
        border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
        minWidth: narrow ? '560px' : undefined,
      }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(3, minmax(0, 1fr))', gap: '1px', background: 'var(--border)' }}>
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                background: i === 0 ? 'rgba(60,122,172,0.1)' : 'var(--bg-card)',
                padding: '16px 18px',
                fontFamily: 'var(--sans)',
                fontSize: i === 0 ? 12 : 14,
                fontWeight: i === 0 ? 600 : (j === 0 ? 500 : 400),
                letterSpacing: i === 0 ? '0.06em' : 'normal',
                textTransform: i === 0 ? 'uppercase' : 'none',
                color: i === 0 ? 'var(--accent)' : (j === 0 ? 'var(--fg)' : 'var(--fg-muted)'),
                lineHeight: 1.5,
                textWrap: 'pretty',
              }}
            >{cell}</div>
          ))}
        </div>
      ))}
      </div>
    </div>
  );
}

function S01() {
  return (
    <Section
      id="s01"
      eyebrow="Report"
      headline="Why generic AI fails on the shop floor—and why Arkim doesn't"
      sub="ChatGPT and Gemini weren't built for your plant. They hallucinate specs, can't read wiring diagrams, and may train on your data. Arkim is industrial AI purpose-built for maintenance: unlimited OEM manuals, schematics, tribal knowledge, and audio diagnostics—in a private copilot that keeps humans in control. This is the evidence your leadership team needs."
      showDemoButton={true}
    />
  );
}

function S02() {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  return (
    <div id="s02" style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px 40px` }}>
        <FadeIn>
          <Eyebrow accent>02 — Arkim Compared to Foundation Models</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '24px', maxWidth: '800px', textWrap: 'balance' }}>
            The only AI your technicians should trust with a live machine.
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '720px', textWrap: 'pretty', marginBottom: '40px' }}>
            Side-by-side: what foundation models can and cannot do when a line is down and every minute counts.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <ComparisonTable />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Eyebrow accent>Why Arkim?</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.12}>
          <FeaturePills items={[
            { title: 'Capture tribal knowledge', body: 'Lock in decades of expertise before it walks out the door—searchable by every tech, every shift.' },
            { title: 'Total data privacy', body: 'Your manuals, SOPs, and diagnostics never train someone else\'s model. Full stop.' },
            { title: 'Instant ROI', body: "Less than one hour of technician pay. One avoided escalation pays for the month." },
            { title: 'Scale without adding headcount', body: 'New hires perform like veterans on day one. Your best people handle harder work, not repeat questions.' },
          ]} />
        </FadeIn>
        <FadeIn delay={0.15} style={{ marginTop: '48px' }}>
          <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-sm)', fontWeight: 600, marginBottom: '16px', letterSpacing: 'var(--title-h3-letter-spacing)' }}>Human-in-the-Loop</h3>
          <p style={{ fontFamily: 'var(--body)', fontSize: '17px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '720px', textWrap: 'pretty', marginBottom: '28px' }}>
            Deployed as a Co-pilot, Arkim AI assists technicians rather than replace them, ensuring safety and keeping a human-in-the-loop at all times.
          </p>
          <p style={{ fontFamily: 'var(--body)', fontSize: '17px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '720px', textWrap: 'pretty', marginBottom: '32px' }}>
            For more information about how Arkim can transform your maintenance operations,{' '}
            <a href="/contactus/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>contact our team</a>
            {' '}or{' '}
            <a href="/contactus/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>request a demo</a>.
          </p>
          <a
            href="https://www.arkim.ai/documents/arkim-vs-foundation-models.pdf"
            target="_blank"
            rel="noopener"
            className="arkim-btn-outline"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >Download Full Report (PDF) →</a>
        </FadeIn>
      </div>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `40px ${gx}px 80px` }}>
        <FadeIn><DemoBtn /></FadeIn>
      </div>
    </div>
  );
}

function S03() {
  const narrow = useIsNarrowLayout();
  const gx = narrow ? 22 : 80;
  const pt = narrow ? 64 : 100;
  return (
    <div id="s03" style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: `${pt}px ${gx}px 80px` }}>
        <FadeIn>
          <Eyebrow accent>Industry Impact</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-lg)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '16px', maxWidth: '900px', textWrap: 'balance' }}>
            What leading research says about AI in maintenance
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.75, maxWidth: '720px', textWrap: 'pretty', marginBottom: '32px' }}>
            Deloitte and BCG put numbers on the opportunity. Arkim is how maintenance teams actually capture it—on the floor, with your assets, this quarter.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '40px',
            maxWidth: '560px',
          }}>
            {[
              { stat: '50%', label: 'Equipment uptime', cite: 'Deloitte' },
              { stat: '30%', label: 'Technician proficiency', cite: 'BCG' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '20px 22px',
                borderRadius: '10px',
                border: '1px solid rgba(60,122,172,0.3)',
                background: 'rgba(60,122,172,0.08)',
              }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--title-stat-md)', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{item.stat}</div>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--fg)', marginTop: '8px', fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 'var(--text-eyebrow-size)', color: 'var(--fg-muted)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.cite}</div>
              </div>
            ))}
          </div>
        </FadeIn>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {INDUSTRY_RESEARCH.map((article, i) => (
            <FadeIn key={article.href} delay={0.06 * (i + 1)}>
              <ResearchArticleCard article={article} narrow={narrow} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25} style={{ marginTop: '48px', padding: narrow ? '28px 22px' : '36px 40px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', textAlign: narrow ? 'left' : 'center' }}>
          <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-sm)', fontWeight: 700, marginBottom: '12px', letterSpacing: 'var(--title-h3-letter-spacing)' }}>
            The research sets the bar. Arkim helps you clear it.
          </h3>
          <p style={{ fontFamily: 'var(--body)', fontSize: '16px', color: 'var(--p-fg)', lineHeight: 1.7, maxWidth: '600px', margin: narrow ? '0 0 24px' : '0 auto 24px', textWrap: 'pretty' }}>
            Stop benchmarking generic AI. Put a maintenance copilot in your technicians&apos; hands that reads your plant&apos;s reality—not the internet&apos;s guess.
          </p>
          <DemoBtn label="Request a demo" />
        </FadeIn>
      </div>
    </div>
  );
}

function FinalCTA() {
  const narrow = useIsNarrowLayout();
  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'linear-gradient(to bottom, var(--final-cta-1), var(--final-cta-2))',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(ellipse, var(--radial-accent-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: narrow ? '72px 22px' : '120px 48px', textAlign: 'center', position: 'relative', color: 'var(--fg)' }}>
        <FadeIn>
          <Eyebrow>Ready when you are</Eyebrow>
          <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-xl)', lineHeight: 'var(--heading-line-height)', letterSpacing: 'var(--title-h2-letter-spacing)', marginBottom: '20px', textWrap: 'balance', color: 'var(--fg)' }}>
            Turn industry proof into<br /><em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>your plant&apos;s performance.</em>
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '18px', fontWeight: 400, color: 'var(--p-fg)', lineHeight: 1.7, marginBottom: '40px' }}>
            You have the benchmarks. See how Arkim puts 30% more proficiency and 50% more uptime within reach for your team—starting with one demo on your equipment.
          </p>
          <DemoBtn label="Book your demo" />
        </FadeIn>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <ArkimFixedHeader activeLabel="Resources" heroOverlay />
      <Hero />
      <ValueProofStrip />
      <StickyAnchorNav />
      <S01 />
      <S02 />
      <S03 />
      <FinalCTA />
      <ArkimFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
