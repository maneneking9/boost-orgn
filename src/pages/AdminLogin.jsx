import { useState } from 'react'

const EMAIL = 'maneneking9@gmail.com'
const PASS  = 'manene@321'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [err, setErr]       = useState('')
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    setTimeout(() => {
      if (email.trim() === EMAIL && pass === PASS) {
        onLogin()
      } else {
        setErr('❌ Wrong email or password.')
      }
      setLoading(false)
    }, 700)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">⚙️</div>
        <h2>Admin Login</h2>
        <p className="login-sub">Sign in to manage Ayaba Shop</p>

        <form className="login-form" onSubmit={submit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email" required autoFocus
              placeholder="admin@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <div className="login-pass-wrap">
              <input
                type={show ? 'text' : 'password'} required
                placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)}
              />
              <button type="button" className="login-eye" onClick={() => setShow(s => !s)}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {err && <div className="login-err">{err}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : '🔓 Sign In'}
          </button>
        </form>

        <div className="login-hint">
          <span>🔒 Secure admin access only</span>
        </div>
      </div>
    </div>
  )
}
