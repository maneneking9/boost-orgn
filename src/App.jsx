import { useState, useEffect, useRef } from 'react'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './components/Cart'
import Toast from './components/Toast'
import AdminPanel from './pages/AdminPanel'
import Gallery from './pages/Gallery'
import AccountModal from './components/AccountModal'
import Chat from './Chat'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [lang, setLang] = useState('en')
  const [cart, setCart] = useState([])
  const [toasts, setToasts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }

  const addToCart = (service) => {
    setCart(c => {
      const exists = c.find(x => x.id === service.id)
      if (exists) return c.map(x => x.id === service.id ? { ...x, qty: x.qty + 1 } : x)
      return [...c, { ...service, qty: 1 }]
    })
    addToast(`${service.name} added to cart!`)
  }

  const removeFromCart = (id) => setCart(c => c.filter(x => x.id !== id))

  const pages = { home: Home, services: Services, about: About, contact: Contact, admin: AdminPanel, gallery: Gallery }
  const PageComponent = pages[page] || Home
  const [showTop, setShowTop] = useState(false)
  const [pageKey, setPageKey] = useState(page)
  const [fading, setFading] = useState(false)

  const changePage = (p) => {
    if (p === page) return
    setFading(true)
    setTimeout(() => { setPage(p); setPageKey(p); setFading(false) }, 180)
  }

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app-wrapper">
      <Navbar
        page={page}
        setPage={changePage}
        dark={dark}
        setDark={setDark}
        cartCount={cart.reduce((s, x) => s + x.qty, 0)}
        onCartOpen={() => setCartOpen(true)}
        onAccountOpen={() => setAccountOpen(true)}
      />
      <main className={`main-content page-transition ${fading ? 'page-fade-out' : 'page-fade-in'}`} key={pageKey}>
        <PageComponent addToCart={addToCart} addToast={addToast} setPage={changePage} dark={dark} setDark={setDark} lang={lang} setLang={setLang} />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">

            <div className="footer-brand">
            <div className="footer-logo">🛍️ <span>Animo</span></div>
            <p className="footer-tagline">Animo it’s your trusted agent for payments, services, media & tech — Kigali-Kabuga.</p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                Instagram
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="X">

                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X.com
              </a>
              <a href="https://wa.me/250798698363" target="_blank" rel="noopener noreferrer" className="social-btn social-btn-wa" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
              </a>

            </div>
          </div>

          <div className="footer-nav-group">
            <h4>Navigation</h4>
            <ul>
              {['home','services','gallery','about','contact'].map(p => (
                <li key={p}>
                  <button onClick={() => changePage(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

            <div className="footer-nav-group">
             <h4>Services</h4>
             <ul>
               <li><button onClick={() => changePage('services')}>🎨 Graphic Design</button></li>
               <li><button onClick={() => changePage('services')}>🎬 Video Production</button></li>
               <li><button onClick={() => changePage('services')}>📷 Photography</button></li>
               <li><button onClick={() => changePage('services')}>📡 Live Streaming</button></li>
             </ul>
           </div>

          <div className="footer-nav-group">
            <h4>Contact</h4>
            <ul>
              <li><span>📍 Kigali, Rwanda</span></li>

              <li><a href="tel:+250798698363">📞 +250 798 698 363</a></li>

              <li><a href="mailto:maneneking9@gmail.com">✉️ maneneking9@gmail.com</a></li>

              <li><a href="https://wa.me/250798698363" target="_blank" rel="noopener noreferrer">💬 Chat on WhatsApp</a></li>

            </ul>
          </div>

        </div>
        <div className="footer-bottom">
          <span>© 2025 Ayaba Shop — All rights reserved</span>
          <span className="footer-secure">🔒 Secure & Trusted</span>
        </div>
      </footer>
      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} addToast={addToast} />}
      {cartOpen && <Cart cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} addToast={addToast} setCart={setCart} addToCart={addToCart} />}
      <Toast toasts={toasts} />
      <Chat />
      {showTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top">
          ↑
        </button>
      )}
    </div>
  )
}
