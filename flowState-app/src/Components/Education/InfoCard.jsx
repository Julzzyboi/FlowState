import React from 'react'

export default function InfoCard({
  title,
  desc,
  img,
  bg,
  border,
}) {
  return (
    <div
      className="edu-info-card"
      style={{
        border: `1px solid ${border}`,
      }}
    >

      <div
        className="edu-card-image-section"
        style={{ background: bg }}
      >

        {img && (
          <img
            src={img}
            alt={title}
            className="edu-card-img"
          />
        )}

      </div>

      <div className="edu-card-text-section">

        <h3 className="edu-card-title">
          {title}
        </h3>

        <p className="edu-card-desc">
          {desc}
        </p>

      </div>

    </div>
  )
}