import React from 'react'

export default function HydrationGuideItem({
  icon,
  time,
  amount,
  note,
  color,
  border,
  textColor,
}) {
  return (
    <div
      className="edu-guide-item"
      style={{
        background: color,
        border: `1px solid ${border}`,
      }}
    >

      <div className="edu-guide-left">

        <span className="edu-guide-icon">
          {icon}
        </span>

        <div className="edu-guide-meta">

          <span
            className="edu-guide-time"
            style={{
              color: textColor,
            }}
          >
            {time}
          </span>

          <span
            className="edu-guide-amount"
            style={{
              color: textColor,
            }}
          >
            {amount}
          </span>

        </div>

      </div>

      <p className="edu-guide-note">
        {note}
      </p>

    </div>
  )
}