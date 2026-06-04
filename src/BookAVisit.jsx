import { useState, useEffect, useRef } from "react";

const PROPERTIES = [
  { id: 1, title: "Horizon Penthouse",      location: "Bandra West, Mumbai",    price: "₹3.25 Cr", type: "Penthouse", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { id: 2, title: "Verdant Garden Villa",   location: "Koregaon Park, Pune",    price: "₹1.80 Cr", type: "Villa",     img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: 3, title: "The Urban Loft",         location: "Connaught Place, Delhi", price: "₹95 L",    type: "Apartment", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
  { id: 4, title: "Sky Residency",          location: "Worli, Mumbai",          price: "₹5.50 Cr", type: "Penthouse", img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&q=80" },
  { id: 5, title: "Heritage Bungalow",      location: "Civil Lines, Delhi",     price: "₹2.70 Cr", type: "Villa",     img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 6, title: "Riverside Sanctum",      location: "Kalyani Nagar, Pune",    price: "₹78 L",    type: "Apartment", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" },
];

const TIMES  = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
const AGENTS = [
  { id: 1, name: "Priya Nair",     role: "Senior Consultant", city: "Mumbai", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80", rating: 4.9, deals: 312 },
  { id: 2, name: "Arjun Mehta",    role: "Luxury Specialist",  city: "Delhi",  img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", rating: 4.8, deals: 278 },
  { id: 3, name: "Sneha Kulkarni", role: "Property Advisor",   city: "Pune",   img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80", rating: 4.9, deals: 195 },
];
const STEPS  = ["Property", "Schedule", "Agent", "Details", "Confirm"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Backend base URL ────────────────────────────────────────
const API_URL = "http://localhost:5000";

function generateCalendar(year, month) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();
  const days        = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({ d, date, past: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()), weekend: date.getDay() === 0 });
  }
  return days;
}

export default function BookAVisit() {
  const [step, setStep]         = useState(0);
  const [selected, setSelected] = useState({ property: null, date: null, time: null, agent: null, name: "", phone: "", email: "", message: "", visitType: "in-person" });
  const [calYear, setCalYear]   = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [submitted, setSubmitted]   = useState(false);
  const [bookingRef, setBookingRef] = useState("");   // ← ID returned from backend
  const [loading, setLoading]       = useState(false); // ← disables submit button while saving
  const [error, setError]           = useState("");    // ← shows if backend fails
  const [animDir, setAnimDir]       = useState("forward");
  const [cursorPos, setCursorPos]   = useState({ x: -200, y: -200 });
  const ringX = useRef(-200), ringY = useRef(-200);
  const [ringPos, setRingPos]       = useState({ x: -200, y: -200 });
  const rafRef = useRef();

  useEffect(() => {
    const track = (e) => { window._bvx = e.clientX; window._bvy = e.clientY; setCursorPos({ x: e.clientX, y: e.clientY }); };
    const loop  = () => {
      ringX.current += ((window._bvx || -200) - ringX.current) * 0.1;
      ringY.current += ((window._bvy || -200) - ringY.current) * 0.1;
      setRingPos({ x: ringX.current, y: ringY.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", track);
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", track); cancelAnimationFrame(rafRef.current); };
  }, []);

  const calDays  = generateCalendar(calYear, calMonth);
  const selProp  = PROPERTIES.find(p => p.id === selected.property);
  const selAgent = AGENTS.find(a => a.id === selected.agent);

  const goStep = (n) => { setAnimDir(n > step ? "forward" : "back"); setStep(n); };

  const canNext = () => {
    if (step === 0) return !!selected.property;
    if (step === 1) return !!selected.date && !!selected.time;
    if (step === 2) return !!selected.agent;
    if (step === 3) return selected.name && selected.phone && selected.email;
    return true;
  };

  // ─── SEND DATA TO BACKEND ──────────────────────────────────
  const handleSubmit = async () => {
    if (!canNext()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/visits`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          selected.name,
          phone:         selected.phone,
          email:         selected.email,
          message:       selected.message,
          propertyName:  selProp?.title,
          propertyCity:  selProp?.location,
          propertyPrice: selProp?.price,
          visitDate:     selected.date?.toLocaleDateString("en-IN"),
          visitTime:     selected.time,
          visitType:     selected.visitType,
          agentName:     selAgent?.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      // ✅ Saved to MongoDB — show success
      setBookingRef(data.bookingRef || data.data?._id || "");
      setSubmitted(true);

    } catch (err) {
      setError("Cannot connect to server. Please make sure node server.js is running.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false); setStep(0); setBookingRef(""); setError("");
    setSelected({ property: null, date: null, time: null, agent: null, name: "", phone: "", email: "", message: "", visitType: "in-person" });
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--ink:#09090f;--ivory:#faf7f2;--warm:#f2ece0;--gold:#c9a96e;--gold2:#e8d5a8;--muted:#78726a;--border:rgba(201,169,110,0.22);--red:#c0392b}
    body{font-family:'Outfit',sans-serif;background:var(--ivory);color:var(--ink);cursor:none;min-height:100vh;overflow-x:hidden}
    .bv-cursor{position:fixed;z-index:9999;pointer-events:none;width:10px;height:10px;border-radius:50%;background:var(--gold);transform:translate(-50%,-50%);mix-blend-mode:multiply}
    .bv-ring{position:fixed;z-index:9998;pointer-events:none;width:36px;height:36px;border-radius:50%;border:1px solid var(--gold);opacity:.45;transform:translate(-50%,-50%)}
    .bv-root{display:grid;grid-template-columns:380px 1fr;min-height:100vh}
    .bv-sidebar{background:var(--ink);position:sticky;top:0;height:100vh;display:flex;flex-direction:column;overflow:hidden}
    .bv-sidebar-bg{position:absolute;inset:0;z-index:0}
    .bv-sidebar-img{width:100%;height:100%;object-fit:cover;opacity:.18;transition:opacity .8s}
    .bv-sidebar-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,9,15,.55) 0%,rgba(9,9,15,.9) 60%,rgba(9,9,15,1) 100%)}
    .bv-sidebar-content{position:relative;z-index:2;display:flex;flex-direction:column;height:100%;padding:40px 36px}
    .bv-logo{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:white;letter-spacing:1px;margin-bottom:52px}
    .bv-logo em{font-style:italic;color:var(--gold)}
    .bv-steps{display:flex;flex-direction:column;flex:1}
    .bv-step-item{display:flex;align-items:flex-start;gap:16px;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.06);transition:all .3s}
    .bv-step-item:last-child{border-bottom:none}
    .bv-step-circle{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600;transition:all .4s;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.3)}
    .bv-step-item.done .bv-step-circle{background:var(--gold);border-color:var(--gold);color:var(--ink)}
    .bv-step-item.active .bv-step-circle{border-color:var(--gold);color:var(--gold);box-shadow:0 0 0 4px rgba(201,169,110,.12)}
    .bv-step-label{font-size:.68rem;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.25);margin-bottom:3px;transition:color .3s}
    .bv-step-item.done .bv-step-label,.bv-step-item.active .bv-step-label{color:var(--gold)}
    .bv-step-title{font-size:.92rem;font-weight:500;color:rgba(255,255,255,.4);transition:color .3s}
    .bv-step-item.active .bv-step-title{color:white}
    .bv-step-item.done .bv-step-title{color:rgba(255,255,255,.6)}
    .bv-sidebar-preview{margin-top:auto;padding-top:28px;border-top:1px solid rgba(255,255,255,.08)}
    .bv-preview-label{font-size:.65rem;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.25);margin-bottom:14px}
    .bv-preview-prop{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(201,169,110,.15);padding:12px;margin-bottom:10px;border-radius:2px}
    .bv-preview-prop img{width:48px;height:48px;object-fit:cover;border-radius:2px}
    .bv-preview-prop-name{font-size:.85rem;font-weight:500;color:white}
    .bv-preview-prop-loc{font-size:.72rem;color:rgba(255,255,255,.35);margin-top:2px}
    .bv-preview-row{display:flex;justify-content:space-between;font-size:.78rem;color:rgba(255,255,255,.3);padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)}
    .bv-preview-row span:last-child{color:var(--gold2);font-weight:500}
    .bv-main{padding:60px 64px;display:flex;flex-direction:column;min-height:100vh}
    .bv-main-header{margin-bottom:48px}
    .bv-eyebrow{font-size:.68rem;letter-spacing:4px;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .bv-eyebrow::before{content:'';width:28px;height:1px;background:var(--gold)}
    .bv-main-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,3.5vw,3.2rem);font-weight:300;line-height:1.1}
    .bv-main-title em{font-style:italic;color:var(--gold)}
    .bv-main-sub{font-size:.9rem;color:var(--muted);margin-top:10px;line-height:1.7}
    .bv-progress-bar{height:2px;background:var(--border);margin-bottom:48px;position:relative;border-radius:2px;overflow:hidden}
    .bv-progress-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));transition:width .6s cubic-bezier(.4,0,.2,1);border-radius:2px}
    @keyframes slideInFwd{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInBck{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    .bv-panel{animation:slideInFwd .4s ease both}
    .bv-panel.back{animation:slideInBck .4s ease both}
    .bv-prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .bv-prop-card{border:1.5px solid var(--border);overflow:hidden;cursor:none;transition:all .3s;position:relative;background:white}
    .bv-prop-card:hover{border-color:var(--gold);transform:translateY(-3px);box-shadow:0 12px 40px rgba(201,169,110,.12)}
    .bv-prop-card.selected{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,110,.2)}
    .bv-prop-card-img{width:100%;height:140px;object-fit:cover;display:block}
    .bv-prop-card-body{padding:14px}
    .bv-prop-card-type{font-size:.62rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
    .bv-prop-card-name{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600}
    .bv-prop-card-loc{font-size:.75rem;color:var(--muted);margin-top:2px}
    .bv-prop-card-price{font-size:.82rem;font-weight:600;color:var(--ink);margin-top:8px}
    .bv-prop-card-check{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:.75rem;color:var(--ink);font-weight:700;opacity:0;transform:scale(.5);transition:all .3s}
    .bv-prop-card.selected .bv-prop-card-check{opacity:1;transform:scale(1)}
    .bv-visit-types{display:flex;gap:14px;margin-bottom:36px}
    .bv-visit-type{flex:1;border:1.5px solid var(--border);padding:18px 20px;cursor:none;transition:all .3s;display:flex;align-items:center;gap:14px;background:white}
    .bv-visit-type.selected{border-color:var(--gold);background:rgba(201,169,110,.05)}
    .bv-visit-type-icon{font-size:1.6rem}
    .bv-visit-type-title{font-size:.88rem;font-weight:600}
    .bv-visit-type-sub{font-size:.75rem;color:var(--muted);margin-top:2px}
    .bv-visit-type-radio{margin-left:auto;width:20px;height:20px;border-radius:50%;border:2px solid var(--border);transition:all .3s;flex-shrink:0;position:relative}
    .bv-visit-type.selected .bv-visit-type-radio{border-color:var(--gold);background:var(--gold)}
    .bv-visit-type.selected .bv-visit-type-radio::after{content:'';position:absolute;inset:3px;border-radius:50%;background:white}
    .bv-calendar-wrap{background:white;border:1px solid var(--border);padding:28px;margin-bottom:28px}
    .bv-cal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .bv-cal-month{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600}
    .bv-cal-nav{width:36px;height:36px;border:1px solid var(--border);background:none;font-size:1rem;cursor:none;transition:all .2s;display:flex;align-items:center;justify-content:center}
    .bv-cal-nav:hover{background:var(--gold);border-color:var(--gold);color:var(--ink)}
    .bv-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
    .bv-cal-day-label{font-size:.65rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);text-align:center;padding:8px 0}
    .bv-cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:.82rem;border-radius:2px;cursor:none;transition:all .2s;border:1px solid transparent}
    .bv-cal-day:not(.past):not(.empty):hover{border-color:var(--gold);color:var(--gold)}
    .bv-cal-day.past{color:#d0ccc5;pointer-events:none}
    .bv-cal-day.empty{pointer-events:none}
    .bv-cal-day.selected{background:var(--gold);color:var(--ink);font-weight:700}
    .bv-cal-day.weekend:not(.past):not(.selected){color:var(--red)}
    .bv-time-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .bv-time-slot{padding:12px;border:1px solid var(--border);text-align:center;font-size:.82rem;font-weight:500;cursor:none;transition:all .2s;background:white}
    .bv-time-slot:hover{border-color:var(--gold);color:var(--gold)}
    .bv-time-slot.selected{background:var(--ink);color:var(--gold2);border-color:var(--ink)}
    .bv-agents{display:flex;flex-direction:column;gap:16px}
    .bv-agent-card{display:flex;align-items:center;gap:20px;border:1.5px solid var(--border);padding:20px 24px;cursor:none;transition:all .3s;background:white;position:relative;overflow:hidden}
    .bv-agent-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);transform:scaleY(0);transform-origin:bottom;transition:transform .3s}
    .bv-agent-card:hover::before,.bv-agent-card.selected::before{transform:scaleY(1)}
    .bv-agent-card:hover{border-color:var(--gold);box-shadow:0 8px 32px rgba(201,169,110,.1)}
    .bv-agent-card.selected{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,110,.15)}
    .bv-agent-img{width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--border)}
    .bv-agent-card.selected .bv-agent-img{border-color:var(--gold)}
    .bv-agent-name{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600}
    .bv-agent-role{font-size:.75rem;color:var(--muted);margin-top:2px}
    .bv-agent-city{font-size:.72rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-top:6px}
    .bv-agent-stats{margin-left:auto;text-align:right}
    .bv-agent-rating{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600}
    .bv-agent-rating span{font-size:.9rem;color:var(--gold)}
    .bv-agent-deals{font-size:.72rem;color:var(--muted);margin-top:2px}
    .bv-agent-check{width:32px;height:32px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:var(--ink);font-weight:700;flex-shrink:0;opacity:0;transform:scale(.5);transition:all .3s}
    .bv-agent-card.selected .bv-agent-check{opacity:1;transform:scale(1)}
    .bv-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    .bv-field{display:flex;flex-direction:column;gap:6px}
    .bv-field.full{grid-column:1/-1}
    .bv-label{font-size:.65rem;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);font-weight:600}
    .bv-input{padding:13px 16px;border:1.5px solid var(--border);background:white;font-family:'Outfit',sans-serif;font-size:.9rem;color:var(--ink);outline:none;transition:border-color .2s;border-radius:0}
    .bv-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,110,.08)}
    .bv-textarea{resize:vertical;min-height:100px}
    .bv-confirm-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
    .bv-confirm-block{background:white;border:1px solid var(--border);padding:24px}
    .bv-confirm-block-title{font-size:.65rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:8px}
    .bv-confirm-block-title::before{content:'';width:20px;height:1px;background:var(--gold)}
    .bv-confirm-prop-img{width:100%;height:130px;object-fit:cover;margin-bottom:14px}
    .bv-confirm-prop-name{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600}
    .bv-confirm-prop-loc{font-size:.8rem;color:var(--muted);margin-top:3px}
    .bv-confirm-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(201,169,110,.1);font-size:.85rem}
    .bv-confirm-row:last-child{border-bottom:none}
    .bv-confirm-row-key{color:var(--muted)}
    .bv-confirm-row-val{font-weight:500}
    .bv-confirm-agent{display:flex;align-items:center;gap:14px}
    .bv-confirm-agent img{width:52px;height:52px;border-radius:50%;object-fit:cover}
    .bv-confirm-agent-name{font-weight:600}
    .bv-confirm-agent-role{font-size:.78rem;color:var(--muted);margin-top:2px}
    .bv-terms{font-size:.78rem;color:var(--muted);line-height:1.6;background:var(--warm);padding:16px;border-left:3px solid var(--gold);margin-bottom:24px}
    .bv-error{background:rgba(192,57,43,.08);border-left:3px solid #c0392b;padding:12px 16px;font-size:.82rem;color:#c0392b;margin-top:16px}
    @keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
    .bv-success{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;flex:1;padding:60px 0;animation:slideInFwd .6s ease both}
    .bv-success-icon{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:28px;box-shadow:0 20px 60px rgba(201,169,110,.3);animation:popIn .5s cubic-bezier(.34,1.56,.64,1) .2s both}
    .bv-success-title{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;margin-bottom:12px}
    .bv-success-title em{font-style:italic;color:var(--gold)}
    .bv-success-sub{font-size:.95rem;color:var(--muted);max-width:420px;line-height:1.8;margin-bottom:12px}
    .bv-success-ref{font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);background:rgba(201,169,110,.1);padding:8px 20px;border:1px solid rgba(201,169,110,.25);margin-bottom:36px}
    .bv-success-details{display:flex;gap:32px;flex-wrap:wrap;justify-content:center;margin-bottom:36px}
    .bv-success-detail-label{font-size:.65rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
    .bv-success-detail-val{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600}
    .bv-nav-btns{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:40px;border-top:1px solid var(--border)}
    .bv-btn-back{background:none;border:1.5px solid var(--border);padding:13px 28px;font-family:'Outfit',sans-serif;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;font-weight:500;color:var(--muted);cursor:none;transition:all .25s}
    .bv-btn-back:hover{border-color:var(--ink);color:var(--ink)}
    .bv-btn-next{background:var(--ink);border:none;padding:13px 36px;font-family:'Outfit',sans-serif;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:var(--gold2);cursor:none;transition:all .25s;display:flex;align-items:center;gap:10px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
    .bv-btn-next:hover{background:var(--gold);color:var(--ink)}
    .bv-btn-next:disabled{opacity:.35;pointer-events:none}
    .bv-btn-submit{background:var(--gold);border:none;padding:15px 40px;font-family:'Outfit',sans-serif;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:var(--ink);cursor:none;transition:all .3s;display:flex;align-items:center;gap:10px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
    .bv-btn-submit:hover{background:var(--gold2);transform:translateY(-2px)}
    .bv-btn-submit:disabled{opacity:.6;pointer-events:none}
    .bv-section-label{font-size:.65rem;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:16px;margin-top:28px}
    @media(max-width:820px){.bv-root{grid-template-columns:1fr}.bv-sidebar{display:none}.bv-main{padding:40px 24px}.bv-prop-grid{grid-template-columns:repeat(2,1fr)}.bv-confirm-grid,.bv-form-grid{grid-template-columns:1fr}.bv-time-grid{grid-template-columns:repeat(4,1fr)}.bv-visit-types{flex-direction:column}}
  `;

  const stepTitles = [
    { eyebrow: "Step 1 of 5", title: "Choose a\nProperty",  sub: "Select the property you'd like to visit." },
    { eyebrow: "Step 2 of 5", title: "Pick a\nDate & Time", sub: "Choose a convenient slot and format." },
    { eyebrow: "Step 3 of 5", title: "Select Your\nAgent",  sub: "Our specialists will guide you through every detail." },
    { eyebrow: "Step 4 of 5", title: "Your\nDetails",       sub: "We'll use this to confirm your visit." },
    { eyebrow: "Step 5 of 5", title: "Review &\nConfirm",   sub: "Everything look good? Lock in your visit." },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="bv-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="bv-ring"   style={{ left: ringPos.x,   top: ringPos.y   }} />

      <div className="bv-root">
        {/* SIDEBAR */}
        <aside className="bv-sidebar">
          <div className="bv-sidebar-bg">
            <img className="bv-sidebar-img" src={selProp?.img || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"} alt="" />
            <div className="bv-sidebar-overlay" />
          </div>
          <div className="bv-sidebar-content">
            <div className="bv-logo">Casa<em>Viva</em></div>
            <div className="bv-steps">
              {STEPS.map((s, i) => (
                <div key={s} className={`bv-step-item${i < step ? " done" : ""}${i === step ? " active" : ""}`} onClick={() => i < step && goStep(i)}>
                  <div className="bv-step-circle">{i < step ? "✓" : i + 1}</div>
                  <div>
                    <div className="bv-step-label">Step {i + 1}</div>
                    <div className="bv-step-title">{s}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bv-sidebar-preview">
              <div className="bv-preview-label">Your Selection</div>
              {selProp
                ? <div className="bv-preview-prop"><img src={selProp.img} alt={selProp.title} /><div><div className="bv-preview-prop-name">{selProp.title}</div><div className="bv-preview-prop-loc">{selProp.location}</div></div></div>
                : <div style={{ fontSize:".78rem", color:"rgba(255,255,255,.2)", fontStyle:"italic", paddingBottom:12 }}>No property selected yet</div>
              }
              {selected.date && <div className="bv-preview-row"><span>Date</span><span>{selected.date.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span></div>}
              {selected.time && <div className="bv-preview-row"><span>Time</span><span>{selected.time}</span></div>}
              {selAgent      && <div className="bv-preview-row"><span>Agent</span><span>{selAgent.name}</span></div>}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="bv-main">
          {submitted ? (
            /* ── SUCCESS SCREEN ── */
            <div className="bv-success">
              <div className="bv-success-icon">🏡</div>
              <div className="bv-success-title">Visit <em>Confirmed!</em></div>
              <div className="bv-success-sub">
                Your visit to <strong>{selProp?.title}</strong> has been saved to our system. We'll confirm to <strong>{selected.email}</strong> shortly.
              </div>
              {bookingRef && (
                <div className="bv-success-ref">Booking ID: {String(bookingRef).slice(-8).toUpperCase()}</div>
              )}
              <div className="bv-success-details">
                <div><div className="bv-success-detail-label">Date</div><div className="bv-success-detail-val">{selected.date?.toLocaleDateString("en-IN",{day:"numeric",month:"long"})}</div></div>
                <div><div className="bv-success-detail-label">Time</div><div className="bv-success-detail-val">{selected.time}</div></div>
                <div><div className="bv-success-detail-label">Agent</div><div className="bv-success-detail-val">{selAgent?.name}</div></div>
              </div>
              <button className="bv-btn-next" onClick={resetForm}>Book Another Visit</button>
            </div>
          ) : (
            <>
              <div className="bv-main-header">
                <div className="bv-eyebrow">{stepTitles[step].eyebrow}</div>
                <div className="bv-main-title">
                  {stepTitles[step].title.split("\n").map((line, i) =>
                    i === 1 ? <span key={i}><br /><em>{line}</em></span> : line
                  )}
                </div>
                <div className="bv-main-sub">{stepTitles[step].sub}</div>
              </div>

              <div className="bv-progress-bar">
                <div className="bv-progress-fill" style={{ width: `${((step + 1) / 5) * 100}%` }} />
              </div>

              <div className={`bv-panel${animDir === "back" ? " back" : ""}`} key={step} style={{ flex: 1 }}>

                {/* STEP 0 — PROPERTY */}
                {step === 0 && (
                  <div className="bv-prop-grid">
                    {PROPERTIES.map(p => (
                      <div key={p.id} className={`bv-prop-card${selected.property === p.id ? " selected" : ""}`} onClick={() => setSelected(s => ({ ...s, property: p.id }))}>
                        <div className="bv-prop-card-check">✓</div>
                        <img className="bv-prop-card-img" src={p.img} alt={p.title} />
                        <div className="bv-prop-card-body">
                          <div className="bv-prop-card-type">{p.type}</div>
                          <div className="bv-prop-card-name">{p.title}</div>
                          <div className="bv-prop-card-loc">📍 {p.location}</div>
                          <div className="bv-prop-card-price">{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 1 — SCHEDULE */}
                {step === 1 && (
                  <div>
                    <div className="bv-visit-types">
                      {[{id:"in-person",icon:"🏠",title:"In-Person Visit",sub:"Walk through with your agent"},{id:"virtual",icon:"🎥",title:"Virtual Tour",sub:"Live video walkthrough"},{id:"self",icon:"🔑",title:"Self-Guided Visit",sub:"Explore at your own pace"}].map(vt => (
                        <div key={vt.id} className={`bv-visit-type${selected.visitType === vt.id ? " selected" : ""}`} onClick={() => setSelected(s => ({ ...s, visitType: vt.id }))}>
                          <div className="bv-visit-type-icon">{vt.icon}</div>
                          <div><div className="bv-visit-type-title">{vt.title}</div><div className="bv-visit-type-sub">{vt.sub}</div></div>
                          <div className="bv-visit-type-radio" />
                        </div>
                      ))}
                    </div>
                    <div className="bv-calendar-wrap">
                      <div className="bv-cal-header">
                        <button className="bv-cal-nav" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}>‹</button>
                        <div className="bv-cal-month">{MONTHS[calMonth]} {calYear}</div>
                        <button className="bv-cal-nav" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}>›</button>
                      </div>
                      <div className="bv-cal-grid">
                        {DAYS_SHORT.map(d => <div key={d} className="bv-cal-day-label">{d}</div>)}
                        {calDays.map((day, i) => (
                          day === null
                            ? <div key={`e-${i}`} className="bv-cal-day empty" />
                            : <div key={day.d} className={`bv-cal-day${day.past?" past":""}${day.weekend?" weekend":""}${selected.date?.getDate()===day.d&&selected.date?.getMonth()===calMonth?" selected":""}`} onClick={() => !day.past && setSelected(s => ({ ...s, date: day.date }))}>
                                {day.d}
                              </div>
                        ))}
                      </div>
                    </div>
                    <div className="bv-section-label">Available Time Slots</div>
                    <div className="bv-time-grid">
                      {TIMES.map(t => (
                        <div key={t} className={`bv-time-slot${selected.time === t ? " selected" : ""}`} onClick={() => setSelected(s => ({ ...s, time: t }))}>{t}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2 — AGENT */}
                {step === 2 && (
                  <div className="bv-agents">
                    {AGENTS.map(a => (
                      <div key={a.id} className={`bv-agent-card${selected.agent === a.id ? " selected" : ""}`} onClick={() => setSelected(s => ({ ...s, agent: a.id }))}>
                        <img className="bv-agent-img" src={a.img} alt={a.name} />
                        <div>
                          <div className="bv-agent-name">{a.name}</div>
                          <div className="bv-agent-role">{a.role}</div>
                          <div className="bv-agent-city">{a.city} Specialist</div>
                        </div>
                        <div className="bv-agent-stats">
                          <div className="bv-agent-rating">{a.rating}<span>★</span></div>
                          <div className="bv-agent-deals">{a.deals} deals closed</div>
                        </div>
                        <div className="bv-agent-check">✓</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 3 — DETAILS */}
                {step === 3 && (
                  <div className="bv-form-grid">
                    <div className="bv-field">
                      <label className="bv-label">Full Name *</label>
                      <input className="bv-input" placeholder="Rahul Sharma" value={selected.name} onChange={e => setSelected(s => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className="bv-field">
                      <label className="bv-label">Phone Number *</label>
                      <input className="bv-input" placeholder="+91 98765 43210" type="tel" value={selected.phone} onChange={e => setSelected(s => ({ ...s, phone: e.target.value }))} />
                    </div>
                    <div className="bv-field full">
                      <label className="bv-label">Email Address *</label>
                      <input className="bv-input" placeholder="rahul@example.com" type="email" value={selected.email} onChange={e => setSelected(s => ({ ...s, email: e.target.value }))} />
                    </div>
                    <div className="bv-field full">
                      <label className="bv-label">Message / Special Requests</label>
                      <textarea className="bv-input bv-textarea" placeholder="Any specific areas you'd like to focus on?" value={selected.message} onChange={e => setSelected(s => ({ ...s, message: e.target.value }))} />
                    </div>
                  </div>
                )}

                {/* STEP 4 — CONFIRM */}
                {step === 4 && selProp && selAgent && (
                  <div>
                    <div className="bv-confirm-grid">
                      <div className="bv-confirm-block">
                        <div className="bv-confirm-block-title">Property</div>
                        <img className="bv-confirm-prop-img" src={selProp.img} alt={selProp.title} />
                        <div className="bv-confirm-prop-name">{selProp.title}</div>
                        <div className="bv-confirm-prop-loc">📍 {selProp.location}</div>
                      </div>
                      <div>
                        <div className="bv-confirm-block" style={{ marginBottom: 16 }}>
                          <div className="bv-confirm-block-title">Visit Details</div>
                          <div className="bv-confirm-row"><span className="bv-confirm-row-key">Date</span><span className="bv-confirm-row-val">{selected.date?.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</span></div>
                          <div className="bv-confirm-row"><span className="bv-confirm-row-key">Time</span><span className="bv-confirm-row-val">{selected.time}</span></div>
                          <div className="bv-confirm-row"><span className="bv-confirm-row-key">Type</span><span className="bv-confirm-row-val" style={{ textTransform:"capitalize" }}>{selected.visitType?.replace("-"," ")}</span></div>
                          <div className="bv-confirm-row"><span className="bv-confirm-row-key">Price</span><span className="bv-confirm-row-val" style={{ color:"var(--gold)" }}>{selProp.price}</span></div>
                        </div>
                        <div className="bv-confirm-block">
                          <div className="bv-confirm-block-title">Your Agent</div>
                          <div className="bv-confirm-agent">
                            <img src={selAgent.img} alt={selAgent.name} />
                            <div><div className="bv-confirm-agent-name">{selAgent.name}</div><div className="bv-confirm-agent-role">{selAgent.role}</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bv-confirm-block" style={{ marginBottom: 16 }}>
                      <div className="bv-confirm-block-title">Contact Info</div>
                      <div className="bv-confirm-row"><span className="bv-confirm-row-key">Name</span><span className="bv-confirm-row-val">{selected.name}</span></div>
                      <div className="bv-confirm-row"><span className="bv-confirm-row-key">Phone</span><span className="bv-confirm-row-val">{selected.phone}</span></div>
                      <div className="bv-confirm-row"><span className="bv-confirm-row-key">Email</span><span className="bv-confirm-row-val">{selected.email}</span></div>
                      {selected.message && <div className="bv-confirm-row"><span className="bv-confirm-row-key">Note</span><span className="bv-confirm-row-val">{selected.message}</span></div>}
                    </div>
                    <div className="bv-terms">By confirming, you agree to CasaViva's <strong>Terms of Service</strong>. Cancellations must be made 24 hours in advance.</div>

                    {/* ← Error shown here if submit fails */}
                    {error && <div className="bv-error">⚠️ {error}</div>}
                  </div>
                )}
              </div>

              {/* NAV BUTTONS */}
              <div className="bv-nav-btns">
                <button className="bv-btn-back" style={{ visibility: step === 0 ? "hidden" : "visible" }} onClick={() => goStep(step - 1)}>← Back</button>
                {step < 4
                  ? <button className="bv-btn-next" disabled={!canNext()} onClick={() => goStep(step + 1)}>Continue →</button>
                  : <button className="bv-btn-submit" disabled={loading} onClick={handleSubmit}>{loading ? "Saving... ⏳" : "Confirm Visit 🏡"}</button>
                }
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
