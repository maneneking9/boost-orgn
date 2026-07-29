import { useState, useRef, useEffect } from 'react'
import { getServices, addService, updateService, deleteService, resetServices } from '../db'
import { getAccounts } from '../db'
import AdminLogin from './AdminLogin'

const GALLERY_API = 'http://localhost:4000/api'
const GALLERY_CATS = ['Design', 'Media', 'Media Sales', 'Entertainment', 'Electronics', 'IT & Network', 'Education', 'Business', 'Hosting', 'Agents']

const fmt = (n) => `RWF ${(+n).toLocaleString('en-RW')}`

const EMPTY = {
  name: '', icon: '🛍️', category: 'Design', price: 0, duration: 'Ku mushinga',
  description: '', features: [''], tax: 0.0, photo: null, hasOptions: false,
}

const CATEGORIES = ['Design', 'Media', 'Media Sales', 'Entertainment', 'Electronics', 'IT & Network', 'Education', 'Business', 'Hosting', 'Agents']

export default function AdminPanel({ addToast }) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [tab, setTab]           = useState('dashboard')
  const [services, setServices] = useState(getServices)
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState(null)
  const [confirm, setConfirm]   = useState(null)
  const [search, setSearch]     = useState('')
  const [preview, setPreview]   = useState(null)
  const fileRef = useRef()

  const handleLogin = () => { sessionStorage.setItem('admin_auth', '1'); setLoggedIn(true) }
  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); setLoggedIn(false) }

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />

  /* ── Stats ── */
  const accounts = getAccounts()
  const totalBalance    = accounts.reduce((s, a) => s + a.balance, 0)
  const totalTxns       = accounts.reduce((s, a) => s + a.transactions.length, 0)
  const totalServices   = services.length
  const avgPrice        = services.filter(s => s.price > 0).reduce((s, x, _, a) => s + x.price / a.length, 0)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { set('photo', ev.target.result); setPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleFeature = (i, v) => {
    const arr = [...form.features]; arr[i] = v; set('features', arr)
  }

  const startEdit = (s) => {
    setEditing(s.id); setForm({ ...s, features: [...(s.features || [''])] })
    setPreview(s.photo || null); setTab('services')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = { ...form, features: form.features.filter(f => f.trim()), price: +form.price, tax: +form.tax }
    if (editing) {
      setServices(updateService({ ...cleaned, id: editing }))
      addToast('✅ Service updated!', 'success')
    } else {
      setServices(addService(cleaned))
      addToast('✅ Service added!', 'success')
    }
    setForm(EMPTY); setEditing(null); setPreview(null)
  }

  const handleDelete = (id) => {
    setServices(deleteService(id)); setConfirm(null)
    addToast('🗑️ Service deleted', 'error')
  }

  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>Welcome back, <strong>Manene</strong> — manage everything here</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="admin-reset-btn" onClick={() => { setServices(resetServices()); addToast('🔄 Reset!') }}>🔄 Reset</button>
          <button className="admin-reset-btn" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[['dashboard','📊 Dashboard'], ['services','🛠️ Services'], ['accounts','💳 Accounts'], ['gallery','📸 Gallery']].map(([id, label]) => (
          <button key={id} className={`admin-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <div className="dash-body">
          <div className="dash-stats">
            <div className="dash-stat dash-stat-green">
              <span className="dash-stat-icon">💰</span>
              <div>
                <p>Total Account Balances</p>
                <strong>{fmt(totalBalance)}</strong>
              </div>
            </div>
            <div className="dash-stat dash-stat-blue">
              <span className="dash-stat-icon">👥</span>
              <div>
                <p>Customer Accounts</p>
                <strong>{accounts.length}</strong>
              </div>
            </div>
            <div className="dash-stat dash-stat-purple">
              <span className="dash-stat-icon">📋</span>
              <div>
                <p>Total Services</p>
                <strong>{totalServices}</strong>
              </div>
            </div>
            <div className="dash-stat dash-stat-orange">
              <span className="dash-stat-icon">🔄</span>
              <div>
                <p>Total Transactions</p>
                <strong>{totalTxns}</strong>
              </div>
            </div>
          </div>

          {/* Avg price */}
          <div className="dash-section">
            <h3>💡 Quick Stats</h3>
            <div className="dash-quick">
              <div className="dash-quick-item">
                <span>Average Service Price</span>
                <strong>{fmt(Math.round(avgPrice))}</strong>
              </div>
              <div className="dash-quick-item">
                <span>Paid Services</span>
                <strong>{services.filter(s => s.price > 0).length}</strong>
              </div>
              <div className="dash-quick-item">
                <span>Free / Agent Services</span>
                <strong>{services.filter(s => s.price === 0).length}</strong>
              </div>
              <div className="dash-quick-item">
                <span>Total Potential Revenue</span>
                <strong>{fmt(services.reduce((s, x) => s + x.price, 0))}</strong>
              </div>
            </div>
          </div>

          {/* Recent accounts */}
          {accounts.length > 0 && (
            <div className="dash-section">
              <h3>👥 Recent Customer Accounts</h3>
              <div className="dash-acc-list">
                {accounts.slice(-5).reverse().map(a => (
                  <div key={a.id} className="dash-acc-row">
                    <span className="dash-acc-avatar">👤</span>
                    <span className="dash-acc-name">{a.name}</span>
                    <span className="dash-acc-phone">{a.phone}</span>
                    <span className="dash-acc-bal">{fmt(a.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SERVICES TAB ── */}
      {tab === 'services' && (
        <>
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editing ? '✏️ Edit Service' : '➕ Add New Service'}</h2>
            <div className="admin-form-grid">
              <div className="admin-photo-col">
                <div className="admin-photo-box" onClick={() => fileRef.current.click()}>
                  {preview
                    ? <img src={preview} alt="preview" className="admin-photo-preview" />
                    : <div className="admin-photo-placeholder">
                        <span>📷</span><p>Click to upload photo</p><small>JPG, PNG, WEBP</small>
                      </div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                {preview && <button type="button" className="admin-remove-photo" onClick={() => { set('photo', null); setPreview(null) }}>✕ Remove</button>}
              </div>
              <div className="admin-fields-col">
                <div className="admin-row-2">
                  <div className="admin-row"><label>Icon</label><input value={form.icon} onChange={e => set('icon', e.target.value)} maxLength={4} /></div>
                  <div className="admin-row"><label>Category</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="admin-row"><label>Service Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Express Delivery" /></div>
                <div className="admin-row-2">
                  <div className="admin-row"><label>Price (RWF)</label><input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} /></div>
                  <div className="admin-row"><label>Duration</label><input value={form.duration} onChange={e => set('duration', e.target.value)} /></div>
                </div>
                <div className="admin-row"><label>Description *</label><textarea required rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
                <div className="admin-row">
                  <label>Features</label>
                  {form.features.map((f, i) => (
                    <div key={i} className="admin-feature-row">
                      <input value={f} onChange={e => handleFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                      {form.features.length > 1 && <button type="button" className="admin-feature-del" onClick={() => set('features', form.features.filter((_, j) => j !== i))}>✕</button>}
                    </div>
                  ))}
                  <button type="button" className="admin-add-feature" onClick={() => set('features', [...form.features, ''])}>+ Add</button>
                </div>
                <div className="admin-row admin-row-check">
                  <label><input type="checkbox" checked={!!form.hasOptions} onChange={e => set('hasOptions', e.target.checked)} /> Has sub-options</label>
                </div>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-save-btn">{editing ? '💾 Save Changes' : '➕ Add Service'}</button>
              {editing && <button type="button" className="admin-cancel-btn" onClick={() => { setForm(EMPTY); setEditing(null); setPreview(null) }}>Cancel</button>}
            </div>
          </form>

          <div className="admin-list-header">
            <h2>📋 All Services ({services.length})</h2>
            <input className="search-input" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
          </div>
          <div className="admin-list">
            {filtered.map(s => (
              <div key={s.id} className="admin-item">
                {s.photo ? <img src={s.photo} alt={s.name} className="admin-item-photo" /> : <div className="admin-item-icon">{s.icon}</div>}
                <div className="admin-item-info">
                  <strong>{s.name}</strong>
                  <span className="admin-item-cat">{s.category}</span>
                  <span className="admin-item-price">{s.price === 0 ? 'Free / Options' : fmt(s.price)} / {s.duration}</span>
                  <p className="admin-item-desc">{s.description}</p>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-edit-btn" onClick={() => startEdit(s)}>✏️ Edit</button>
                  <button className="admin-del-btn" onClick={() => setConfirm(s.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ACCOUNTS TAB ── */}
      {tab === 'accounts' && (
        <div className="dash-body">
          <div className="dash-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>💳 All Customer Accounts</h3>
              <span className="admin-item-cat">{accounts.length} accounts · {fmt(totalBalance)} total</span>
            </div>
            {accounts.length === 0
              ? <p style={{ color: 'var(--text-muted)', padding: '24px 0' }}>No accounts yet. Use the Account button to create one.</p>
              : accounts.map(a => (
                <div key={a.id} className="dash-acc-full">
                  <div className="dash-acc-full-top">
                    <span className="dash-acc-avatar-lg">👤</span>
                    <div className="dash-acc-full-info">
                      <strong>{a.name}</strong>
                      <span>{a.phone}</span>
                    </div>
                    <div className="dash-acc-bal-big">{fmt(a.balance)}</div>
                  </div>
                  <div className="dash-txn-list">
                    {a.transactions.slice().reverse().map((t, i) => (
                      <div key={i} className="dash-txn">
                        <span>💰 {t.note || 'Deposit'}</span>
                        <span className="dash-txn-amt">+{fmt(t.amount)}</span>
                        <span className="dash-txn-date">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── GALLERY TAB ── */}
      {tab === 'gallery' && <AdminGalleryTab addToast={addToast} />}

      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <h2>🗑️ Delete Service?</h2>
            <p style={{ margin: '12px 0 20px', color: 'var(--text)' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pay-btn" style={{ flex: 1 }} onClick={() => handleDelete(confirm)}>Yes, Delete</button>
              <button className="icon-add-btn" style={{ flex: 1 }} onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminGalleryTab({ addToast }) {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [desc, setDesc] = useState('')
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    fetch(`${GALLERY_API}/gallery`).then(r => r.json()).then(setItems).catch(() => {})
  }, [])

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { addToast('File too large (max 5MB)', 'error'); return }
    if (!f.type.startsWith('image/')) { addToast('Only image files allowed', 'error'); return }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleUpload = async () => {
    if (!title.trim()) { addToast('Please enter a title', 'error'); return }
    if (!category) { addToast('Please select a category', 'error'); return }
    if (!preview) { addToast('Please select an image', 'error'); return }
    setUploading(true)
    try {
      const res = await fetch(`${GALLERY_API}/admin/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), category, desc: desc.trim(), image: preview, emoji: '📸', createdAt: new Date().toISOString() })
      })
      if (res.ok) {
        const item = await res.json()
        setItems(prev => [item, ...prev])
        addToast('✅ Photo uploaded to gallery!')
        setTitle(''); setCategory(''); setDesc(''); setPreview(null)
      } else { addToast('Upload failed', 'error') }
    } catch { addToast('Upload failed — check connection', 'error') }
    setUploading(false)
  }

  const handleDelete = async (id) => {
    await fetch(`${GALLERY_API}/admin/gallery/${id}`, { method: 'DELETE' }).catch(() => {})
    setItems(prev => prev.filter(x => x.id !== id))
    addToast('🗑️ Photo removed')
  }

  return (
    <div className="dash-body">
      <div className="dash-section">
        <h3>📤 Upload New Photo</h3>
        <div className="admin-form-grid" style={{ marginTop: 16 }}>
          <div className="admin-photo-col">
            <div
              className={`admin-photo-box ${dragging ? 'dragging' : ''}`}
              style={{ height: 200 }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer?.files?.[0]) }}
              onClick={() => fileRef.current?.click()}
            >
              {preview
                ? <img src={preview} alt="preview" className="admin-photo-preview" />
                : <div className="admin-photo-placeholder"><span>📁</span><p>Click or drop image</p><small>JPG, PNG up to 5MB</small></div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
            {preview && <button type="button" className="admin-remove-photo" onClick={() => setPreview(null)}>✕ Remove</button>}
          </div>
          <div className="admin-fields-col">
            <div className="admin-row">
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Photo title..." maxLength={80} />
            </div>
            <div className="admin-row">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {GALLERY_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-row">
              <label>Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Short description..." maxLength={200} />
            </div>
            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? '⏳ Uploading...' : '📤 Upload to Gallery'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-section">
        <h3>🖼️ Gallery Photos ({items.length})</h3>
        <div className="gallery-grid" style={{ marginTop: 12 }}>
          {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No photos yet.</p>}
          {items.map(item => (
            <div key={item.id} className="gallery-card" style={{ cursor: 'default' }}>
              <div className="gallery-card-img">
                {item.image
                  ? <img src={item.image} alt={item.title} loading="lazy" />
                  : <div className="gallery-card-emoji">{item.emoji || '📸'}</div>}
              </div>
              <div className="gallery-card-body">
                <span className="gallery-card-cat">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <button className="gallery-card-delete" title="Delete" onClick={() => handleDelete(item.id)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
