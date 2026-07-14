import { useState } from 'react'
import { saveAccount, getAccount, getAccounts } from '../db'

const fmt = (n) => `RWF ${(+n).toLocaleString('en-RW')}`

export default function AccountModal({ onClose, addToast }) {
  const [tab, setTab]       = useState('deposit')  // 'deposit' | 'lookup'
  const [form, setForm]     = useState({ name: '', phone: '', deposit: '', note: '' })
  const [found, setFound]   = useState(null)
  const [lookupPhone, setLookupPhone] = useState('')
  const [done, setDone]     = useState(false)
  const [savedAcc, setSavedAcc] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleDeposit = (e) => {
    e.preventDefault()
    if (!form.phone || !form.deposit || +form.deposit <= 0) return
    const result = saveAccount({ ...form, deposit: +form.deposit })
    const acc = result.find(a => a.phone === form.phone)
    setSavedAcc(acc)
    setDone(true)
    addToast(`✅ Account funded — ${fmt(form.deposit)} loaded!`, 'success')
  }

  const handleLookup = (e) => {
    e.preventDefault()
    const acc = getAccount(lookupPhone)
    setFound(acc || false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide account-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {done && savedAcc ? (
          <div className="acc-success">
            <div className="acc-success-icon">💳</div>
            <h2>Account Updated!</h2>
            <div className="acc-card">
              <div className="acc-card-row">
                <span>Name</span><strong>{savedAcc.name}</strong>
              </div>
              <div className="acc-card-row">
                <span>Phone</span><strong>{savedAcc.phone}</strong>
              </div>
              <div className="acc-card-row acc-balance-row">
                <span>Balance</span>
                <strong className="acc-balance">{fmt(savedAcc.balance)}</strong>
              </div>
              <div className="acc-card-row">
                <span>Transactions</span><strong>{savedAcc.transactions.length}</strong>
              </div>
            </div>
            <button className="confirm-btn" style={{ marginTop: 20 }} onClick={onClose}>Done ✓</button>
          </div>
        ) : (
          <>
            <div className="acc-header">
              <span className="acc-header-icon">💳</span>
              <div>
                <h2>Customer Account</h2>
                <p className="modal-desc">Create or top-up a customer wallet account</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="acc-tabs">
              <button className={`acc-tab ${tab === 'deposit' ? 'active' : ''}`}
                onClick={() => setTab('deposit')}>💰 Deposit / Create</button>
              <button className={`acc-tab ${tab === 'lookup' ? 'active' : ''}`}
                onClick={() => setTab('lookup')}>🔍 Check Balance</button>
            </div>

            {/* DEPOSIT TAB */}
            {tab === 'deposit' && (
              <form className="acc-form" onSubmit={handleDeposit}>
                <div className="acc-field">
                  <label>Full Name *</label>
                  <input required placeholder="e.g. Uwase Marie" value={form.name}
                    onChange={e => set('name', e.target.value)} />
                </div>
                <div className="acc-field">
                  <label>Phone Number *</label>
                  <input required placeholder="e.g. 0781234567" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                  <small>Used as account ID — existing accounts will be topped up</small>
                </div>
                <div className="acc-field">
                  <label>Amount to Load (RWF) *</label>
                  <div className="acc-amount-row">
                    <input required type="number" min="100" placeholder="e.g. 5000"
                      value={form.deposit} onChange={e => set('deposit', e.target.value)} />
                    <div className="acc-quick-btns">
                      {[1000, 2000, 5000, 10000].map(v => (
                        <button type="button" key={v} className={`acc-quick ${+form.deposit === v ? 'active' : ''}`}
                          onClick={() => set('deposit', v)}>
                          {fmt(v)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="acc-field">
                  <label>Note (optional)</label>
                  <input placeholder="e.g. For delivery fees" value={form.note}
                    onChange={e => set('note', e.target.value)} />
                </div>
                {form.deposit > 0 && (
                  <div className="acc-preview">
                    <div className="acc-preview-row"><span>Amount</span><span>{fmt(form.deposit)}</span></div>
                    <div className="acc-preview-row acc-preview-total"><span>Total to Load</span><strong>{fmt(form.deposit)}</strong></div>
                  </div>
                )}
                <button type="submit" className="pay-btn" style={{ marginTop: 16 }}>
                  💰 Load {form.deposit > 0 ? fmt(form.deposit) : 'Account'}
                </button>
              </form>
            )}

            {/* LOOKUP TAB */}
            {tab === 'lookup' && (
              <div className="acc-form">
                <form onSubmit={handleLookup} style={{ display: 'flex', gap: 10 }}>
                  <div className="acc-field" style={{ flex: 1 }}>
                    <label>Phone Number</label>
                    <input placeholder="0781234567" value={lookupPhone}
                      onChange={e => { setLookupPhone(e.target.value); setFound(null) }} />
                  </div>
                  <button type="submit" className="confirm-btn" style={{ marginTop: 22, whiteSpace: 'nowrap' }}>
                    🔍 Look Up
                  </button>
                </form>

                {found === false && (
                  <div className="acc-not-found">❌ No account found for this number.</div>
                )}
                {found && (
                  <div className="acc-card" style={{ marginTop: 16 }}>
                    <div className="acc-card-row"><span>Name</span><strong>{found.name}</strong></div>
                    <div className="acc-card-row"><span>Phone</span><strong>{found.phone}</strong></div>
                    <div className="acc-card-row acc-balance-row">
                      <span>Balance</span>
                      <strong className="acc-balance">{fmt(found.balance)}</strong>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Recent Transactions</p>
                      {found.transactions.slice(-5).reverse().map((t, i) => (
                        <div key={i} className="acc-txn">
                          <span>💰 {t.note || 'Deposit'}</span>
                          <span className="acc-txn-amount">+{fmt(t.amount)}</span>
                          <span className="acc-txn-date">{new Date(t.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All accounts list */}
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-h)' }}>
                    All Accounts ({getAccounts().length})
                  </p>
                  {getAccounts().map(a => (
                    <div key={a.id} className="acc-list-item" onClick={() => setLookupPhone(a.phone)}>
                      <span className="acc-list-avatar">👤</span>
                      <span className="acc-list-name">{a.name}</span>
                      <span className="acc-list-phone">{a.phone}</span>
                      <span className="acc-list-balance">{fmt(a.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
