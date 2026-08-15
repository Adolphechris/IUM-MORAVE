import React from 'react'

type ContainerProps = {
  children: React.ReactNode
  maxWidth?: number | string
  className?: string
}

export default function Container({ children, maxWidth = 760, className }: ContainerProps) {
  return (
    <div className={className} style={{
      maxWidth,
      margin: '0 auto',
      padding: '1.5rem'
    }}>
      {children}
    </div>
  )
}
