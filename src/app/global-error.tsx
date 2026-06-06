'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#0a0a0a',
        color: '#fafafa',
        padding: '1rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #059669, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Something Went Wrong
          </div>
          <p style={{ color: '#a1a1aa', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            We encountered an unexpected error. Please try again or contact us if the problem persists.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#fafafa',
                border: '1px solid #3f3f46',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Go Home
            </a>
          </div>
          {error.digest && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#71717a' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
