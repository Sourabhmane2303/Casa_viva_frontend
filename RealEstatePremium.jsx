import { useState, useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom"
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
const properties = [
  {
    id: 1,
    title: "Horizon Penthouse",
    location: "Bandra West, Mumbai",
    price: 32500000,
    beds: 4, baths: 3, sqft: 3200,
    tag: "Premium", city: "Mumbai", type: "Penthouse",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=90",
    accent: "#c9a96e",
  },
  {
    id: 2,
    title: "Verdant Garden Villa",
    location: "Koregaon Park, Pune",
    price: 18000000,
    beds: 3, baths: 2, sqft: 2400,
    tag: "New", city: "Pune", type: "Villa",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=90",
    accent: "#4ecb8d",
  },
  {
    id: 3,
    title: "The Urban Loft",
    location: "Connaught Place, Delhi",
    price: 9500000,
    beds: 2, baths: 2, sqft: 1400,
    tag: "Hot", city: "Delhi", type: "Apartment",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=90",
    accent: "#e05c5c",
  },
  {
    id: 4,
    title: "Sky Residency",
    location: "Worli, Mumbai",
    price: 55000000,
    beds: 5, baths: 4, sqft: 5100,
    tag: "Luxury", city: "Mumbai", type: "Penthouse",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=90",
    accent: "#b08fff",
  },
  {
    id: 5,
    title: "Heritage Bungalow",
    location: "Civil Lines, Delhi",
    price: 27000000,
    beds: 4, baths: 3, sqft: 3800,
    tag: "Premium", city: "Delhi", type: "Villa",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=90",
    accent: "#c9a96e",
  },
  {
    id: 6,
    title: "Riverside Sanctum",
    location: "Kalyani Nagar, Pune",
    price: 7800000,
    beds: 2, baths: 1, sqft: 1100,
    tag: "New", city: "Pune", type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=90",
    accent: "#4ecb8d",
  },
];

const formatPrice = (p) =>
  p >= 10000000 ? `₹${(p / 10000000).toFixed(1)} Cr` : `₹${(p / 100000).toFixed(0)} L`;

const tagMeta = {
  Premium: { bg: "linear-gradient(135deg,#c9a96e,#e8d5a8)", color: "#2a1a00" },
  New:     { bg: "linear-gradient(135deg,#4ecb8d,#a8f0d0)", color: "#002a1a" },
  Hot:     { bg: "linear-gradient(135deg,#e05c5c,#f0a8a8)", color: "#2a0000" },
  Luxury:  { bg: "linear-gradient(135deg,#b08fff,#d8c0ff)", color: "#1a0040" },
};

// ─── Backend URL ─────────────────────────────────────────────
const API_URL = "http://localhost:5000";

export default function RealEstatePremium() {
  const navigate = useNavigate();
  const [cityFilter, setCityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy]         = useState("default");
  const [wishlist, setWishlist]     = useState([]);
  const [modal, setModal]           = useState(null);
  const [scrolled, setScrolled]     = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});

  // ─── Form fields for Talk to Expert & Enquire ────────────
  const [form, setForm]         = useState({ name: "", phone: "", email: "", budget: "" });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [formError, setFormError] = useState("");

  const openModal = (val) => {
    setModal(val);
    setForm({ name: "", phone: "", email: "", budget: "" });
    setSuccess(false);
    setFormError("");
  };

  const heroSlides = [
    { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=90", label: "Mumbai" },
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=90", label: "Pune" },
    { img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=90", label: "Delhi" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveHero(h => (h + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisibleCards(s => new Set([...s, e.target.dataset.id]));
      }),
      { threshold: 0.15 }
    );
    Object.values(cardRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [cityFilter, typeFilter, sortBy]);

  const toggleWish = (id, e) => {
    e.stopPropagation();
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  };

  let filtered = properties.filter(p => {
    if (cityFilter !== "All" && p.city !== cityFilter) return false;
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    return true;
  });
  if (sortBy === "low")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    :root {
      --ink:    #0a0a0f;
      --ivory:  #f9f6f0;
      --warm:   #f2ece0;
      --gold:   #c9a96e;
      --gold2:  #e8d5a8;
      --muted:  #7a7060;
      --border: rgba(201,169,110,0.2);
      --glass:  rgba(249,246,240,0.7);
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--ivory);
      color: var(--ink);
      cursor: none;
    }

    /* CUSTOM CURSOR */
    .cv-cursor {
      position: fixed; z-index: 9999; pointer-events: none;
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--gold); mix-blend-mode: multiply;
      transform: translate(-50%,-50%);
      transition: width .3s, height .3s, opacity .3s;
    }
    .cv-cursor-ring {
      position: fixed; z-index: 9998; pointer-events: none;
      width: 40px; height: 40px; border-radius: 50%;
      border: 1px solid var(--gold); opacity: 0.5;
      transform: translate(-50%,-50%);
      transition: all .12s ease-out;
    }

    /* NAV */
    .cv-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 500;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 56px; height: 72px;
      transition: all .4s ease;
    }
    .cv-nav.scrolled {
      background: var(--glass);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border);
      box-shadow: 0 4px 40px rgba(10,10,15,0.06);
    }
    .cv-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.7rem; font-weight: 600; letter-spacing: 1px;
      color: white; text-shadow: 0 2px 20px rgba(0,0,0,0.4);
      transition: color .4s;
    }
    .cv-nav.scrolled .cv-logo { color: var(--ink); text-shadow: none; }
    .cv-logo em { font-style: italic; color: var(--gold); }
    .cv-nav-links { display: flex; gap: 36px; }
    .cv-nav-links a {
      font-size: 0.82rem; letter-spacing: 1.5px; text-transform: uppercase;
      font-weight: 500; color: rgba(255,255,255,0.85);
      text-decoration: none; cursor: none;
      transition: color .3s; position: relative;
    }
    .cv-nav.scrolled .cv-nav-links a { color: var(--muted); }
    .cv-nav-links a::after {
      content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px;
      background: var(--gold); transform: scaleX(0); transition: transform .3s;
    }
    .cv-nav-links a:hover::after { transform: scaleX(1); }
    .cv-nav-links a:hover { color: white; }
    .cv-nav.scrolled .cv-nav-links a:hover { color: var(--ink); }
    .cv-nav-cta {
      background: transparent; color: white;
      border: 1px solid rgba(255,255,255,0.5);
      padding: 9px 24px; border-radius: 2px;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem;
      letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500;
      cursor: none; transition: all .3s;
    }
    .cv-nav.scrolled .cv-nav-cta { color: var(--ink); border-color: var(--border); }
    .cv-nav-cta:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }

    /* HERO */
    .cv-hero {
      position: relative; height: 100vh; overflow: hidden;
      display: flex; align-items: flex-end;
    }
    .cv-hero-slide {
      position: absolute; inset: 0;
      transition: opacity 1.4s ease, transform 8s ease;
    }
    .cv-hero-slide img {
      width: 100%; height: 100%; object-fit: cover;
      transform: scale(1.08);
      transition: transform 8s ease, opacity 1.4s ease;
    }
    .cv-hero-slide.active img { transform: scale(1); }
    .cv-hero-slide.active { opacity: 1; }
    .cv-hero-slide:not(.active) { opacity: 0; }
    .cv-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(10,10,15,0.1) 0%,
        rgba(10,10,15,0.0) 30%,
        rgba(10,10,15,0.55) 70%,
        rgba(10,10,15,0.85) 100%
      );
    }
    .cv-hero-content {
      position: relative; z-index: 10;
      padding: 0 72px 80px;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 40px; width: 100%;
      align-items: flex-end;
    }
    .cv-hero-left {}
    .cv-hero-eyebrow {
      display: inline-flex; align-items: center; gap: 10px;
      font-size: 0.72rem; letter-spacing: 4px; text-transform: uppercase;
      color: var(--gold); margin-bottom: 20px;
    }
    .cv-hero-eyebrow::before {
      content: ''; width: 30px; height: 1px; background: var(--gold);
    }
    .cv-hero-h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3.5rem, 6vw, 6.5rem);
      font-weight: 300; line-height: 1.0; color: white;
      margin-bottom: 28px; letter-spacing: -1px;
    }
    .cv-hero-h1 em { font-style: italic; font-weight: 400; color: var(--gold2); }
    .cv-hero-sub {
      font-size: 0.95rem; color: rgba(255,255,255,0.65);
      line-height: 1.8; max-width: 400px; margin-bottom: 40px;
    }
    .cv-hero-btns { display: flex; gap: 14px; }
    .cv-btn-primary {
      background: var(--gold);
      color: var(--ink);
      border: none; padding: 15px 36px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
      cursor: none; transition: all .3s; clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    }
    .cv-btn-primary:hover { background: var(--gold2); transform: translateY(-2px); }
    .cv-btn-ghost {
      background: transparent; color: rgba(255,255,255,0.8);
      border: 1px solid rgba(255,255,255,0.3); padding: 15px 36px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500;
      cursor: none; transition: all .3s; clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    }
    .cv-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
    .cv-hero-right {
      display: flex; flex-direction: column; align-items: flex-end; gap: 24px;
    }
    .cv-hero-badge {
      background: rgba(249,246,240,0.12);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(201,169,110,0.3);
      border-radius: 4px; padding: 20px 28px;
      text-align: right; color: white;
    }
    .cv-badge-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem; font-weight: 300; color: var(--gold); line-height: 1;
    }
    .cv-badge-lbl { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 4px; }
    .cv-hero-dots {
      display: flex; gap: 8px;
    }
    .cv-dot {
      width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3);
      cursor: none; transition: all .3s;
    }
    .cv-dot.active { background: var(--gold); width: 24px; border-radius: 3px; }
    .cv-hero-location {
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      color: rgba(255,255,255,0.5);
    }
    .cv-hero-location span { color: var(--gold); }

    /* MARQUEE */
    .cv-marquee-wrap {
      background: var(--gold); overflow: hidden;
      padding: 14px 0; border-top: none;
    }
    .cv-marquee {
      display: flex; gap: 0;
      animation: marquee 20s linear infinite;
      width: max-content;
    }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .cv-marquee-item {
      display: flex; align-items: center; gap: 20px; padding: 0 28px;
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      font-weight: 600; color: var(--ink); white-space: nowrap;
    }
    .cv-marquee-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(10,10,15,0.3); }

    /* STATS */
    .cv-stats {
      background: var(--ink);
      display: grid; grid-template-columns: repeat(4,1fr);
      position: relative; overflow: hidden;
    }
    .cv-stats::before {
      content: ''; position: absolute; top: -100px; left: 50%;
      transform: translateX(-50%);
      width: 600px; height: 300px; border-radius: 50%;
      background: radial-gradient(ellipse, rgba(201,169,110,0.08), transparent 70%);
    }
    .cv-stat {
      padding: 56px 40px; text-align: center; position: relative;
    }
    .cv-stat + .cv-stat::before {
      content: ''; position: absolute; left: 0; top: 30%; bottom: 30%;
      width: 1px; background: rgba(201,169,110,0.15);
    }
    .cv-stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3.5rem; font-weight: 300; color: var(--gold);
      line-height: 1; margin-bottom: 8px;
    }
    .cv-stat-lbl {
      font-size: 0.72rem; letter-spacing: 2.5px; text-transform: uppercase;
      color: rgba(255,255,255,0.35);
    }

    /* SECTION HEADER */
    .cv-section-header {
      padding: 100px 72px 0;
      display: flex; align-items: flex-end; justify-content: space-between;
    }
    .cv-section-eyebrow {
      display: flex; align-items: center; gap: 12px;
      font-size: 0.72rem; letter-spacing: 4px; text-transform: uppercase;
      color: var(--gold); margin-bottom: 14px;
    }
    .cv-section-eyebrow::before { content: ''; width: 30px; height: 1px; background: var(--gold); }
    .cv-section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.2rem, 4vw, 3.8rem);
      font-weight: 300; line-height: 1.1; letter-spacing: -0.5px;
    }
    .cv-section-title em { font-style: italic; color: var(--gold); }

    /* FILTERS */
    .cv-filters {
      padding: 40px 72px 36px;
      display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
    }
    .cv-chip {
      padding: 8px 20px; border: 1px solid var(--border);
      background: transparent; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase;
      font-weight: 500; color: var(--muted); cursor: none;
      transition: all .25s; position: relative; overflow: hidden;
    }
    .cv-chip::before {
      content: ''; position: absolute; inset: 0;
      background: var(--gold); transform: scaleX(0); transform-origin: left;
      transition: transform .3s;
    }
    .cv-chip span { position: relative; }
    .cv-chip:hover::before { transform: scaleX(1); }
    .cv-chip:hover { color: var(--ink); border-color: var(--gold); }
    .cv-chip.active { background: var(--ink); color: var(--gold2); border-color: var(--ink); }
    .cv-chip.active::before { display: none; }
    .cv-sep { width: 1px; height: 28px; background: var(--border); margin: 0 6px; }
    .cv-sort {
      padding: 8px 20px; border: 1px solid var(--border);
      background: transparent; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase;
      font-weight: 500; color: var(--muted); cursor: none; outline: none;
      appearance: none;
    }

    /* GRID */
    .cv-grid {
      padding: 0 72px 100px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
    }
    .cv-card {
      position: relative; overflow: hidden; cursor: none;
      opacity: 0; transform: translateY(30px);
      transition: opacity .6s ease, transform .6s ease;
      background: #0a0a0f;
    }
    .cv-card.visible { opacity: 1; transform: translateY(0); }
    .cv-card:nth-child(2) { transition-delay: .1s; }
    .cv-card:nth-child(3) { transition-delay: .2s; }
    .cv-card-img {
      width: 100%; height: 340px; object-fit: cover;
      display: block; transition: transform .7s ease, filter .5s ease;
      filter: brightness(0.88);
    }
    .cv-card:hover .cv-card-img { transform: scale(1.07); filter: brightness(0.7); }
    .cv-card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0) 55%);
      transition: opacity .4s;
    }
    .cv-card-tag {
      position: absolute; top: 20px; left: 20px;
      font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase;
      font-weight: 700; padding: 5px 14px;
    }
    .cv-card-wish {
      position: absolute; top: 16px; right: 16px;
      width: 40px; height: 40px;
      background: rgba(10,10,15,0.4); backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; cursor: none; transition: all .3s;
    }
    .cv-card-wish:hover { background: rgba(201,169,110,0.3); border-color: var(--gold); }
    .cv-card-body {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 28px 28px 24px; color: white;
      transform: translateY(0); transition: transform .4s ease;
    }
    .cv-card-type {
      font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
      color: rgba(255,255,255,0.45); margin-bottom: 6px;
    }
    .cv-card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem; font-weight: 400; line-height: 1.1; margin-bottom: 4px;
    }
    .cv-card-loc { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
    .cv-card-footer {
      display: flex; align-items: center; justify-content: space-between;
      border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;
    }
    .cv-card-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.55rem; font-weight: 400; color: var(--gold2);
    }
    .cv-card-meta { display: flex; gap: 16px; }
    .cv-card-meta-item { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
    .cv-card-cta {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity .4s;
    }
    .cv-card:hover .cv-card-cta { opacity: 1; }
    .cv-card-cta-btn {
      background: var(--gold); color: var(--ink);
      border: none; padding: 12px 28px;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem;
      letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
      cursor: none; transform: translateY(10px); transition: transform .3s;
      clip-path: polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
    }
    .cv-card:hover .cv-card-cta-btn { transform: translateY(0); }

    /* FEATURE SECTION */
    .cv-feature {
      display: grid; grid-template-columns: 1fr 1fr;
      margin: 0; background: var(--warm);
    }
    .cv-feature-img-wrap { position: relative; overflow: hidden; height: 600px; }
    .cv-feature-img { width: 100%; height: 100%; object-fit: cover; }
    .cv-feature-img-label {
      position: absolute; bottom: 32px; right: 32px;
      background: var(--gold); padding: 10px 20px;
      font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
      font-weight: 700; color: var(--ink);
    }
    .cv-feature-content {
      padding: 80px 72px 80px 64px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .cv-feature-list { margin-top: 40px; display: flex; flex-direction: column; gap: 24px; }
    .cv-feature-item {
      display: flex; gap: 20px; align-items: flex-start;
      padding-bottom: 24px; border-bottom: 1px solid var(--border);
    }
    .cv-feature-item:last-child { border-bottom: none; padding-bottom: 0; }
    .cv-feature-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      border: 1px solid var(--border); display: flex; align-items: center;
      justify-content: center; font-size: 1.3rem;
    }
    .cv-feature-item-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;
    }
    .cv-feature-item-sub { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

    /* CTA */
    .cv-cta {
      margin: 0; position: relative; overflow: hidden;
      background: var(--ink);
      padding: 120px 72px;
      display: flex; flex-direction: column; align-items: center;
      text-align: center;
    }
    .cv-cta::before {
      content: ''; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 800px; height: 500px;
      background: radial-gradient(ellipse, rgba(201,169,110,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .cv-cta-lines {
      position: absolute; inset: 0; overflow: hidden;
    }
    .cv-cta-line {
      position: absolute; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent);
    }
    .cv-cta-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.5rem, 5vw, 5rem);
      font-weight: 300; color: white; line-height: 1.1;
      margin: 20px 0 16px; letter-spacing: -1px; position: relative;
    }
    .cv-cta-title em { font-style: italic; color: var(--gold); }
    .cv-cta-sub {
      font-size: 0.95rem; color: rgba(255,255,255,0.4);
      margin-bottom: 48px; max-width: 460px; line-height: 1.8; position: relative;
    }
    .cv-btn-gold {
      background: var(--gold); color: var(--ink);
      border: none; padding: 17px 48px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      letter-spacing: 2px; text-transform: uppercase; font-weight: 700;
      cursor: none; position: relative;
      clip-path: polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
      transition: all .3s;
    }
    .cv-btn-gold:hover { background: var(--gold2); transform: translateY(-3px); }

    /* FOOTER */
    .cv-footer {
      background: #060608;
      padding: 64px 72px 40px;
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 60px;
      border-top: 1px solid rgba(201,169,110,0.1);
    }
    .cv-footer-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem; font-weight: 300; color: white; margin-bottom: 16px;
    }
    .cv-footer-logo em { font-style: italic; color: var(--gold); }
    .cv-footer-desc { font-size: 0.85rem; color: rgba(255,255,255,0.3); line-height: 1.8; max-width: 280px; }
    .cv-footer-col-title {
      font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--gold); margin-bottom: 20px; font-weight: 600;
    }
    .cv-footer-links { display: flex; flex-direction: column; gap: 12px; }
    .cv-footer-links a {
      font-size: 0.85rem; color: rgba(255,255,255,0.3);
      text-decoration: none; cursor: none; transition: color .2s;
    }
    .cv-footer-links a:hover { color: rgba(255,255,255,0.8); }
    .cv-footer-bottom {
      grid-column: 1/-1; border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 28px; display: flex; justify-content: space-between;
      font-size: 0.75rem; color: rgba(255,255,255,0.2);
    }

    /* MODAL */
    .cv-modal-overlay {
      position: fixed; inset: 0; z-index: 800;
      background: rgba(10,10,15,0.8); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center; padding: 24px;
      animation: fadeIn .3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .cv-modal {
      background: var(--ivory); max-width: 520px; width: 100%;
      padding: 0; position: relative; overflow: hidden;
      animation: slideUp .4s ease;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity:0; } to { transform: none; opacity:1; } }
    .cv-modal-top {
      background: var(--ink); padding: 36px 40px 32px; position: relative;
    }
    .cv-modal-close {
      position: absolute; top: 20px; right: 20px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; color: rgba(255,255,255,0.6); cursor: none; transition: all .2s;
    }
    .cv-modal-close:hover { background: rgba(201,169,110,0.2); color: var(--gold); }
    .cv-modal-eyebrow {
      font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
      color: var(--gold); margin-bottom: 10px;
    }
    .cv-modal-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem; font-weight: 300; color: white; line-height: 1.1;
    }
    .cv-modal-body { padding: 36px 40px; }
    .cv-modal-prop {
      display: flex; align-items: center; gap: 12px;
      background: var(--warm); padding: 14px 18px; margin-bottom: 28px;
      border-left: 3px solid var(--gold);
    }
    .cv-modal-prop-name { font-size: 0.85rem; font-weight: 600; }
    .cv-modal-prop-loc { font-size: 0.75rem; color: var(--muted); }
    .cv-modal-prop-price {
      margin-left: auto; font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; color: var(--gold);
    }
    .cv-field { margin-bottom: 16px; }
    .cv-field label {
      display: block; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase;
      color: var(--muted); margin-bottom: 6px; font-weight: 600;
    }
    .cv-input {
      width: 100%; padding: 12px 16px;
      border: 1px solid var(--border); background: white;
      font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--ink);
      outline: none; transition: border-color .2s;
    }
    .cv-input:focus { border-color: var(--gold); }
    .cv-submit {
      width: 100%; background: var(--ink); color: var(--gold2);
      border: none; padding: 15px;
      font-family: 'Outfit', sans-serif; font-size: 0.78rem;
      letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
      cursor: none; margin-top: 8px; transition: background .3s;
    }
    .cv-submit:hover { background: var(--gold); color: var(--ink); }

    /* EMPTY */
    .cv-empty {
      grid-column: 1/-1; padding: 100px; text-align: center;
      color: var(--muted); font-size: 1rem; letter-spacing: 1px;
    }

    /* RESPONSIVE */
    @media (max-width: 1100px) {
      .cv-grid { grid-template-columns: repeat(2,1fr); padding: 0 40px 80px; }
      .cv-hero-content { padding: 0 40px 60px; }
      .cv-section-header { padding: 80px 40px 0; }
      .cv-filters { padding: 32px 40px 28px; }
      .cv-stats { grid-template-columns: repeat(2,1fr); }
      .cv-footer { grid-template-columns: 1fr 1fr; padding: 48px 40px 32px; }
      .cv-feature { grid-template-columns: 1fr; }
      .cv-feature-img-wrap { height: 400px; }
      .cv-feature-content { padding: 60px 40px; }
    }
    @media (max-width: 700px) {
      .cv-nav { padding: 0 24px; }
      .cv-nav-links { display: none; }
      .cv-hero-content { grid-template-columns: 1fr; padding: 0 24px 48px; }
      .cv-hero-right { display: none; }
      .cv-grid { grid-template-columns: 1fr; padding: 0 0 60px; gap: 1px; }
      .cv-section-header { padding: 60px 24px 0; flex-direction: column; align-items: flex-start; gap: 16px; }
      .cv-filters { padding: 24px 24px 20px; }
      .cv-cta { padding: 80px 24px; }
      .cv-footer { grid-template-columns: 1fr; padding: 40px 24px 28px; gap: 36px; }
      .cv-stats { grid-template-columns: repeat(2,1fr); }
    }
  `;

  // cursor
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const dx = e.clientX - ringRef.current.x;
      const dy = e.clientY - ringRef.current.y;
      ringRef.current = { x: ringRef.current.x + dx * 0.15, y: ringRef.current.y + dy * 0.15 };
      setRingPos({ ...ringRef.current });
    };
    const raf = () => {
      const dx = (window._mx || 0) - ringRef.current.x;
      const dy = (window._my || 0) - ringRef.current.y;
      ringRef.current.x += dx * 0.12;
      ringRef.current.y += dy * 0.12;
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      window._raf = requestAnimationFrame(raf);
    };
    const track = (e) => { window._mx = e.clientX; window._my = e.clientY; setCursorPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", track);
    window._raf = requestAnimationFrame(raf);
    return () => { window.removeEventListener("mousemove", track); cancelAnimationFrame(window._raf); };
  }, []);

  const marqItems = ["Luxury Living", "Premium Locations", "Expert Guidance", "Trusted Since 2005", "500Cr+ Sold", "12,000+ Happy Families"];

  return (
    <>
      <style>{css}</style>

      {/* CURSOR */}
      <div className="cv-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cv-cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* NAV */}
      <nav className={`cv-nav${scrolled ? " scrolled" : ""}`}>
        <div className="cv-logo">Casa<em>Viva</em></div>
        <div className="cv-nav-links">
          <a onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })}>Properties</a>
          <a>Locations</a>
          <Link onClick = {()=> navigate("/About")}><a>About</a></Link>
          <a>Concierge</a>
        </div>
        <button className="cv-nav-cta" onClick={()=> navigate("/BookAVisit")}>Book a Visit</button>
      </nav>

      {/* HERO */}
      <section className="cv-hero">
        {heroSlides.map((s, i) => (
          <div key={i} className={`cv-hero-slide${activeHero === i ? " active" : ""}`}>
            <img src={s.img} alt={s.label} />
          </div>
        ))}
        <div className="cv-hero-overlay" />
        <div className="cv-hero-content">
          <div className="cv-hero-left">
            <div className="cv-hero-eyebrow">India's Finest Properties</div>
            <h1 className="cv-hero-h1">
              Where <em>Luxury</em><br />Meets Home
            </h1>
            <p className="cv-hero-sub">
              Curated penthouses, villas, and residences in Mumbai, Pune & Delhi. Your extraordinary life begins with an extraordinary address.
            </p>
            <div className="cv-hero-btns">
              <button className="cv-btn-primary" onClick={() => navigate("/PropertiesPage")}>
                Explore Properties
              </button>
              <button className="cv-btn-ghost" onClick={() => openModal("contact")}>
                Talk to Expert
              </button>
            </div>
          </div>
          <div className="cv-hero-right">
            <div className="cv-hero-badge">
              <div className="cv-badge-num">₹500Cr<span style={{ fontSize: "1.5rem" }}>+</span></div>
              <div className="cv-badge-lbl">Properties Sold</div>
            </div>
            <div className="cv-hero-badge">
              <div className="cv-badge-num">12K<span style={{ fontSize: "1.5rem" }}>+</span></div>
              <div className="cv-badge-lbl">Happy Families</div>
            </div>
            <div className="cv-hero-dots">
              {heroSlides.map((_, i) => (
                <div key={i} className={`cv-dot${activeHero === i ? " active" : ""}`} onClick={() => setActiveHero(i)} />
              ))}
            </div>
            <div className="cv-hero-location">Currently showing: <span>{heroSlides[activeHero].label}</span></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="cv-marquee-wrap">
        <div className="cv-marquee">
          {[...marqItems, ...marqItems].map((t, i) => (
            <div className="cv-marquee-item" key={i}>
              {t} <div className="cv-marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="cv-stats">
        {[
          { num: "12K+", lbl: "Happy Clients" },
          { num: "3.8K+", lbl: "Properties Sold" },
          { num: "18", lbl: "Cities Covered" },
          { num: "99%", lbl: "Satisfaction Rate" },
        ].map(s => (
          <div className="cv-stat" key={s.lbl}>
            <div className="cv-stat-num">{s.num}</div>
            <div className="cv-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </section>

      {/* LISTINGS */}
      <div id="listings">
        <div className="cv-section-header">
          <div>
            <div className="cv-section-eyebrow">Our Portfolio</div>
            <h2 className="cv-section-title">Featured <em>Residences</em></h2>
          </div>
          <div className="cv-sort-wrap" style={{ position: "relative" }}>
            <select className="cv-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="cv-filters">
          {["All","Mumbai","Pune","Delhi"].map(c => (
            <button key={c} className={`cv-chip${cityFilter===c?" active":""}`} onClick={() => setCityFilter(c)}>
              <span>{c}</span>
            </button>
          ))}
          <div className="cv-sep" />
          {["All","Apartment","Villa","Penthouse"].map(t => (
            <button key={t} className={`cv-chip${typeFilter===t?" active":""}`} onClick={() => setTypeFilter(t)}>
              <span>{t}</span>
            </button>
          ))}
        </div>

        <div className="cv-grid">
          {filtered.length === 0 && <div className="cv-empty">No properties found — try adjusting your filters.</div>}
          {filtered.map((p, idx) => {
            const tm = tagMeta[p.tag] || { bg: "#c9a96e", color: "#000" };
            return (
              <div
                key={p.id}
                className={`cv-card${visibleCards.has(String(p.id)) ? " visible" : ""}`}
                ref={el => cardRefs.current[p.id] = el}
                data-id={p.id}
              >
                <img className="cv-card-img" src={p.image} alt={p.title} />
                <div className="cv-card-overlay" />
                <div className="cv-card-tag" style={{ background: tm.bg, color: tm.color }}>
                  {p.tag}
                </div>
                <button className="cv-card-wish" onClick={e => toggleWish(p.id, e)}>
                  {wishlist.includes(p.id) ? "❤️" : "🤍"}
                </button>
                <div className="cv-card-body">
                  <div className="cv-card-type">{p.type} · {p.city}</div>
                  <div className="cv-card-title">{p.title}</div>
                  <div className="cv-card-loc">📍 {p.location}</div>
                  <div className="cv-card-footer">
                    <div className="cv-card-price">{formatPrice(p.price)}</div>
                    <div className="cv-card-meta">
                      <div className="cv-card-meta-item">🛏 {p.beds}</div>
                      <div className="cv-card-meta-item">🚿 {p.baths}</div>
                      <div className="cv-card-meta-item">📐 {(p.sqft/1000).toFixed(1)}K sqft</div>
                    </div>
                  </div>
                </div>
                <div className="cv-card-cta">
                  <button className="cv-card-cta-btn" onClick={() => openModal(p)}>
                    Enquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURE */}
      <section className="cv-feature">
        <div className="cv-feature-img-wrap">
          <img className="cv-feature-img" src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=90" alt="Luxury interior" />
          <div className="cv-feature-img-label">Concierge Service</div>
        </div>
        <div className="cv-feature-content">
          <div className="cv-section-eyebrow">Why CasaViva</div>
          <h2 className="cv-section-title" style={{ fontSize: "2.6rem" }}>
            The <em>Standard</em><br />of Excellence
          </h2>
          <div className="cv-feature-list">
            {[
              { icon: "🏛", title: "Curated Portfolio", sub: "Hand-selected properties that meet our strict standards of quality, location, and value." },
              { icon: "🤝", title: "White-Glove Service", sub: "A dedicated relationship manager guides you from first viewing to final handover." },
              { icon: "📊", title: "Market Intelligence", sub: "Deep data insights help you buy and sell at exactly the right moment." },
            ].map(f => (
              <div className="cv-feature-item" key={f.title}>
                <div className="cv-feature-icon">{f.icon}</div>
                <div>
                  <div className="cv-feature-item-title">{f.title}</div>
                  <div className="cv-feature-item-sub">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-cta">
        <div className="cv-cta-lines">
          {[20, 40, 60, 80].map(top => (
            <div className="cv-cta-line" key={top} style={{ top: `${top}%` }} />
          ))}
        </div>
        <div className="cv-section-eyebrow" style={{ color: "var(--gold)" }}>Begin Your Journey</div>
        <div className="cv-cta-title">
          Your Dream Home<br /><em>Is One Call Away</em>
        </div>
        <div className="cv-cta-sub">
          Free consultation. Expert guidance. No pressure — just the perfect home for the life you deserve.
        </div>
        <button className="cv-btn-gold" onClick={() => openModal("contact")}>
          Schedule Free Consultation
        </button>
      </section>

      {/* FOOTER */}
      <footer className="cv-footer">
        <div>
          <div className="cv-footer-logo">Casa<em>Viva</em></div>
          <div className="cv-footer-desc">
            India's most trusted luxury real estate consultancy. Connecting extraordinary people with extraordinary homes since 2005.
          </div>
        </div>
        <div>
          <div className="cv-footer-col-title">Explore</div>
          <div className="cv-footer-links">
            <a>Properties</a><a>New Launches</a><a>Luxury Villas</a><a>Commercial</a>
          </div>
        </div>
        <div>
          <div className="cv-footer-col-title">Cities</div>
          <div className="cv-footer-links">
            <a>Mumbai</a><a>Pune</a><a>Delhi NCR</a><a>Bangalore</a>
          </div>
        </div>
        <div>
          <div className="cv-footer-col-title">Company</div>
          <div className="cv-footer-links">
            <a>About Us</a><a>Our Team</a><a>Careers</a><a>Contact</a>
          </div>
        </div>
        <div className="cv-footer-bottom">
          <span>© 2026 CasaViva. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </footer>

      {/* MODAL — Talk to Expert & Property Enquiry */}
      {modal && (
        <div className="cv-modal-overlay" onClick={() => setModal(null)}>
          <div className="cv-modal" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-top">
              <button className="cv-modal-close" onClick={() => setModal(null)}>✕</button>
              <div className="cv-modal-eyebrow">
                {modal === "contact" ? "Expert Consultation" : "Property Enquiry"}
              </div>
              <div className="cv-modal-title">
                {modal === "contact" ? "Talk to an Expert" : `Enquire About ${modal.title}`}
              </div>
            </div>
            <div className="cv-modal-body">

              {/* Property tag shown only for property enquiry */}
              {modal !== "contact" && (
                <div className="cv-modal-prop">
                  <div>
                    <div className="cv-modal-prop-name">{modal.title}</div>
                    <div className="cv-modal-prop-loc">{modal.location}</div>
                  </div>
                  <div className="cv-modal-prop-price">{formatPrice(modal.price)}</div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {success ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", marginBottom: 8 }}>
                    {modal === "contact" ? "Request Received!" : "Enquiry Submitted!"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
                    Our team will contact you within 24 hours.
                  </div>
                </div>
              ) : (
                <>
                  {/* FORM FIELDS */}
                  <div className="cv-field">
                    <label>Full Name</label>
                    <input
                      className="cv-input"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="cv-field">
                    <label>Phone Number</label>
                    <input
                      className="cv-input"
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div className="cv-field">
                    <label>Email Address</label>
                    <input
                      className="cv-input"
                      placeholder="rahul@example.com"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  {modal === "contact" && (
                    <div className="cv-field">
                      <label>Budget Range</label>
                      <input
                        className="cv-input"
                        placeholder="e.g. ₹1Cr – ₹3Cr"
                        value={form.budget}
                        onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* ERROR */}
                  {formError && (
                    <div style={{ background: "rgba(192,57,43,.08)", borderLeft: "3px solid #c0392b", padding: "10px 14px", fontSize: "0.8rem", color: "#c0392b", marginTop: 8 }}>
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    className="cv-submit"
                    disabled={loading}
                    onClick={async () => {
                      if (!form.name || !form.phone) {
                        setFormError("Name and phone number are required.");
                        return;
                      }
                      setLoading(true);
                      setFormError("");
                      try {
                        const endpoint = modal === "contact" ? "/api/expert" : "/api/visits";
                        const body = modal === "contact"
                          ? { name: form.name, phone: form.phone, email: form.email, budget: form.budget }
                          : { name: form.name, phone: form.phone, email: form.email, propertyName: modal.title, propertyCity: modal.location, propertyPrice: formatPrice(modal.price), visitDate: "TBD", visitTime: "TBD" };

                        const res  = await fetch(`${API_URL}${endpoint}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(body),
                        });
                        const data = await res.json();
                        if (!res.ok) { setFormError(data.message || "Something went wrong."); return; }
                        setSuccess(true);
                      } catch (err) {
                        setFormError("Cannot connect to server. Make sure node server.js is running.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? "Sending... ⏳" : modal === "contact" ? "Request Consultation →" : "Submit Enquiry →"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
