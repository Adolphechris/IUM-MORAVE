import React from 'react'

type CardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
  onClick?: () => void
  actionLabel?: string
}

export default function Card({ title, description, children, onClick, actionLabel }: CardProps) {
  return (
    <article style={{
      background: 'white',
      border: '1px solid #dce5ed',
      borderRadius: '.7rem',
      boxShadow: '0 5px 18px rgba(20, 49, 78, .06)',
      padding: '1.35rem',
      display: 'grid',
      gap: '.6rem'
    }}>
      {title ? <h3 style={{ margin: '.35rem 0 .5rem' }}>{title}</h3> : null}
      {description ? <p style={{ color: '#52677c', fontSize: '.95rem' }}>{description}</p> : null}
      {children}
      {onClick && actionLabel ? (
        <button type="button" onClick={onClick} style={{
          width: 'fit-content',
          border: 0,
          borderRadius: '.35rem',
          background: '#07588e',
          color: 'white',
          cursor: 'pointer',
          font: 'inherit',
          fontWeight: 700,
          padding: '.65rem .9rem'
        }}>{actionLabel}</button>
      ) : null}
    </article>
  )
}
