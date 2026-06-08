'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, MapPin, BarChart3, Settings, CalendarDays, Mail, CalendarCheck, FileEdit } from 'lucide-react'
import { useEventStore, ViewTab } from '@/components/event-organizer/store'
import { Header } from '@/components/event-organizer/header'
import { Sidebar } from '@/components/event-organizer/sidebar'
import { Dashboard } from '@/components/event-organizer/dashboard'
import { EventsList } from '@/components/event-organizer/events-list'
import { CreateEventDialog } from '@/components/event-organizer/create-event-dialog'
import { LoginPage } from '@/components/event-organizer/login-page'
import { AttendeesView } from '@/components/event-organizer/attendees-view'
import { VenuesView } from '@/components/event-organizer/venues-view'
import { AnalyticsView } from '@/components/event-organizer/analytics-view'
import { SettingsView } from '@/components/event-organizer/settings-view'
import { MessagesView } from '@/components/event-organizer/messages-view'
import { BookingsView } from '@/components/event-organizer/bookings-view'
import { ContentManager } from '@/components/event-organizer/content-manager'

const viewTitles: Record<ViewTab, { title: string; subtitle: string; icon: React.ElementType }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening.', icon: CalendarDays },
  events: { title: 'Events', subtitle: 'Manage all your events in one place.', icon: Calendar },
  messages: { title: 'Messages', subtitle: 'View and manage contact submissions.', icon: Mail },
  bookings: { title: 'Bookings', subtitle: 'Manage event bookings and requests.', icon: CalendarCheck },
  attendees: { title: 'Attendees', subtitle: 'Track and manage event attendees.', icon: Users },
  venues: { title: 'Venues', subtitle: 'Manage your event venues.', icon: MapPin },
  analytics: { title: 'Analytics', subtitle: 'Insights and performance metrics.', icon: BarChart3 },
  content: { title: 'Content', subtitle: 'Manage all site content.', icon: FileEdit },
  settings: { title: 'Settings', subtitle: 'Configure your preferences.', icon: Settings },
}

function AppView() {
  const { currentView, setEvents, setActivities } = useEventStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, activitiesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/activities'),
        ])
        const eventsData = await eventsRes.json()
        const activitiesData = await activitiesRes.json()
        if (eventsData.events) setEvents(eventsData.events)
        if (activitiesData.activities) setActivities(activitiesData.activities)
      } catch {
        // ignore
      }
    }
    fetchData()
  }, [setEvents, setActivities])

  const info = viewTitles[currentView]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{info.subtitle}</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Dashboard />
                </motion.div>
              )}
              {currentView === 'events' && (
                <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <EventsList />
                </motion.div>
              )}
              {currentView === 'messages' && (
                <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <MessagesView />
                </motion.div>
              )}
              {currentView === 'bookings' && (
                <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <BookingsView />
                </motion.div>
              )}
              {currentView === 'attendees' && (
                <motion.div key="attendees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <AttendeesView />
                </motion.div>
              )}
              {currentView === 'venues' && (
                <motion.div key="venues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <VenuesView />
                </motion.div>
              )}
              {currentView === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <AnalyticsView />
                </motion.div>
              )}
              {currentView === 'content' && (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <ContentManager />
                </motion.div>
              )}
              {currentView === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <SettingsView />
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

export default function AdminPage() {
  const { appView, setAppView } = useEventStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        if (data.authenticated) {
          setAppView('app')
        } else {
          setAppView('login')
        }
      } catch {
        setAppView('login')
      }
      setChecked(true)
    }
    checkAuth()
  }, [setAppView])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {appView === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage />
        </motion.div>
      )}
      {appView === 'app' && (
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
