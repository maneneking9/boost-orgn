import { useEffect, useState, useRef } from 'react'

const fmt = (n) => `RWF ${n.toLocaleString('en-RW')}`

const T = {
  en: {
    badge: '🛍️ Welcome to Ayaba Shop',
    title: 'Shop Smarter,\nLive Better',
    sub: 'Discover premium products and services tailored just for you. Fast delivery, great prices, and exceptional support.',
    explore: 'Explore Services',
    contact: 'Contact Us',
    fastDel: 'Fast Delivery', fastDelSub: '1–2 days express',
    premium: 'Premium Quality', premiumSub: 'Top-rated products',
    secure: 'Secure Payment', secureSub: '100% protected',
    statsLabels: ['Happy Customers', 'Products Available', 'On-time Delivery', 'Average Rating'],
    whyTitle: 'Why Choose Ayaba Shop?',
    features: [
      { icon: '🚀', title: 'Express Delivery', desc: 'Get your orders delivered in as fast as 24 hours with our express service.' },
      { icon: '💰', title: 'Best Prices', desc: 'We guarantee the best prices on all products with our price-match policy.' },
      { icon: '🔄', title: 'Easy Returns', desc: 'Not satisfied? Return any item within 30 days, no questions asked.' },
      { icon: '🎧', title: '24/7 Support', desc: 'Our support team is always available to help you with any issue.' },
      { icon: '🔒', title: 'Secure Payments', desc: 'All transactions are encrypted and protected with bank-level security.' },
      { icon: '🌍', title: 'Nationwide Coverage', desc: 'We deliver to all provinces across Rwanda with reliable logistics.' },
      { icon: '📱', title: 'Mobile Money', desc: 'Pay easily with MTN MoMo, Airtel Money, or bank transfer.' },
      { icon: '🏛️', title: 'Gov Services', desc: 'Access Irembo, RRA, and banking agent services all in one place.' },
    ],
    howTitle: 'How It Works',
    steps: [
      { icon: '🔍', title: 'Browse Services', desc: 'Explore our wide range of services and find what you need.' },
      { icon: '✅', title: 'Select & Apply', desc: 'Choose one or multiple services, review the cost breakdown.' },
      { icon: '💳', title: 'Pay Securely', desc: 'Pay via MoMo, Airtel Money, or bank — fast and safe.' },
      { icon: '🎉', title: 'Done!', desc: 'Your service is confirmed and processed immediately.' },
    ],
    featuredTitle: 'Popular Services',
    featuredSub: 'Click a service to see cost and apply',
    addCart: 'Add to Cart',
    multiTitle: 'Apply Multiple Services',
    multiSub: 'Select services below and apply them all at once',
    selected: 'selected',
    totalCost: 'Total Cost',
    applyAll: 'Apply All Selected',
    tax: 'Tax',
    total: 'Total',
    price: 'Price',
    themeTitle: '🎨 Appearance',
    themeSub: 'Switch between light and dark mode',
    lightMode: '☀️ Light Mode',
    darkMode: '🌙 Dark Mode',
    langTitle: '🌐 Language / Ururimi',
    testimonials: 'What Our Customers Say',
    reviews: [
      { name: 'Amina K.', text: 'Ayaba Shop made my Irembo application so easy! Fast and reliable.', stars: 5 },
      { name: 'Jean P.', text: 'I applied for 3 services at once and everything was processed the same day!', stars: 5 },
      { name: 'Grace M.', text: 'The video editing service is top quality. Highly recommend!', stars: 5 },
    ],
  },
  rw: {
    badge: '🛍️ Murakaza neza kuri Ayaba Shop',
    title: 'Gura Neza,\nBana Neza',
    sub: 'Shakisha serivisi nziza zikurikirana nawe. Gutanga vuba, ibiciro byiza, n\'inkunga idasanzwe.',
    explore: 'Reba Serivisi',
    contact: 'Twandikire',
    fastDel: 'Gutanga Vuba', fastDelSub: 'Iminsi 1–2 gusa',
    premium: 'Ubwiza Bw\'Ikirenga', premiumSub: 'Ibicuruzwa byiza cyane',
    secure: 'Kwishyura Neza', secureSub: 'Birindwa 100%',
    statsLabels: ['Abakiriya Bashimye', 'Ibicuruzwa Bihari', 'Gutangwa Ku Gihe', 'Amanota Asanzwe'],
    whyTitle: 'Kuki Uhitamo Ayaba Shop?',
    features: [
      { icon: '🚀', title: 'Gutanga Vuba', desc: 'Ibicuruzwa byawe bitangwa mu masaha 24 gusa.' },
      { icon: '💰', title: 'Ibiciro Byiza', desc: 'Tuguranisha ibiciro byiza cyane ku bicuruzwa byose.' },
      { icon: '🔄', title: 'Gusubiza Byoroshye', desc: 'Niba utishimye, subiza ikintu cyose mu minsi 30.' },
      { icon: '🎧', title: 'Inkunga 24/7', desc: 'Itsinda ryacu rihari buri gihe gufasha ibibazo byawe.' },
      { icon: '🔒', title: 'Kwishyura Neza', desc: 'Ibikorwa byose birinzwe n\'uburinzi bw\'amabanki.' },
      { icon: '🌍', title: 'Gutanga Hose', desc: 'Dutanga mu ntara zose z\'u Rwanda.' },
      { icon: '📱', title: 'Amafaranga ya Telefoni', desc: 'Ishyura na MTN MoMo, Airtel Money, cyangwa banki.' },
      { icon: '🏛️', title: 'Serivisi za Leta', desc: 'Irembo, RRA, n\'agent za banki — ahantu hamwe.' },
    ],
    howTitle: 'Uburyo Bikora',
    steps: [
      { icon: '🔍', title: 'Shakisha Serivisi', desc: 'Reba serivisi zacu zose ukore ihitamo.' },
      { icon: '✅', title: 'Hitamo & Saba', desc: 'Hitamo serivisi imwe cyangwa nyinshi, reba igiciro.' },
      { icon: '💳', title: 'Ishyura Neza', desc: 'Ishyura na MoMo, Airtel, cyangwa banki — vuba kandi neza.' },
      { icon: '🎉', title: 'Byarangiye!', desc: 'Serivisi yawe yemejwe kandi itangwa ako kanya.' },
    ],
    featuredTitle: 'Serivisi Zikunzwe',
    featuredSub: 'Kanda serivisi urebe igiciro ukayisabe',
    addCart: 'Ongeraho mu Kagari',
    multiTitle: 'Saba Serivisi Nyinshi',
    multiSub: 'Hitamo serivisi hano uzisabe zose rimwe',
    selected: 'zahisemo',
    totalCost: 'Igiciro Cyose',
    applyAll: 'Saba Zahisemo Zose',
    tax: 'Umusoro',
    total: 'Igiteranyo',
    price: 'Igiciro',
    themeTitle: '🎨 Isura',
    themeSub: 'Hindura hagati ya mode yera na mode yijimye',
    lightMode: '☀️ Mode Yera',
    darkMode: '🌙 Mode Yijimye',
    langTitle: '🌐 Language / Ururimi',
    testimonials: 'Abakiriya Bacu Bavuga Iki?',
    reviews: [
      { name: 'Amina K.', text: 'Ayaba Shop yampaye ubufasha bwo gusaba Irembo vuba! Ni byiza cyane.', stars: 5 },
      { name: 'Jean P.', text: 'Nasabye serivisi 3 rimwe kandi byose byakozwe uwo munsi!', stars: 5 },
      { name: 'Grace M.', text: 'Serivisi yo guhindura video ni nziza cyane. Ndayisaba!', stars: 5 },
    ],
  },
}

