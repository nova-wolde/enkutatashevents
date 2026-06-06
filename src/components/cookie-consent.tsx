'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'enkutatash-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay so it doesn't appear immediately
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }))
    setVisible(false)
    // Enable analytics if consent given
    window.dispatchEvent(new Event('cookie-consent-accepted'))
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-3 sm:p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-3xl mx-auto bg-background/95 backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Cookie className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-semibold">We value your privacy</h3>
              <button
                onClick={decline}
                className="shrink-0 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
              <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                onClick={accept}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm h-9"
              >
                Accept All Cookies
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={decline}
                className="text-xs sm:text-sm h-9"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
