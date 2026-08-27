import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      maxWidth: 1120,
      margin: '0 auto',
      padding: '2.5rem 1.5rem',
      color: '#64748b',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      marginTop: '4rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
        <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Accueil</a>
        <a href="/espace" style={{ color: '#38bdf8', textDecoration: 'none' }}>🔐 Espace Numérique</a>
        <a href="/verify" style={{ color: '#38bdf8', textDecoration: 'none' }}>🛡️ Vérification QR Code</a>
        <a href="/admissions" style={{ color: '#94a3b8', textDecoration: 'none' }}>Admissions</a>
        <a href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
      </div>
      <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
        © {new Date().getFullYear()} <strong>Institut Universitaire Morave Willsamal (IUM-MORAVE)</strong> · Mwene-Ditu, Province de Lomami, RDC<br />
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Établissement d'enseignement supérieur agréé par l'État Congolais — Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018
        </span>
      </p>
    </footer>
  );
}

