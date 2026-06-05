'use client'

import { format, parseISO } from 'date-fns'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Pencil,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useEventStore, EventStatus } from './store'
import { useToast } from '@/hooks/use-toast'

const statusColors: Record<EventStatus, string> = {
  upcoming: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  ongoing: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
}

const categoryColors: Record<string, string> = {
  Conference: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/20',
  Workshop: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
  Social: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Concert: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20',
  Meetup: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
}

const statusFlow: EventStatus[] = ['upcoming', 'ongoing', 'completed', 'cancelled']

export function EventDetailDialog() {
  const { selectedEvent, setSelectedEvent, updateEvent, deleteEvent, addActivity, setEditingEvent, setCreateDialogOpen } = useEventStore()
  const { toast } = useToast()

  if (!selectedEvent) return null

  const event = selectedEvent
  const attendeePercent = Math.round((event.attendees / event.maxAttendees) * 100)

  const handleStatusChange = (newStatus: EventStatus) => {
    updateEvent(event.id, { status: newStatus })
    addActivity({
      id: Date.now().toString(),
      user: 'John Doe',
      avatar: 'JD',
      action: `changed status to ${newStatus} for`,
      target: event.name,
      timestamp: new Date().toISOString(),
    })
    setSelectedEvent({ ...event, status: newStatus })
    toast({
      title: 'Status Updated',
      description: `${event.name} is now ${newStatus}`,
    })
  }

  const handleDelete = () => {
    deleteEvent(event.id)
    addActivity({
      id: Date.now().toString(),
      user: 'John Doe',
      avatar: 'JD',
      action: 'deleted',
      target: event.name,
      timestamp: new Date().toISOString(),
    })
    setSelectedEvent(null)
    toast({
      title: 'Event Deleted',
      description: `${event.name} has been deleted.`,
    })
  }

  const handleEdit = () => {
    setSelectedEvent(null)
    setEditingEvent(event)
    setCreateDialogOpen(true)
  }

  return (
    <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        {/* Cover gradient */}
        <div className={`h-32 bg-gradient-to-br ${event.imageGradient} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <DialogHeader className="absolute bottom-0 left-0 right-0 p-6 pb-4">
            <DialogTitle className="text-white text-xl font-bold drop-shadow-md">
              {event.name}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              {event.category} Event
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`capitalize ${statusColors[event.status]}`}>
              {event.status}
            </Badge>
            <Badge variant="outline" className={categoryColors[event.category] || ''}>
              {event.category}
            </Badge>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">{format(parseISO(event.date), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Venue</p>
                <p className="text-sm font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Ticket className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Ticket Price</p>
                <p className="text-sm font-medium">{event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}</p>
              </div>
            </div>
          </div>

          {/* Attendee progress */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">Attendees</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {event.attendees} / {event.maxAttendees}
              </span>
            </div>
            <Progress value={attendeePercent} className="h-2" />
            <p className="text-xs text-muted-foreground">{attendeePercent}% capacity</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{event.name}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 ml-auto">
                  Change Status <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusFlow.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={s === event.status}
                    className="capitalize"
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
