import React from 'react'

type BadgeProps = {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'danger' | 'muted'
}

const tones: Record<string, React.CSSProperties> = {
  default: { background: '#edf6fb', color: '#07588e' },
  success: { background: '#e6f5ec', color: '#15623c' },
  danger: { background: '#fff1f1', color: '#8e2020' },
  muted: { background: '#f1f3f6', color: '#52677c' }
}

export default function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span style={{
      ...tones[tone],
      borderRadius: '.35rem',
      display: 'inline-block',
      fontSize: '.8rem',
      fontWeight: 700,
      padding: '.35rem .6rem'
    }}>{children}</span>
  )
}
