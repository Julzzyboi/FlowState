import React from 'react'

export default function QuickFactItem({
  icon,
  text,
}) {
  return (
    <div className="edu-fact-item">

      <div className="edu-fact-border" />

      <span className="edu-fact-icon">
        {icon}
      </span>

      <p className="edu-fact-text">
        {text}
      </p>

    </div>
  )
}