import { useState } from 'react'

export default function Contact({ addToast }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    addToast('Message sent! We will reply within 24 hours.', 'success')
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have a question or need help? We'd love to hear from you.</p>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          {[
            { icon: '📍', label: 'Address', value: '123 Design Street, Addis Ababa, Ethiopia' },
{ icon: '📞', label: 'Phone', value: '0784270825 / 0791981419' },
            { icon: '📧', label: 'Email', value: 'support@boostartdesigner.com' },
            { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 8am – 8pm' },
          ].map(i => (
            <div key={i.label} className="info-item">
              <span className="info-icon">{i.icon}</span>
              <div><strong>{i.label}</strong><p>{i.value}</p></div>
            </div>
          ))}
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          {sent && <div className="form-success">✅ Message sent successfully!</div>}
          <div className="form-row">
            <input placeholder="Your Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input placeholder="Your Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <input placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          <textarea placeholder="Your Message *" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
          <button type="submit" className="btn-primary">Send Message 📨</button>
        </form>
      </div>
    </div>
  )
}
