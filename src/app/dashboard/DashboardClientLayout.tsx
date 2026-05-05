"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Vérification immédiate côté client (pas dans useEffect pour éviter le flash)
  const [demoChecked, setDemoChecked] = useState(false)

  useEffect(() => {
    // Vérifier URL param ?demo=true via Next.js searchParams
    const urlDemo = searchParams.get("demo") === "true"
    
    // Vérifier localStorage
    const lsDemo = localStorage.getItem("demo-mode") === "true"
    
    const demoMode = urlDemo || lsDemo
    setIsDemo(demoMode)
    setDemoChecked(true)
    
    // Si URL demo, aussi stocker dans localStorage pour les prochaines pages
    if (urlDemo) {
      localStorage.setItem("demo-mode", "true")
    }

    if (demoMode) {
      setIsAuthenticated(true)
      return
    }

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (!session?.user) {
          setIsAuthenticated(false)
          router.push("/auth/signin")
        } else {
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
        router.push("/auth/signin")
      })
  }, [router, pathname, searchParams])

  if (!demoChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirection...</div>
      </div>
    )
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/menu", label: "Menu" },
    { href: "/dashboard/orders", label: "Commandes" },
    { href: "/dashboard/reservations", label: "Réservations" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/settings", label: "Paramètres" },
    { href: "/dashboard/qr", label: "QR Code" },
  ]

  const demoParam = isDemo ? "?demo=true" : ""

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation responsive */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-orange-500">MenuQR</span>
            </div>

            {/* Desktop nav - explicit media query via style tag */}
            <div className="desktop-nav items-center space-x-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`${link.href}${demoParam}`}
                    className="text-gray-700 hover:text-orange-500 text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              {isDemo && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  Mode Démo
                </span>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-btn items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-orange-500 p-2"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu drawer */}
          {mobileMenuOpen && (
            <div className="mobile-drawer pb-4">
              <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={`${link.href}${demoParam}`}
                  className="text-gray-700 hover:text-orange-500 hover:bg-gray-50 px-3 py-2 rounded text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
                {isDemo && (
                  <span className="bg-green-100 text-green-800 px-3 py-2 rounded text-xs w-fit">
                    Mode Démo
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Responsive navbar styles via inline style tag */}
      <style>{`
        .desktop-nav {
          display: none;
        }
        .mobile-menu-btn {
          display: flex;
        }
        .mobile-drawer {
          display: block;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  )
}
