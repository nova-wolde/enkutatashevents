'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEventStore } from '@/components/event-organizer/store'

export default function MesfinLogin() {
  const router = useRouter()
  const setAppView = useEventStore((s) => s.setAppView)

  useEffect(() => {
    setAppView('login')
    router.replace('/')
  }, [setAppView, router])

  return null
}
