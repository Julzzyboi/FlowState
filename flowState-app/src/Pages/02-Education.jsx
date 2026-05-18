import React from 'react'
import '../Style/Education.css'

/* ── Why Water Matters ── */
const cardData = [
  {
    id: 1,
    img: 'YOUR_IMAGE_URL_HERE',
    iconBg: '#fef3c7',
    title: 'Why You Need 2–4L Daily',
    desc: 'Water regulates body temp, carries nutrients, and flushes toxins. Learn how much you actually need.',
    bg: '#fef9ec',
    border: '#fde68a',
  },
  {
    id: 2,
    img: 'YOUR_IMAGE_URL_HERE',
    iconBg: '#dbeafe',
    title: 'Handwashing & Hygiene',
    desc: 'Proper handwashing prevents 80% of common infections. Techniques and best practices inside.',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    id: 3,
    img: 'YOUR_IMAGE_URL_HERE',
    iconBg: '#dcfce7',
    title: 'Dehydration & Brain Health',
    desc: 'Even 1–2% dehydration impacts focus and mood. Find out the safe warning signs.',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 4,
    img: 'YOUR_IMAGE_URL_HERE',
    iconBg: '#e0f2fe',
    title: 'Clean Water Access',
    desc: '2.2 billion people lack safe drinking water. Understand the global sanitation crisis.',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
]

/* ── Hydration Guidelines ── */
const hydrationGuidelines = [
  {
    time: 'Morning',
    amount: '500ml',
    note: 'Drink a glass right after waking up to rehydrate after sleep and kickstart your metabolism.',
    icon: '🌅',
    color: '#fef3c7',
    border: '#fde68a',
    textColor: '#92400e',
  },
  {
    time: 'Mid-Morning',
    amount: '300–400ml',
    note: 'Sip water steadily between breakfast and lunch to maintain focus and energy levels.',
    icon: '☀️',
    color: '#eff6ff',
    border: '#bfdbfe',
    textColor: '#1e40af',
  },
  {
    time: 'Afternoon',
    amount: '500ml',
    note: 'Drink before and during lunch. Staying hydrated after midday prevents the common energy slump.',
    icon: '🌤️',
    color: '#f0fdf4',
    border: '#bbf7d0',
    textColor: '#166534',
  },
  {
    time: 'Evening',
    amount: '300–400ml',
    note: 'Continue hydrating in the afternoon. Avoid large amounts right before bed to prevent disrupted sleep.',
    icon: '🌙',
    color: '#f5f3ff',
    border: '#ddd6fe',
    textColor: '#5b21b6',
  },
]

const hydrationFacts = [
  { label: 'Daily Goal', value: '2–4L', desc: 'for an average adult' },
  { label: 'More if Active', value: '+500ml', desc: 'per hour of exercise' },
  { label: 'Hot Climate', value: '1.5×', desc: 'increase your intake' },
]

/* ── Sanitation Steps ── */
const sanitationSteps = [
  { step: '01', title: 'Wet your hands',       desc: 'Use clean, running water — warm or cold.' },
  { step: '02', title: 'Lather with soap',     desc: 'Scrub backs, between fingers, and under nails.' },
  { step: '03', title: 'Scrub for 20 sec',     desc: 'Hum "Happy Birthday" twice as a timer.' },
  { step: '04', title: 'Rinse thoroughly',     desc: 'Remove all soap under clean running water.' },
  { step: '05', title: 'Dry with clean towel', desc: 'Use a clean towel or let hands air dry.' },
]

const sanitationStats = [
  { value: '80%',  label: 'of infections prevented by handwashing', color: '#3b82f6' },
  { value: '2.2B', label: 'people lack basic sanitation access',     color: '#ef4444' },
  { value: '297k', label: 'child deaths prevented yearly',           color: '#16a34a' },
]

/* ── Quick Facts ── */
const quickFacts = [
  {
    icon: '💧',
    text: <>Your body is <strong>60% water</strong>. Every cell, organ, and tissue depends on water to function.</>,
  },
  {
    icon: '🌡️',
    text: <>In hot or humid climates, your water needs can increase by <span className="highlight">up to 1.5× the normal amount</span></>,
  },
  {
    icon: '🚿',
    text: <>Proper sanitation prevents <span className="highlight">cholera, typhoid, and diarrhea</span> — diseases that still kill millions every year.</>,
  },
  {
    icon: '⚡',
    text: <>Feeling tired mid-afternoon? It's often dehydration. Try a glass of water before reaching for <span className="highlight">caffeine</span>.</>,
  },
  {
    icon: '🌐',
    text: <>Clean water initiatives have protected <span className="highlight">over 1.8 billion people</span> from waterborne diseases since 1990.</>,
  },
]

export default function EducationPage() {
  return (
    <div className="edu-page">
      <div className="edu-outer">

        {/* ── Hero ── */}
        <div className="edu-hero">
          <div className="edu-hero-content">
            <h1 className="edu-hero-title">Education</h1>
            <p className="edu-hero-subtitle">
              HYDRATION AND SANITATION AWARENESS – WHY THEY MATTER?
            </p>
            <p className="edu-hero-desc">
              Drinkly supports Good Health &amp; Well-being (SDG 3) and Clean Water &amp; Sanitation
              (SDG 6) by building everyday awareness of healthy hydration.
            </p>
            <div className="edu-tag-row">
              <span className="edu-tag">SDG 3 · Good Health</span>
              <span className="edu-tag">SDG 6 · Clean Water</span>
              <span className="edu-tag">SDG 6 · Clean Water</span>
            </div>
          </div>
          <div className="edu-circle edu-circle-1" />
          <div className="edu-circle edu-circle-2" />
        </div>

        {/* ── Why Water Matters ── */}
        <div className="edu-section">
          <h2 className="edu-section-title">Why Water Matters</h2>
          <div className="edu-card-grid">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="edu-info-card"
                style={{ border: `1px solid ${card.border}` }}
              >
                {/* Top colored section with image */}
                <div className="edu-card-image-section" style={{ background: card.bg }}>
                  <img src={card.img} alt={card.title} className="edu-card-img" />
                </div>
                {/* Bottom white section with text */}
                <div className="edu-card-text-section">
                  <h3 className="edu-card-title">{card.title}</h3>
                  <p className="edu-card-desc">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hydration & Sanitation ── */}
        <div className="edu-two-col-row">

          {/* ── Hydration Guidelines ── */}
          <div className="edu-panel">
            <div className="edu-panel-header">
              <h2 className="edu-panel-title">💧 Hydration</h2>
              <span className="edu-guide-tag">Guidelines</span>
            </div>

            <p className="edu-guide-intro">
              Spreading your water intake throughout the day is more effective than drinking large amounts at once.
              Here's a simple guide to follow:
            </p>

            {/* Quick stats row */}
            <div className="edu-hyd-stats-row">
              {hydrationFacts.map((f, i) => (
                <div key={i} className="edu-hyd-stat">
                  <span className="edu-hyd-stat-value">{f.value}</span>
                  <span className="edu-hyd-stat-label">{f.label}</span>
                  <span className="edu-hyd-stat-desc">{f.desc}</span>
                </div>
              ))}
            </div>

            {/* Time-of-day guidelines */}
            <div className="edu-guide-list">
              {hydrationGuidelines.map((g, i) => (
                <div
                  key={i}
                  className="edu-guide-item"
                  style={{ background: g.color, border: `1px solid ${g.border}` }}
                >
                  <div className="edu-guide-left">
                    <span className="edu-guide-icon">{g.icon}</span>
                    <div className="edu-guide-meta">
                      <span className="edu-guide-time" style={{ color: g.textColor }}>{g.time}</span>
                      <span className="edu-guide-amount" style={{ color: g.textColor }}>{g.amount}</span>
                    </div>
                  </div>
                  <p className="edu-guide-note">{g.note}</p>
                </div>
              ))}
            </div>

            <div className="edu-tip-box">
              <span className="edu-tip-icon">💡</span>
              <p className="edu-tip-text">
                Spread your intake evenly throughout the day — drinking too much water at once can strain your kidneys.
              </p>
            </div>
          </div>

          {/* ── Sanitation & Hygiene ── */}
          <div className="edu-panel">
            <div className="edu-panel-header">
              <h2 className="edu-panel-title">🧼 Sanitation &amp; Hygiene</h2>
            </div>

            <div className="edu-stats-row">
              {sanitationStats.map((s, i) => (
                <div key={i} className="edu-stat-box">
                  <span className="edu-stat-value" style={{ color: s.color }}>{s.value}</span>
                  <span className="edu-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <p className="edu-steps-heading">Proper Handwashing Steps</p>
            <div className="edu-steps-list">
              {sanitationSteps.map((s, i) => (
                <div key={i} className="edu-step-item">
                  <div className="edu-step-track">
                    <div className="edu-step-num">{s.step}</div>
                    {i < sanitationSteps.length - 1 && <div className="edu-step-connector" />}
                  </div>
                  <div className="edu-step-text">
                    <span className="edu-step-title">{s.title}</span>
                    <span className="edu-step-desc">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="edu-tip-box green">
              <span className="edu-tip-icon">✅</span>
              <p className="edu-tip-text">
                Wash your hands before eating, after the bathroom, and after touching public surfaces.
              </p>
            </div>
          </div>

        </div>

        {/* ── Quick Facts ── */}
        <div className="edu-section">
          <h2 className="edu-section-title">Quick Facts</h2>
          <div className="edu-facts-list">
            {quickFacts.map((fact, i) => (
              <div key={i} className="edu-fact-item">
                <div className="edu-fact-border" />
                <span className="edu-fact-icon">{fact.icon}</span>
                <p className="edu-fact-text">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}