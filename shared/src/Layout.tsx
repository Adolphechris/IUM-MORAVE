import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Container from './Container'

type LayoutProps = {
  title?: string
  headerChildren?: React.ReactNode
  children: React.ReactNode
}

export default function Layout({ title = 'IUM-MORAVE', headerChildren, children }: LayoutProps) {
  return (
    <>
      <Header title={title}>{headerChildren}</Header>
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  )
}
