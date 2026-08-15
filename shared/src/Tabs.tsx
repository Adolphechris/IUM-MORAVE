import React from 'react'

type TabsProps = {
  labels: string[]
  active: number
  onChange: (index: number) => void
  children: React.ReactNode
}

export default function Tabs({ labels, active, onChange, children }: TabsProps) {
  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '.5rem',
        borderBottom: '1px solid #dce5ed',
        marginBottom: '1rem'
      }}>
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(index)}
            style={{
              border: 0,
              background: 'transparent',
              color: index === active ? '#07588e' : '#52677c',
              borderBottom: index === active ? '2px solid #07588e' : '2px solid transparent',
              cursor: 'pointer',
              font: 'inherit',
              fontWeight: 700,
              padding: '.5rem .25rem'
            }}
          >{label}</button>
        ))}
      </div>
      <div>{React.Children.toArray(children)[active]}</div>
    </div>
  )
}
