'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEventStore, EventCategory } from './store'

const categoryColors: Record<EventCategory, string> = {
  Conference: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  Workshop: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
  Social: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Concert: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20',
  Meetup: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
}

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
  const { events } = useEventStore()

  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
    .slice(0, 6)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">Events happening soon</p>
        </div>
        <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
          View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {upcomingEvents.map((event) => (
          <motion.div key={event.id} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card className="rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Gradient image placeholder */}
              <div className={`h-32 bg-gradient-to-br ${event.imageGradient} relative`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90 dark:bg-black/50 text-xs border-0 backdrop-blur-sm">
                    {event.status === 'ongoing' ? '🔴 Live Now' : 'Upcoming'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="outline" className={`text-xs border ${categoryColors[event.category]}`}>
                    {event.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-base leading-tight">{event.name}</h3>

                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {format(parseISO(event.date), 'MMM d, yyyy')} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
                  </span>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