const FEATURED = [
  { id: 7,  name: 'Irembo Services',    icon: '🏛️', price: 500,   tax: 0.0,  duration: 'Ku gusaba',     desc: 'Serivisi za leta — viza, impamyabumenyi, uburenganzira' },
  { id: 14, name: 'MTN MoMo',           icon: '📱', price: 200,   tax: 0.0,  duration: 'Ku bikorwa',    desc: 'Kohereza, akira, ishyura fagitire & gura airtime' },
  { id: 10, name: 'Video Editing',      icon: '🎬', price: 7000,  tax: 0.0,  duration: 'Ku mushinga',   desc: 'Guhindura video nziza ku bibirori & reklamu' },
  { id: 11, name: 'Web Development',    icon: '💻', price: 50000, tax: 0.0,  duration: 'Ku mushinga',   desc: 'Websites zikorwa ku bwenge bwawe' },
  { id: 9,  name: 'Printing Services',  icon: '🖨️', price: 150,   tax: 0.0,  duration: 'Ku ipaji',      desc: 'Gucapura amabara & B/W, guskanisha, lamination' },
  { id: 8,  name: 'RRA Tax Services',   icon: '🧾', price: 1000,  tax: 0.0,  duration: 'Ku gutanga',    desc: 'Kwiyandikisha TIN, gutanga TVA, inkunga ya e-tax' },
]

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = target / (duration / 16)
      const tick = () => {
        start = Math.min(start + step, target)
        setCount(Math.floor(start))
        if (start < target) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return [count, ref]
}

