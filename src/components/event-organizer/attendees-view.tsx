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
import { useEventStore, BookingItem } from './store'
import { useToast } from '@/hooks/use-toast'

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  checkedIn: boolean
  guestCount: number
  eventDate: string
  venue: string
}

const statusColors: Record<string, string> = {
  Confirmed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
}

export function AttendeesView() {
  const { events, bookings } = useEventStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEvent, setFilterEvent] = useState('all')
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set())

  // Convert bookings to attendees
  const attendees: Attendee[] = useMemo(() => {
    return bookings.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      eventType: b.eventType,
      status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'cancelled' ? 'Cancelled' : 'Pending',
      checkedIn: checkedInIds.has(b.id),
      guestCount: b.guestCount,
      eventDate: b.eventDate,
      venue: b.venue,
    }))
  }, [bookings, checkedInIds])

  const filteredAttendees = useMemo(() => {
    let result = [...attendees]

    if (filterEvent !== 'all') {
      result = result.filter((a) => a.eventType === filterEvent)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.eventType.toLowerCase().includes(q)
      )
    }

    return result
  }, [attendees, filterEvent, searchQuery])

  const totalAttendees = attendees.length
  const totalGuests = attendees.reduce((sum, a) => sum + a.guestCount, 0)
  const checkedInCount = attendees.filter((a) => a.checkedIn).length
  const confirmedCount = attendees.filter((a) => a.status === 'Confirmed').length

  const handleCheckIn = (attendeeId: string) => {
    setCheckedInIds((prev) => {
      const next = new Set(prev)
      if (next.has(attendeeId)) {
        next.delete(attendeeId)
        toast({ title: 'Check-in Reverted', description: 'Attendee has been unchecked.' })
      } else {
        next.add(attendeeId)
        toast({ title: 'Checked In', description: 'Attendee has been checked in.' })
      }
      return next
    })
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Event Type', 'Status', 'Guest Count', 'Event Date', 'Venue', 'Checked In'].join(','),
      ...filteredAttendees.map((a) =>
        [a.name, a.email, a.phone, a.eventType, a.status, a.guestCount, a.eventDate, a.venue, a.checkedIn ? 'Yes' : 'No'].join(',')
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

  // Get unique event types for filter
  const eventTypes = useMemo(() => {
    const types = new Set(attendees.map((a) => a.eventType))
    return Array.from(types).filter(Boolean)
  }, [attendees])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bookings</p>
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
              <p className="text-sm text-muted-foreground">Total Guests</p>
              <p className="text-2xl font-bold">{totalGuests.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Checked In</p>
              <p className="text-2xl font-bold">{checkedInCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg font-semibold">Booking List</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-full sm:w-[200px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterEvent} onValueChange={setFilterEvent}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                    <SelectValue placeholder="Filter by event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="h-9 gap-1.5 w-full sm:w-auto"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden sm:table-cell">Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Check-in</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No bookings found. They will appear here when clients book events.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendees.slice(0, 50).map((attendee) => (
                    <TableRow key={attendee.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{attendee.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{attendee.email}</TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <p>{attendee.eventType}</p>
                          <p className="text-xs text-muted-foreground">{attendee.venue || 'TBD'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{attendee.guestCount}</TableCell>
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
                        {attendee.status !== 'Cancelled' && (
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
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredAttendees.length > 50 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Showing 50 of {filteredAttendees.length} bookings. Use search to narrow results.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
