import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: '#52677c'
    }}>
      <p>© {new Date().getFullYear()} Institut Universitaire Morave · Portail MVP</p>
    </footer>
  )
}
