'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Users,
  TrendingUp,
  Ticket,
} from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEventStore, EventCategory } from './store'

const COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#8b5cf6', '#f43f5e']

const monthlyRevenue = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 15800 },
  { month: 'Apr', revenue: 22400 },
  { month: 'May', revenue: 28600 },
  { month: 'Jun', revenue: 24800 },
]

const monthlyAttendees = [
  { month: 'Jan', attendees: 420 },
  { month: 'Feb', attendees: 680 },
  { month: 'Mar', attendees: 540 },
  { month: 'Apr', attendees: 820 },
  { month: 'May', attendees: 1050 },
  { month: 'Jun', attendees: 890 },
]

const categoryColors: Record<EventCategory, string> = {
  Conference: '#10b981',
  Workshop: '#8b5cf6',
  Social: '#f59e0b',
  Concert: '#f43f5e',
  Meetup: '#14b8a6',
}

export function AnalyticsView() {
  const { events } = useEventStore()

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    events.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [events])

  const topEvents = useMemo(() =>
    [...events]
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 5)
      .map((e) => ({
        name: e.name.length > 20 ? e.name.slice(0, 20) + '...' : e.name,
        attendees: e.attendees,
      }))
  , [events])

  const totalRevenue = useMemo(() =>
    events.reduce((sum, e) => sum + e.attendees * e.ticketPrice, 0)
  , [events])

  const avgAttendees = useMemo(() =>
    events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length) : 0
  , [events])

  const successRate = useMemo(() => {
    const nonCancelled = events.filter((e) => e.status !== 'cancelled')
    const completed = events.filter((e) => e.status === 'completed')
    return nonCancelled.length > 0 ? Math.round((completed.length / nonCancelled.length) * 100) : 0
  }, [events])

  const totalTicketSales = useMemo(() =>
    events.reduce((sum, e) => sum + e.attendees, 0)
  , [events])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Attendees/Event</p>
              <p className="text-2xl font-bold">{avgAttendees}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Ticket className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Sales</p>
              <p className="text-2xl font-bold">{totalTicketSales.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Events by Category */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={categoryColors[entry.name as EventCategory] || '#10b981'}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendee Trends */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Attendee Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyAttendees}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), 'Attendees']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="attendees" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Events by Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEvents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), 'Attendees']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="attendees" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
