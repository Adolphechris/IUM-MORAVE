import React from 'react'

type HeaderProps = {
  title?: string
  children?: React.ReactNode
}

export default function Header({ title = 'IUM-MORAVE', children }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 1120,
      margin: '0 auto',
      padding: '1rem 1.5rem'
    }}>
      <a href="/" style={{ color: '#0a4f82', fontWeight: 800, textDecoration: 'none' }}>
        {title}
      </a>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        {children}
      </nav>
    </header>
  )
}
