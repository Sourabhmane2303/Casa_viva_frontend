import { useState, useEffect, useRef } from "react";

const TEAM = [
  { name: "Vikram Singhania", role: "Founder & Chairman", city: "Mumbai", exp: "28 yrs", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85", quote: "A home is not just an address — it is the first chapter of a life story." },
  { name: "Ananya Krishnan",  role: "Chief Executive Officer", city: "Delhi", exp: "18 yrs", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85", quote: "Excellence is not a feature — it is our only standard." },
  { name: "Rahul Oberoi",     role: "Head of Acquisitions", city: "Pune",   exp: "14 yrs", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85", quote: "Every great property starts with an eye that sees beyond bricks." },
  { name: "Priya Nair",       role: "Senior Consultant", city: "Mumbai",    exp: "12 yrs", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85", quote: "Listening deeply is how I match every client to their perfect home." },
  { name: "Arjun Mehta",      role: "Luxury Specialist",  city: "Delhi",    exp: "10 yrs", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=85", quote: "Luxury is in the details no one else notices." },
  { name: "Sneha Kulkarni",   role: "Property Advisor",   city: "Pune",     exp: "8 yrs",  img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=85", quote: "I don't sell properties — I help people find where they belong." },
];

const MILESTONES = [
  { year: "2005", title: "Founded in Mumbai", desc: "Vikram Singhania started CasaViva with a single office in Bandra and a vision to redefine real estate." },
  { year: "2009", title: "Expanded to Delhi & Pune", desc: "Three city presence established. First luxury villa portfolio launched in Koregaon Park." },
  { year: "2013", title: "₹100 Cr in Sales", desc: "Crossed the milestone with 500 families served. Launched our white-glove concierge program." },
  { year: "2017", title: "Digital CRM Platform", desc: "Proprietary tech built in-house to manage client relationships and site visit coordination." },
  { year: "2021", title: "₹500 Cr Portfolio", desc: "12,000+ clients across three cities. Rated #1 luxury consultancy in western India." },
  { year: "2026", title: "The Future", desc: "Expanding to Bangalore & Hyderabad. Committed to serving the next generation of homeowners." },
];

const VALUES = [
  { icon: "◈", title: "Integrity First",      desc: "Every recommendation we make is guided by what is best for our client — not our commission." },
  { icon: "◇", title: "Curated Excellence",   desc: "We hand-select every property in our portfolio. If it doesn't meet our standard, it doesn't reach you." },
  { icon: "◉", title: "Deep Listening",        desc: "We invest time to understand not just your budget, but your life — your routines, aspirations, and future." },
  { icon: "◈", title: "Transparent Process",  desc: "No hidden fees, no surprise clauses. Our clients always know exactly where they stand." },
];

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeTeam, setActiveTeam] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const ringX = useRef(-200), ringY = useRef(-200);
  const [ringPos, setRingPos] = useState({ x: -200, y: -200 });
  const rafRef = useRef();
  const sectionRefs = useRef({});
  const navScrolled = scrollY > 60;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = (e) => { window._abx = e.clientX; window._aby = e.clientY; setCursorPos({ x: e.clientX, y: e.clientY }); };
    const loop = () => {
      ringX.current += ((window._abx || -200) - ringX.current) * 0.09;
      ringY.current += ((window._aby || -200) - ringY.current) * 0.09;
      setRingPos({ x: ringX.current, y: ringY.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", track);
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", track); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisibleSections(s => new Set([...s, e.target.dataset.section])); });
    }, { threshold: 0.12 });
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const sectionRef = (key) => (el) => { if (el) { sectionRefs.current[key] = el; el.dataset.section = key; } };
  const isVisible = (key) => visibleSections.has(key);

  const parallaxStyle = (speed = 0.3) => ({ transform: `translateY(${scrollY * speed}px)` });

  return (
    <>
      <style>{CSS}</style>

      {/* CURSOR */}
      <div className="ab-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="ab-ring"   style={{ left: ringPos.x,   top: ringPos.y   }} />

      {/* NAV */}
      <nav className={`ab-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="ab-logo">Casa<em>Viva</em></div>
        <div className="ab-nav-links">
          {["Properties", "Locations", "About", "Concierge"].map(l => (
            <a key={l} className={l === "About" ? "active" : ""}>{l}</a>
          ))}
        </div>
        <button className="ab-nav-cta">Book a Visit</button>
      </nav>

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg" style={parallaxStyle(0.25)}>
          <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=90" alt="" className="ab-hero-img" />
          <div className="ab-hero-overlay" />
        </div>

        {/* FLOATING DECORATIVE TEXT */}
        <div className="ab-hero-deco-text">ABOUT</div>

        <div className="ab-hero-content">
          <div className="ab-hero-left">
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line" />
              Est. 2005 · Mumbai, India
            </div>
            <h1 className="ab-hero-h1">
              We Don't Just<br />Sell Homes.<br />
              <em>We Shape Lives.</em>
            </h1>
          </div>
          <div className="ab-hero-right">
            <p className="ab-hero-desc">
              For over two decades, CasaViva has been India's most trusted luxury real estate consultancy — quietly matching extraordinary people with extraordinary addresses across Mumbai, Pune, and Delhi.
            </p>
            <div className="ab-hero-stats">
              {[["20+", "Years of Trust"], ["₹500Cr+", "Properties Sold"], ["12,000+", "Happy Families"]].map(([n, l]) => (
                <div key={l} className="ab-hero-stat">
                  <div className="ab-hero-stat-num">{n}</div>
                  <div className="ab-hero-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ab-scroll-hint">
          <div className="ab-scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="ab-story" ref={sectionRef("story")}>
        <div className={`ab-story-inner${isVisible("story") ? " visible" : ""}`}>
          <div className="ab-story-left">
            <div className="ab-eyebrow" style={{ color: "#c9a96e" }}>
              <span className="ab-eyebrow-line" style={{ background: "#c9a96e" }} />
              Our Story
            </div>
            <h2 className="ab-section-title">
              Born from a Belief<br />that <em>Home Matters</em>
            </h2>
            <div className="ab-story-body">
              <p>In 2005, Vikram Singhania left a decade-long career in corporate banking with a single conviction: that India's most discerning homebuyers deserved better. Not just better properties — but better <em>people</em> to guide them.</p>
              <p>He started CasaViva in a small office in Bandra with four team members, a curated list of twelve properties, and an uncompromising standard: we only show a client a home we would live in ourselves.</p>
              <p>Twenty years later, that standard has never changed. Our portfolio has grown from twelve to over three hundred properties. Our team has grown from four to sixty. But the philosophy — <strong>people first, property second</strong> — remains the heartbeat of everything we do.</p>
            </div>
          </div>
          <div className="ab-story-right">
            <div className="ab-story-img-wrap">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=85" alt="CasaViva story" className="ab-story-img" />
              <div className="ab-story-img-badge">
                <div className="ab-badge-year">2005</div>
                <div className="ab-badge-lbl">Year Founded</div>
              </div>
              <div className="ab-story-img-frame" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ── */}
      <section className="ab-philosophy">
        <div className="ab-philosophy-inner">
          <div className="ab-philosophy-quote">
            "The right home doesn't just shelter you —<br />
            <em>it reveals who you are meant to become.</em>"
          </div>
          <div className="ab-philosophy-attr">— Vikram Singhania, Founder</div>
        </div>
        <div className="ab-philosophy-pattern" />
      </section>

      {/* ── VALUES ── */}
      <section className="ab-values-section" ref={sectionRef("values")}>
        <div className="ab-section-header">
          <div className="ab-eyebrow">
            <span className="ab-eyebrow-line" />
            What Drives Us
          </div>
          <h2 className="ab-section-title">Our Core <em>Values</em></h2>
        </div>
        <div className="ab-values-grid">
          {VALUES.map((v, i) => (
            <div key={v.title} className={`ab-value-card${isVisible("values") ? " visible" : ""}`} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="ab-value-icon">{v.icon}</div>
              <div className="ab-value-title">{v.title}</div>
              <div className="ab-value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="ab-timeline-section" ref={sectionRef("timeline")}>
        <div className="ab-section-header" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="ab-eyebrow" style={{ justifyContent: "center" }}>
            <span className="ab-eyebrow-line" />
            Two Decades of Excellence
            <span className="ab-eyebrow-line" />
          </div>
          <h2 className="ab-section-title">Our <em>Journey</em></h2>
        </div>
        <div className="ab-timeline">
          <div className="ab-timeline-line" />
          {MILESTONES.map((m, i) => (
            <div key={m.year} className={`ab-timeline-item${i % 2 === 0 ? " left" : " right"}${isVisible("timeline") ? " visible" : ""}`} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="ab-timeline-dot" />
              <div className="ab-timeline-card">
                <div className="ab-timeline-year">{m.year}</div>
                <div className="ab-timeline-title">{m.title}</div>
                <div className="ab-timeline-desc">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ab-team-section" ref={sectionRef("team")}>
        <div className="ab-section-header">
          <div className="ab-eyebrow">
            <span className="ab-eyebrow-line" />
            The People Behind the Promise
          </div>
          <h2 className="ab-section-title">Meet Our <em>Team</em></h2>
        </div>

        <div className="ab-team-layout">
          {/* FEATURED MEMBER */}
          <div className="ab-team-featured">
            <div className="ab-team-featured-img-wrap">
              <img src={TEAM[activeTeam].img} alt={TEAM[activeTeam].name} className="ab-team-featured-img" />
              <div className="ab-team-featured-overlay" />
              <div className="ab-team-featured-info">
                <div className="ab-team-featured-role">{TEAM[activeTeam].role}</div>
                <div className="ab-team-featured-name">{TEAM[activeTeam].name}</div>
                <div className="ab-team-featured-meta">📍 {TEAM[activeTeam].city} · {TEAM[activeTeam].exp} experience</div>
              </div>
            </div>
            <div className="ab-team-featured-quote">
              <span className="ab-quote-mark">"</span>
              {TEAM[activeTeam].quote}
            </div>
          </div>

          {/* TEAM GRID */}
          <div className="ab-team-grid">
            {TEAM.map((m, i) => (
              <div key={m.name} className={`ab-team-card${activeTeam === i ? " active" : ""}${isVisible("team") ? " visible" : ""}`} style={{ animationDelay: `${i * 0.08}s` }} onClick={() => setActiveTeam(i)}>
                <img src={m.img} alt={m.name} className="ab-team-card-img" />
                <div className="ab-team-card-body">
                  <div className="ab-team-card-name">{m.name}</div>
                  <div className="ab-team-card-role">{m.role}</div>
                  <div className="ab-team-card-city">{m.city}</div>
                </div>
                <div className="ab-team-card-select-indicator" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="ab-numbers-section" ref={sectionRef("numbers")}>
        <div className="ab-numbers-bg">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #09090f 0%, #1a1208 100%)" }} />
        </div>
        <div className="ab-numbers-inner">
          <div className="ab-section-header" style={{ textAlign: "center", alignItems: "center", marginBottom: 64 }}>
            <div className="ab-eyebrow" style={{ justifyContent: "center", color: "#c9a96e" }}>
              <span className="ab-eyebrow-line" style={{ background: "#c9a96e" }} />
              The Numbers Speak
              <span className="ab-eyebrow-line" style={{ background: "#c9a96e" }} />
            </div>
            <h2 className="ab-section-title" style={{ color: "white" }}>
              Two Decades of<br /><em style={{ color: "#c9a96e" }}>Measured Excellence</em>
            </h2>
          </div>
          <div className="ab-numbers-grid">
            {[
              { num: "20+",    label: "Years in Business",      icon: "🏛" },
              { num: "12,000+",label: "Families Housed",        icon: "🏡" },
              { num: "₹500Cr+",label: "Total Sales Value",      icon: "💰" },
              { num: "3",      label: "Cities Served",          icon: "📍" },
              { num: "300+",   label: "Curated Properties",     icon: "🏢" },
              { num: "60+",    label: "Expert Team Members",    icon: "👥" },
              { num: "99%",    label: "Client Satisfaction",    icon: "⭐" },
              { num: "18",     label: "Industry Awards",        icon: "🏆" },
            ].map((n, i) => (
              <div key={n.label} className={`ab-number-card${isVisible("numbers") ? " visible" : ""}`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="ab-number-icon">{n.icon}</div>
                <div className="ab-number-num">{n.num}</div>
                <div className="ab-number-label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="ab-awards-section" ref={sectionRef("awards")}>
        <div className="ab-section-header">
          <div className="ab-eyebrow">
            <span className="ab-eyebrow-line" />
            Recognition
          </div>
          <h2 className="ab-section-title">Awards & <em>Accolades</em></h2>
        </div>
        <div className="ab-awards-grid">
          {[
            { year: "2024", award: "#1 Luxury Real Estate Consultancy", body: "Economic Times Realty Awards" },
            { year: "2023", award: "Best Client Experience — West India", body: "National Real Estate Excellence Awards" },
            { year: "2022", award: "Most Trusted Property Brand", body: "India Today Consumer Survey" },
            { year: "2021", award: "Luxury Property Advisor of the Year", body: "Mumbai Real Estate Summit" },
            { year: "2020", award: "Excellence in Technology", body: "PropTech India Awards" },
            { year: "2019", award: "Top 10 Real Estate Brands in India", body: "Business Today Real Estate Rankings" },
          ].map((a, i) => (
            <div key={a.award} className={`ab-award-card${isVisible("awards") ? " visible" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ab-award-year">{a.year}</div>
              <div className="ab-award-icon">🏆</div>
              <div className="ab-award-title">{a.award}</div>
              <div className="ab-award-body">{a.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-deco-left" />
        <div className="ab-cta-deco-right" />
        <div className="ab-cta-inner">
          <div className="ab-eyebrow" style={{ justifyContent: "center", color: "#c9a96e" }}>
            <span className="ab-eyebrow-line" style={{ background: "#c9a96e" }} />
            Begin Your Journey
            <span className="ab-eyebrow-line" style={{ background: "#c9a96e" }} />
          </div>
          <h2 className="ab-cta-title">
            Your Dream Home<br />is <em>One Conversation Away</em>
          </h2>
          <p className="ab-cta-sub">
            Let's talk about what you're looking for. No pressure, no pitch — just a genuine conversation about your next chapter.
          </p>
          <div className="ab-cta-btns">
            <button className="ab-btn-primary">Book a Free Consultation →</button>
            <button className="ab-btn-ghost">View Properties</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ab-footer">
        <div className="ab-footer-top">
          <div className="ab-footer-brand">
            <div className="ab-footer-logo">Casa<em>Viva</em></div>
            <div className="ab-footer-tagline">Where luxury meets home.</div>
            <div className="ab-footer-cities">Mumbai · Pune · Delhi</div>
          </div>
          <div className="ab-footer-links-wrap">
            {[
              { heading: "Explore", links: ["Properties", "New Launches", "Luxury Villas", "Commercial"] },
              { heading: "Company", links: ["About Us", "Our Team", "Careers", "Press"] },
              { heading: "Contact", links: ["+91 98000 00000", "hello@casaviva.in", "Mon–Sat 9AM–7PM"] },
            ].map(col => (
              <div key={col.heading}>
                <div className="ab-footer-col-title">{col.heading}</div>
                {col.links.map(l => <div key={l} className="ab-footer-link">{l}</div>)}
              </div>
            ))}
          </div>
        </div>
        <div className="ab-footer-bottom">
          <span>© 2026 CasaViva. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service · Sitemap</span>
        </div>
      </footer>
    </>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --gold: #c9a96e; --gold2: #e8d5a8; --ink: #09090f;
    --ivory: #faf7f2; --warm: #f2ece0; --muted: #78726a;
    --border: rgba(201,169,110,0.18);
  }
  body { font-family: 'Jost', sans-serif; background: var(--ivory); color: var(--ink); cursor: none; overflow-x: hidden; }

  /* CURSOR */
  .ab-cursor { position: fixed; z-index: 9999; pointer-events: none; width: 10px; height: 10px; border-radius: 50%; background: var(--gold); transform: translate(-50%,-50%); mix-blend-mode: multiply; transition: width .2s, height .2s; }
  .ab-ring   { position: fixed; z-index: 9998; pointer-events: none; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--gold); opacity: 0.4; transform: translate(-50%,-50%); }

  /* NAV */
  .ab-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 500; display: flex; align-items: center; justify-content: space-between; padding: 0 64px; height: 76px; transition: all .4s; }
  .ab-nav.scrolled { background: rgba(250,247,242,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); box-shadow: 0 4px 32px rgba(10,10,15,0.05); }
  .ab-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 600; color: white; transition: color .4s; letter-spacing: 0.5px; }
  .ab-nav.scrolled .ab-logo { color: var(--ink); }
  .ab-logo em { font-style: italic; color: var(--gold); }
  .ab-nav-links { display: flex; gap: 36px; }
  .ab-nav-links a { font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500; color: rgba(255,255,255,0.75); text-decoration: none; cursor: none; transition: color .3s; position: relative; padding-bottom: 2px; }
  .ab-nav.scrolled .ab-nav-links a { color: var(--muted); }
  .ab-nav-links a::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:var(--gold); transform:scaleX(0); transition:transform .3s; }
  .ab-nav-links a:hover::after, .ab-nav-links a.active::after { transform:scaleX(1); }
  .ab-nav-links a:hover, .ab-nav-links a.active { color: white; }
  .ab-nav.scrolled .ab-nav-links a:hover, .ab-nav.scrolled .ab-nav-links a.active { color: var(--ink); }
  .ab-nav-cta { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.4); padding: 9px 24px; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; cursor: none; transition: all .3s; }
  .ab-nav.scrolled .ab-nav-cta { color: var(--ink); border-color: var(--border); }
  .ab-nav-cta:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }

  /* EYEBROW */
  .ab-eyebrow { display: flex; align-items: center; gap: 12px; font-size: 0.68rem; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .ab-eyebrow-line { width: 28px; height: 1px; background: var(--muted); flex-shrink: 0; }

  /* SECTION TITLE */
  .ab-section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 3.5vw, 3.2rem); font-weight: 300; line-height: 1.12; letter-spacing: -0.5px; }
  .ab-section-title em { font-style: italic; color: var(--gold); font-weight: 400; }
  .ab-section-header { margin-bottom: 52px; }

  /* ANIMATIONS */
  @keyframes fadeUp   { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeRight{ from { opacity: 0; transform: translateX(40px);  } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn  { from { opacity: 0; transform: scale(0.92); }       to { opacity: 1; transform: scale(1); } }

  /* ── HERO ── */
  .ab-hero { position: relative; height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
  .ab-hero-bg { position: absolute; inset: -10%; }
  .ab-hero-img { width: 100%; height: 100%; object-fit: cover; }
  .ab-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(9,9,15,0.75) 0%, rgba(9,9,15,0.35) 50%, rgba(9,9,15,0.7) 100%); }
  .ab-hero-deco-text { position: absolute; top: 50%; right: -40px; transform: translateY(-50%) rotate(90deg); font-family: 'Cormorant Garamond', serif; font-size: 10rem; font-weight: 700; color: rgba(201,169,110,0.05); letter-spacing: 20px; user-select: none; white-space: nowrap; }
  .ab-hero-content { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding: 0 72px 96px; align-items: flex-end; }
  .ab-hero-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5.5vw, 6rem); font-weight: 300; color: white; line-height: 1.0; letter-spacing: -1px; animation: fadeLeft .9s ease both; }
  .ab-hero-h1 em { font-style: italic; color: var(--gold2); font-weight: 400; }
  .ab-hero-desc { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.85; margin-bottom: 36px; animation: fadeRight .9s .2s ease both; }
  .ab-hero-stats { display: flex; gap: 32px; animation: fadeRight .9s .35s ease both; }
  .ab-hero-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; color: var(--gold); line-height: 1; }
  .ab-hero-stat-lbl { font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 4px; }
  .ab-scroll-hint { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 3; animation: fadeUp .8s .6s ease both; }
  .ab-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.6)); animation: scrollPulse 2s infinite; }
  @keyframes scrollPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .ab-scroll-hint span { font-size: 0.62rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); }

  /* ── STORY ── */
  .ab-story { padding: 120px 72px; background: var(--ivory); overflow: hidden; }
  .ab-story-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; opacity: 0; transform: translateY(30px); transition: opacity .8s ease, transform .8s ease; }
  .ab-story-inner.visible { opacity: 1; transform: translateY(0); }
  .ab-story-body { margin-top: 28px; display: flex; flex-direction: column; gap: 18px; }
  .ab-story-body p { font-size: 0.95rem; color: var(--muted); line-height: 1.9; }
  .ab-story-body em { font-style: italic; color: var(--gold); }
  .ab-story-body strong { color: var(--ink); font-weight: 600; }
  .ab-story-img-wrap { position: relative; }
  .ab-story-img { width: 100%; height: 560px; object-fit: cover; display: block; }
  .ab-story-img-badge { position: absolute; bottom: -24px; left: -24px; background: var(--gold); padding: 22px 28px; }
  .ab-badge-year { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: var(--ink); line-height: 1; }
  .ab-badge-lbl { font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(9,9,15,0.6); margin-top: 4px; }
  .ab-story-img-frame { position: absolute; top: 20px; left: 20px; right: -20px; bottom: -20px; border: 1px solid var(--border); z-index: -1; }

  /* ── PHILOSOPHY ── */
  .ab-philosophy { background: var(--ink); padding: 100px 72px; position: relative; overflow: hidden; text-align: center; }
  .ab-philosophy-pattern { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(201,169,110,0.04) 1px, transparent 1px); background-size: 32px 32px; }
  .ab-philosophy-inner { position: relative; z-index: 2; }
  .ab-philosophy-quote { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.5rem, 3vw, 2.8rem); font-weight: 300; color: white; line-height: 1.4; letter-spacing: -0.5px; }
  .ab-philosophy-quote em { font-style: italic; color: var(--gold); }
  .ab-philosophy-attr { font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 24px; }

  /* ── VALUES ── */
  .ab-values-section { padding: 120px 72px; background: var(--warm); }
  .ab-values-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  .ab-value-card { background: white; padding: 40px 32px; opacity: 0; transform: translateY(30px); }
  .ab-value-card.visible { animation: fadeUp .6s ease both; }
  .ab-value-icon { font-size: 2rem; color: var(--gold); margin-bottom: 20px; font-family: serif; }
  .ab-value-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; margin-bottom: 12px; }
  .ab-value-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.8; }
  .ab-value-card:hover { background: var(--ink); transition: background .3s; }
  .ab-value-card:hover .ab-value-title,
  .ab-value-card:hover .ab-value-icon { color: var(--gold); transition: color .3s; }
  .ab-value-card:hover .ab-value-desc { color: rgba(255,255,255,0.45); transition: color .3s; }

  /* ── TIMELINE ── */
  .ab-timeline-section { padding: 120px 72px; background: var(--ivory); }
  .ab-timeline { position: relative; max-width: 900px; margin: 0 auto; }
  .ab-timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent); transform: translateX(-50%); }
  .ab-timeline-item { display: flex; width: 100%; margin-bottom: 56px; position: relative; opacity: 0; }
  .ab-timeline-item.visible { animation: fadeUp .6s ease both; }
  .ab-timeline-item.left { justify-content: flex-start; padding-right: calc(50% + 40px); }
  .ab-timeline-item.right { justify-content: flex-end; padding-left: calc(50% + 40px); }
  .ab-timeline-dot { position: absolute; left: 50%; top: 28px; width: 14px; height: 14px; border-radius: 50%; background: var(--gold); border: 3px solid var(--ivory); transform: translateX(-50%); box-shadow: 0 0 0 4px rgba(201,169,110,0.2); }
  .ab-timeline-card { background: white; border: 1px solid var(--border); padding: 24px 28px; max-width: 340px; }
  .ab-timeline-year { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: var(--gold); line-height: 1; margin-bottom: 8px; }
  .ab-timeline-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; }
  .ab-timeline-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.75; }

  /* ── TEAM ── */
  .ab-team-section { padding: 120px 72px; background: var(--warm); }
  .ab-team-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  .ab-team-featured-img-wrap { position: relative; height: 500px; overflow: hidden; }
  .ab-team-featured-img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
  .ab-team-featured-img-wrap:hover .ab-team-featured-img { transform: scale(1.04); }
  .ab-team-featured-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(9,9,15,0.88) 0%, transparent 50%); }
  .ab-team-featured-info { position: absolute; bottom: 28px; left: 28px; right: 28px; }
  .ab-team-featured-role { font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .ab-team-featured-name { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; color: white; line-height: 1.1; }
  .ab-team-featured-meta { font-size: 0.78rem; color: rgba(255,255,255,0.45); margin-top: 6px; }
  .ab-team-featured-quote { background: var(--ink); padding: 24px 28px; position: relative; }
  .ab-team-featured-quote { font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.8; font-style: italic; }
  .ab-quote-mark { font-family: 'Cormorant Garamond', serif; font-size: 4rem; color: var(--gold); line-height: 0; vertical-align: -1.2rem; margin-right: 4px; opacity: 0.6; }
  .ab-team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .ab-team-card { background: white; border: 1.5px solid var(--border); cursor: none; transition: all .3s; overflow: hidden; opacity: 0; position: relative; }
  .ab-team-card.visible { animation: fadeUp .5s ease both; }
  .ab-team-card:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(201,169,110,0.12); }
  .ab-team-card.active { border-color: var(--gold); border-width: 2px; }
  .ab-team-card-img { width: 100%; height: 160px; object-fit: cover; transition: transform .5s; }
  .ab-team-card:hover .ab-team-card-img { transform: scale(1.05); }
  .ab-team-card-body { padding: 14px; }
  .ab-team-card-name { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; }
  .ab-team-card-role { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .ab-team-card-city { font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-top: 6px; }
  .ab-team-card-select-indicator { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gold); transform: scaleX(0); transition: transform .3s; }
  .ab-team-card.active .ab-team-card-select-indicator { transform: scaleX(1); }

  /* ── NUMBERS ── */
  .ab-numbers-section { position: relative; padding: 120px 72px; }
  .ab-numbers-bg { position: absolute; inset: 0; overflow: hidden; }
  .ab-numbers-inner { position: relative; z-index: 2; }
  .ab-numbers-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.04); }
  .ab-number-card { background: rgba(9,9,15,0.6); padding: 40px 28px; text-align: center; border: 1px solid rgba(201,169,110,0.08); opacity: 0; transition: all .3s; }
  .ab-number-card.visible { animation: scaleIn .5s ease both; }
  .ab-number-card:hover { background: rgba(201,169,110,0.08); border-color: rgba(201,169,110,0.25); }
  .ab-number-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .ab-number-num { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 300; color: var(--gold); line-height: 1; }
  .ab-number-label { font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 8px; }

  /* ── AWARDS ── */
  .ab-awards-section { padding: 120px 72px; background: var(--ivory); }
  .ab-awards-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .ab-award-card { border: 1px solid var(--border); padding: 32px 28px; background: white; opacity: 0; transition: all .3s; position: relative; overflow: hidden; }
  .ab-award-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold2)); transform: scaleX(0); transform-origin: left; transition: transform .4s; }
  .ab-award-card:hover::before { transform: scaleX(1); }
  .ab-award-card.visible { animation: fadeUp .6s ease both; }
  .ab-award-card:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(201,169,110,0.1); }
  .ab-award-year { font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; font-weight: 600; }
  .ab-award-icon { font-size: 2rem; margin-bottom: 14px; }
  .ab-award-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600; margin-bottom: 8px; line-height: 1.3; }
  .ab-award-body { font-size: 0.78rem; color: var(--muted); }

  /* ── CTA ── */
  .ab-cta { background: var(--ink); padding: 130px 72px; text-align: center; position: relative; overflow: hidden; }
  .ab-cta-deco-left { position: absolute; top: -80px; left: -80px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,110,0.08), transparent 70%); }
  .ab-cta-deco-right { position: absolute; bottom: -60px; right: -60px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,110,0.06), transparent 70%); }
  .ab-cta-inner { position: relative; z-index: 2; }
  .ab-cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 300; color: white; line-height: 1.1; margin: 20px 0 18px; letter-spacing: -1px; }
  .ab-cta-title em { font-style: italic; color: var(--gold); }
  .ab-cta-sub { font-size: 0.95rem; color: rgba(255,255,255,0.38); max-width: 460px; margin: 0 auto 48px; line-height: 1.85; }
  .ab-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .ab-btn-primary { background: var(--gold); color: var(--ink); border: none; padding: 16px 40px; font-family: 'Jost', sans-serif; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; cursor: none; transition: all .3s; clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px)); }
  .ab-btn-primary:hover { background: var(--gold2); transform: translateY(-3px); }
  .ab-btn-ghost { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 16px 40px; font-family: 'Jost', sans-serif; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; cursor: none; transition: all .3s; clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px)); }
  .ab-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

  /* ── FOOTER ── */
  .ab-footer { background: #060608; padding: 72px 72px 40px; border-top: 1px solid rgba(201,169,110,0.08); }
  .ab-footer-top { display: grid; grid-template-columns: 1.6fr 1fr; gap: 80px; margin-bottom: 56px; }
  .ab-footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; color: white; margin-bottom: 10px; }
  .ab-footer-logo em { font-style: italic; color: var(--gold); }
  .ab-footer-tagline { font-size: 0.88rem; color: rgba(255,255,255,0.25); margin-bottom: 6px; }
  .ab-footer-cities { font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); opacity: 0.6; }
  .ab-footer-links-wrap { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px; }
  .ab-footer-col-title { font-size: 0.62rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; font-weight: 600; }
  .ab-footer-link { font-size: 0.84rem; color: rgba(255,255,255,0.28); margin-bottom: 10px; cursor: none; transition: color .2s; }
  .ab-footer-link:hover { color: rgba(255,255,255,0.75); }
  .ab-footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 28px; display: flex; justify-content: space-between; font-size: 0.74rem; color: rgba(255,255,255,0.18); }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .ab-hero-content { padding: 0 48px 72px; }
    .ab-story, .ab-values-section, .ab-timeline-section, .ab-team-section, .ab-numbers-section, .ab-awards-section, .ab-cta { padding-left: 48px; padding-right: 48px; }
    .ab-values-grid { grid-template-columns: repeat(2,1fr); }
    .ab-numbers-grid { grid-template-columns: repeat(4,1fr); }
    .ab-footer { padding: 56px 48px 32px; }
  }
  @media (max-width: 860px) {
    .ab-nav { padding: 0 28px; }
    .ab-nav-links { display: none; }
    .ab-hero-content { grid-template-columns: 1fr; padding: 0 28px 64px; }
    .ab-story-inner, .ab-team-layout { grid-template-columns: 1fr; }
    .ab-story-img-wrap { margin-top: 40px; }
    .ab-story-img { height: 400px; }
    .ab-values-grid { grid-template-columns: 1fr 1fr; }
    .ab-numbers-grid { grid-template-columns: repeat(2,1fr); }
    .ab-awards-grid { grid-template-columns: repeat(2,1fr); }
    .ab-timeline-item.left, .ab-timeline-item.right { justify-content: flex-start; padding: 0 0 0 44px; }
    .ab-timeline-line { left: 7px; }
    .ab-timeline-dot { left: 7px; }
    .ab-footer { padding: 48px 28px 28px; }
    .ab-footer-top { grid-template-columns: 1fr; gap: 48px; }
    .ab-story, .ab-values-section, .ab-timeline-section, .ab-team-section, .ab-numbers-section, .ab-awards-section, .ab-cta { padding-left: 28px; padding-right: 28px; }
  }
  @media (max-width: 560px) {
    .ab-values-grid, .ab-awards-grid { grid-template-columns: 1fr; }
    .ab-numbers-grid { grid-template-columns: repeat(2,1fr); }
    .ab-team-grid { grid-template-columns: repeat(2,1fr); }
    .ab-footer-links-wrap { grid-template-columns: 1fr 1fr; }
    .ab-hero-deco-text { display: none; }
  }
`;
