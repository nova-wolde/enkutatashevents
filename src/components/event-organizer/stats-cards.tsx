'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEventStore } from './store'

function AnimatedCounter({ target, duration = 1500, prefix = '', suffix = '' }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
}

export function StatsCards() {
  const { events } = useEventStore()

  const totalEvents = events.length
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0)
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').length
  const totalRevenue = events.reduce((sum, e) => sum + e.attendees * e.ticketPrice, 0)

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      sub: `${upcomingEvents} upcoming · ${events.filter((e) => e.status === 'completed').length} completed`,
      icon: CalendarDays,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 border border-emerald-500/15',
    },
    {
      title: 'Total Attendees',
      value: totalAttendees,
      sub: 'across all events',
      icon: Users,
      iconColor: 'text-teal-600 dark:text-teal-400',
      iconBg: 'bg-teal-500/10 border border-teal-500/15',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      sub: upcomingEvents > 0 ? 'scheduled ahead' : 'nothing scheduled',
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 border border-amber-500/15',
    },
    {
      title: 'Est. Revenue',
      value: totalRevenue,
      sub: 'from ticket sales',
      icon: DollarSign,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10 border border-violet-500/15',
      prefix: '$',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-[13px] font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-[28px] font-bold leading-none tracking-tight">
                      <AnimatedCounter
                        target={stat.value}
                        prefix={stat.prefix || ''}
                      />
                    </p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="mt-3 truncate text-xs text-muted-foreground/80">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
