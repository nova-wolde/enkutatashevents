'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEventStore } from './store'
import { parseISO, isSameDay } from 'date-fns'

export function CalendarWidget() {
  const { events } = useEventStore()
  const [date, setDate] = useState<Date | undefined>(new Date())

  const eventDates = events
    .filter((e) => e.status !== 'cancelled')
    .map((e) => parseISO(e.date))

  const eventsOnSelectedDate = date
    ? events.filter((e) => isSameDay(parseISO(e.date), date) && e.status !== 'cancelled')
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Calendar</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              hasEvent: eventDates,
            }}
            className="rounded-md"
            modifiersClassNames={{
              hasEvent: 'after:bg-emerald-500 after:rounded-full after:w-1.5 after:h-1.5 after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:absolute',
            }}
          />

          {/* Events on selected date */}
          {eventsOnSelectedDate.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Events on this day
              </p>
              {eventsOnSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                >
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${event.imageGradient}`} />
                  <span className="font-medium truncate">{event.name}</span>
                  <span className="text-muted-foreground ml-auto text-xs">{event.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
