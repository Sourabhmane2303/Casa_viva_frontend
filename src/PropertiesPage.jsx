import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const PROPERTIES = [
  {
    id: 1, title: "Horizon Penthouse", location: "Bandra West, Mumbai", city: "Mumbai",
    price: 32500000, priceLabel: "₹3.25 Cr", type: "Penthouse", status: "Available",
    beds: 4, baths: 3, sqft: 3200, floor: "32nd", facing: "Sea View",
    tag: "Premium", year: 2022, parking: 2,
    desc: "A crown jewel above Mumbai's skyline. Sweeping 270° Arabian Sea views, double-height ceilings, and a private sky terrace make this the city's most coveted address.",
    amenities: ["Private Terrace", "Sky Pool", "Home Theatre", "Smart Home", "Concierge", "Helipad Access"],
    imgs: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=85",
    ],
    agent: { name: "Priya Nair", phone: "+91 98001 00001", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  },
  {
    id: 2, title: "Verdant Garden Villa", location: "Koregaon Park, Pune", city: "Pune",
    price: 18000000, priceLabel: "₹1.80 Cr", type: "Villa", status: "Available",
    beds: 3, baths: 2, sqft: 2400, floor: "Ground + 1", facing: "Garden View",
    tag: "New", year: 2023, parking: 2,
    desc: "Set amid 4,000 sq.ft. of curated landscaping, this villa offers a rare union of indoor luxury and outdoor serenity in Pune's most prestigious enclave.",
    amenities: ["Private Garden", "Jacuzzi", "Modular Kitchen", "Solar Power", "EV Charging", "24x7 Security"],
    imgs: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85",
    ],
    agent: { name: "Sneha Kulkarni", phone: "+91 98001 00003", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  },
  {
    id: 3, title: "The Urban Loft", location: "Connaught Place, Delhi", city: "Delhi",
    price: 9500000, priceLabel: "₹95 L", type: "Apartment", status: "Available",
    beds: 2, baths: 2, sqft: 1400, floor: "14th", facing: "City View",
    tag: "Hot", year: 2021, parking: 1,
    desc: "Industrial-chic meets refined living. Exposed concrete, floor-to-ceiling glass, and bespoke finishes — this loft redefines contemporary urban dwelling.",
    amenities: ["Rooftop Lounge", "Co-working Space", "Infinity Pool", "Gym", "Concierge", "Valet Parking"],
    imgs: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
    ],
    agent: { name: "Arjun Mehta", phone: "+91 98001 00002", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  },
  {
    id: 4, title: "Sky Residency", location: "Worli, Mumbai", city: "Mumbai",
    price: 55000000, priceLabel: "₹5.50 Cr", type: "Penthouse", status: "Available",
    beds: 5, baths: 4, sqft: 5100, floor: "48th", facing: "Sea + City",
    tag: "Luxury", year: 2024, parking: 3,
    desc: "The absolute pinnacle. A full-floor duplex penthouse on Mumbai's tallest residential tower. Private lift lobby, plunge pool, and a view that stretches to infinity.",
    amenities: ["Private Lift", "Plunge Pool", "Wine Cellar", "Butler Service", "Smart Home", "Panic Room"],
    imgs: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85",
    ],
    agent: { name: "Priya Nair", phone: "+91 98001 00001", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  },
  {
    id: 5, title: "Heritage Bungalow", location: "Civil Lines, Delhi", city: "Delhi",
    price: 27000000, priceLabel: "₹2.70 Cr", type: "Villa", status: "Under Offer",
    beds: 4, baths: 3, sqft: 3800, floor: "Ground", facing: "Park View",
    tag: "Premium", year: 2019, parking: 3,
    desc: "A lovingly restored colonial-era bungalow on half an acre. Original teak joinery, ornate cornicing, and a landscaped garden — history and luxury in rare harmony.",
    amenities: ["Heritage Architecture", "Private Garden", "Library", "Staff Quarters", "Pool", "Garage"],
    imgs: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85",
    ],
    agent: { name: "Arjun Mehta", phone: "+91 98001 00002", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  },
  {
    id: 6, title: "Riverside Sanctum", location: "Kalyani Nagar, Pune", city: "Pune",
    price: 7800000, priceLabel: "₹78 L", type: "Apartment", status: "Available",
    beds: 2, baths: 1, sqft: 1100, floor: "6th", facing: "River View",
    tag: "New", year: 2024, parking: 1,
    desc: "Waking up to the sound of flowing water. This riverside apartment combines Scandinavian minimalism with warm Indian textures for a truly peaceful sanctuary.",
    amenities: ["River-facing Balcony", "Yoga Deck", "Co-working Lounge", "Bike Storage", "Rainwater Harvesting", "Terrace Garden"],
    imgs: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
    ],
    agent: { name: "Sneha Kulkarni", phone: "+91 98001 00003", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  },
  {
    id: 7, title: "The Ivory Tower", location: "Lower Parel, Mumbai", city: "Mumbai",
    price: 22000000, priceLabel: "₹2.20 Cr", type: "Apartment", status: "Available",
    beds: 3, baths: 2, sqft: 2100, floor: "28th", facing: "City View",
    tag: "Hot", year: 2023, parking: 2,
    desc: "At the heart of Mumbai's fastest-growing corridor. Clean-lined luxury, marble-clad interiors, and unobstructed city views define this aspirational tower residence.",
    amenities: ["Sky Garden", "Lap Pool", "Squash Court", "Kids Play Area", "Mini Theatre", "Concierge"],
    imgs: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
    ],
    agent: { name: "Priya Nair", phone: "+91 98001 00001", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  },
  {
    id: 8, title: "The Jasmine Estate", location: "Wakad, Pune", city: "Pune",
    price: 12500000, priceLabel: "₹1.25 Cr", type: "Villa", status: "Available",
    beds: 3, baths: 3, sqft: 2800, floor: "Ground + 1", facing: "Garden",
    tag: "New", year: 2024, parking: 2,
    desc: "Nestled within a 12-villa boutique gated community. Thoughtfully designed with passive cooling, natural stone finishes, and a private courtyard garden.",
    amenities: ["Courtyard Garden", "Passive Cooling", "Natural Stone Finishes", "Clubhouse", "Jogging Track", "EV Station"],
    imgs: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=85",
    ],
    agent: { name: "Sneha Kulkarni", phone: "+91 98001 00003", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  },
  {
    id: 9, title: "Parliament View Suite", location: "Lutyen's Delhi", city: "Delhi",
    price: 48000000, priceLabel: "₹4.80 Cr", type: "Penthouse", status: "Available",
    beds: 4, baths: 4, sqft: 4400, floor: "22nd", facing: "Parliament View",
    tag: "Luxury", year: 2022, parking: 3,
    desc: "An address that speaks for itself. Overlooking Raisina Hill, this penthouse is Delhi's most architecturally significant residential offering — politics of luxury.",
    amenities: ["Parliament Views", "Private Terrace", "Cigar Lounge", "Private Dining", "Smart Home", "Staff Quarters"],
    imgs: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85",
    ],
    agent: { name: "Arjun Mehta", phone: "+91 98001 00002", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  },
];

