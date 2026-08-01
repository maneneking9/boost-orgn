import { useState, useMemo, useCallback, useEffect } from 'react'
import { getServices } from '../db'

const fmt = (n) => `RWF ${n.toLocaleString('en-RW')}`

const SUB_OPTIONS = {
  1: {
    label: 'Graphic Design — Choose Service',
    options: [
      { id: 'gd-1', name: 'Banner Design',             icon: '🖼️', price: 2000, desc: 'Custom banners for social media & print' },
      { id: 'gd-2', name: 'Sticker Design',            icon: '🏷️', price: 1500, desc: 'Creative sticker designs for branding' },
      { id: 'gd-3', name: 'Flyer',                     icon: '📄', price: 2500, desc: 'Eye-catching flyers for events & promos' },
      { id: 'gd-4', name: 'Certificate',               icon: '🏆', price: 3000, desc: 'Professional certificate templates' },
      { id: 'gd-5', name: 'Invitation',                icon: '💌', price: 2000, desc: 'Beautiful invitations for all occasions' },
      { id: 'gd-6', name: 'One Ways Sticker Design',   icon: '🚀', price: 1800, desc: 'Unique one-way sticker concepts' },
      { id: 'gd-7', name: 'Branding',                  icon: '✨', price: 5000, desc: 'Complete branding identity package' },
    ],
  },
}

const MSG_HINTS = {
  1: 'e.g. I need a banner design for my business event',
  2: 'e.g. Record a promotional video for my restaurant',
  3: 'e.g. Wedding photography at Kigali Convention Centre',
  4: 'e.g. Live stream my graduation ceremony on Facebook',
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
