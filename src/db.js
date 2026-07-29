const KEY = 'boost_art_designer_services'

const DEFAULTS = [
  { id: 1, name: 'Graphic Design', icon: '🎨', category: 'Design', price: 0, duration: 'Ku mushinga', description: 'get in touch with us today', features: ['Professional design team', 'Fast turnaround', 'Unlimited revisions'], tax: 0.0, photo: null, hasOptions: true },
  { id: 2, name: 'Video Production', icon: '🎬', category: 'Media', price: 15000, duration: 'Ku mushinga', description: 'Kora video nziza ku birori, reklamu, reels & YouTube.', features: ['Professional filming', 'Script & storyboard', 'Editing & color grading', 'Motion graphics'], tax: 0.0, photo: null },
  { id: 3, name: 'Photography', icon: '📷', category: 'Media', price: 25000, duration: 'Ku session', description: 'Amafoto y\'ibikorwa: ubukwe, ibirori, portraits, products.', features: ['Planning & shot list', 'Editing basics', 'High-res delivery', 'Social media sizes'], tax: 0.0, photo: null },
  { id: 4, name: 'Live Streaming', icon: '📡', category: 'Media', price: 45000, duration: 'Ku event', description: 'Gushiraho live streaming: camera/audio/config + guidance.', features: ['Stream settings', 'Audio check', 'Moderation tips', 'Replays access'], tax: 0.0, photo: null },
]


export function getServices() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(DEFAULTS)); return DEFAULTS }
    return JSON.parse(raw)
  } catch { return DEFAULTS }
}

export function saveServices(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function addService(service) {
  const list = getServices()
  const id = Date.now()
  const next = [...list, { ...service, id }]
  saveServices(next)
  return next
}

export function updateService(updated) {
  const next = getServices().map(s => s.id === updated.id ? updated : s)
  saveServices(next)
  return next
}

export function deleteService(id) {
  const next = getServices().filter(s => s.id !== id)
  saveServices(next)
  return next
}

export function resetServices() {
  saveServices(DEFAULTS)
  return DEFAULTS
}

/* ── CUSTOMER ACCOUNTS ── */
const ACC_KEY = 'boost_art_designer_accounts'

export function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACC_KEY) || '[]') } catch { return [] }
}

export function saveAccount(acc) {
  const list = getAccounts()
  const existing = list.find(a => a.phone === acc.phone)
  let next
  if (existing) {
    next = list.map(a => a.phone === acc.phone
      ? { ...a, balance: a.balance + acc.deposit, transactions: [...a.transactions, { type: 'deposit', amount: acc.deposit, date: new Date().toISOString(), note: acc.note }] }
      : a)
  } else {
    next = [...list, {
      id: Date.now(), name: acc.name, phone: acc.phone,
      balance: acc.deposit,
      transactions: [{ type: 'deposit', amount: acc.deposit, date: new Date().toISOString(), note: acc.note }]
    }]
  }
  localStorage.setItem(ACC_KEY, JSON.stringify(next))
  return next
}

export function getAccount(phone) {
  return getAccounts().find(a => a.phone === phone) || null
}
