'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  Search,
  Filter,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Package,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useEventStore, BookingItem } from './store'

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-500/10', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-500/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-500/10', icon: XCircle },
  completed: { label: 'Completed', color: 'text-violet-700 dark:text-violet-400', bgColor: 'bg-violet-500/10', icon: AlertCircle },
}

export function BookingsView() {
  const { toast } = useToast()
  const { bookings, setBookings, setPendingBookingsCount } = useEventStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const updateStatus = async (booking: BookingItem, newStatus: string) => {
    const updated = bookings.map((b) =>
      b.id === booking.id ? { ...b, status: newStatus as BookingItem['status'] } : b
    )
    setBookings(updated)
    const pending = updated.filter((b) => b.status === 'pending').length
    setPendingBookingsCount(pending)
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking({ ...booking, status: newStatus as BookingItem['status'] })
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, status: newStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update status on server')
      }
      toast({
        title: 'Status Updated',
        description: `Booking for ${booking.name} marked as ${newStatus}`,
      })
    } catch {
      const reverted = bookings.map((b) =>
        b.id === booking.id ? { ...b, status: booking.status } : b
      )
      setBookings(reverted)
      const revertedPending = reverted.filter((b) => b.status === 'pending').length
      setPendingBookingsCount(revertedPending)
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking(booking)
      }
      toast({
        title: 'Error updating booking status',
        description: 'Failed to save changes to server.',
        variant: 'destructive',
      })
    }
  }

  const deleteBooking = async (booking: BookingItem) => {
    const updated = bookings.filter((b) => b.id !== booking.id)
    setBookings(updated)
    const pending = updated.filter((b) => b.status === 'pending').length
    setPendingBookingsCount(pending)
    if (selectedBooking?.id === booking.id) {
      setDetailOpen(false)
      setSelectedBooking(null)
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete booking on server')
      }
      toast({
        title: 'Booking Deleted',
        description: `Removed booking for ${booking.name}`,
      })
    } catch {
      setBookings(bookings)
      const revertedPending = bookings.filter((b) => b.status === 'pending').length
      setPendingBookingsCount(revertedPending)
      toast({
        title: 'Error deleting booking',
        description: 'Failed to delete booking from server.',
        variant: 'destructive',
      })
    }
  }

  const toggleRead = async (booking: BookingItem) => {
    const nextRead = !booking.read
    const updated = bookings.map((b) =>
      b.id === booking.id ? { ...b, read: nextRead } : b
    )
    setBookings(updated)

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, read: nextRead }),
      })
      if (!response.ok) {
        throw new Error('Failed to update read status on server')
      }
    } catch {
      const reverted = bookings.map((b) =>
        b.id === booking.id ? { ...b, read: booking.read } : b
      )
      setBookings(reverted)
      toast({
        title: 'Error updating status',
        description: 'Failed to save read status on server.',
        variant: 'destructive',
      })
    }
  }

  const openDetail = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setDetailOpen(true)
    if (!booking.read) {
      toggleRead(booking)
    }
  }

  // Filter and search
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.eventType.toLowerCase().includes(q) ||
        b.venue.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Stats
  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const thisMonthCount = bookings.filter((b) => {
    const d = new Date(b.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-xl font-bold">{bookings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-xl font-bold">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold">{thisMonthCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, event type, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <CalendarCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No Bookings</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'No bookings match your current filters.'
                : 'No bookings yet. They will appear here when clients book events.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredBookings.map((booking) => {
            const status = statusConfig[booking.status]
            const StatusIcon = status.icon
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    !booking.read ? 'border-amber-200 dark:border-amber-800 bg-amber-500/5' : ''
                  }`}
                  onClick={() => openDetail(booking)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                        !booking.read
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : 'bg-muted'
                      }`}>
                        {booking.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className={`text-sm font-medium ${!booking.read ? 'font-semibold' : ''}`}>
                            {booking.name}
                          </p>
                          {!booking.read && (
                            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <Badge variant="secondary" className="text-[10px]">
                            {booking.eventType}
                          </Badge>
                          <Badge className={`text-[10px] ${status.bgColor} ${status.color} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(booking.eventDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {booking.guestCount} guests
                          </span>
                          {booking.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.venue}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {booking.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-emerald-600 hover:text-emerald-700"
                            onClick={() => updateStatus(booking, 'confirmed')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-violet-600 hover:text-violet-700"
                            onClick={() => updateStatus(booking, 'completed')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {booking.status !== 'pending' && (
                              <DropdownMenuItem onClick={() => updateStatus(booking, 'pending')}>
                                Mark as Pending
                              </DropdownMenuItem>
                            )}
                            {booking.status !== 'confirmed' && (
                              <DropdownMenuItem onClick={() => updateStatus(booking, 'confirmed')}>
                                Mark as Confirmed
                              </DropdownMenuItem>
                            )}
                            {booking.status !== 'completed' && (
                              <DropdownMenuItem onClick={() => updateStatus(booking, 'completed')}>
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            {booking.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => updateStatus(booking, 'cancelled')}>
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteBooking(booking)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Booking Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Booking Details
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (() => {
            const status = statusConfig[selectedBooking.status]
            const StatusIcon = status.icon
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {selectedBooking.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedBooking.name}</p>
                    <Badge className={`${status.bgColor} ${status.color} border-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{selectedBooking.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedBooking.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Event Type</p>
                    <p className="text-sm font-medium">{selectedBooking.eventType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Event Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedBooking.eventDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Guest Count</p>
                    <p className="text-sm font-medium">{selectedBooking.guestCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="text-sm font-medium">{selectedBooking.venue || 'Not specified'}</p>
                  </div>
                </div>

                {selectedBooking.services.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Services Requested
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBooking.services.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBooking.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-lg p-3">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm">{formatDate(selectedBooking.createdAt)}</p>
                </div>

                <Separator />

                <div className="flex flex-wrap justify-between gap-2 pt-2">
                  <div className="flex gap-2">
                    {selectedBooking.status === 'pending' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { updateStatus(selectedBooking, 'confirmed'); setDetailOpen(false) }}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Confirm
                      </Button>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => { updateStatus(selectedBooking, 'completed'); setDetailOpen(false) }}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Complete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedBooking.status !== 'cancelled' && (
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => { updateStatus(selectedBooking, 'cancelled'); setDetailOpen(false) }}>
                        <XCircle className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => { deleteBooking(selectedBooking); setDetailOpen(false) }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
