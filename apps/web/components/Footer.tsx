import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '2rem 1.5rem',
      color: '#52677c',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      marginTop: '3rem'
    }}>
      <p>© {new Date().getFullYear()} Institut Universitaire Morave · Portail Officiel Institutionnel — Agrément ESU N°83/MINESU</p>
    </footer>
  )
}
