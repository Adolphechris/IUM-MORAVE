import React from 'react'

type AlertProps = {
  tone?: 'error' | 'success' | 'info'
  children: React.ReactNode
}

const styles: Record<string, React.CSSProperties> = {
  error: { background: '#fff1f1', borderLeft: '4px solid #bd3030', color: '#751b1b' },
  success: { background: '#e6f5ec', borderLeft: '4px solid #2bb673', color: '#15623c' },
  info: { background: '#edf6fb', borderLeft: '4px solid #0a689f', color: '#07588e' }
}

export default function Alert({ tone = 'info', children }: AlertProps) {
  return (
    <p role="alert" style={{
      ...styles[tone],
      borderRadius: '.35rem',
      padding: '.75rem 1rem',
      marginTop: '1rem'
    }}>{children}</p>
  )
}
