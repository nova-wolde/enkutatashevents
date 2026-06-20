'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, Sparkles } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useEventStore, EventCategory, EventItem } from './store'
import { useToast } from '@/hooks/use-toast'
import { VENUE_NAMES, EVENT_CATEGORIES } from '@/lib/constants'

const gradients = [
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-rose-400 to-pink-600',
  'from-cyan-400 to-sky-600',
]

const defaultCategories: EventCategory[] = [...EVENT_CATEGORIES]

export function CreateEventDialog() {
  const { createDialogOpen, setCreateDialogOpen, addEvent, editingEvent, setEditingEvent, updateEvent, addActivity } = useEventStore()
  const { toast } = useToast()
  const [venues, setVenues] = useState<string[]>([...VENUE_NAMES])
  const [categories, setCategories] = useState<EventCategory[]>(defaultCategories)
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('09:00')
  const [venue, setVenue] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [maxAttendees, setMaxAttendees] = useState('100')
  const [ticketPrice, setTicketPrice] = useState('0')

  const isEditing = !!editingEvent

  // Populate form when editing
  useEffect(() => {
    if (editingEvent) {
      setName(editingEvent.name)
      setDate(parseISO(editingEvent.date))
      setTime(editingEvent.time)
      setVenue(editingEvent.venue)
      setCategory(editingEvent.category)
      setDescription(editingEvent.description)
      setMaxAttendees(editingEvent.maxAttendees.toString())
      setTicketPrice(editingEvent.ticketPrice.toString())
    }
  }, [editingEvent])

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name || !date || !venue || !category) return
    setSubmitting(true)

    try {
      if (isEditing && editingEvent) {
        const updates = {
          name,
          date: format(date, 'yyyy-MM-dd'),
          time,
          venue,
          category: category as EventCategory,
          description,
          maxAttendees: parseInt(maxAttendees) || 100,
          ticketPrice: parseFloat(ticketPrice) || 0,
        }

        const response = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEvent.id, ...updates }),
        })
        const resData = await response.json()
        if (!response.ok || !resData.success) {
          throw new Error(resData.errors?.[0] || 'Failed to update event')
        }

        updateEvent(editingEvent.id, updates)
        
        try {
          const actResponse = await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: 'Owner',
              avatar: 'OW',
              action: 'updated details for',
              target: name,
            })
          })
          const actData = await actResponse.json()
          if (actResponse.ok && actData.success) {
            addActivity(actData.activity)
          }
        } catch (e) {
          console.error("Failed to log activity", e)
        }

        toast({ title: 'Event Updated', description: `${name} has been updated successfully.` })
      } else {
        const newEventData = {
          name,
          date: format(date, 'yyyy-MM-dd'),
          time,
          venue,
          attendees: 0,
          maxAttendees: parseInt(maxAttendees) || 100,
          category: category as EventCategory || 'Conference',
          status: 'upcoming' as const,
          description,
          ticketPrice: parseFloat(ticketPrice) || 0,
          imageGradient: gradients[Math.floor(Math.random() * gradients.length)],
        }

        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEventData),
        })
        const resData = await response.json()
        if (!response.ok || !resData.success) {
          throw new Error(resData.errors?.[0] || 'Failed to create event')
        }

        addEvent(resData.event)

        try {
          const actResponse = await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: 'Owner',
              avatar: 'OW',
              action: 'created event',
              target: name,
            })
          })
          const actData = await actResponse.json()
          if (actResponse.ok && actData.success) {
            addActivity(actData.activity)
          }
        } catch (e) {
          console.error("Failed to log activity", e)
        }

        toast({ title: 'Event Created', description: `${name} has been created successfully.` })
      }
      handleClose()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save event. Please try again.', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setCreateDialogOpen(false)
    setEditingEvent(null)
    setName('')
    setDate(undefined)
    setTime('09:00')
    setVenue('')
    setCategory('')
    setDescription('')
    setMaxAttendees('100')
    setTicketPrice('0')
  }

  return (
    <Dialog open={createDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the event details below.' : 'Fill in the details to create your new event.'}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Cover image placeholder */}
          <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <p className="text-white/90 text-sm font-medium z-10">Cover Image Preview</p>
          </div>

          {/* Event name */}
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Date and Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-10 justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MMM d, yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Venue and Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Venue</Label>
              <Select value={venue || undefined} onValueChange={setVenue}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category || undefined} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="event-desc">Description</Label>
            <Textarea
              id="event-desc"
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Max attendees and ticket price row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-attendees">Max Attendees</Label>
              <Input
                id="max-attendees"
                type="number"
                placeholder="100"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-price">Ticket Price ($)</Label>
              <Input
                id="ticket-price"
                type="number"
                placeholder="0"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || !date || !venue || !category || submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
