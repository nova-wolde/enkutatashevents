'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEventStore, EventStatus } from './store'
import { useToast } from '@/hooks/use-toast'
import { EventDetailDialog } from './event-detail-dialog'

const statusColors: Record<EventStatus, string> = {
  upcoming: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  ongoing: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
}

type SortField = 'name' | 'date' | 'attendees' | 'status'
type SortDir = 'asc' | 'desc'

function SortHeaderButton({ field, children, onSort }: { field: SortField; children: React.ReactNode; onSort: (field: SortField) => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  )
}

export function EventsList() {
  const { events, filterStatus, setFilterStatus, searchQuery, setSelectedEvent, deleteEvent, addActivity, setEditingEvent, setCreateDialogOpen } = useEventStore()
  const { toast } = useToast()
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const perPage = 6

  const filteredEvents = useMemo(() => {
    let result = [...events]

    if (filterStatus !== 'all') {
      result = result.filter((e) => e.status === filterStatus)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'date':
          cmp = a.date.localeCompare(b.date)
          break
        case 'attendees':
          cmp = a.attendees - b.attendees
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [events, filterStatus, searchQuery, sortField, sortDir])

  const totalPages = Math.ceil(filteredEvents.length / perPage)
  const paginatedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage)

  const handleSort = useCallback((field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDir((prev) => prev === 'asc' ? 'desc' : 'asc')
      } else {
        setSortDir('asc')
      }
      return field
    })
  }, [])

  const handleView = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) setSelectedEvent(event)
  }

  const handleEdit = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      setEditingEvent(event)
      setCreateDialogOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    const event = events.find((e) => e.id === deleteTarget)
    deleteEvent(deleteTarget)
    if (event) {
      addActivity({
        id: Date.now().toString(),
        user: 'John Doe',
        avatar: 'JD',
        action: 'deleted',
        target: event.name,
        timestamp: new Date().toISOString(),
      })
      toast({
        title: 'Event Deleted',
        description: `${event.name} has been deleted.`,
      })
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg font-semibold">All Events</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as EventStatus | 'all'); setPage(1) }}>
                  <SelectTrigger className="w-[140px] h-9 text-sm">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">
                      <SortHeaderButton field="name" onSort={handleSort}>Event</SortHeaderButton>
                    </TableHead>
                    <TableHead>
                      <SortHeaderButton field="date" onSort={handleSort}>Date</SortHeaderButton>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Venue</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      <SortHeaderButton field="attendees" onSort={handleSort}>Attendees</SortHeaderButton>
                    </TableHead>
                    <TableHead>
                      <SortHeaderButton field="status" onSort={handleSort}>Status</SortHeaderButton>
                    </TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${event.imageGradient} shrink-0`} />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{event.name}</p>
                              <p className="text-xs text-muted-foreground">{event.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(parseISO(event.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm hidden md:table-cell truncate max-w-[160px]">
                          {event.venue}
                        </TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">
                          {event.attendees}/{event.maxAttendees}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs capitalize ${statusColors[event.status]}`}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(event.id)}>
                                <Eye className="mr-2 h-3.5 w-3.5" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteTarget(event.id)}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredEvents.length)} of{' '}
                  {filteredEvents.length} events
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="icon"
                      className={`h-8 w-8 ${
                        p === page ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Event Detail Dialog */}
      <EventDetailDialog />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