const TAG_META = {
  Premium: { bg: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "rgba(201,169,110,0.3)" },
  New:     { bg: "rgba(16,185,129,0.12)",  color: "#10b981", border: "rgba(16,185,129,0.25)" },
  Hot:     { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", border: "rgba(239,68,68,0.25)" },
  Luxury:  { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "rgba(167,139,250,0.25)" },
};

const STATUS_META = {
  Available:    { color: "#10b981", dot: "#10b981" },
  "Under Offer":{ color: "#f59e0b", dot: "#f59e0b" },
  Sold:         { color: "#6b7280", dot: "#6b7280" },
};

/* ─── MAIN PAGE ─────────────────────────────────────────────────────── */
export default function PropertiesPage() {
  const [scrollY, setScrollY]       = useState(0);
  const [city, setCity]             = useState("All");
  const [type, setType]             = useState("All");
  const [priceRange, setPriceRange] = useState([0, 60000000]);
  const [beds, setBeds]             = useState("Any");
  const [sortBy, setSortBy]         = useState("default");
  const [viewMode, setViewMode]     = useState("grid"); // grid | list
  const [wishlist, setWishlist]     = useState([]);
  const [activeProperty, setActiveProperty] = useState(null);
  const [detailImgIdx, setDetailImgIdx]     = useState(0);
  const [enquireOpen, setEnquireOpen]       = useState(false);
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [visibleCards, setVisibleCards]     = useState(new Set());
  const [cursorPos, setCursorPos]   = useState({ x: -200, y: -200 });
  const ringX = useRef(-200), ringY = useRef(-200);
  const [ringPos, setRingPos]       = useState({ x: -200, y: -200 });
  const rafRef   = useRef();
  const cardRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = (e) => { window._px = e.clientX; window._py = e.clientY; setCursorPos({ x: e.clientX, y: e.clientY }); };
    const loop  = () => {
      ringX.current += ((window._px || -200) - ringX.current) * 0.1;
      ringY.current += ((window._py || -200) - ringY.current) * 0.1;
      setRingPos({ x: ringX.current, y: ringY.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", track);
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", track); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisibleCards(s => new Set([...s, e.target.dataset.id])); }),
      { threshold: 0.1 }
    );
    Object.values(cardRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  });

  const toggleWish = (id, e) => {
    e?.stopPropagation();
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  let filtered = PROPERTIES.filter(p => {
    if (city !== "All" && p.city !== city) return false;
    if (type !== "All" && p.type !== type) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (beds !== "Any" && p.beds < parseInt(beds)) return false;
    return true;
  });
  if (sortBy === "low")    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high")   filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "newest") filtered = [...filtered].sort((a, b) => b.year - a.year);
  if (sortBy === "sqft")   filtered = [...filtered].sort((a, b) => b.sqft - a.sqft);

  const openDetail = (p) => { setActiveProperty(p); setDetailImgIdx(0); setEnquireOpen(false); };

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="pp-ring"   style={{ left: ringPos.x,   top: ringPos.y   }} />

      {/* ── NAV ── */}
      <nav className={`pp-nav${scrollY > 50 ? " scrolled" : ""}`}>
        <div className="pp-logo">Casa<em>Viva</em></div>
        <div className="pp-nav-links">
          {["Properties","Locations","About","Concierge"].map(l => (
            <a key={l} className={l === "Properties" ? "active" : ""}>{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {wishlist.length > 0 && (
            <div className="pp-wish-counter">❤️ {wishlist.length}</div>
          )}
          <button className="pp-nav-cta">Book a Visit</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-bg">
          <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=90" alt="" />
          <div className="pp-hero-overlay" />
        </div>
        <div className="pp-hero-deco">PROPERTIES</div>
        <div className="pp-hero-content">
          <div className="pp-eyebrow"><span className="pp-eyebrow-line"/>Curated Listings<span className="pp-eyebrow-line"/></div>
          <h1 className="pp-hero-h1">Find Your <em>Perfect</em><br/>Address</h1>
          <p className="pp-hero-sub">
            {PROPERTIES.length} exceptional properties across Mumbai, Pune & Delhi — hand-selected for those who refuse to compromise.
          </p>
          <div className="pp-hero-chips">
            {["Mumbai","Pune","Delhi"].map(c => (
              <button key={c} className={`pp-hero-chip${city===c?" active":""}`} onClick={() => { setCity(c); document.getElementById("listings")?.scrollIntoView({ behavior:"smooth" }); }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="pp-hero-stats">
          {[["9", "Properties"], ["3", "Cities"], ["₹95L–5.5Cr", "Price Range"], ["99%", "Satisfaction"]].map(([n,l]) => (
            <div className="pp-hero-stat" key={l}>
              <div className="pp-hero-stat-n">{n}</div>
              <div className="pp-hero-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="pp-filter-bar" id="listings">
        <div className="pp-filter-left">
          {/* CITY */}
          <div className="pp-filter-group">
            {["All","Mumbai","Pune","Delhi"].map(c => (
              <button key={c} className={`pp-chip${city===c?" active":""}`} onClick={() => setCity(c)}><span>{c}</span></button>
            ))}
          </div>
          <div className="pp-filter-sep"/>
          {/* TYPE */}
          <div className="pp-filter-group">
            {["All","Apartment","Villa","Penthouse"].map(t => (
              <button key={t} className={`pp-chip${type===t?" active":""}`} onClick={() => setType(t)}><span>{t}</span></button>
            ))}
          </div>
          <div className="pp-filter-sep"/>
          {/* BEDS */}
          <select className="pp-select" value={beds} onChange={e => setBeds(e.target.value)}>
            <option value="Any">Any Beds</option>
            {["2","3","4","5"].map(b => <option key={b} value={b}>{b}+ Beds</option>)}
          </select>
          {/* ADVANCED */}
          <button className="pp-adv-btn" onClick={() => setFiltersOpen(o => !o)}>
            ⚙ Filters{filtersOpen ? " ▴" : " ▾"}
          </button>
        </div>
        <div className="pp-filter-right">
          <select className="pp-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="newest">Newest First</option>
            <option value="sqft">Largest First</option>
          </select>
          {/* VIEW TOGGLE */}
          <div className="pp-view-toggle">
            <button className={viewMode==="grid"?" active":""} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={viewMode==="list"?" active":""} onClick={() => setViewMode("list")}>☰</button>
          </div>
          <div className="pp-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* ADVANCED FILTER PANEL */}
      {filtersOpen && (
        <div className="pp-adv-panel">
          <div className="pp-adv-section">
            <div className="pp-adv-label">Price Range</div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {[[0,10000000,"Under ₹1Cr"],[10000000,25000000,"₹1–2.5Cr"],[25000000,40000000,"₹2.5–4Cr"],[40000000,60000000,"Above ₹4Cr"]].map(([min,max,label]) => (
                <button key={label} className={`pp-chip${priceRange[0]===min&&priceRange[1]===max?" active":""}`} onClick={() => setPriceRange([min,max])}><span>{label}</span></button>
              ))}
              <button className={`pp-chip${priceRange[0]===0&&priceRange[1]===60000000?" active":""}`} onClick={() => setPriceRange([0,60000000])}><span>All Prices</span></button>
            </div>
          </div>
          <div className="pp-adv-section">
            <div className="pp-adv-label">Status</div>
            <div style={{ display:"flex", gap:12 }}>
              {["Available","Under Offer"].map(s => (
                <span key={s} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", color:"#78726a" }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:STATUS_META[s].dot,display:"inline-block" }}/>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GRID / LIST ── */}
      <div className={`pp-grid-wrap${viewMode==="list"?" list-mode":""}`}>
        {filtered.length === 0 && (
          <div className="pp-empty">
            <div style={{ fontSize:"3rem",marginBottom:16 }}>🔍</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",marginBottom:8 }}>No properties found</div>
            <div style={{ color:"#78726a",fontSize:"0.9rem" }}>Try adjusting your filters</div>
            <button className="pp-reset-btn" onClick={() => { setCity("All"); setType("All"); setBeds("Any"); setPriceRange([0,60000000]); }}>Reset Filters</button>
          </div>
        )}
        {filtered.map((p, idx) => (
          <PropertyCard
            key={p.id} p={p} idx={idx} viewMode={viewMode}
            wished={wishlist.includes(p.id)} onWish={toggleWish}
            onOpen={openDetail} isVisible={visibleCards.has(String(p.id))}
            cardRef={el => { if(el){ cardRefs.current[p.id]=el; el.dataset.id=p.id; } }}
          />
        ))}
      </div>

      {/* ── DETAIL DRAWER ── */}
      {activeProperty && (
        <PropertyDetail
          p={activeProperty} imgIdx={detailImgIdx} setImgIdx={setDetailImgIdx}
          wished={wishlist.includes(activeProperty.id)} onWish={toggleWish}
          onClose={() => setActiveProperty(null)}
          enquireOpen={enquireOpen} setEnquireOpen={setEnquireOpen}
        />
      )}

      {/* ── FOOTER ── */}
      <footer className="pp-footer">
        <div className="pp-footer-inner">
          <div>
            <div className="pp-footer-logo">Casa<em>Viva</em></div>
            <div className="pp-footer-sub">Where luxury meets home.<br/>Mumbai · Pune · Delhi</div>
          </div>
          <div className="pp-footer-links">
            {["Properties","About Us","Book a Visit","Contact"].map(l => <a key={l}>{l}</a>)}
          </div>
          <div className="pp-footer-copy">© 2026 CasaViva. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}

/* ─── PROPERTY CARD ─────────────────────────────────────────────────── */
function PropertyCard({ p, idx, viewMode, wished, onWish, onOpen, isVisible, cardRef }) {
  const [imgHover, setImgHover] = useState(false);
  const tm = TAG_META[p.tag] || TAG_META.Premium;
  const sm = STATUS_META[p.status];

  if (viewMode === "list") return (
    <div className={`pp-list-card${isVisible ? " visible" : ""}`} ref={cardRef} style={{ animationDelay: `${(idx % 4) * 0.08}s` }} onClick={() => onOpen(p)}>
      <div className="pp-list-card-img-wrap">
        <img src={p.imgs[0]} alt={p.title} className="pp-list-card-img" />
        <div className="pp-list-card-tag" style={{ background: tm.bg, color: tm.color, border: `1px solid ${tm.border}` }}>{p.tag}</div>
      </div>
      <div className="pp-list-card-body">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div className="pp-list-card-type">{p.type} · {p.city}</div>
            <div className="pp-list-card-title">{p.title}</div>
            <div className="pp-list-card-loc">📍 {p.location}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="pp-list-card-price">{p.priceLabel}</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"flex-end", marginTop:4 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:sm.dot,display:"inline-block" }}/>
              <span style={{ fontSize:"0.72rem", color:sm.color }}>{p.status}</span>
            </div>
          </div>
        </div>
        <p className="pp-list-card-desc">{p.desc}</p>
        <div className="pp-list-card-meta">
          {[["🛏",p.beds+" Beds"],["🚿",p.baths+" Baths"],["📐",p.sqft.toLocaleString()+" sqft"],["🅿",p.parking+" Parking"],["🏢",p.floor+" Floor"]].map(([ic,val]) => (
            <div key={val} className="pp-meta-item"><span>{ic}</span>{val}</div>
          ))}
        </div>
      </div>
      <div className="pp-list-card-actions">
        <button className="pp-wish-btn" onClick={e => onWish(p.id, e)} style={{ color: wished ? "#ef4444" : "#9ca3af" }}>{wished ? "❤️" : "🤍"}</button>
        <button className="pp-detail-btn">View Details →</button>
      </div>
    </div>
  );

  return (
    <div className={`pp-card${isVisible ? " visible" : ""}`} ref={cardRef} style={{ animationDelay: `${(idx % 3) * 0.1}s` }}
      onMouseEnter={() => setImgHover(true)} onMouseLeave={() => setImgHover(false)} onClick={() => onOpen(p)}>
      {/* IMAGE */}
      <div className="pp-card-img-wrap">
        <img src={p.imgs[0]} alt={p.title} className={`pp-card-img${imgHover ? " hovered" : ""}`} />
        <div className="pp-card-img-overlay" />
        <div className="pp-card-tag" style={{ background: tm.bg, color: tm.color, border: `1px solid ${tm.border}` }}>{p.tag}</div>
        <button className="pp-card-wish" onClick={e => onWish(p.id, e)}>{wished ? "❤️" : "🤍"}</button>
        {p.status !== "Available" && (
          <div className="pp-card-status-banner" style={{ background: sm.dot }}>
            <span>{p.status}</span>
          </div>
        )}
        <div className="pp-card-hover-cta">
          <span>View Details</span>
          <span style={{ fontSize:"1.2rem" }}>→</span>
        </div>
      </div>
      {/* BODY */}
      <div className="pp-card-body">
        <div className="pp-card-type-row">
          <span className="pp-card-type">{p.type}</span>
          <span className="pp-card-city">{p.city}</span>
        </div>
        <div className="pp-card-title">{p.title}</div>
        <div className="pp-card-loc">📍 {p.location}</div>
        <div className="pp-card-meta">
          <div className="pp-meta-item"><span>🛏</span>{p.beds}</div>
          <div className="pp-meta-item"><span>🚿</span>{p.baths}</div>
          <div className="pp-meta-item"><span>📐</span>{(p.sqft/1000).toFixed(1)}K</div>
          <div className="pp-meta-item"><span>🏢</span>{p.floor}</div>
        </div>
        <div className="pp-card-footer">
          <div className="pp-card-price">{p.priceLabel}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:sm.dot,display:"inline-block" }}/>
            <span style={{ fontSize:"0.72rem",color:sm.color }}>{p.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROPERTY DETAIL DRAWER ──────────────────────────────────────── */
function PropertyDetail({ p, imgIdx, setImgIdx, wished, onWish, onClose, enquireOpen, setEnquireOpen }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", msg:"" });
  const tm = TAG_META[p.tag] || TAG_META.Premium;
  const sm = STATUS_META[p.status];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="pp-drawer-overlay" onClick={onClose}>
      <div className="pp-drawer" onClick={e => e.stopPropagation()}>
        {/* CLOSE */}
        <button className="pp-drawer-close" onClick={onClose}>✕</button>

        <div className="pp-drawer-inner">
          {/* LEFT — IMAGES + INFO */}
          <div className="pp-drawer-left">
            {/* MAIN IMAGE */}
            <div className="pp-drawer-main-img-wrap">
              <img src={p.imgs[imgIdx]} alt={p.title} className="pp-drawer-main-img" />
              <div className="pp-drawer-img-overlay"/>
              <div className="pp-drawer-tag" style={{ background:tm.bg, color:tm.color, border:`1px solid ${tm.border}` }}>{p.tag}</div>
              <button className="pp-drawer-wish" onClick={e => onWish(p.id, e)}>{wished ? "❤️" : "🤍"}</button>
            </div>
            {/* THUMBNAILS */}
            <div className="pp-drawer-thumbs">
              {p.imgs.map((img, i) => (
                <div key={i} className={`pp-drawer-thumb${imgIdx===i?" active":""}`} onClick={() => setImgIdx(i)}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>

            {/* KEY DETAILS */}
            <div className="pp-drawer-key-grid">
              {[["Beds",p.beds,"🛏"],["Baths",p.baths,"🚿"],["Area",p.sqft.toLocaleString()+" sqft","📐"],["Floor",p.floor,"🏢"],["Facing",p.facing,"🌅"],["Parking",p.parking+" spots","🅿"],["Built",p.year,"📅"],["Status",p.status,"✓"]].map(([k,v,ic]) => (
                <div key={k} className="pp-drawer-key-item">
                  <div className="pp-drawer-key-icon">{ic}</div>
                  <div className="pp-drawer-key-val">{v}</div>
                  <div className="pp-drawer-key-label">{k}</div>
                </div>
              ))}
            </div>

            {/* AMENITIES */}
            <div className="pp-drawer-section">
              <div className="pp-drawer-section-title">Amenities</div>
              <div className="pp-amenities">
                {p.amenities.map(a => (
                  <div key={a} className="pp-amenity-chip">✦ {a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — DETAILS + ENQUIRY */}
          <div className="pp-drawer-right">
            <div className="pp-drawer-type-row">
              <span className="pp-drawer-type">{p.type}</span>
              <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:sm.dot,display:"inline-block" }}/>
                <span style={{ fontSize:"0.72rem",color:sm.color,fontWeight:600 }}>{p.status}</span>
              </span>
            </div>
            <h2 className="pp-drawer-title">{p.title}</h2>
            <div className="pp-drawer-loc">📍 {p.location}</div>
            <div className="pp-drawer-price">{p.priceLabel}</div>

            <p className="pp-drawer-desc">{p.desc}</p>

            {/* AGENT */}
            <div className="pp-drawer-agent">
              <img src={p.agent.img} alt={p.agent.name} className="pp-drawer-agent-img" />
              <div>
                <div className="pp-drawer-agent-label">Your Agent</div>
                <div className="pp-drawer-agent-name">{p.agent.name}</div>
                <div className="pp-drawer-agent-phone">{p.agent.phone}</div>
              </div>
              <a href={`tel:${p.agent.phone}`} className="pp-agent-call-btn">📞</a>
            </div>

            {/* ENQUIRY TOGGLE */}
            {!enquireOpen ? (
              <div style={{ display:"flex", gap:12, marginTop:24 }}>
                <button className="pp-enquire-btn" onClick={() => setEnquireOpen(true)}>Enquire Now</button>
                <button className="pp-visit-btn">Book a Visit →</button>
              </div>
            ) : (
              <div className="pp-enquiry-form">
                <div className="pp-enq-title">Send an Enquiry</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <div className="pp-field-label">Full Name</div>
                    <input className="pp-field-input" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div>
                    <div className="pp-field-label">Phone</div>
                    <input className="pp-field-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div className="pp-field-label">Email</div>
                  <input className="pp-field-input" placeholder="you@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div className="pp-field-label">Message</div>
                  <textarea className="pp-field-input pp-field-textarea" placeholder="Any questions or requirements?" value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))}/>
                </div>
                <button className="pp-enquire-btn" style={{ width:"100%" }} onClick={() => setEnquireOpen(false)}>Submit Enquiry →</button>
              </div>
            )}

            {/* SHARE / SAVE */}
            <div className="pp-drawer-actions">
              <button className="pp-action-chip" onClick={e => onWish(p.id, e)}>{wished ? "❤️ Saved" : "🤍 Save"}</button>
              <button className="pp-action-chip">🔗 Share</button>
              <button className="pp-action-chip">🖨 Print</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root { --gold:#c9a96e; --gold2:#e8d5a8; --ink:#09090f; --ivory:#faf7f2; --warm:#f2ece0; --muted:#78726a; --border:rgba(201,169,110,0.18); }
  body { font-family:'Jost',sans-serif; background:var(--ivory); color:var(--ink); cursor:none; overflow-x:hidden; }

  .pp-cursor { position:fixed; z-index:9999; pointer-events:none; width:10px; height:10px; border-radius:50%; background:var(--gold); transform:translate(-50%,-50%); mix-blend-mode:multiply; }
  .pp-ring   { position:fixed; z-index:9998; pointer-events:none; width:36px; height:36px; border-radius:50%; border:1px solid var(--gold); opacity:0.4; transform:translate(-50%,-50%); }

  /* NAV */
  .pp-nav { position:fixed; top:0; left:0; right:0; z-index:500; display:flex; align-items:center; justify-content:space-between; padding:0 64px; height:74px; transition:all .4s; }
  .pp-nav.scrolled { background:rgba(250,247,242,0.92); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); box-shadow:0 4px 32px rgba(10,10,15,0.05); }
  .pp-logo { font-family:'Cormorant Garamond',serif; font-size:1.7rem; font-weight:600; color:white; letter-spacing:0.5px; transition:color .4s; }
  .pp-nav.scrolled .pp-logo { color:var(--ink); }
  .pp-logo em { font-style:italic; color:var(--gold); }
  .pp-nav-links { display:flex; gap:36px; }
  .pp-nav-links a { font-size:0.78rem; letter-spacing:1.5px; text-transform:uppercase; font-weight:500; color:rgba(255,255,255,0.75); text-decoration:none; cursor:none; transition:color .3s; position:relative; padding-bottom:2px; }
  .pp-nav.scrolled .pp-nav-links a { color:var(--muted); }
  .pp-nav-links a::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:var(--gold); transform:scaleX(0); transition:transform .3s; }
  .pp-nav-links a:hover::after, .pp-nav-links a.active::after { transform:scaleX(1); }
  .pp-nav-links a:hover, .pp-nav-links a.active { color:white; }
  .pp-nav.scrolled .pp-nav-links a:hover, .pp-nav.scrolled .pp-nav-links a.active { color:var(--ink); }
  .pp-nav-cta { background:transparent; color:white; border:1px solid rgba(255,255,255,0.4); padding:9px 22px; font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; font-weight:500; cursor:none; transition:all .3s; }
  .pp-nav.scrolled .pp-nav-cta { color:var(--ink); border-color:var(--border); }
  .pp-nav-cta:hover { background:var(--gold); border-color:var(--gold); color:var(--ink); }
  .pp-wish-counter { background:rgba(239,68,68,0.12); color:#ef4444; border:1px solid rgba(239,68,68,0.25); padding:6px 14px; font-size:0.75rem; font-weight:600; cursor:none; }

  /* EYEBROW */
  .pp-eyebrow { display:flex; align-items:center; gap:14px; font-size:0.68rem; letter-spacing:4px; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:18px; justify-content:center; }
  .pp-eyebrow-line { width:28px; height:1px; background:rgba(255,255,255,0.3); flex-shrink:0; }

  /* HERO */
  .pp-hero { position:relative; height:88vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; overflow:hidden; }
  .pp-hero-bg { position:absolute; inset:0; }
  .pp-hero-bg img { width:100%; height:100%; object-fit:cover; }
  .pp-hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(9,9,15,0.55) 0%,rgba(9,9,15,0.45) 50%,rgba(9,9,15,0.8) 100%); }
  .pp-hero-deco { position:absolute; font-family:'Cormorant Garamond',serif; font-size:clamp(6rem,14vw,18rem); font-weight:700; color:rgba(201,169,110,0.04); letter-spacing:20px; user-select:none; pointer-events:none; top:50%; transform:translateY(-50%); white-space:nowrap; }
  .pp-hero-content { position:relative; z-index:2; padding:0 40px; animation:ppFadeUp .9s ease both; }
  .pp-hero-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(3rem,6vw,6.5rem); font-weight:300; color:white; line-height:1.0; letter-spacing:-1px; margin-bottom:20px; }
  .pp-hero-h1 em { font-style:italic; color:var(--gold2); }
  .pp-hero-sub { font-size:1rem; color:rgba(255,255,255,0.55); max-width:520px; margin:0 auto 32px; line-height:1.8; }
  .pp-hero-chips { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .pp-hero-chip { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.75); border:1px solid rgba(255,255,255,0.2); padding:9px 24px; font-family:'Jost',sans-serif; font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; cursor:none; transition:all .3s; backdrop-filter:blur(8px); }
  .pp-hero-chip:hover, .pp-hero-chip.active { background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:700; }
  .pp-hero-stats { position:absolute; bottom:0; left:0; right:0; z-index:2; display:flex; background:rgba(9,9,15,0.7); backdrop-filter:blur(20px); border-top:1px solid rgba(201,169,110,0.12); }
  .pp-hero-stat { flex:1; padding:20px; text-align:center; border-right:1px solid rgba(201,169,110,0.1); }
  .pp-hero-stat:last-child { border-right:none; }
  .pp-hero-stat-n { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300; color:var(--gold); line-height:1; }
  .pp-hero-stat-l { font-size:0.62rem; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-top:5px; }

  /* FILTER BAR */
  .pp-filter-bar { background:white; border-bottom:1px solid var(--border); padding:18px 64px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; position:sticky; top:74px; z-index:100; box-shadow:0 4px 24px rgba(10,10,15,0.04); }
  .pp-filter-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .pp-filter-right { display:flex; align-items:center; gap:12px; }
  .pp-filter-group { display:flex; gap:6px; }
  .pp-filter-sep { width:1px; height:28px; background:var(--border); }
  .pp-chip { padding:7px 16px; border:1.5px solid var(--border); background:transparent; font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:1.5px; text-transform:uppercase; font-weight:500; color:var(--muted); cursor:none; transition:all .2s; position:relative; overflow:hidden; }
  .pp-chip span { position:relative; z-index:1; }
  .pp-chip::before { content:''; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .28s; }
  .pp-chip:hover::before { transform:scaleX(1); }
  .pp-chip:hover { color:var(--ink); border-color:var(--gold); }
  .pp-chip.active { background:var(--ink); color:var(--gold2); border-color:var(--ink); }
  .pp-chip.active::before { display:none; }
  .pp-select { padding:7px 16px; border:1.5px solid var(--border); background:white; font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:1px; text-transform:uppercase; color:var(--muted); cursor:none; outline:none; }
  .pp-adv-btn { padding:7px 16px; border:1.5px solid var(--border); background:transparent; font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:1px; text-transform:uppercase; color:var(--muted); cursor:none; transition:all .2s; }
  .pp-adv-btn:hover { border-color:var(--gold); color:var(--gold); }
  .pp-view-toggle { display:flex; border:1.5px solid var(--border); overflow:hidden; }
  .pp-view-toggle button { padding:7px 12px; background:transparent; border:none; font-size:1rem; cursor:none; color:var(--muted); transition:all .2s; }
  .pp-view-toggle button.active { background:var(--ink); color:var(--gold2); }
  .pp-result-count { font-size:0.75rem; color:var(--muted); font-weight:500; white-space:nowrap; }

  /* ADV FILTER PANEL */
  .pp-adv-panel { background:var(--warm); border-bottom:1px solid var(--border); padding:20px 64px; display:flex; gap:48px; align-items:flex-start; }
  .pp-adv-section { display:flex; flex-direction:column; gap:12px; }
  .pp-adv-label { font-size:0.65rem; letter-spacing:3px; text-transform:uppercase; color:var(--gold); font-weight:600; }

  /* GRID */
  @keyframes ppFadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
  .pp-grid-wrap { padding:48px 64px 80px; display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .pp-grid-wrap.list-mode { grid-template-columns:1fr; gap:16px; }

  /* GRID CARD */
  .pp-card { background:white; border:1px solid var(--border); overflow:hidden; cursor:none; transition:transform .35s, box-shadow .35s, border-color .3s; opacity:0; transform:translateY(28px); }
  .pp-card.visible { animation:ppFadeUp .55s ease both; }
  .pp-card:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(201,169,110,0.13); border-color:rgba(201,169,110,0.35); }
  .pp-card-img-wrap { position:relative; height:260px; overflow:hidden; }
  .pp-card-img { width:100%; height:100%; object-fit:cover; transition:transform .7s ease, filter .4s; filter:brightness(0.92); }
  .pp-card-img.hovered { transform:scale(1.07); filter:brightness(0.75); }
  .pp-card-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(9,9,15,0.35) 0%,transparent 50%); }
  .pp-card-tag { position:absolute; top:14px; left:14px; font-size:0.62rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; padding:4px 12px; }
  .pp-card-wish { position:absolute; top:12px; right:12px; width:38px; height:38px; border-radius:50%; background:rgba(9,9,15,0.4); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:1rem; cursor:none; transition:all .25s; }
  .pp-card-wish:hover { background:rgba(239,68,68,0.2); border-color:rgba(239,68,68,0.4); }
  .pp-card-status-banner { position:absolute; bottom:14px; left:0; padding:4px 14px 4px 10px; font-size:0.65rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; color:white; clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%); }
  .pp-card-hover-cta { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:12px; opacity:0; transition:opacity .3s; font-size:0.8rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; color:var(--gold2); }
  .pp-card-img.hovered ~ .pp-card-img-overlay ~ .pp-card-hover-cta,
  .pp-card:hover .pp-card-hover-cta { opacity:1; }
  .pp-card-body { padding:20px; }
  .pp-card-type-row { display:flex; justify-content:space-between; margin-bottom:4px; }
  .pp-card-type { font-size:0.62rem; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:600; }
  .pp-card-city { font-size:0.62rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); }
  .pp-card-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; margin-bottom:4px; line-height:1.2; }
  .pp-card-loc { font-size:0.75rem; color:var(--muted); margin-bottom:14px; }
  .pp-card-meta { display:flex; gap:14px; padding:12px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); margin-bottom:12px; }
  .pp-meta-item { display:flex; align-items:center; gap:5px; font-size:0.75rem; color:var(--muted); }
  .pp-card-footer { display:flex; align-items:center; justify-content:space-between; }
  .pp-card-price { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:400; color:var(--ink); }

  /* LIST CARD */
  .pp-list-card { display:flex; background:white; border:1px solid var(--border); overflow:hidden; cursor:none; transition:all .3s; opacity:0; }
  .pp-list-card.visible { animation:ppFadeUp .5s ease both; }
  .pp-list-card:hover { border-color:rgba(201,169,110,0.4); box-shadow:0 8px 40px rgba(201,169,110,0.1); transform:translateX(4px); }
  .pp-list-card-img-wrap { position:relative; width:260px; flex-shrink:0; overflow:hidden; }
  .pp-list-card-img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .pp-list-card:hover .pp-list-card-img { transform:scale(1.05); }
  .pp-list-card-tag { position:absolute; top:12px; left:12px; font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; padding:3px 10px; }
  .pp-list-card-body { flex:1; padding:24px 28px; }
  .pp-list-card-type { font-size:0.62rem; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:4px; }
  .pp-list-card-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:600; margin-bottom:4px; }
  .pp-list-card-loc { font-size:0.78rem; color:var(--muted); margin-bottom:10px; }
  .pp-list-card-desc { font-size:0.83rem; color:var(--muted); line-height:1.75; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .pp-list-card-meta { display:flex; gap:16px; flex-wrap:wrap; }
  .pp-list-card-price { font-family:'Cormorant Garamond',serif; font-size:1.7rem; font-weight:400; color:var(--ink); }
  .pp-list-card-actions { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:20px 24px; border-left:1px solid var(--border); }
  .pp-wish-btn { background:none; border:none; font-size:1.4rem; cursor:none; transition:transform .2s; }
  .pp-wish-btn:hover { transform:scale(1.2); }
  .pp-detail-btn { background:var(--ink); color:var(--gold2); border:none; padding:10px 18px; font-family:'Jost',sans-serif; font-size:0.72rem; letter-spacing:1.5px; text-transform:uppercase; font-weight:600; cursor:none; white-space:nowrap; transition:background .25s; clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); }
  .pp-detail-btn:hover { background:var(--gold); color:var(--ink); }

  /* EMPTY */
  .pp-empty { grid-column:1/-1; text-align:center; padding:80px; color:var(--muted); }
  .pp-reset-btn { margin-top:20px; background:var(--ink); color:var(--gold2); border:none; padding:12px 28px; font-family:'Jost',sans-serif; font-size:0.75rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:none; }

  /* ── DRAWER ── */
  .pp-drawer-overlay { position:fixed; inset:0; z-index:900; background:rgba(9,9,15,0.65); backdrop-filter:blur(10px); display:flex; justify-content:flex-end; animation:drawerOverlay .3s ease; }
  @keyframes drawerOverlay { from{opacity:0} to{opacity:1} }
  .pp-drawer { width:min(900px, 95vw); height:100vh; background:var(--ivory); overflow-y:auto; position:relative; animation:drawerIn .4s cubic-bezier(.4,0,.2,1); box-shadow:-40px 0 100px rgba(9,9,15,0.3); }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
  .pp-drawer-close { position:sticky; top:0; left:0; z-index:10; float:right; margin:16px 16px 0 0; width:40px; height:40px; background:rgba(9,9,15,0.08); border:none; font-size:1rem; cursor:none; transition:all .2s; display:flex; align-items:center; justify-content:center; }
  .pp-drawer-close:hover { background:var(--ink); color:var(--gold2); }
  .pp-drawer-inner { clear:both; display:grid; grid-template-columns:1fr 1fr; gap:0; }
  .pp-drawer-left { padding:0 0 48px; border-right:1px solid var(--border); }
  .pp-drawer-right { padding:48px 36px 48px 36px; }
  .pp-drawer-main-img-wrap { position:relative; height:320px; overflow:hidden; }
  .pp-drawer-main-img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .pp-drawer-main-img-wrap:hover .pp-drawer-main-img { transform:scale(1.04); }
  .pp-drawer-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(9,9,15,0.3) 0%,transparent 60%); }
  .pp-drawer-tag { position:absolute; top:14px; left:14px; font-size:0.62rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; padding:4px 12px; }
  .pp-drawer-wish { position:absolute; top:12px; right:12px; width:38px; height:38px; border-radius:50%; background:rgba(9,9,15,0.4); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:1rem; cursor:none; }
  .pp-drawer-thumbs { display:flex; gap:8px; padding:12px; overflow-x:auto; }
  .pp-drawer-thumb { width:80px; height:56px; flex-shrink:0; overflow:hidden; cursor:none; border:2px solid transparent; transition:border-color .2s; }
  .pp-drawer-thumb.active { border-color:var(--gold); }
  .pp-drawer-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
  .pp-drawer-thumb:hover img { transform:scale(1.08); }
  .pp-drawer-key-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); margin:16px 0; border:1px solid var(--border); }
  .pp-drawer-key-item { background:white; padding:14px 10px; text-align:center; }
  .pp-drawer-key-icon { font-size:1.1rem; margin-bottom:4px; }
  .pp-drawer-key-val { font-size:0.85rem; font-weight:600; color:var(--ink); }
  .pp-drawer-key-label { font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:2px; }
  .pp-drawer-section { padding:0 16px; }
  .pp-drawer-section-title { font-size:0.65rem; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:12px; font-weight:600; }
  .pp-amenities { display:flex; flex-wrap:wrap; gap:8px; }
  .pp-amenity-chip { padding:6px 14px; border:1px solid var(--border); background:var(--warm); font-size:0.75rem; color:var(--muted); }
  .pp-drawer-type-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .pp-drawer-type { font-size:0.65rem; letter-spacing:3px; text-transform:uppercase; color:var(--gold); font-weight:700; }
  .pp-drawer-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,3vw,2.8rem); font-weight:600; line-height:1.1; margin-bottom:8px; }
  .pp-drawer-loc { font-size:0.82rem; color:var(--muted); margin-bottom:12px; }
  .pp-drawer-price { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:300; color:var(--gold); margin-bottom:20px; letter-spacing:-0.5px; }
  .pp-drawer-desc { font-size:0.88rem; color:var(--muted); line-height:1.85; margin-bottom:24px; border-left:2px solid var(--gold); padding-left:16px; }
  .pp-drawer-agent { display:flex; align-items:center; gap:14px; background:var(--warm); padding:16px; border:1px solid var(--border); margin-bottom:8px; }
  .pp-drawer-agent-img { width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid var(--border); }
  .pp-drawer-agent-label { font-size:0.6rem; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); }
  .pp-drawer-agent-name { font-weight:700; font-size:0.9rem; margin-top:2px; }
  .pp-drawer-agent-phone { font-size:0.75rem; color:var(--muted); margin-top:2px; }
  .pp-agent-call-btn { margin-left:auto; width:40px; height:40px; background:var(--ink); border:none; display:flex; align-items:center; justify-content:center; font-size:1.1rem; cursor:none; flex-shrink:0; }
  .pp-enquire-btn { background:var(--ink); color:var(--gold2); border:none; padding:13px 28px; font-family:'Jost',sans-serif; font-size:0.75rem; letter-spacing:2px; text-transform:uppercase; font-weight:700; cursor:none; transition:all .25s; clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px)); }
  .pp-enquire-btn:hover { background:var(--gold); color:var(--ink); }
  .pp-visit-btn { background:transparent; color:var(--ink); border:1.5px solid var(--border); padding:13px 24px; font-family:'Jost',sans-serif; font-size:0.75rem; letter-spacing:2px; text-transform:uppercase; font-weight:600; cursor:none; transition:all .25s; clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px)); }
  .pp-visit-btn:hover { border-color:var(--gold); color:var(--gold); }
  .pp-enquiry-form { margin-top:16px; background:var(--warm); padding:20px; border:1px solid var(--border); }
  .pp-enq-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; margin-bottom:16px; }
  .pp-field-label { font-size:0.6rem; letter-spacing:2.5px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; font-weight:600; }
  .pp-field-input { width:100%; padding:10px 12px; border:1.5px solid var(--border); background:white; font-family:'Jost',sans-serif; font-size:0.85rem; color:var(--ink); outline:none; transition:border-color .2s; }
  .pp-field-input:focus { border-color:var(--gold); }
  .pp-field-textarea { resize:vertical; min-height:80px; }
  .pp-drawer-actions { display:flex; gap:10px; margin-top:16px; }
  .pp-action-chip { padding:8px 16px; border:1.5px solid var(--border); background:transparent; font-family:'Jost',sans-serif; font-size:0.72rem; color:var(--muted); cursor:none; transition:all .2s; }
  .pp-action-chip:hover { border-color:var(--gold); color:var(--gold); }

  /* FOOTER */
  .pp-footer { background:var(--ink); padding:48px 64px; border-top:1px solid rgba(201,169,110,0.1); }
  .pp-footer-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px; }
  .pp-footer-logo { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300; color:white; }
  .pp-footer-logo em { font-style:italic; color:var(--gold); }
  .pp-footer-sub { font-size:0.75rem; color:rgba(255,255,255,0.25); margin-top:4px; }
  .pp-footer-links { display:flex; gap:28px; }
  .pp-footer-links a { font-size:0.78rem; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.3); text-decoration:none; cursor:none; transition:color .2s; }
  .pp-footer-links a:hover { color:rgba(255,255,255,0.8); }
  .pp-footer-copy { font-size:0.72rem; color:rgba(255,255,255,0.15); }

  /* RESPONSIVE */
  @media (max-width:1100px) {
    .pp-nav { padding:0 36px; }
    .pp-grid-wrap { padding:40px 36px 60px; grid-template-columns:repeat(2,1fr); }
    .pp-filter-bar { padding:16px 36px; }
    .pp-adv-panel { padding:20px 36px; }
    .pp-footer { padding:40px 36px; }
  }
  @media (max-width:820px) {
    .pp-nav-links { display:none; }
    .pp-grid-wrap { grid-template-columns:1fr; padding:28px 20px 48px; }
    .pp-filter-bar { padding:14px 20px; }
    .pp-adv-panel { padding:16px 20px; flex-direction:column; gap:20px; }
    .pp-drawer-inner { grid-template-columns:1fr; }
    .pp-drawer-left { border-right:none; border-bottom:1px solid var(--border); }
    .pp-drawer-right { padding:28px 24px; }
    .pp-hero-chips { gap:8px; }
    .pp-list-card { flex-direction:column; }
    .pp-list-card-img-wrap { width:100%; height:200px; }
    .pp-list-card-actions { flex-direction:row; border-left:none; border-top:1px solid var(--border); padding:14px 20px; }
    .pp-footer { padding:32px 20px; }
    .pp-footer-inner { flex-direction:column; align-items:flex-start; }
  }
`;
