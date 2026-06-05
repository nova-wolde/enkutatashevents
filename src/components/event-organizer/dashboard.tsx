'use client'

import { StatsCards } from './stats-cards'
import { EventCards } from './event-cards'
import { CalendarWidget } from './calendar-widget'
import { ActivityFeed } from './activity-feed'
import { QuickActions } from './quick-actions'

export function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - upcoming events */}
        <div className="lg:col-span-2 space-y-6">
          <EventCards />
        </div>

        {/* Right column - calendar, activity, quick actions */}
        <div className="space-y-6">
          <CalendarWidget />
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
