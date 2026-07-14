import { useState, useRef, useEffect } from 'react'

const NAV = [
  { id: 'admin',    label: 'Admin',    icon: '⚙️' },
  { id: 'contact',  label: 'Contact',  icon: '📬' },
  { id: 'about',    label: 'About',    icon: 'ℹ️'  },
  { id: 'gallery',  label: 'Gallery',  icon: '📸' },
  { id: 'services', label: 'Services', icon: '⚡' },
  { id: 'home',     label: 'Home',     icon: '🏠' },
]

const SERVICE_LINKS = [
  { name: 'Basic Delivery',   icon: '📦', desc: 'Fast & reliable delivery' },
  { name: 'Irembo',           icon: '🏛️', desc: 'Government services' },
  { name: 'RRA Tax',          icon: '🧾', desc: 'Tax filing & TIN' },
  { name: 'MTN MoMo',         icon: '📱', desc: 'Mobile money transfers' },
  { name: 'Airtel Money',     icon: '📲', desc: 'Airtel transactions' },
  { name: 'Agent BK',         icon: '🏦', desc: 'Bank of Kigali agent' },
  { name: 'Equity Bank',      icon: '💳', desc: 'Equity Bank agent' },
  { name: 'Printing',         icon: '🖨️', desc: 'Print, scan & copy' },
  { name: 'Web Dev',          icon: '💻', desc: 'Custom websites & apps' },
  { name: 'Video Editing',    icon: '🎬', desc: 'Professional editing' },
]

export default function Navbar({ page, setPage, dark, setDark, cartCount, onCartOpen, onAccountOpen }) {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [ripple, setRipple]             = useState(null)
  const pillRef  = useRef(null)
  const linksRef = useRef({})

  // move active pill
  useEffect(() => {
    const el = linksRef.current[page]
    const pill = pillRef.current
    if (!el || !pill) return
    const { offsetLeft, offsetWidth } = el
    pill.style.left  = offsetLeft + 'px'
    pill.style.width = offsetWidth + 'px'
  }, [page])

  const go = (p, e) => {
    if (e) {
      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      setRipple({ id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top })
      setTimeout(() => setRipple(null), 600)
    }
    setPage(p); setMenuOpen(false); setServicesOpen(false)
  }

  return (
    <nav className="nb">
      {/* ── Brand ── */}
      <div className="nb-brand" onClick={() => go('home')}>
        <span className="nb-brand-emoji">🛍️</span>
        <span className="nb-brand-name">Ayaba<strong>Shop</strong></span>
      </div>

      {/* ── Desktop nav — right to left ── */}
      <div className="nb-center">
        <ul className={`nb-list ${menuOpen ? 'open' : ''}`} role="list">
          {/* sliding pill */}
          <span className="nb-pill" ref={pillRef} />

          {NAV.map((n, i) => n.id === 'services' ? (
            <li key={n.id} className="nb-dd-wrap"
              style={{ '--i': i }}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                ref={el => { linksRef.current[n.id] = el }}
                className={`nb-item ${page === n.id ? 'active' : ''}`}
                onClick={e => go(n.id, e)}
              >
                <span className="nb-item-icon">{n.icon}</span>
                <span>{n.label}</span>
                <span className={`nb-arrow ${servicesOpen ? 'up' : ''}`}>›</span>
              </button>

              {servicesOpen && (
                <div className="nb-dd">
                  <p className="nb-dd-label">Browse Services</p>
                  <div className="nb-dd-grid">
                    {SERVICE_LINKS.map(s => (
                      <button key={s.name} className="nb-dd-item" onClick={e => go('services', e)}>
                        <span className="nb-dd-icon">{s.icon}</span>
                        <span className="nb-dd-body">
                          <span className="nb-dd-name">{s.name}</span>
                          <span className="nb-dd-desc">{s.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button className="nb-dd-all" onClick={e => go('services', e)}>
                    View all services →
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li key={n.id} style={{ '--i': i }}>
              <button
                ref={el => { linksRef.current[n.id] = el }}
                className={`nb-item ${page === n.id ? 'active' : ''}`}
                onClick={e => go(n.id, e)}
              >
                {ripple && <span className="nb-ripple" style={{ left: ripple.x, top: ripple.y }} />}
                <span className="nb-item-icon">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right actions ── */}
      <div className="nb-right">
        <button className="nb-acc" onClick={onAccountOpen} title="Account">
          <span>👤</span>
          <span className="nb-acc-label">Account</span>
        </button>

        <button className={`nb-toggle ${dark ? 'on' : ''}`} onClick={() => setDark(d => !d)}>
          <span className="nb-toggle-knob">{dark ? '🌙' : '☀️'}</span>
        </button>

        <button className="nb-cart" onClick={onCartOpen}>
          🛒
          {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
        </button>

        <button className={`nb-burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
