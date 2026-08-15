import React from 'react'

export const Button = ({ children, ...props }) => (
  <button {...props} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>
    {children}
  </button>
)

export default Button
