'use client'

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

  const recentMessages = messages.slice(0, 3)
  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">Recent Messages</CardTitle>
            {unreadCount > 0 && (
              <Badge className="h-5 border-0 bg-emerald-600 px-1.5 text-[10px] text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            onClick={() => setCurrentView('messages')}
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {recentMessages.length === 0 ? (
          <div className="flex flex-col items-center py-5 text-center">
            <Mail className="mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          recentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60 ${
                !msg.read ? 'bg-emerald-500/5 ring-1 ring-emerald-500/10' : ''
              }`}
              onClick={() => setCurrentView('messages')}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                !msg.read ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {msg.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-xs ${!msg.read ? 'font-semibold' : ''}`}>{msg.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{msg.message}</p>
              </div>
              {!msg.read && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function RecentBookingsCard() {
  const { bookings, setCurrentView } = useEventStore()

  const recentBookings = bookings.slice(0, 3)
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  const statusDot: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    cancelled: 'bg-red-500',
    completed: 'bg-violet-500',
  }

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">Recent Bookings</CardTitle>
            {pendingCount > 0 && (
              <Badge className="h-5 border-0 bg-amber-500 px-1.5 text-[10px] text-white">
                {pendingCount} pending
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            onClick={() => setCurrentView('bookings')}
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center py-5 text-center">
            <CalendarCheck className="mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No bookings yet</p>
          </div>
        ) : (
          recentBookings.map((bk) => (
            <div
              key={bk.id}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60"
              onClick={() => setCurrentView('bookings')}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] font-bold text-white">
                {bk.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{bk.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{bk.eventType} — {bk.eventDate}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium capitalize text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[bk.status] || 'bg-muted-foreground'}`} />
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
  return (
    <div className="space-y-5">
      <StatsCards />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column - upcoming events */}
        <div className="space-y-5 lg:col-span-2">
          <EventCards />
          <QuickActions />
        </div>

        {/* Right column - calendar, messages, bookings, activity */}
        <div className="space-y-5">
          <CalendarWidget />
          <RecentMessagesCard />
          <RecentBookingsCard />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
