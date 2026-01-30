'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export function FacebookPixel() {
  const pathname = usePathname()
  const initialPathRef = useRef<string | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Skip on localhost - fbevents.js is typically blocked by ad blockers/privacy extensions in dev
  useEffect(() => {
    const isLocalhost = /^localhost(:\d+)?$|^127\.0\.0\.1(:\d+)?$/.test(window.location?.host ?? '')
    setShouldLoad(!isLocalhost)
  }, [])

  useEffect(() => {
    if (!FB_PIXEL_ID || typeof window === 'undefined') return

    // Track PageView on route changes (SPA navigation only - skip initial load)
    if (pathname && initialPathRef.current !== null && initialPathRef.current !== pathname && window.fbq) {
      window.fbq('track', 'PageView')
    }
    if (initialPathRef.current === null) initialPathRef.current = pathname ?? null
  }, [pathname])

  if (!FB_PIXEL_ID || !shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window.fbq === 'function') {
            window.fbq('init', FB_PIXEL_ID!)
            window.fbq('track', 'PageView')
          }
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

