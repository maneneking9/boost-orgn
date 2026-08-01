export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
<h1>About boost art designer</h1>
        <p>We are a modern e-commerce platform dedicated to bringing you the best products and services at unbeatable prices.</p>
      </div>
      <div className="about-grid">
        <div className="about-card">
          <span>🎯</span>
          <h3>Our Mission</h3>
          <p>To make quality products accessible to everyone, with fast delivery and outstanding customer service.</p>
        </div>
        <div className="about-card">
          <span>👁️</span>
          <h3>Our Vision</h3>
          <p>To become the most trusted online shop in the region, known for reliability and customer satisfaction.</p>
        </div>
        <div className="about-card">
          <span>💎</span>
          <h3>Our Values</h3>
          <p>Integrity, quality, speed, and customer-first thinking guide every decision we make.</p>
        </div>
      </div>
      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {[
{ name: 'Boost A.', role: 'Founder & CEO', avatar: '👩‍💼' },
            { name: 'Samuel T.', role: 'Head of Logistics', avatar: '👨‍💻' },
            { name: 'Liya M.', role: 'Customer Support Lead', avatar: '👩‍🎧' },
          ].map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar">{m.avatar}</div>
              <strong>{m.name}</strong>
              <span>{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
