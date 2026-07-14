import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  'What products do you sell?',
  'How can I place an order?',
  'What are your delivery options?',
  'How do I return an item?',
  'Do you offer discounts?',
]

const RESPONSES = {
  'What products do you sell?': 'We sell a wide range of fashion, electronics, and home goods at Ayaba Shop!',
  'How can I place an order?': 'Browse our catalog, add items to your cart, and proceed to checkout.',
  'What are your delivery options?': 'We offer standard (5-7 days) and express (1-2 days) delivery.',
  'How do I return an item?': 'Contact us within 14 days of delivery to initiate a return.',
  'Do you offer discounts?': 'Yes! Subscribe to our newsletter for exclusive deals and discounts.',
}

export default function Chat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Welcome to Ayaba Shop 👋 How can I help you today?' },
  ])
  const [input, setInput] = useState('')

  const [typing, setTyping] = useState(false)
  const msgEndRef = useRef(null)

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text) => {
    if (!text.trim()) return
    const reply = RESPONSES[text] || "Thanks for your message! Our team will get back to you shortly."
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { from: 'bot', text: reply }])
    }, 900)
  }

  return (
    <div className="chat-widget">
      <button className="chat-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle chat">
        {open ? '✕' : '💬'}
      </button>
      {open && (
        <div className="chat-box">
          <div className="chat-header">Ayaba Shop Support</div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-typing">
                <span/><span/><span/>
              </div>
            )}
            <div ref={msgEndRef} />
          </div>
          <div className="chat-suggestions">
            {SUGGESTED.map(q => (
              <button key={q} onClick={() => send(q)}>{q}</button>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Type your message..."
            />
            <button onClick={() => send(input)}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}
