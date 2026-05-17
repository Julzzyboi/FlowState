import React, { useState } from 'react'
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

/* ── Quick Facts ── */
const quickFacts = [
  {
    icon: '💧',
    text: (
      <>
        Your body is <strong>60% water</strong>. Every cell, organ, and tissue depends on water to function.
      </>
    ),
  },
  {
    icon: '🌡️',
    text: (
      <>
        In hot or humid climates, your water needs can increase by{' '}
        <span className="highlight">up to 1.5× the normal amount</span>
      </>
    ),
  },
  {
    icon: '🚿',
    text: (
      <>
        Proper sanitation prevents{' '}
        <span className="highlight">cholera, typhoid, and diarrhea</span> — diseases that still kill millions every year.
      </>
    ),
  },
  {
    icon: '⚡',
    text: (
      <>
        Feeling tired mid-afternoon? It's often dehydration. Try a glass of water before reaching for{' '}
        <span className="highlight">caffeine</span>.
      </>
    ),
  },
  {
    icon: '🌐',
    text: (
      <>
        Clean water initiatives have protected{' '}
        <span className="highlight">over 1.8 billion people</span> from waterborne diseases since 1990.
      </>
    ),
  },
]

/* ── Hydration Schedule ── */
const hydrationSchedule = [
  { time: '7:00 AM',  amount: '500ml', note: 'Right after waking up',  done: true  },
  { time: '10:00 AM', amount: '400ml', note: 'Mid-morning boost',       done: true  },
  { time: '1:00 PM',  amount: '500ml', note: 'Before lunch',            done: false },
  { time: '4:00 PM',  amount: '400ml', note: 'Afternoon refuel',        done: false },
  { time: '7:00 PM',  amount: '500ml', note: 'Evening wind-down',       done: false },
]

/* ── Sanitation Steps ── */
const sanitationSteps = [
  { step: '01', title: 'Wet your hands',      desc: 'Use clean, running water — warm or cold.' },
  { step: '02', title: 'Lather with soap',    desc: 'Scrub backs, between fingers, and under nails.' },
  { step: '03', title: 'Scrub for 20 sec',    desc: 'Hum "Happy Birthday" twice as a timer.' },
  { step: '04', title: 'Rinse thoroughly',    desc: 'Remove all soap under clean running water.' },
  { step: '05', title: 'Dry with clean towel',desc: 'Use a clean towel or let hands air dry.' },
]

const sanitationStats = [
  { value: '80%',  label: 'of infections prevented by handwashing', color: '#3b82f6' },
  { value: '2.2B', label: 'people lack basic sanitation access',     color: '#ef4444' },
  { value: '297k', label: 'child deaths prevented yearly',           color: '#16a34a' },
]

export default function EducationPage() {
  const [checked, setChecked] = useState(hydrationSchedule.map((h) => h.done))

  const toggleCheck = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const totalMl = hydrationSchedule.reduce((s, h) => s + parseInt(h.amount), 0)
  const doneMl  = hydrationSchedule
    .filter((_, i) => checked[i])
    .reduce((s, h) => s + parseInt(h.amount), 0)
  const pct      = Math.round((doneMl / totalMl) * 100)
  const doneCount = checked.filter(Boolean).length

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
                style={{ background: card.bg, border: `1px solid ${card.border}` }}
              >
                <div className="edu-icon-circle" style={{ background: card.iconBg }}>
                  <img src={card.img} alt={card.title} className="edu-card-img" />
                </div>
                <h3 className="edu-card-title">{card.title}</h3>
                <p className="edu-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hydration & Sanitation ── */}
        <div className="edu-two-col-row">

          {/* Hydration */}
          <div className="edu-panel">
            <div className="edu-panel-header">
              <h2 className="edu-panel-title">💧 Hydration</h2>
              <span className="edu-panel-badge">{doneCount}/{hydrationSchedule.length} done</span>
            </div>

            <div className="edu-progress-wrap">
              <div className="edu-progress-track">
                <div className="edu-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="edu-progress-label">{doneMl}ml / {totalMl}ml ({pct}%)</span>
            </div>

            <div className="edu-schedule-list">
              {hydrationSchedule.map((item, i) => (
                <div
                  key={i}
                  className={`edu-schedule-item ${checked[i] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(i)}
                >
                  <div className={`edu-checkbox ${checked[i] ? 'checked' : ''}`}>
                    {checked[i] && <span className="edu-checkmark">✓</span>}
                  </div>
                  <div className="edu-schedule-text">
                    <span className={`edu-schedule-time ${checked[i] ? 'checked' : ''}`}>{item.time}</span>
                    <span className="edu-schedule-note">{item.note}</span>
                  </div>
                  <span className={`edu-schedule-amount ${checked[i] ? 'checked' : ''}`}>{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="edu-tip-box">
              <span className="edu-tip-icon">💡</span>
              <p className="edu-tip-text">
                Spread your intake evenly — drinking too much at once strains your kidneys.
              </p>
            </div>
          </div>

          {/* Sanitation & Hygiene */}
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