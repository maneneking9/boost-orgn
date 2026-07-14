const KEY = 'ayaba_services'

const DEFAULTS = [
  { id: 1,  name: 'Basic Delivery',       icon: '📦', category: 'Delivery',      price: 2000,  duration: 'Iminsi 5–7',  description: 'Gutanga bisanzwe kuri irembo ryawe.',                                            features: ['Numero yo gukurikirana', 'SMS imenyesha', 'Paketi nziza'],                                              tax: 0.0, photo: null },
  { id: 2,  name: 'Express Delivery',     icon: '🚀', category: 'Delivery',      price: 5000,  duration: 'Iminsi 1–2',  description: 'Gutanga vuba cyane ku bikorwa bihutirwa.',                                        features: ['Gutunga mbere', 'Gukurikirana kuri live', 'Umukono usabwa'],                                            tax: 0.0, photo: null },
  { id: 3,  name: 'Premium Membership',   icon: '⭐', category: 'Membership',    price: 9900,  duration: 'Ukwezi',      description: 'Fungura amasezerano yihariye no gutanga ubuntu.',                                 features: ['Gutanga ubuntu ku bikorwa byose', 'Kugabanya 10%', 'Kwinjira mbere ku macuruzwa', 'Inkunga ya mbere'], tax: 0.0, photo: null },
  { id: 4,  name: 'Product Insurance',    icon: '🛡️', category: 'Protection',    price: 3500,  duration: 'Ku kintu',    description: 'Kurinzwa byuzuye ibyangiritse cyangwa ibihombye.',                               features: ['Kurinzwa ibyangiritse', 'Kurinzwa ibihombye', 'Iminsi 30 yo gutanga ikirego', 'Inkunga 24/7'],         tax: 0.0, photo: null },
  { id: 5,  name: 'Gift Wrapping',        icon: '🎁', category: 'Extra',         price: 1500,  duration: 'Ku itumba',   description: "Gupakira impano nziza hamwe n'ubutumwa bwite.",                                   features: ['Impapuro nziza zo gupakira', 'Ruban & bow', 'Ikarita yihariye'],                                        tax: 0.0, photo: null },
  { id: 6,  name: 'Installation Service', icon: '🔧', category: 'Extra',         price: 15000, duration: 'Rimwe',       description: "Gushyiraho n'inzobere mu rugo rwawe.",                                            features: ['Inzobere yemejwe', 'Serivisi uwo munsi', "Garantiya y'umwaka 1", 'Gusura ubuntu'],                    tax: 0.0, photo: null },
  { id: 7,  name: 'Irembo Services',      icon: '🏛️', category: 'Gov & Finance', price: 500,   duration: 'Ku gusaba',   description: 'Saba serivisi za leta kuri Irembo — viza, impamyabumenyi, uburenganzira.',       features: ["Impamyabumenyi y'amavuko/ubukwe", 'Gusaba viza', "Uburenganzira bw'ubucuruzi", 'Gutunga vuba'],       tax: 0.0, photo: null },
  { id: 8,  name: 'RRA Tax Services',     icon: '🧾', category: 'Gov & Finance', price: 1000,  duration: 'Ku gutanga',  description: 'Gutanga imisoro ya RRA, kwiyandikisha TIN & imenyesha.',                          features: ['Kwiyandikisha TIN', 'Gutanga TVA', "Imisoro y'umusaruro", 'Inkunga ya e-tax'],                         tax: 0.0, photo: null },
  { id: 9,  name: 'Printing Services',    icon: '🖨️', category: 'Digital',       price: 150,   duration: 'Ku ipaji',    description: 'Gucapura byiza — inyandiko, amafoto, ibendera & byinshi.',                        features: ['Gucapura amabara & B/W', 'Guskanisha & gukopera', 'Lamination', 'Gucapura binini'],                    tax: 0.0, photo: null },
  { id: 10, name: 'Video Editing',        icon: '🎬', category: 'Digital',       price: 7000,  duration: 'Ku mushinga', description: 'Guhindura video nziza ku bibirori, reklamu, reels & YouTube.',                     features: ['Color grading', 'Motion graphics', 'Gusana amajwi', 'Gutanga vuba'],                                   tax: 0.0, photo: null },
  { id: 11, name: 'Web Development',      icon: '💻', category: 'Digital',       price: 50000, duration: 'Ku mushinga', description: 'Websites & web apps zikorwa ku bwenge bwawe.',                                   features: ['Responsive design', 'E-commerce', 'SEO optimized', "Inkunga y'ukwezi 1 ubuntu"],                       tax: 0.0, photo: null },
  { id: 12, name: 'Agent in BK',          icon: '🏦', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za BK agent — gushyira, gukura & kohereza amafaranga.',                  features: ['Gushyira & gukura amafaranga', 'Gufungura konti', 'Kohereza amafaranga', 'Kureba balance'],            tax: 0.0, photo: null, hasOptions: true },
  { id: 13, name: 'Equity Bank Agent',    icon: '💳', category: 'Banking',       price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Equity Bank agent — banki aho uri hose.',                            features: ['Gushyira & gukura', 'Kureba inguzanyo', 'Serivisi za konti', 'Inkunga ya mobile banking'],             tax: 0.0, photo: null, hasOptions: true },
  { id: 14, name: 'MTN MoMo',             icon: '📱', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'MTN Mobile Money — kohereza, akira, ishyura fagitire & gura airtime.',            features: ['Kohereza & akira amafaranga', 'Kwishyura fagitire', 'Gura airtime', 'MoMo Pay'],                       tax: 0.0, photo: null, hasOptions: true },
  { id: 15, name: 'Airtel Money',         icon: '📲', category: 'Mobile Money',  price: 0,     duration: 'Ku bikorwa',  description: 'Serivisi za Airtel Money — ibikorwa vuba kandi neza.',                           features: ['Kohereza amafaranga', 'Kwishyura fagitire', 'Airtime & data', 'Kwishyura ku bucuruzi'],                 tax: 0.0, photo: null, hasOptions: true },
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
