import React from 'react'

type SelectProps = {
  id?: string
  label?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
}

export default function Select({ id, label, value, onChange, options, required }: SelectProps) {
  return (
    <>
      {label ? <label htmlFor={id} style={{ fontWeight: 700 }}>{label}</label> : null}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          border: '1px solid #9fb0bf',
          borderRadius: '.35rem',
          font: 'inherit',
          padding: '.75rem',
          width: '100%'
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  )
}
