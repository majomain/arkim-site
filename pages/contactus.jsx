const { useState, useEffect, useRef } = React;
const { ArkimFixedHeader } = window;
const ArkimFooter = window.ArkimFooter;
const useArkimTheme = window.useArkimTheme;

function useFadeIn() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
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
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>{children}</div>
  );
}
function Label({ children }) {
  return <div className="arkim-section-caption arkim-section-caption--muted">{children}</div>;
}

function HubSpotMeetingsEmbed() {
  useEffect(() => {
    const src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="meetings-iframe-container"
      data-src="https://meetings-na2.hubspot.com/tom-dickie?embed=true"
    />
  );
}

function ScheduleSection() {
  const narrow = useIsNarrowLayout();
  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: narrow ? '56px' : '80px', paddingTop: narrow ? '48px' : '64px' }}>
      <FadeIn>
        <h2 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h2-md)', letterSpacing: 'var(--title-h3-letter-spacing)', color: 'var(--fg)', marginBottom: narrow ? '24px' : '32px', textAlign: 'center' }}>
          Schedule a meeting with us
        </h2>
        <HubSpotMeetingsEmbed />
      </FadeIn>
    </div>
  );
}

function ContactSection() {
  const narrow = useIsNarrowLayout();
  const fsInited = useRef(false);

  useEffect(() => {
    if (fsInited.current) return;
    const id = window.requestAnimationFrame(() => {
      if (fsInited.current) return;
      try {
        window.formspree('initForm', { formElement: '#arkim-contact-form', formId: 'xldbnyol' });
        fsInited.current = true;
      } catch (err) {
        console.error('[formspree]', err);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: narrow ? '48px 22px 80px' : '80px 80px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1.4fr', gap: narrow ? '48px' : '80px', alignItems: 'start' }}>

          <FadeIn>
            <div style={{ position: narrow ? 'static' : 'sticky', top: narrow ? undefined : '100px' }}>
              <div style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                marginBottom: '28px',
              }}>
                <img
                  src="https://pub-21bffe7c211448d7818625366c788ae6.r2.dev/tom-pfp-thumb.webp"
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
              <div style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-md)', fontWeight: 700, letterSpacing: 'var(--title-h3-letter-spacing)', marginBottom: '4px' }}>Tom Dickie</div>
              <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--accent)', fontWeight: 500, marginBottom: '20px' }}>CEO, Arkim AI</div>
              <a href="mailto:tom@arkim.ai" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--body)', fontSize: '15px', color: 'var(--fg-muted)', textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--fg)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--fg-muted)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                tom@arkim.ai
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div>
              <div data-fs-success style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '48px', marginBottom: '20px' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--sans)', textTransform: 'uppercase', fontSize: 'var(--title-h3-lg)', fontWeight: 700, letterSpacing: 'var(--title-h3-letter-spacing)', marginBottom: '12px', color: 'var(--fg)' }}>Message sent.</h3>
                <p style={{ fontFamily: 'var(--body)', fontSize: '16px', fontWeight: 400, color: 'var(--p-fg)' }}>Tom will be in touch within one business day.</p>
              </div>
              <form id="arkim-contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div data-fs-error="" role="alert" aria-live="polite" />
                <input type="hidden" name="_subject" value="Arkim website — Contact form" />
                <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  <div>
                    <Label>Name</Label>
                    <input className="form-input" type="text" name="name" data-fs-field placeholder="Your name" required autoComplete="name" />
                    <span data-fs-error="name" />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <input className="form-input" type="text" name="company" data-fs-field placeholder="Company name" required autoComplete="organization" />
                    <span data-fs-error="company" />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <input className="form-input" type="email" name="email" data-fs-field placeholder="you@company.com" required autoComplete="email" inputMode="email" />
                  <span data-fs-error="email" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  <div>
                    <Label>Your Role</Label>
                    <select className="form-input" name="role" data-fs-field required defaultValue="">
                      <option value="" disabled>Select role</option>
                      <option value="Plant Manager">Plant Manager</option>
                      <option value="Maintenance Manager">Maintenance Manager</option>
                      <option value="Technician">Technician</option>
                      <option value="Executive">Executive</option>
                      <option value="Other">Other</option>
                    </select>
                    <span data-fs-error="role" />
                  </div>
                  <div>
                    <Label>Facility Type</Label>
                    <select className="form-input" name="facility-type" data-fs-field required defaultValue="">
                      <option value="" disabled>Select type</option>
                      <option value="Pharmaceutical">Pharmaceutical</option>
                      <option value="Food & Beverage">Food &amp; Beverage</option>
                      <option value="Contract Manufacturing">Contract Manufacturing</option>
                      <option value="Industrial OEM">Industrial OEM</option>
                      <option value="Other">Other</option>
                    </select>
                    <span data-fs-error="facility-type" />
                  </div>
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea className="form-input" name="message" data-fs-field placeholder="Tell us about your facility and what you're looking to solve..." required rows={6} />
                  <span data-fs-error="message" />
                </div>
                <div>
                  <button type="submit" data-fs-submit-btn className="arkim-btn-primary">Send →</button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
        <ScheduleSection />
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <ArkimFixedHeader activeLabel="Contact Us" />
      <ContactSection />
      <ArkimFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
