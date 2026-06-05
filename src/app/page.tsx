'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, MapPin, BarChart3, Settings, CalendarDays } from 'lucide-react'
import { useEventStore, ViewTab } from '@/components/event-organizer/store'
import { sampleEvents, sampleActivities } from '@/components/event-organizer/data'
import { Header } from '@/components/event-organizer/header'
import { Sidebar } from '@/components/event-organizer/sidebar'
import { Dashboard } from '@/components/event-organizer/dashboard'
import { EventsList } from '@/components/event-organizer/events-list'
import { CreateEventDialog } from '@/components/event-organizer/create-event-dialog'
import { LandingPage } from '@/components/event-organizer/landing-page'
import { Card, CardContent } from '@/components/ui/card'

const viewTitles: Record<ViewTab, { title: string; subtitle: string; icon: React.ElementType }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back, John! Here\'s what\'s happening.', icon: CalendarDays },
  events: { title: 'Events', subtitle: 'Manage all your events in one place.', icon: Calendar },
  attendees: { title: 'Attendees', subtitle: 'Track and manage event attendees.', icon: Users },
  venues: { title: 'Venues', subtitle: 'Manage your event venues.', icon: MapPin },
  analytics: { title: 'Analytics', subtitle: 'Insights and performance metrics.', icon: BarChart3 },
  settings: { title: 'Settings', subtitle: 'Configure your preferences.', icon: Settings },
}

function PlaceholderView({ view }: { view: ViewTab }) {
  const info = viewTitles[view]
  const Icon = info.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold mb-1">{info.title}</h2>
          <p className="text-muted-foreground text-sm">{info.subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AppView() {
  const { currentView, setEvents, setActivities } = useEventStore()

  // Initialize with sample data
  useEffect(() => {
    setEvents(sampleEvents)
    setActivities(sampleActivities)
  }, [setEvents, setActivities])

  const info = viewTitles[currentView]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{info.subtitle}</p>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dashboard />
                </motion.div>
              )}
              {currentView === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventsList />
                </motion.div>
              )}
              {!['dashboard', 'events'].includes(currentView) && (
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlaceholderView view={currentView} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CreateEventDialog />
    </div>
  )
}

export default function Home() {
  const { appView } = useEventStore()

  return (
    <AnimatePresence mode="wait">
      {appView === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AppView />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
