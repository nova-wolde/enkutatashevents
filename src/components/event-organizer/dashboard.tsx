'use client'

import { motion } from 'framer-motion'
import { Mail, CalendarCheck, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEventStore } from './store'
import { StatsCards } from './stats-cards'
import { EventCards } from './event-cards'
import { CalendarWidget } from './calendar-widget'
import { ActivityFeed } from './activity-feed'
import { QuickActions } from './quick-actions'

function RecentMessagesCard() {
  const { messages, setCurrentView } = useEventStore()

  // Data is already initialized from hardcoded data in the store

  const recentMessages = messages.slice(0, 3)
  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-sm font-semibold">Recent Messages</CardTitle>
            {unreadCount > 0 && (
              <Badge className="h-5 px-1.5 text-[10px] bg-emerald-600 text-white border-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-emerald-600 hover:text-emerald-700 h-7"
            onClick={() => setCurrentView('messages')}
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentMessages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No messages yet</p>
        ) : (
          recentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                !msg.read ? 'bg-emerald-500/5' : ''
              }`}
              onClick={() => setCurrentView('messages')}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white ${
                !msg.read ? 'bg-emerald-500' : 'bg-muted'
              }`}>
                {msg.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${!msg.read ? 'font-semibold' : ''}`}>{msg.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{msg.message}</p>
              </div>
              {!msg.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function RecentBookingsCard() {
  const { bookings, setCurrentView } = useEventStore()

  // Data is already initialized from hardcoded data in the store

  const recentBookings = bookings.slice(0, 3)
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  const statusColors: Record<string, string> = {
    pending: 'text-amber-700 dark:text-amber-400',
    confirmed: 'text-emerald-700 dark:text-emerald-400',
    cancelled: 'text-red-700 dark:text-red-400',
    completed: 'text-violet-700 dark:text-violet-400',
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-sm font-semibold">Recent Bookings</CardTitle>
            {pendingCount > 0 && (
              <Badge className="h-5 px-1.5 text-[10px] bg-amber-500 text-white border-0">
                {pendingCount} pending
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-emerald-600 hover:text-emerald-700 h-7"
            onClick={() => setCurrentView('bookings')}
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentBookings.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No bookings yet</p>
        ) : (
          recentBookings.map((bk) => (
            <div
              key={bk.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setCurrentView('bookings')}
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white bg-gradient-to-br from-emerald-500 to-teal-600">
                {bk.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{bk.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{bk.eventType} — {bk.eventDate}</p>
              </div>
              <span className={`text-[10px] font-medium capitalize ${statusColors[bk.status] || ''}`}>
                {bk.status}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { events } = useEventStore()

  // Data is already initialized from hardcoded data in the store

  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - upcoming events */}
        <div className="lg:col-span-2 space-y-6">
          <EventCards />
        </div>

        {/* Right column - calendar, messages, bookings, activity, quick actions */}
        <div className="space-y-6">
          <CalendarWidget />
          <RecentMessagesCard />
          <RecentBookingsCard />
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
