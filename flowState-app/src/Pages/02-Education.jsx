// src/Pages/02-Education.jsx

import React from 'react'

import '../Style/Education.css'
import SectionTitle from '../Components/Education/SectionTitle'
import QuickFactItem from '../Components/Education/QuickFactItem'
import HydrationGuideItem from '../Components/Education/HydrationGuideItem'
import InfoCard from '../Components/Education/InfoCard'
import QuizSection from '../Components/Education/QuizSection'

import BrainSvg from '../assets/brain.svg'
import faucetSvg from '../assets/faucet.svg'
import soapSvg from '../assets/soap.svg'
import waterSvg from '../assets/water.svg'

/* ─────────────────────────────────────
   WHY WATER MATTERS
───────────────────────────────────── */

const cardData = [
  {
    id: 1,
    img: waterSvg,
    title: 'Why You Need 2–4L Daily',
    desc:
      'Water regulates body temperature, carries nutrients, and removes waste from the body.',
    bg: '#fef9ec',
  },

  {
    id: 2,
    img: soapSvg,
    title: 'Handwashing & Hygiene',
    desc:
      'Proper handwashing prevents common infections and disease transmission.',
    bg: '#eff6ff',
  },

  {
    id: 3,
    img: BrainSvg,
    title: 'Dehydration & Brain Health',
    desc:
      'Even mild dehydration affects focus, memory, and energy levels.',
    bg: '#f0fdf4',
  },

  {
    id: 4,
    img: faucetSvg,
    title: 'Clean Water Access',
    desc:
      'Billions of people still lack access to safe drinking water.',
    bg: '#f0f9ff',
  },
]

/* ─────────────────────────────────────
   HYDRATION GUIDELINES
───────────────────────────────────── */

const hydrationGuidelines = [
  {
    time: 'Morning',
    amount: '500ml',
    note:
      'Drink a glass of water after waking up.',
    icon: '🌅',
    color: '#fef3c7',
    border: '#fde68a',
    textColor: '#92400e',
  },

  {
    time: 'Mid-Morning',
    amount: '300–400ml',
    note:
      'Stay hydrated between breakfast and lunch.',
    icon: '☀️',
    color: '#eff6ff',
    border: '#bfdbfe',
    textColor: '#1e40af',
  },

  {
    time: 'Afternoon',
    amount: '500ml',
    note:
      'Drink water before and during lunch.',
    icon: '🌤️',
    color: '#f0fdf4',
    border: '#bbf7d0',
    textColor: '#166534',
  },

  {
    time: 'Evening',
    amount: '300–400ml',
    note:
      'Avoid excessive water before sleeping.',
    icon: '🌙',
    color: '#f5f3ff',
    border: '#ddd6fe',
    textColor: '#5b21b6',
  },
]

/* ─────────────────────────────────────
   SANITATION STATS
───────────────────────────────────── */

const sanitationStats = [
  {
    value: '80%',
    label:
      'of infections prevented by handwashing',
    color: '#2563eb',
  },

  {
    value: '2.2B',
    label:
      'people lack basic sanitation access',
    color: '#ef4444',
  },

  {
    value: '297k',
    label:
      'child deaths prevented yearly',
    color: '#16a34a',
  },
]

/* ─────────────────────────────────────
   SANITATION STEPS
───────────────────────────────────── */

const sanitationSteps = [
  {
    step: '01',
    title: 'Wet your hands',
    desc: 'Use clean running water.',
  },

  {
    step: '02',
    title: 'Apply soap',
    desc:
      'Scrub palms, fingers, and nails.',
  },

  {
    step: '03',
    title: 'Scrub for 20 sec',
    desc:
      'Wash thoroughly for 20 seconds.',
  },

  {
    step: '04',
    title: 'Rinse thoroughly',
    desc:
      'Remove all soap using clean water.',
  },

  {
    step: '05',
    title: 'Dry properly',
    desc:
      'Use a clean towel or air dry.',
  },
]

/* ─────────────────────────────────────
   QUICK FACTS
───────────────────────────────────── */

const quickFacts = [
  {
    icon: '💧',
    text: 'Your body is 60% water.',
  },

  {
    icon: '🌡️',
    text:
      'Hot weather increases hydration needs.',
  },

  {
    icon: '🚿',
    text:
      'Good sanitation prevents disease.',
  },

  {
    icon: '⚡',
    text:
      'Dehydration reduces energy and focus.',
  },

  {
    icon: '🌍',
    text:
      'Clean water access remains a global issue.',
  },
]

export default function EducationPage() {

  return (
    <div className="edu-page">

      <div className="edu-outer">

        {/* HERO */}
        <div className="edu-hero">

          <div className="edu-hero-content">

            <h1 className="edu-hero-title">
              Education
            </h1>

            <p className="edu-hero-subtitle">
              HYDRATION AND SANITATION AWARENESS
            </p>

            <p className="edu-hero-desc">
              Learn the importance of proper hydration,
              hygiene, and clean water awareness.
            </p>

          </div>

          <div className="edu-circle edu-circle-1" />
          <div className="edu-circle edu-circle-2" />

        </div>

        {/* WHY WATER MATTERS */}
        <div className="edu-section">

          <SectionTitle
            title="Why Water Matters"
          />

          <div className="edu-card-grid">

            {cardData.map((card) => (
              <InfoCard
                key={card.id}
                {...card}
              />
            ))}

          </div>

        </div>

        {/* HYDRATION & SANITATION */}
        <div className="edu-two-col-row">

          {/* HYDRATION */}
          <div className="edu-panel">

            <div className="edu-panel-header">

              <h2 className="edu-panel-title">
                💧 Hydration
              </h2>

            </div>

            <div className="edu-guide-list">

              {hydrationGuidelines.map(
                (guide, i) => (
                  <HydrationGuideItem
                    key={i}
                    {...guide}
                  />
                )
              )}

            </div>

          </div>

          {/* SANITATION */}
          <div className="edu-panel">

            <div className="edu-panel-header">

              <h2 className="edu-panel-title">
                🧼 Sanitation & Hygiene
              </h2>

            </div>

            <div className="edu-stats-row">

              {sanitationStats.map(
                (stat, i) => (
                  <div
                    key={i}
                    className="edu-stat-box"
                  >

                    <span
                      className="edu-stat-value"
                      style={{
                        color: stat.color,
                      }}
                    >
                      {stat.value}
                    </span>

                    <span className="edu-stat-label">
                      {stat.label}
                    </span>

                  </div>
                )
              )}

            </div>

            <p className="edu-steps-heading">
              Proper Handwashing Steps
            </p>

            <div className="edu-steps-list">

              {sanitationSteps.map(
                (step, i) => (
                  <div
                    key={i}
                    className="edu-step-item"
                  >

                    <div className="edu-step-track">

                      <div className="edu-step-num">
                        {step.step}
                      </div>

                      {i <
                        sanitationSteps.length -
                          1 && (
                        <div className="edu-step-connector" />
                      )}

                    </div>

                    <div className="edu-step-text">

                      <span className="edu-step-title">
                        {step.title}
                      </span>

                      <span className="edu-step-desc">
                        {step.desc}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* QUICK FACTS */}
        <div className="edu-section">

          <SectionTitle
            title="Quick Facts"
          />

          <div className="edu-facts-list">

            {quickFacts.map((fact, i) => (
              <QuickFactItem
                key={i}
                {...fact}
              />
            ))}

          </div>

        </div>

        {/* AWARENESS CHALLENGE */}
        <QuizSection />

      </div>

    </div>
  )
}