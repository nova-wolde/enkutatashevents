'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * PWA is scoped to the admin app only.
 * - On /admin/*: registers the service worker with an /admin/ scope so the
 *   site is installable as an admin console.
 * - Everywhere else: tears down any existing (legacy site-wide) registration
 *   so public pages are never controlled by a service worker.
 */
export function ServiceWorkerRegistration() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/admin/' })
        .then((reg) => {
          console.log('SW registered (admin):', reg.scope)
        })
        .catch((err) => {
          console.log('SW registration failed:', err)
        })
    } else {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          if (!reg.scope.includes('/admin')) {
            reg.unregister()
            console.log('SW unregistered (public page):', reg.scope)
          }
        })
      })
    }
  }, [pathname])

  return null
}
