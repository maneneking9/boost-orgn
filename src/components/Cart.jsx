import { useState, useMemo } from 'react'

const fmt = (n) => `RWF ${Math.round(n).toLocaleString('en-RW')}`

const ALL_SERVICES = [
  { id: 1,  name: 'Basic Delivery',       icon: '📦', category: 'Delivery',      price: 2000  },
  { id: 2,  name: 'Express Delivery',     icon: '🚀', category: 'Delivery',      price: 5000  },
  { id: 3,  name: 'Premium Membership',   icon: '⭐', category: 'Membership',    price: 9900  },
  { id: 4,  name: 'Product Insurance',    icon: '🛡️', category: 'Protection',    price: 3500  },
  { id: 5,  name: 'Gift Wrapping',        icon: '🎁', category: 'Extra',         price: 1500  },
  { id: 6,  name: 'Installation Service', icon: '🔧', category: 'Extra',         price: 15000 },
  { id: 7,  name: 'Irembo Services',      icon: '🏛️', category: 'Gov & Finance', price: 500   },
  { id: 8,  name: 'RRA Tax Services',     icon: '🧾', category: 'Gov & Finance', price: 1000  },
  { id: 9,  name: 'Printing Services',    icon: '🖨️', category: 'Digital',       price: 150   },
  { id: 10, name: 'Video Editing',        icon: '🎬', category: 'Digital',       price: 7000  },
  { id: 11, name: 'Web Development',      icon: '💻', category: 'Digital',       price: 50000 },
  { id: 12, name: 'Agent in BK',          icon: '🏦', category: 'Banking',       price: 300   },
  { id: 13, name: 'Equity Bank Agent',    icon: '💳', category: 'Banking',       price: 300   },
  { id: 14, name: 'MTN MoMo',            icon: '📱', category: 'Mobile Money',  price: 200   },
  { id: 15, name: 'Airtel Money',         icon: '📲', category: 'Mobile Money',  price: 200   },
]

// Placeholder hint per service so user knows what to write
const MSG_HINTS = {
  1:  'Andika aderesi yawe yo gutangirizwa...',
  2:  'Andika aderesi & igihe uhitamo gutangirwa...',
  3:  'Andika amazina yawe yuzuye...',
  4:  'Andika izina ry\'ibicuruzwa ugomba kurinzwa...',
  5:  'Andika ubutumwa bw\'impano (optional)...',
  6:  'Andika aderesi & ubwoko bw\'ibikoresho...',
  7:  'Andika serivisi ya Irembo uhitamo (urugero: viza, impamyabumenyi)...',
  8:  'Andika TIN yawe cyangwa ubwoko bw\'imisoro...',
  9:  'Andika umubare w\'amapaji & ubwoko bwo gucapura...',
  10: 'Andika ibisobanuro by\'video (igihe, style, etc.)...',
  11: 'Andika ibisobanuro by\'website uhitamo...',
  12: 'Andika numero ya konti & umubare w\'amafaranga...',
  13: 'Andika numero ya konti & serivisi uhitamo...',
  14: 'Andika numero ya telefoni & umubare w\'amafaranga...',
  15: 'Andika numero ya telefoni & umubare w\'amafaranga...',
}

const CATEGORIES = ['All', ...new Set(ALL_SERVICES.map(s => s.category))]

const PAYMENT_METHODS = [
  { id: 'momo',   label: 'MTN MoMo',     icon: '📱' },
  { id: 'airtel', label: 'Airtel Money', icon: '📲' },
  { id: 'bk',     label: 'BK (Bank)',    icon: '🏦' },
  { id: 'cash',   label: 'Cash',         icon: '💵' },
]

