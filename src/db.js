const KEY = 'ayaba_services'

const DEFAULTS = [
  { id: 1,  name: 'Basic Delivery',       icon: '📦', category: 'Delivery',      price: 2000,  duration: 'Iminsi 5–7',  description: 'Gutanga bisanzwe kuri irembo ryawe.',                                            features: ['Numero yo gukurikirana', 'SMS imenyesha', 'Paketi nziza'],                                              tax: 0.0, photo: null },
  { id: 2,  name: 'Express Delivery',     icon: '🚀', category: 'Delivery',      price: 5000,  duration: 'Iminsi 1–2',  description: 'Gutanga vuba cyane ku bikorwa bihutirwa.',                                        features: ['Gutunga mbere', 'Gukurikirana kuri live', 'Umukono usabwa'],                                            tax: 0.0, photo: null },
  { id: 3,  name: 'Premium Membership',   icon: '⭐', category: 'Membership',    price: 9900,  duration: 'Ukwezi',      description: 'Fungura amasezerano yihariye no gutanga ubuntu.',                                 features: ['Gutanga ubuntu ku bikorwa byose', 'Kugabanya 10%', 'Kwinjira mbere ku macuruzwa', 'Inkunga ya mbere'], tax: 0.0, photo: null },
  { id: 4,  name: 'Product Insurance',    icon: '🛡️', category: 'Protection',    price: 3500,  duration: 'Ku kintu',    description: 'Kurinzwa byuzuye ibyangiritse cyangwa ibihombye.',                               features: ['Kurinzwa ibyangiritse', 'Kurinzwa ibihombye', 'Iminsi 30 yo gutanga ikirego', 'Inkunga 24/7'],         tax: 0.0, photo: null },
  { id: 5,  name: 'Gift Wrapping',        icon: '🎁', category: 'Extra',         price: 1500,  duration: 'Ku itumba',   description: "Gupakira impano nziza hamwe n'ubutumwa bwite.",                                   features: ['Impapuro nziza zo gupakira', 'Ruban & bow', 'Ikarita yihariye'],                                        tax: 0.0, photo: null },
  { id: 6,  name: 'Installation Service', icon: '🔧', category: 'Extra',         price: 15000, duration: 'Rimwe',       description: "Gushyiraho n'inzobere mu rugo rwawe.",                                            features: ['Inzobere yemejwe', 'Serivisi uwo munsi', "Garantiya y'umwaka 1", 'Gusura ubuntu'],                    tax: 0.0, photo: null },

  // Gov & Finance
  { id: 7,  name: 'Irembo Services',      icon: '🏛️', category: 'Gov & Finance', price: 500,   duration: 'Ku gusaba',   description: 'Saba serivisi za leta kuri Irembo — viza, impamyabumenyi, uburenganzira.',       features: ["Impamyabumenyi y'amavuko/ubukwe", 'Gusaba viza', "Uburenganzira bw'ubucuruzi", 'Gutunga vuba'],       tax: 0.0, photo: null },
  { id: 8,  name: 'RRA Tax Services',     icon: '🧾', category: 'Gov & Finance', price: 1000,  duration: 'Ku gutanga',  description: 'Gutanga imisoro ya RRA, kwiyandikisha TIN & imenyesha.',                          features: ['Kwiyandikisha TIN', 'Gutanga TVA', "Imisoro y'umusaruro", 'Inkunga ya e-tax'],                         tax: 0.0, photo: null },

  // Mobile Money (existing)
  { id: 12, name: 'Agent in BK',          icon: '🏦', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za BK agent — gushyira, gukura & kohereza amafaranga.',                  features: ['Gushyira & gukura amafaranga', 'Gufungura konti', 'Kohereza amafaranga', 'Kureba balance'],            tax: 0.0, photo: null, hasOptions: true },
  { id: 13, name: 'Equity Bank Agent',    icon: '💳', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Equity Bank agent — banki aho uri hose.',                            features: ['Gushyira & gukura', 'Kureba inguzanyo', 'Serivisi za konti', 'Inkunga ya mobile banking'],             tax: 0.0, photo: null, hasOptions: true },
  { id: 14, name: 'MTN MoMo',             icon: '📱', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'MTN Mobile Money — kohereza, akira, ishyura fagitire & gura airtime.',            features: ['Kohereza & akira amafaranga', 'Kwishyura fagitire', 'Gura airtime', 'MoMo Pay'],                       tax: 0.0, photo: null, hasOptions: true },
  { id: 15, name: 'Airtel Money',         icon: '📲', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Airtel Money — ibikorwa vuba kandi neza.',                           features: ['Kohereza amafaranga', 'Kwishyura fagitire', 'Airtime & data', 'Kwishyura ku bucuruzi'],                 tax: 0.0, photo: null, hasOptions: true },

  // Digital
  { id: 9,  name: 'Printing & Copying',    icon: '🖨️', category: 'Digital',       price: 150,   duration: 'Ku ipaji',    description: 'Gucapura, gusikana (scan) & kopi — inyandiko n’amafoto.',                        features: ['Amabara & B/W', 'Scan & copy', 'Lamination', 'Gucapura binini'],                    tax: 0.0, photo: null },
  { id: 10, name: 'Video Editing',        icon: '🎬', category: 'Digital',       price: 7000,  duration: 'Ku mushinga', description: 'Guhindura video nziza ku bibirori, reklamu, reels & YouTube.',                     features: ['Color grading', 'Motion graphics', 'Gusana amajwi', 'Gutanga vuba'],                                   tax: 0.0, photo: null },
  { id: 11, name: 'Web Development',      icon: '💻', category: 'Digital',       price: 50000, duration: 'Ku mushinga', description: 'Websites & web apps zikorwa ku bwenge bwawe.',                                   features: ['Responsive design', 'E-commerce / Forms', 'SEO basics', "Inkunga y'ukwezi 1 ubuntu"],                       tax: 0.0, photo: null },

  // Expanded services (new)
  { id: 16, name: 'Logo & Image Design', icon: '🧩', category: 'Design', price: 18000, duration: 'Ku mushinga', description: 'Kora logo, poster, banner n’udushushanyo two gusasisha.', features: ['Logo design (vector)', 'Revision 1–2', 'Print-ready files', 'Brand guidelines basics'], tax: 0.0, photo: null },
  { id: 17, name: 'Mobile App Design', icon: '📱', category: 'Design', price: 45000, duration: 'Ku mushinga', description: 'UI/UX ya mobile app: screens, flows, prototypes.', features: ['Wireframes', 'Clickable prototype', 'Design system', 'Handoff to dev'], tax: 0.0, photo: null },

  { id: 18, name: 'Website & E-commerce Design', icon: '🛒', category: 'Design', price: 65000, duration: 'Ku mushinga', description: 'Web design + e-commerce structure (catalog, checkout, pages).', features: ['Home/Category/Product pages', 'Cart & checkout flow', 'Performance best practices', 'SEO-ready layout'], tax: 0.0, photo: null },
  { id: 19, name: 'Photography', icon: '📷', category: 'Media', price: 25000, duration: 'Ku session', description: 'Amafoto y’ibikorwa: ubukwe, ibirori, portraits, products.', features: ['Planning & shot list', 'Editing basics', 'High-res delivery', 'Social media sizes'], tax: 0.0, photo: null },
  { id: 20, name: 'Films & Songs Sale', icon: '🎵', category: 'Media Sales', price: 5000, duration: 'Ku kintu', description: 'Gutanga / kugurisha filime na indirimbo (selection yakozwe).', features: ['Curated catalog', 'Instant delivery', 'Licensing depending on content', 'Updates weekly'], tax: 0.0, photo: null },
  { id: 21, name: 'DJ Mixer Service', icon: '🎚️', category: 'Entertainment', price: 35000, duration: 'Ku mushinga', description: 'DJ mixing na music setup ku birori.', features: ['Live mixing', 'Song requests', 'Sound check coordination', 'Backup playlist'], tax: 0.0, photo: null },
  { id: 22, name: 'Smaller Electric Devices Sales', icon: '🔌', category: 'Electronics', price: 0, duration: 'Ku kintu', description: 'Gusaba no kugura ibikoresho by’amashanyarazi bito (chargers, adapters, accessories).', features: ['Best price matching', 'Device recommendations', 'Compatibility check', 'Quick delivery'], tax: 0.0, photo: null },
  { id: 23, name: 'Network Installation & Setup', icon: '🌐', category: 'IT & Network', price: 30000, duration: 'Ku setup', description: 'Kwinjiza internet/network: routers, Wi-Fi setup, cabling basics.', features: ['Wi‑Fi coverage setup', 'Password & security', 'Speed/basic test', 'Customer guidance'], tax: 0.0, photo: null },
  { id: 24, name: 'Install Mobile Application', icon: '📲', category: 'IT & Network', price: 12000, duration: 'Ku installation', description: 'Gushyira app kuri phone (configuration & login help).', features: ['Compatibility check', 'Install & login', 'Data backup reminder', 'How-to guidance'], tax: 0.0, photo: null },
  { id: 25, name: 'Education in Mobiles & Computers', icon: '🎓', category: 'Education', price: 20000, duration: 'Ku somo', description: 'Amafaranga ya training: phone & computer skills (basic to intermediate).', features: ['Beginner-friendly', 'Hands-on practice', 'Homework notes', 'Progress tracking'], tax: 0.0, photo: null },
  { id: 26, name: 'Road Safety Education (Kwiyigisha amategeko)', icon: '🛑', category: 'Education', price: 15000, duration: 'Ku session', description: 'Kwiyigisha amategeko y’umuhanda: traffic rules, safety tips.', features: ['Interactive lessons', 'Real-life scenarios', 'Quizzes', 'Handouts'], tax: 0.0, photo: null },
  { id: 27, name: 'Business Maker / Design & Analysis', icon: '📈', category: 'Business', price: 50000, duration: 'Ku mushinga', description: 'Business plan/design: idea → structure → steps and analysis.', features: ['Target audience', 'Simple financial plan', 'Marketing outline', 'Action roadmap'], tax: 0.0, photo: null },
  { id: 28, name: 'Live Streaming Setup', icon: '📡', category: 'Media', price: 45000, duration: 'Ku event', description: 'Gushiraho live streaming: camera/audio/config + guidance.', features: ['Stream settings', 'Audio check', 'Moderation tips', 'Replays access'], tax: 0.0, photo: null },
  { id: 29, name: 'Web Hosting for Your Business', icon: '🗂️', category: 'Hosting', price: 30000, duration: 'Ukwezi', description: 'Hosting & domain guidance for your website/business.', features: ['Uptime monitoring basics', 'Email/SSL guidance', 'Backup routine', 'Monthly support'], tax: 0.0, photo: null },
  { id: 30, name: 'Artel Agent Services', icon: '🏢', category: 'Agents', price: 0, duration: 'Ku bikorwa', description: 'Serivisi za Artel agent (gushyira/gukora nk’uko ukeneye).', features: ['Walk-in support', 'Transaction guidance', 'Receipt/confirmation', 'Customer tracking'], tax: 0.0, photo: null, hasOptions: false },
  { id: 31, name: 'Bank Agent (General)', icon: '🏦', category: 'Agents', price: 0, duration: 'Ku bikorwa', description: 'Bank agent (support: deposit/withdraw/transfer) — depends on bank & request.', features: ['Deposit help', 'Withdrawal help', 'Transfer initiation', 'Balance checks'], tax: 0.0, photo: null },
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
const ACC_KEY = 'ayaba_accounts'

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

/* ── FAVORITES ── */
const FAV_KEY = 'ayaba_favorites'

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}

export function isFavorite(id) {
  return getFavorites().some(f => f === id)
}

export function toggleFavorite(id) {
  const list = getFavorites()
  const next = list.includes(id) ? list.filter(f => f !== id) : [...list, id]
  localStorage.setItem(FAV_KEY, JSON.stringify(next))
  return next
}

/* ── REVIEWS ── */
const REVIEW_KEY = 'ayaba_reviews'

export function getReviews(serviceId = null) {
  try {
    const all = JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]')
    return serviceId ? all.filter(r => r.serviceId === serviceId) : all
  } catch { return [] }
}

export function addReview({ serviceId, name, rating, text }) {
  const all = getReviews()
  const review = {
    id: Date.now(),
    serviceId,
    name: name?.trim() || 'Anonymous',
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    text: text?.trim() || '',
    date: new Date().toISOString(),
  }
  const next = [...all, review]
  localStorage.setItem(REVIEW_KEY, JSON.stringify(next))
  return review
}

export function deleteReview(id) {
  const next = getReviews().filter(r => r.id !== id)
  localStorage.setItem(REVIEW_KEY, JSON.stringify(next))
  return next
}

export function getRatingSummary(serviceId) {
  const reviews = getReviews(serviceId)
  const count = reviews.length
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }))
  return { count, avg: Math.round(avg * 10) / 10, dist }
}
