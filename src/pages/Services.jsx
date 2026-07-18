import { useState, useMemo, useCallback, useEffect } from 'react'
import { getServices, toggleFavorite, isFavorite, getReviews, addReview, deleteReview, getRatingSummary } from '../db'

const fmt = (n) => `RWF ${n.toLocaleString('en-RW')}`

const SUB_OPTIONS = {
  14: {
    label: 'MTN MoMo — Choose Operation',
    options: [
      { id: 'mtn-1', name: 'Send Money',             icon: '💸', price: 200, desc: 'Send money to any MTN number' },
      { id: 'mtn-2', name: 'Withdraw Cash',           icon: '🏧', price: 300, desc: 'Withdraw cash from MoMo wallet' },
      { id: 'mtn-3', name: 'Pay Bill',                icon: '🧾', price: 100, desc: 'Pay electricity, water, DSTV & more' },
      { id: 'mtn-4', name: 'Buy Airtime',             icon: '📶', price: 50,  desc: 'Top up MTN airtime instantly' },
      { id: 'mtn-5', name: 'Buy Data Bundle',         icon: '🌐', price: 100, desc: 'Purchase MTN internet bundles' },
      { id: 'mtn-6', name: 'MoMo Pay (Merchant)',     icon: '🏪', price: 100, desc: 'Pay at shops using MoMo Pay' },
      { id: 'mtn-7', name: 'International Transfer',  icon: '🌍', price: 500, desc: 'Send money abroad via MoMo' },
    ],
  },
  15: {
    label: 'Airtel Money — Choose Operation',
    options: [
      { id: 'air-1', name: 'Send Money',        icon: '💸', price: 200, desc: 'Send money to any Airtel number' },
      { id: 'air-2', name: 'Withdraw Cash',     icon: '🏧', price: 300, desc: 'Withdraw cash from Airtel wallet' },
      { id: 'air-3', name: 'Pay Utility Bill',  icon: '🧾', price: 100, desc: 'Pay WASAC, REG, DSTV & more' },
      { id: 'air-4', name: 'Buy Airtime',       icon: '📶', price: 50,  desc: 'Top up Airtel airtime instantly' },
      { id: 'air-5', name: 'Buy Data Bundle',   icon: '🌐', price: 100, desc: 'Purchase Airtel internet bundles' },
      { id: 'air-6', name: 'Merchant Payment',  icon: '🏪', price: 100, desc: 'Pay at shops using Airtel Money' },
    ],
  },
  12: {
    label: 'Bank of Kigali — Choose Service',
    options: [
      { id: 'bk-1', name: 'Cash Deposit',    icon: '💰', price: 300, desc: 'Deposit cash into any BK account' },
      { id: 'bk-2', name: 'Cash Withdrawal', icon: '🏧', price: 400, desc: 'Withdraw cash from BK account' },
      { id: 'bk-3', name: 'Fund Transfer',   icon: '🔄', price: 300, desc: 'Transfer funds between accounts' },
      { id: 'bk-4', name: 'Account Opening', icon: '📋', price: 0,   desc: 'Open a new BK account (free)' },
      { id: 'bk-5', name: 'Balance Inquiry', icon: '📊', price: 0,   desc: 'Check your BK account balance (free)' },
      { id: 'bk-6', name: 'Mini Statement',  icon: '🧾', price: 200, desc: 'Print last 5 transactions' },
      { id: 'bk-7', name: 'Bill Payment',    icon: '💡', price: 100, desc: 'Pay utilities via BK agent' },
    ],
  },
  13: {
    label: 'Equity Bank — Choose Service',
    options: [
      { id: 'eq-1', name: 'Cash Deposit',         icon: '💰', price: 300, desc: 'Deposit cash into Equity account' },
      { id: 'eq-2', name: 'Cash Withdrawal',       icon: '🏧', price: 400, desc: 'Withdraw from Equity account' },
      { id: 'eq-3', name: 'Loan Inquiry',          icon: '📋', price: 0,   desc: 'Check loan eligibility (free)' },
      { id: 'eq-4', name: 'Account Services',      icon: '🏦', price: 200, desc: 'Account updates & management' },
      { id: 'eq-5', name: 'Mobile Banking Help',   icon: '📱', price: 0,   desc: 'Equitel setup & support (free)' },
      { id: 'eq-6', name: 'Fund Transfer',         icon: '🔄', price: 300, desc: 'Transfer to any bank account' },
    ],
  },
}

