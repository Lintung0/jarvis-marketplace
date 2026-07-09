import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Root() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
