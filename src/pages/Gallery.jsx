import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:4000/api'

const CATEGORIES = ['All', 'Delivery', 'Digital', 'Gov & Finance', 'Banking', 'Mobile Money', 'Extra', 'Membership', 'Protection']

export default function Gallery({ addToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showUpload, setShowUpload] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  /* upload form state */
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [desc, setDesc] = useState('')
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API}/gallery`)
      const data = await res.json()
      setItems(data)
    } catch { /* silent */ }
    setLoading(false)
  }

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { addToast('File too large (max 5MB)', 'error'); return }
    if (!f.type.startsWith('image/')) { addToast('Only image files allowed', 'error'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer?.files?.[0]
    handleFile(f)
  }

  const handleUpload = async () => {
    if (!title.trim()) { addToast('Please enter a title', 'error'); return }
    if (!category) { addToast('Please select a category', 'error'); return }
    if (!preview) { addToast('Please select an image', 'error'); return }

    setUploading(true)
    try {
      const res = await fetch(`${API}/admin/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          desc: desc.trim(),
          image: preview,
          emoji: '📸',
          createdAt: new Date().toISOString()
        })
      })
      if (res.ok) {
        addToast('Photo uploaded successfully!')
        resetForm()
        fetchGallery()
      } else {
        addToast('Upload failed', 'error')
      }
    } catch {
      addToast('Upload failed — check connection', 'error')
    }
    setUploading(false)
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/admin/gallery/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(x => x.id !== id))
      addToast('Photo removed')
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  const resetForm = () => {
    setTitle(''); setCategory(''); setDesc('')
    setPreview(null); setFile(null); setShowUpload(false)
  }

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  const activeCats = ['All', ...new Set(items.map(i => i.category).filter(Boolean))]

  return (
    <div className="gallery-page">
      {/* ── Hero ── */}
      <div className="gallery-hero">
        <h1>📸 Activity Gallery</h1>
        <p>Upload &amp; showcase photos from all our activities and services</p>
        <button className="btn-primary gallery-upload-trigger" onClick={() => setShowUpload(v => !v)}>
          {showUpload ? '✕ Close' : '＋ Upload New Photo'}
        </button>
      </div>

      {/* ── Upload Panel ── */}
      {showUpload && (
        <div className="gallery-upload-panel">
          <div className="gallery-upload-inner">
            <div
              className={`gallery-dropzone ${dragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="gallery-preview-img" />
              ) : (
                <div className="gallery-dropzone-text">
                  <span className="gallery-dropzone-icon">📁</span>
                  <p>Drop image here or click to browse</p>
                  <span className="gallery-dropzone-hint">Supports JPG, PNG, GIF up to 5MB</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            <div className="gallery-upload-fields">
              <label>
                Title
                <input
                  type="text"
                  placeholder="Enter photo title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                />
              </label>
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <textarea
                  placeholder="Enter description..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
              </label>
              <div className="gallery-upload-actions">
                <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? '⏳ Uploading...' : '📤 Upload Photo'}
                </button>
                <button className="btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="gallery-filters">
        {activeCats.map(c => (
          <button
            key={c}
            className={`gallery-filter-pill ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="gallery-empty">
          <span className="gallery-empty-icon">⏳</span>
          <p>Loading gallery...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="gallery-empty">
          <span className="gallery-empty-icon">📷</span>
          <h3>No photos yet</h3>
          <p>Be the first to share an activity photo!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map(item => (
            <div key={item.id} className="gallery-card" onClick={() => item.image && setLightbox(item)}>
              <div className="gallery-card-img">
                {item.image ? (
                  <img src={item.image} alt={item.title} loading="lazy" />
                ) : (
                  <div className="gallery-card-emoji">{item.emoji || '📸'}</div>
                )}
              </div>
              <div className="gallery-card-body">
                <span className="gallery-card-cat">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <button
                className="gallery-card-delete"
                title="Delete"
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={lightbox.title} />
            <div className="gallery-lightbox-info">
              <span className="gallery-card-cat">{lightbox.category}</span>
              <h3>{lightbox.title}</h3>
              <p>{lightbox.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
