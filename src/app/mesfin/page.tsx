'use client'

import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/event-organizer/login-page'

export default function MesfinLogin() {
  const router = useRouter()

  return (
    <LoginPage
      onSuccess={() => router.replace('/admin')}
    />
  )
}
