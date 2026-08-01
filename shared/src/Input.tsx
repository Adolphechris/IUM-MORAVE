import React from 'react'

type InputProps = {
  id?: string
  label?: string
  type?: string
  value?: string
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoComplete?: string
  minLength?: number
  maxLength?: number
}

export default function Input({ id, label, type = 'text', value, placeholder, onChange, required, autoComplete, minLength, maxLength }: InputProps) {
  return (
    <>
      {label ? <label htmlFor={id} style={{ fontWeight: 700 }}>{label}</label> : null}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        style={{
          border: '1px solid #9fb0bf',
          borderRadius: '.35rem',
          font: 'inherit',
          padding: '.75rem',
          width: '100%'
        }}
      />
    </>
  )
}