const _STATIC_SERVICES = [
  { id: 1,  name: 'Basic Delivery',       icon: '📦', category: 'Delivery',      price: 2000,  duration: 'Iminsi 5–7',  description: 'Gutanga bisanzwe kuri irembo ryawe.',                                            features: ['Numero yo gukurikirana', 'SMS imenyesha', 'Paketi nziza'],                                              tax: 0.0 },
  { id: 2,  name: 'Express Delivery',     icon: '🚀', category: 'Delivery',      price: 5000,  duration: 'Iminsi 1–2',  description: 'Gutanga vuba cyane ku bikorwa bihutirwa.',                                        features: ['Gutunga mbere', 'Gukurikirana kuri live', 'Umukono usabwa'],                                            tax: 0.0 },
  { id: 3,  name: 'Premium Membership',   icon: '⭐', category: 'Membership',    price: 9900,  duration: 'Ukwezi',      description: 'Fungura amasezerano yihariye no gutanga ubuntu.',                                 features: ['Gutanga ubuntu ku bikorwa byose', 'Kugabanya 10%', 'Kwinjira mbere ku macuruzwa', 'Inkunga ya mbere'], tax: 0.0 },
  { id: 4,  name: 'Product Insurance',    icon: '🛡️', category: 'Protection',    price: 3500,  duration: 'Ku kintu',    description: 'Kurinzwa byuzuye ibyangiritse cyangwa ibihombye.',                               features: ['Kurinzwa ibyangiritse', 'Kurinzwa ibihombye', 'Iminsi 30 yo gutanga ikirego', 'Inkunga 24/7'],         tax: 0.0 },
  { id: 5,  name: 'Gift Wrapping',        icon: '🎁', category: 'Extra',         price: 1500,  duration: 'Ku itumba',   description: "Gupakira impano nziza hamwe n'ubutumwa bwite.",                                   features: ['Impapuro nziza zo gupakira', 'Ruban & bow', 'Ikarita yihariye'],                                        tax: 0.0 },
  { id: 6,  name: 'Installation Service', icon: '🔧', category: 'Extra',         price: 15000, duration: 'Rimwe',       description: "Gushyiraho n'inzobere mu rugo rwawe.",                                            features: ['Inzobere yemejwe', 'Serivisi uwo munsi', "Garantiya y'umwaka 1", 'Gusura ubuntu'],                    tax: 0.0 },
  { id: 7,  name: 'Irembo Services',      icon: '🏛️', category: 'Gov & Finance', price: 500,   duration: 'Ku gusaba',   description: 'Saba serivisi za leta kuri Irembo — viza, impamyabumenyi, uburenganzira.',       features: ["Impamyabumenyi y'amavuko/ubukwe", 'Gusaba viza', "Uburenganzira bw'ubucuruzi", 'Gutunga vuba'],       tax: 0.0 },
  { id: 8,  name: 'RRA Tax Services',     icon: '🧾', category: 'Gov & Finance', price: 1000,  duration: 'Ku gutanga',  description: 'Gutanga imisoro ya RRA, kwiyandikisha TIN & imenyesha.',                          features: ['Kwiyandikisha TIN', 'Gutanga TVA', "Imisoro y'umusaruro", 'Inkunga ya e-tax'],                         tax: 0.0 },
  { id: 9,  name: 'Printing Services',    icon: '🖨️', category: 'Digital',       price: 150,   duration: 'Ku ipaji',    description: 'Gucapura byiza — inyandiko, amafoto, ibendera & byinshi.',                        features: ['Gucapura amabara & B/W', 'Guskanisha & gukopera', 'Lamination', 'Gucapura binini'],                    tax: 0.0 },
  { id: 10, name: 'Video Editing',        icon: '🎬', category: 'Digital',       price: 7000,  duration: 'Ku mushinga', description: 'Guhindura video nziza ku bibirori, reklamu, reels & YouTube.',                     features: ['Color grading', 'Motion graphics', 'Gusana amajwi', 'Gutanga vuba'],                                   tax: 0.0 },
  { id: 11, name: 'Web Development',      icon: '💻', category: 'Digital',       price: 50000, duration: 'Ku mushinga', description: 'Websites & web apps zikorwa ku bwenge bwawe.',                                   features: ['Responsive design', 'E-commerce', 'SEO optimized', "Inkunga y'ukwezi 1 ubuntu"],                       tax: 0.0 },
  { id: 12, name: 'Agent in BK',          icon: '🏦', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za BK agent — gushyira, gukura & kohereza amafaranga.',                  features: ['Gushyira & gukura amafaranga', 'Gufungura konti', 'Kohereza amafaranga', 'Kureba balance'],            tax: 0.0, hasOptions: true },
  { id: 13, name: 'Equity Bank Agent',    icon: '💳', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Equity Bank agent — banki aho uri hose.',                            features: ['Gushyira & gukura', 'Kureba inguzanyo', 'Serivisi za konti', 'Inkunga ya mobile banking'],             tax: 0.0, hasOptions: true },
  { id: 14, name: 'MTN MoMo',             icon: '📱', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'MTN Mobile Money — kohereza, akira, ishyura fagitire & gura airtime.',            features: ['Kohereza & akira amafaranga', 'Kwishyura fagitire', 'Gura airtime', 'MoMo Pay'],                       tax: 0.0, hasOptions: true },
  { id: 15, name: 'Airtel Money',         icon: '📲', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Airtel Money — ibikorwa vuba kandi neza.',                           features: ['Kohereza amafaranga', 'Kwishyura fagitire', 'Airtime & data', 'Kwishyura ku bucuruzi'],                 tax: 0.0, hasOptions: true },
]


const MSG_HINTS = {
  1:  'e.g. Deliver to KG 5 Ave, Kigali — leave at gate',
  2:  'e.g. Urgent delivery to Remera by 3pm today',
  3:  'e.g. Full name: John Doe, Phone: 078...',
  4:  'e.g. Insure my laptop — Samsung Galaxy Book',
  5:  'e.g. Gift message: Happy Birthday Sarah! 🎂',
  6:  'e.g. Install TV wall mount at KN 3 Rd, 2nd floor',
  7:  'e.g. I need a birth certificate for my child',
  8:  'e.g. Register TIN for my new business',
  9:  'e.g. Print 10 pages color + 5 pages B&W, A4 size',
  10: 'e.g. Edit 3-min wedding video, add music & transitions',
  11: 'e.g. E-commerce site for clothing shop, 50 products',
  12: 'e.g. Deposit RWF 50,000 to account 0001234567',
  13: 'e.g. Withdraw RWF 20,000 from Equity account',
  14: 'e.g. Send RWF 5,000 to 0781234567',
  15: 'e.g. Pay WASAC bill — meter number 12345',
}

export default function Services({ addToCart, addToast }) {
  const [SERVICES, setSERVICES] = useState(() => getServices())
  useEffect(() => { setSERVICES(getServices()) }, [])
  const CATEGORIES = useMemo(() => ['All', ...new Set(SERVICES.map(s => s.category))], [SERVICES])
  const [selected, setSelected]     = useState(null)
  const [subOption, setSubOption]   = useState(null)
  const [filter, setFilter]         = useState('All')
  const [search, setSearch]         = useState('')
  const [basket, setBasket]         = useState({})
  const [basketOpen, setBasketOpen] = useState(false)
  const [step, setStep]             = useState(1)   // 1 = write message, 2 = see price
  const [userMsg, setUserMsg]       = useState('')
  const [payDone, setPayDone]       = useState(false)

  const filtered = useMemo(() =>
    SERVICES.filter(s =>
      (filter === 'All' || s.category === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    ), [filter, search]
  )

  const toggleBasket = useCallback((s) => {
    setBasket(b => {
      const next = { ...b }
      if (next[s.id]) delete next[s.id]
      else next[s.id] = s
      return next
    })
  }, [])

  const basketList  = Object.values(basket)
  const basketTotal = basketList.reduce((s, x) => s + x.price, 0)

  const handleApplyBasket = () => {
    basketList.forEach(s => addToCart(s))
    addToast(`✅ Serivisi ${basketList.length} zongewe mu kagari!`, 'success')
    setBasket({})
    setBasketOpen(false)
  }

  const openService = useCallback((s) => {
    setSelected(s)
    setSubOption(null)
    setPayDone(false)
    setStep(1)
    setUserMsg('')
  }, [])

  const closeModal = () => {
    setSelected(null); setSubOption(null)
    setPayDone(false); setStep(1); setUserMsg('')
  }

  const handlePay = (item) => {
    addToCart({ ...item, id: item.id ?? selected.id, userMsg })
    addToast(`✅ ${item.name} — order confirmed!`, 'success')
    setPayDone(true)
  }

  const activeItem = subOption ?? (selected?.hasOptions ? null : selected)
  const activePrice = activeItem?.price ?? 0

  return (
    <section className="services-page">

      {/* HEADER */}
      <div className="services-header">
        <h1>Serivisi Zacu</h1>
        <p>Hitamo serivisi, reba igiciro, usabe rimwe.</p>
        <div className="services-controls">
          <input className="search-input" placeholder="🔍 Shakisha serivisi..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-tabs">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* BASKET BAR */}
      {basketList.length > 0 && (
        <div className="basket-bar">
          <span>🧺 {basketList.length} serivisi zahisemo — Igiteranyo: <strong>{fmt(basketTotal)}</strong></span>
          <div className="basket-bar-actions">
            <button className="basket-bar-btn" onClick={() => setBasketOpen(true)}>Reba & Saba Zose</button>
            <button className="basket-bar-clear" onClick={() => setBasket({})}>✕ Siba</button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="services-grid">
        {filtered.length === 0 && <p className="no-results">Nta serivisi yabonetse.</p>}
        {filtered.map(s => {
          const inBasket = !!basket[s.id]
          return (
            <div key={s.id}
              className={`service-card ${inBasket ? 'in-basket' : ''} ${s.hasOptions ? 'has-options' : ''}`}
              onClick={() => openService(s)}
            >
              {s.photo && <img src={s.photo} alt={s.name} className="service-card-photo" />}
              <div className="service-card-top">
                <div className="service-icon">{s.icon}</div>
                {!s.hasOptions && (
                  <input type="checkbox" className="service-check" checked={inBasket}
                    onClick={e => e.stopPropagation()} onChange={() => toggleBasket(s)} />
                )}
                {s.hasOptions && <span className="options-badge">Hitamo</span>}
              </div>
              <span className="service-category">{s.category}</span>
              <h3>{s.name}</h3>
              <p className="service-desc">{s.description}</p>
              <ul className="service-features">
                {s.features.map(f => <li key={f}>✓ {f}</li>)}
              </ul>
              <div className="service-footer">
                <div className="service-price">
                  {s.hasOptions
                    ? <span className="price-amount options-price">See prices ▾</span>
                    : <><span className="price-amount">{fmt(s.price)}</span><span className="price-duration">/ {s.duration}</span></>
                  }
                </div>
                <button className="apply-btn" onClick={e => { e.stopPropagation(); openService(s) }}>
                  {s.hasOptions ? 'Choose' : 'Apply Now'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* BASKET MODAL */}
      {basketOpen && (
        <div className="modal-overlay" onClick={() => setBasketOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBasketOpen(false)}>✕</button>
            <h2>🧺 Serivisi Zahisemo</h2>
            <div className="basket-list">
              {basketList.map(s => (
                <div key={s.id} className="basket-item">
                  <span>{s.icon} {s.name}</span>
                  <div className="basket-item-right">
                    <span>{fmt(s.price)}</span>
                    <button className="remove-btn" onClick={() => toggleBasket(s)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="payment-box" style={{ marginTop: 16 }}>
              <div className="pay-row pay-total"><span>Igiteranyo</span><span>{fmt(basketTotal)}</span></div>
            </div>
            <button className="pay-btn" style={{ marginTop: 16 }} onClick={handleApplyBasket}>
              💳 Saba Zose — {fmt(basketTotal)}
            </button>
          </div>
        </div>
      )}

      {/* SERVICE MODAL — 2 steps */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            {/* SUCCESS */}
            {payDone ? (
              <div className="success-screen">
                <div className="success-icon">🎉</div>
                <h2>Order Confirmed!</h2>
                <p>You requested <strong>{activeItem?.name ?? selected.name}</strong>.</p>
                {userMsg && (
                  <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 8, fontStyle: 'italic' }}>
                    ✉️ "{userMsg}"
                  </p>
                )}
                <p className="success-amount">
                  Price: <strong>{activePrice === 0 ? 'Free' : fmt(activePrice)}</strong>
                </p>
                <button className="confirm-btn" style={{ marginTop: 16 }} onClick={closeModal}>Done ✓</button>
              </div>
            ) : (
              <>
                {/* Service header */}
                {selected.photo && <img src={selected.photo} alt={selected.name} className="modal-service-photo" />}
                <div className="modal-service-header">
                  <span className="modal-icon">{selected.icon}</span>
                  <div>
                    <h2>{selected.name}</h2>
                    <p className="modal-desc">{selected.description}</p>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="modal-steps">
                  <div className={`modal-step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                  <div className="modal-step-line" />
                  <div className={`modal-step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                  <span className="modal-step-label">
                    {step === 1 ? 'Write your details' : 'Review price & confirm'}
                  </span>
                </div>

                {/* ── STEP 1: write message ── */}
                {step === 1 && (
                  <div className="modal-step-body">
                    <label className="modal-msg-label">✉️ Tell us what you need</label>
                    <textarea
                      className="modal-msg-textarea"
                      rows={4}
                      placeholder={MSG_HINTS[selected.id] || 'Describe your request in detail...'}
                      value={userMsg}
                      onChange={e => setUserMsg(e.target.value)}
                      autoFocus
                    />
                    <p className="modal-msg-hint">The more detail you give, the faster we can help you.</p>

                    {/* Sub-options for services that need them */}
                    {selected.hasOptions && SUB_OPTIONS[selected.id] && (
                      <div className="sub-options-section" style={{ marginTop: 16 }}>
                        <h3 className="sub-options-title">{SUB_OPTIONS[selected.id].label}</h3>
                        <div className="sub-options-grid">
                          {SUB_OPTIONS[selected.id].options.map(opt => (
                            <button key={opt.id}
                              className={`sub-option-card ${subOption?.id === opt.id ? 'active' : ''}`}
                              onClick={() => setSubOption(opt)}
                            >
                              <span className="sub-opt-icon">{opt.icon}</span>
                              <span className="sub-opt-name">{opt.name}</span>
                              <span className="sub-opt-price">{opt.price === 0 ? 'Free' : fmt(opt.price)}</span>
                              <span className="sub-opt-desc">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className="confirm-btn"
                      style={{ marginTop: 20, width: '100%' }}
                      disabled={!userMsg.trim() || (selected.hasOptions && !subOption)}
                      onClick={() => setStep(2)}
                    >
                      {!userMsg.trim()
                        ? '✏️ Write your details first ↑'
                        : selected.hasOptions && !subOption
                        ? 'Select an option above ↑'
                        : 'See Price →'}
                    </button>
                  </div>
                )}

                {/* ── STEP 2: price breakdown ── */}
                {step === 2 && (
                  <div className="modal-step-body">

                    {/* Message preview */}
                    <div className="modal-msg-preview">
                      <span className="modal-msg-preview-label">✉️ Your request</span>
                      <p className="modal-msg-preview-text">{userMsg}</p>
                      <button className="modal-msg-edit" onClick={() => setStep(1)}>✏️ Edit</button>
                    </div>

                    {/* Price breakdown */}
                    <div className="cost-breakdown">
                      <h3>💰 Price Breakdown</h3>
                      <div className="cost-row">
                        <span>{activeItem?.name ?? selected.name}</span>
                        <span>{activePrice === 0 ? 'Free' : fmt(activePrice)}</span>
                      </div>
                      <div className="cost-row">
                        <span>Tax (0%)</span>
                        <span>RWF 0</span>
                      </div>
                      <div className="cost-row total">
                        <span>Total</span>
                        <span style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 800 }}>
                          {activePrice === 0 ? '🆓 Free' : fmt(activePrice)}
                        </span>
                      </div>
                      <div className="cost-row duration-row">
                        <span>Duration</span>
                        <span>{selected.duration}</span>
                      </div>
                    </div>

                    <ul className="modal-features">
                      {selected.features.map(f => <li key={f}>✓ {f}</li>)}
                    </ul>

                    <div className="modal-actions">
                      <button className="icon-add-btn" onClick={() => {
                        addToCart({ ...(activeItem ?? selected), userMsg })
                        addToast(`${activeItem?.name ?? selected.name} added to cart!`)
                        closeModal()
                      }}>🛒 Add to Cart</button>
                      <button className="confirm-btn" onClick={() => handlePay(activeItem ?? selected)}>
                        💳 Pay Now — {activePrice === 0 ? 'Free' : fmt(activePrice)}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
