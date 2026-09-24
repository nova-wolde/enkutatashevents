'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Plus } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEventStore } from './store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function EventCards() {
  const { events, setCurrentView, setSelectedEvent, setCreateDialogOpen } = useEventStore()

  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
    .slice(0, 6)

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Upcoming Events</h2>
            <p className="text-xs text-muted-foreground">Scheduled and live events</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400" onClick={() => setCurrentView('events')}>
            View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium">No upcoming events</p>
            <p className="mb-4 mt-0.5 max-w-xs text-xs text-muted-foreground">
              Create your next event and it will show up here with bookings and attendee stats.
            </p>
            <Button size="sm" className="h-8 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Event
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  {/* Gradient image placeholder */}
                  <div className={`relative h-24 bg-gradient-to-br ${event.imageGradient}`}>
                    <Sparkles className="absolute -bottom-2 right-4 h-16 w-16 rotate-12 text-white/10" />
                    <div className="absolute right-3 top-3 flex items-center gap-1.5">
                      {event.status === 'ongoing' ? (
                        <Badge variant="outline" className="border-0 bg-white/90 text-xs backdrop-blur-sm dark:bg-black/50">
                          <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                          Live Now
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-0 bg-white/90 text-xs backdrop-blur-sm dark:bg-black/50">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="outline" className="border-0 bg-white/90 text-xs font-medium text-zinc-800 backdrop-blur-sm">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-3 p-4">
                    <h3 className="truncate font-semibold leading-tight">{event.name}</h3>

                    <div className="grid grid-cols-1 gap-1.5 text-[13px] text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate">{format(parseISO(event.date), 'MMM d, yyyy')} · {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate">{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice.toLocaleString()}`}
                      </span>
                      <Button size="sm" variant="outline" className="h-8 border-emerald-600/30 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white" onClick={() => { setSelectedEvent(event); setCurrentView('events') }}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
