require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const app = express()
app.use(cors())
app.use(express.json())

const SECRET = process.env.JWT_SECRET || 'ayaba_secret'
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'

// ── Auth middleware ──────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    req.admin = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── Admin login ──────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username !== ADMIN_USER || password !== ADMIN_PASS)
    return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '8h' })
  res.json({ token, username })
})

// ── Services (public) ────────────────────────────────────
app.get('/api/services', (req, res) => {
  res.json(db.get('services').value())
})

app.get('/api/services/:id', (req, res) => {
  const s = db.get('services').find({ id: Number(req.params.id) }).value()
  if (!s) return res.status(404).json({ error: 'Not found' })
  res.json(s)
})

// ── Services (admin) ─────────────────────────────────────
app.put('/api/admin/services/:id', auth, (req, res) => {
  const id = Number(req.params.id)
  const allowed = ['name', 'price', 'description', 'details', 'requirements', 'duration', 'available', 'features']
  const update = {}
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k] })
  db.get('services').find({ id }).assign(update).write()
  res.json(db.get('services').find({ id }).value())
})

app.post('/api/admin/services', auth, (req, res) => {
  const services = db.get('services').value()
  const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1
  const service = { id: newId, available: true, features: [], ...req.body }
  db.get('services').push(service).write()
  res.status(201).json(service)
})

app.delete('/api/admin/services/:id', auth, (req, res) => {
  db.get('services').remove({ id: Number(req.params.id) }).write()
  res.json({ ok: true })
})

// ── Orders ───────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
  const orders = db.get('orders').value()
  const order = {
    id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  db.get('orders').push(order).write()
  res.status(201).json(order)
})

app.get('/api/admin/orders', auth, (req, res) => {
  res.json(db.get('orders').value().reverse())
})

app.put('/api/admin/orders/:id', auth, (req, res) => {
  const id = Number(req.params.id)
  db.get('orders').find({ id }).assign({ status: req.body.status }).write()
  res.json(db.get('orders').find({ id }).value())
})

app.delete('/api/admin/orders/:id', auth, (req, res) => {
  db.get('orders').remove({ id: Number(req.params.id) }).write()
  res.json({ ok: true })
})

// ── Gallery (public) ─────────────────────────────────────
app.get('/api/gallery', (req, res) => {
  res.json(db.get('gallery').value())
})

app.post('/api/admin/gallery', (req, res) => {
  const gallery = db.get('gallery').value()
  const item = { id: gallery.length ? Math.max(...gallery.map(g => g.id)) + 1 : 1, ...req.body }
  db.get('gallery').push(item).write()
  res.status(201).json(item)
})

app.delete('/api/admin/gallery/:id', (req, res) => {
  db.get('gallery').remove({ id: Number(req.params.id) }).write()
  res.json({ ok: true })
})

// ── Stats (admin dashboard) ──────────────────────────────
app.get('/api/admin/stats', auth, (req, res) => {
  const orders = db.get('orders').value()
  const services = db.get('services').value()
  res.json({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0),
    totalServices: services.length,
    activeServices: services.filter(s => s.available).length,
  })
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Ayaba Shop API running on http://localhost:${process.env.PORT || 4000}`)
})
