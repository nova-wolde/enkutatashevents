'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEventStore } from './store'
import { useToast } from '@/hooks/use-toast'

interface Attendee {
  id: string
  name: string
  email: string
  eventName: string
  ticketType: 'VIP' | 'General' | 'Student'
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  checkedIn: boolean
}

const firstNames = ['Sarah', 'Alex', 'Maya', 'Tom', 'Priya', 'Jordan', 'Emily', 'Marcus', 'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Aiden']
const lastNames = ['Chen', 'Rivera', 'Johnson', 'Wilson', 'Patel', 'Lee', 'Davis', 'Brown', 'Garcia', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Young']

function generateAttendees(events: Attendee['eventName'][]): Attendee[] {
  const attendees: Attendee[] = []
  const ticketTypes: Attendee['ticketType'][] = ['VIP', 'General', 'Student']
  const statuses: Attendee['status'][] = ['Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled']
  let idCounter = 1

  events.forEach((eventName) => {
    const count = 8 + Math.floor(Math.random() * 12)
    for (let i = 0; i < count; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)]
      attendees.push({
        id: `att-${idCounter++}`,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
        eventName,
        ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        checkedIn: Math.random() > 0.6,
      })
    }
  })

  return attendees
}

const statusColors: Record<string, string> = {
  Confirmed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
}

const ticketColors: Record<string, string> = {
  VIP: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
  General: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/20',
  Student: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
}

export function AttendeesView() {
  const { events } = useEventStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEvent, setFilterEvent] = useState('all')
  const [attendees, setAttendees] = useState<Attendee[]>(() =>
    generateAttendees(events.map((e) => e.name))
  )

  const filteredAttendees = useMemo(() => {
    let result = [...attendees]

    if (filterEvent !== 'all') {
      result = result.filter((a) => a.eventName === filterEvent)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.eventName.toLowerCase().includes(q)
      )
    }

    return result
  }, [attendees, filterEvent, searchQuery])

  const totalAttendees = attendees.length
  const checkedInCount = attendees.filter((a) => a.checkedIn).length
  const confirmedCount = attendees.filter((a) => a.status === 'Confirmed').length

  const handleCheckIn = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a
      )
    )
    const attendee = attendees.find((a) => a.id === attendeeId)
    if (attendee) {
      toast({
        title: attendee.checkedIn ? 'Check-in Reverted' : 'Checked In',
        description: `${attendee.name} has been ${attendee.checkedIn ? 'unchecked' : 'checked in'}.`,
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Event', 'Ticket Type', 'Status', 'Checked In'].join(','),
      ...filteredAttendees.map((a) =>
        [a.name, a.email, a.eventName, a.ticketType, a.status, a.checkedIn ? 'Yes' : 'No'].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendees.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast({
      title: 'Export Complete',
      description: 'Attendee list has been exported as CSV.',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Attendees</p>
              <p className="text-2xl font-bold">{totalAttendees}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Checked In</p>
              <p className="text-2xl font-bold">{checkedInCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg font-semibold">Attendee List</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-[200px]"
                />
              </div>
              <Select value={filterEvent} onValueChange={setFilterEvent}>
                <SelectTrigger className="w-[180px] h-9 text-sm">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9 gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden sm:table-cell">Ticket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Check-in</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No attendees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendees.slice(0, 20).map((attendee) => (
                    <TableRow key={attendee.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm">{attendee.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{attendee.email}</TableCell>
                      <TableCell className="text-sm">{attendee.eventName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={`text-xs ${ticketColors[attendee.ticketType]}`}>
                          {attendee.ticketType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColors[attendee.status]}`}>
                          {attendee.status === 'Confirmed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {attendee.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                          {attendee.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3" />}
                          {attendee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {attendee.checkedIn ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            Checked In
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Not Checked In
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={attendee.checkedIn ? 'outline' : 'default'}
                          size="sm"
                          className={`h-7 text-xs gap-1 ${
                            !attendee.checkedIn ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                          }`}
                          onClick={() => handleCheckIn(attendee.id)}
                        >
                          <UserCheck className="h-3 w-3" />
                          {attendee.checkedIn ? 'Undo' : 'Check In'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredAttendees.length > 20 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Showing 20 of {filteredAttendees.length} attendees. Use search to narrow results.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