export default function Cart({ cart, onClose, onRemove, addToast, setCart, addToCart }) {
  const [tab, setTab]             = useState('cart')
  const [filter, setFilter]       = useState('All')
  const [search, setSearch]       = useState('')
  const [payMethod, setPayMethod] = useState(null)
  const [paid, setPaid]           = useState(false)
  const [messages, setMessages]   = useState({}) // { [itemId]: string }
  const [expandMsg, setExpandMsg] = useState({}) // { [itemId]: bool }

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0)

  const filtered = useMemo(() =>
    ALL_SERVICES.filter(s =>
      (filter === 'All' || s.category === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    ), [filter, search]
  )

  const inCart = (id) => cart.some(x => x.id === id)

  const handleAddFromBrowse = (s) => {
    addToCart(s)
    addToast(`✅ ${s.name} yongewe mu kagari!`, 'success')
  }

  // Increase qty of existing item
  const increaseQty = (id) => {
    setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x))
  }

  // Decrease qty — remove if reaches 0
  const decreaseQty = (id) => {
    setCart(c => {
      const item = c.find(x => x.id === id)
      if (!item) return c
      if (item.qty <= 1) return c.filter(x => x.id !== id)
      return c.map(x => x.id === id ? { ...x, qty: x.qty - 1 } : x)
    })
  }

  const setMsg = (id, val) => setMessages(m => ({ ...m, [id]: val }))
  const toggleMsg = (id) => setExpandMsg(e => ({ ...e, [id]: !e[id] }))

  const handleCheckout = () => {
    if (!payMethod) { addToast('Hitamo uburyo bwo kwishyura mbere!', 'error'); return }
    setPaid(true)
    addToast('🎉 Itumba ryawe ryakiriwe neza!', 'success')
    setTimeout(() => { setCart([]); onClose() }, 2400)
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="cart-panel-header">
          <h2>🛒 Kagari Kawe</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* TABS */}
        <div className="cart-tabs">
          <button className={`cart-tab ${tab === 'cart' ? 'active' : ''}`} onClick={() => setTab('cart')}>
            Kagari {cart.length > 0 && <span className="cart-tab-badge">{cart.reduce((s,x)=>s+x.qty,0)}</span>}
          </button>
          <button className={`cart-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>
            🔍 Ongeraho
          </button>
          {cart.length > 0 && (
            <button className={`cart-tab ${tab === 'checkout' ? 'active' : ''}`} onClick={() => setTab('checkout')}>
              💳 Ishyura
            </button>
          )}
        </div>

        {/* ── TAB: CART ── */}
        {tab === 'cart' && (
          <div className="cart-tab-body">
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <span>🛒</span>
                <p>Kagari kawe ni ubusa.</p>
                <button className="confirm-btn" onClick={() => setTab('browse')}>Ongeraho Serivisi</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item-card">

                      {/* Item row */}
                      <div className="cart-item-row">
                        <span className="cart-item-icon">{item.icon}</span>
                        <div className="cart-item-info">
                          <strong>{item.name}</strong>
                          <span className="cart-item-cat">{item.category}</span>
                          <span className="cart-item-unit">{fmt(item.price)} / serivisi</span>
                        </div>
                        <div className="cart-item-right">
                          <span className="cart-item-total">{fmt(item.price * item.qty)}</span>
                          <button className="remove-btn" onClick={() => onRemove(item.id)} title="Siba">🗑️</button>
                        </div>
                      </div>

                      {/* Qty controls */}
                      <div className="cart-item-controls">
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => decreaseQty(item.id)}>−</button>
                          <span className="qty-value">{item.qty}</span>
                          <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                          <span className="qty-label">× {fmt(item.price)} = <strong>{fmt(item.price * item.qty)}</strong></span>
                        </div>
                        <button
                          className="msg-toggle-btn"
                          onClick={() => toggleMsg(item.id)}
                        >
                          ✉️ {expandMsg[item.id] ? 'Hisha ubutumwa' : messages[item.id] ? '✓ Ubutumwa bwanditswe' : 'Andika ubutumwa'}
                        </button>
                      </div>

                      {/* Message textarea */}
                      {expandMsg[item.id] && (
                        <div className="cart-msg-box">
                          <textarea
                            className="cart-msg-input"
                            rows={3}
                            placeholder={MSG_HINTS[item.id] || 'Andika ubutumwa bwawe...'}
                            value={messages[item.id] || ''}
                            onChange={e => setMsg(item.id, e.target.value)}
                          />
                          {messages[item.id] && (
                            <span className="cart-msg-saved">✓ Ubutumwa bwabitswe</span>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Auto total */}
                <div className="cart-totals">
                  <div className="cart-total-row">
                    <span>Serivisi ({cart.reduce((s,x)=>s+x.qty,0)})</span>
                    <span>{fmt(total)}</span>
                  </div>
                  <div className="cart-total-row cart-grand-total">
                    <span>💰 Igiteranyo Cyose</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button className="icon-add-btn" onClick={() => setTab('browse')}>+ Ongeraho</button>
                  <button className="confirm-btn" onClick={() => setTab('checkout')}>Komeza Kwishyura →</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB: BROWSE ── */}
        {tab === 'browse' && (
          <div className="cart-tab-body">
            <input
              className="search-input"
              placeholder="🔍 Shakisha serivisi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div className="cart-filter-tabs">
              {CATEGORIES.map(c => (
                <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`}
                  onClick={() => setFilter(c)}>{c}
                </button>
              ))}
            </div>
            <div className="browse-list">
              {filtered.map(s => (
                <div key={s.id} className={`browse-item ${inCart(s.id) ? 'in-cart' : ''}`}>
                  <span className="browse-icon">{s.icon}</span>
                  <div className="browse-info">
                    <strong>{s.name}</strong>
                    <span>{s.category} — {fmt(s.price)}</span>
                  </div>
                  <button
                    className={`browse-add-btn ${inCart(s.id) ? 'added' : ''}`}
                    onClick={() => handleAddFromBrowse(s)}
                  >
                    {inCart(s.id) ? '+ Ongeraho' : '+ Ongeraho'}
                  </button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="browse-footer">
                <span>{cart.reduce((s,x)=>s+x.qty,0)} serivisi — {fmt(total)}</span>
                <button className="confirm-btn" onClick={() => setTab('cart')}>Reba Kagari →</button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CHECKOUT ── */}
        {tab === 'checkout' && (
          <div className="cart-tab-body">
            {paid ? (
              <div className="success-screen">
                <div className="success-icon">🎉</div>
                <h2>Kwishyura Byagenze Neza!</h2>
                <p>Serivisi zawe zakiriwe.</p>
                <p className="success-amount">Warishyuye: <strong>{fmt(total)}</strong></p>
              </div>
            ) : (
              <>
                {/* Order summary with messages */}
                <div className="checkout-summary">
                  <h3>📋 Incamake y'Itumba</h3>
                  {cart.map(item => (
                    <div key={item.id} className="checkout-item-block">
                      <div className="checkout-row">
                        <span>{item.icon} {item.name} ×{item.qty}</span>
                        <span>{fmt(item.price * item.qty)}</span>
                      </div>
                      {messages[item.id] && (
                        <div className="checkout-msg-preview">
                          ✉️ <em>"{messages[item.id]}"</em>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="checkout-row checkout-total">
                    <span>💰 Igiteranyo Cyose</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="payment-methods-section">
                  <h3>💳 Hitamo Uburyo bwo Kwishyura</h3>
                  <div className="payment-methods-grid">
                    {PAYMENT_METHODS.map(m => (
                      <button key={m.id}
                        className={`pay-method-btn ${payMethod === m.id ? 'active' : ''}`}
                        onClick={() => setPayMethod(m.id)}
                      >
                        <span className="pay-method-icon">{m.icon}</span>
                        <span>{m.label}</span>
                        {payMethod === m.id && <span className="pay-method-check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final total */}
                <div className="checkout-final">
                  <div className="checkout-final-row">
                    <span>Uburyo bwo Kwishyura</span>
                    <span>{payMethod ? PAYMENT_METHODS.find(m=>m.id===payMethod)?.label : '—'}</span>
                  </div>
                  <div className="checkout-final-row checkout-final-total">
                    <span>💰 Ugomba Kwishyura</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <button className="pay-btn" style={{ marginTop: 16 }}
                  disabled={!payMethod} onClick={handleCheckout}>
                  {payMethod
                    ? `${PAYMENT_METHODS.find(m=>m.id===payMethod)?.icon} Ishyura ${fmt(total)}`
                    : 'Hitamo Uburyo bwo Kwishyura'}
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