function AnimatedStats({ labels }) {
  const STATS = [
    { icon: '👥', target: 10000, suffix: '+', label: labels[0] },
    { icon: '📦', target: 500,   suffix: '+', label: labels[1] },
    { icon: '🚀', target: 99,    suffix: '%', label: labels[2] },
    { icon: '⭐', target: 49,    suffix: '/5', label: labels[3], divisor: 10 },
  ]
  return (
    <section className="stats-section">
      {STATS.map(s => {
        const [count, ref] = useCountUp(s.target)
        const display = s.divisor ? (count / s.divisor).toFixed(1) : count.toLocaleString()
        return (
          <div key={s.label} className="stat-card" ref={ref}>
            <span className="stat-icon">{s.icon}</span>
            <strong>{display}{s.suffix}</strong>
            <span>{s.label}</span>
          </div>
        )
      })}
    </section>
  )
}

const fmt2 = (n) => `RWF ${(+n).toLocaleString('en-RW')}`

export default function Home({ addToCart, addToast, setPage, dark, setDark, lang, setLang }) {
  const [picked, setPicked] = useState({})
  const [hoveredCard, setHoveredCard] = useState(null)
  const [modalSvc, setModalSvc] = useState(null)

  const t = T[lang] || T.en

  useEffect(() => {
    const handler = (e) => setPage && setPage(e.detail)
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [setPage])

  const togglePick = (s) => {
    setPicked(p => {
      const next = { ...p }
      if (next[s.id]) delete next[s.id]
      else next[s.id] = s
      return next
    })
  }

  const pickedList = Object.values(picked)
  const multiSubtotal = pickedList.reduce((s, x) => s + x.price, 0)
  const multiTax = pickedList.reduce((s, x) => s + x.price * x.tax, 0)
  const multiTotal = multiSubtotal + multiTax

  const handleApplyAll = () => {
    if (!pickedList.length) return
    pickedList.forEach(s => addToCart(s))
    addToast(`✅ ${pickedList.length} ${t.selected} services added to cart!`, 'success')
    setPicked({})
  }

  return (
    <div className="home-page">

      {/* ── LANG + THEME BAR ── */}
      <div className="home-topbar">
        <div className="topbar-group">
          <span className="topbar-label">{t.langTitle}</span>
          <div className="lang-btns">
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇬🇧 English</button>
            <button className={`lang-btn ${lang === 'rw' ? 'active' : ''}`} onClick={() => setLang('rw')}>🇷🇼 Kinyarwanda</button>
          </div>
        </div>
        <div className="topbar-group">
          <span className="topbar-label">{t.themeTitle}</span>
          <div className="theme-btns">
            <button className={`theme-btn ${!dark ? 'active' : ''}`} onClick={() => setDark(false)}>{t.lightMode}</button>
            <button className={`theme-btn ${dark ? 'active' : ''}`} onClick={() => setDark(true)}>{t.darkMode}</button>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">{t.badge}</span>
          <h1 className="hero-title">{t.title.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h1>
          <p className="hero-sub">{t.sub}</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'services' }))}>{t.explore}</button>
            <button className="btn-outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }))}>{t.contact}</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating"><span>📦</span><div><strong>{t.fastDel}</strong><p>{t.fastDelSub}</p></div></div>
          <div className="hero-card floating delay1"><span>⭐</span><div><strong>{t.premium}</strong><p>{t.premiumSub}</p></div></div>
          <div className="hero-card floating delay2"><span>🛡️</span><div><strong>{t.secure}</strong><p>{t.secureSub}</p></div></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <AnimatedStats labels={t.statsLabels} />

      {/* ── FEATURES ── */}
      <section className="features-section">
        <h2>{t.whyTitle}</h2>
        <div className="features-grid features-grid-8">
          {t.features.map((f, i) => (
            <div key={f.title} className="feature-card"
              style={{ animationDelay: `${i * 0.07}s` }}
              onMouseEnter={() => setHoveredCard(f.title)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span className="feature-icon" style={{ transform: hoveredCard === f.title ? 'scale(1.3) rotate(-5deg)' : 'scale(1)', transition: 'transform 0.25s' }}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <h2>{t.howTitle}</h2>
        <div className="how-steps">
          {t.steps.map((s, i) => (
            <div key={s.title} className="how-step">
              <div className="how-num">{i + 1}</div>
              <div className="how-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED SERVICES WITH COST ── */}
      <section className="featured-section">
        <h2>{t.featuredTitle}</h2>
        <p className="featured-sub">{t.featuredSub}</p>
        <div className="featured-grid">
          {FEATURED.map(s => {
            const isPicked = !!picked[s.id]
            return (
              <div key={s.id} className={`featured-card ${isPicked ? 'picked' : ''}`}
                onClick={() => setModalSvc(s)} style={{ cursor: 'pointer' }}>
                <div className="featured-top">
                  <span className="featured-icon">{s.icon}</span>
                  <input type="checkbox" className="featured-check" checked={isPicked}
                    onClick={e => e.stopPropagation()} onChange={() => togglePick(s)} />
                </div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="featured-cost">
                  <div className="cost-line"><span>{t.price}</span><span>{fmt(s.price)}</span></div>
                  <div className="cost-line cost-total"><span>{t.total}</span><span>{fmt(s.price)}</span></div>
                  <div className="cost-duration">/ {s.duration}</div>
                </div>
                <button className="apply-btn" onClick={e => { e.stopPropagation(); addToCart(s); addToast(`${s.name} yongewe mu kagari!`) }}>{t.addCart}</button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── MULTI-SERVICE APPLY ── */}
      <section className="multi-section">
        <h2>{t.multiTitle}</h2>
        <p className="featured-sub">{t.multiSub}</p>
        <div className="multi-grid">
          {FEATURED.map(s => {
            const isPicked = !!picked[s.id]
            return (
              <label key={s.id} className={`multi-item ${isPicked ? 'picked' : ''}`}>
                <input type="checkbox" checked={isPicked} onChange={() => togglePick(s)} />
                <span>{s.icon}</span>
                <span className="multi-name">{s.name}</span>
                <span className="multi-price">{fmt(s.price)}</span>
              </label>
            )
          })}
        </div>
        {pickedList.length > 0 && (
          <div className="multi-summary">
            <div className="multi-summary-rows">
              {pickedList.map(s => (
                <div key={s.id} className="multi-row">
                  <span>{s.icon} {s.name}</span>
                  <span>{fmt(s.price)}</span>
                </div>
              ))}
              <div className="multi-row multi-row-total">
                <span>{t.totalCost} ({pickedList.length} {t.selected})</span>
                <span>{fmt(multiTotal)}</span>
              </div>
            </div>
            <button className="pay-btn multi-apply-btn" onClick={handleApplyAll}>{t.applyAll} — {fmt(multiTotal)}</button>
          </div>
        )}
      </section>

      {/* ── SERVICE DETAIL MODAL ── */}
      {modalSvc && (
        <div className="modal-overlay" onClick={() => setModalSvc(null)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalSvc(null)}>✕</button>
            <div className="modal-service-header">
              <span className="modal-icon">{modalSvc.icon}</span>
              <div>
                <h2>{modalSvc.name}</h2>
                <p className="modal-desc">{modalSvc.desc}</p>
              </div>
            </div>
            <div className="cost-breakdown">
              <h3>💰 Price Breakdown</h3>
              <div className="cost-row"><span>Service Price</span><span>{fmt2(modalSvc.price)}</span></div>
              <div className="cost-row"><span>Tax (0%)</span><span>RWF 0</span></div>
              <div className="cost-row total"><span>Total</span><span style={{ color: 'var(--accent)', fontWeight: 900 }}>{fmt2(modalSvc.price)}</span></div>
              <div className="cost-row duration-row"><span>Billing</span><span>{modalSvc.duration}</span></div>
            </div>
            <div className="modal-actions">
              <button className="icon-add-btn" onClick={() => { addToCart(modalSvc); addToast(`${modalSvc.name} added to cart!`); setModalSvc(null) }}>🛒 Add to Cart</button>
              <button className="confirm-btn" onClick={() => { setPage('services'); setModalSvc(null) }}>⚡ Go to Services →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <h2>{t.testimonials}</h2>
        <div className="testimonials-grid">
          {t.reviews.map(r => (
            <div key={r.name} className="testimonial-card">
              <div className="stars">{'⭐'.repeat(r.stars)}</div>
              <p>"{r.text}"</p>
              <strong>{r.name}</strong>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
