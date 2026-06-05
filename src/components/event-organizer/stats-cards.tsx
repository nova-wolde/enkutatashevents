'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
    <span>
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
      icon: CalendarDays,
      trend: '+12%',
      trendUp: true,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: 'Total Attendees',
      value: totalAttendees,
      icon: Users,
      trend: '+8.5%',
      trendUp: true,
      gradient: 'from-violet-500/10 to-purple-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/15',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents,
      icon: Clock,
      trend: '2 this week',
      trendUp: true,
      gradient: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/15',
    },
    {
      title: 'Revenue',
      value: totalRevenue,
      icon: DollarSign,
      trend: '+23%',
      trendUp: true,
      gradient: 'from-rose-500/10 to-pink-500/10',
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/15',
      prefix: '$',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">
                      <AnimatedCounter
                        target={stat.value}
                        prefix={stat.prefix || ''}
                      />
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {stat.trendUp ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
