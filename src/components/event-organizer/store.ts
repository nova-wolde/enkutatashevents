'use client'

import { create } from 'zustand'
import { hardcodedEvents, hardcodedActivities, hardcodedMessages, hardcodedBookings } from './hardcoded-data'

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'Conference' | 'Workshop' | 'Social' | 'Concert' | 'Meetup' | 'Wedding' | 'Corporate' | 'Cultural' | 'Symposium' | 'Government'

export interface EventItem {
  id: string
  name: string
  date: string
  time: string
  venue: string
  attendees: number
  maxAttendees: number
  category: EventCategory
  status: EventStatus
  description: string
  ticketPrice: number
  imageGradient: string
}

export interface ActivityItem {
  id: string
  user: string
  avatar: string
  action: string
  target: string
  timestamp: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  message: string
  createdAt: string
  read: boolean
}

export interface BookingItem {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: number
  venue: string
  services: string[]
  message: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  read: boolean
}

export type ViewTab = 'dashboard' | 'events' | 'attendees' | 'venues' | 'analytics' | 'settings' | 'messages' | 'bookings' | 'content'
export type AppView = 'landing' | 'app' | 'login'

interface EventStore {
  events: EventItem[]
  activities: ActivityItem[]
  currentView: ViewTab
  appView: AppView
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  createDialogOpen: boolean
  searchQuery: string
  filterStatus: EventStatus | 'all'
  selectedEvent: EventItem | null
  editingEvent: EventItem | null
  messages: ContactSubmission[]
  bookings: BookingItem[]
  unreadCount: number
  pendingBookingsCount: number
  bookingDialogOpen: boolean

  setEvents: (events: EventItem[]) => void
  addEvent: (event: EventItem) => void
  updateEvent: (id: string, updates: Partial<EventItem>) => void
  deleteEvent: (id: string) => void
  setActivities: (activities: ActivityItem[]) => void
  addActivity: (activity: ActivityItem) => void
  setCurrentView: (view: ViewTab) => void
  setAppView: (view: AppView) => void
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setCreateDialogOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setFilterStatus: (status: EventStatus | 'all') => void
  setSelectedEvent: (event: EventItem | null) => void
  setEditingEvent: (event: EventItem | null) => void
  setMessages: (messages: ContactSubmission[]) => void
  setBookings: (bookings: BookingItem[]) => void
  setUnreadCount: (count: number) => void
  setPendingBookingsCount: (count: number) => void
  setBookingDialogOpen: (open: boolean) => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: hardcodedEvents,
  activities: hardcodedActivities,
  currentView: 'dashboard',
  appView: 'landing',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  createDialogOpen: false,
  searchQuery: '',
  filterStatus: 'all',
  selectedEvent: null,
  editingEvent: null,
  messages: hardcodedMessages,
  bookings: hardcodedBookings,
  unreadCount: hardcodedMessages.filter(m => !m.read).length,
  pendingBookingsCount: hardcodedBookings.filter(b => b.status === 'pending').length,
  bookingDialogOpen: false,

  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
    })),
  setCurrentView: (currentView) => set({ currentView }),
  setAppView: (appView) => set({ appView }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setCreateDialogOpen: (createDialogOpen) => set({ createDialogOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
  setEditingEvent: (editingEvent) => set({ editingEvent }),
  setMessages: (messages) => set({ messages }),
  setBookings: (bookings) => set({ bookings }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setPendingBookingsCount: (pendingBookingsCount) => set({ pendingBookingsCount }),
  setBookingDialogOpen: (bookingDialogOpen) => set({ bookingDialogOpen }),
}))
