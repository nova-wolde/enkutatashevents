'use client'

import { create } from 'zustand'

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'Conference' | 'Workshop' | 'Social' | 'Concert' | 'Meetup'

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

export type ViewTab = 'dashboard' | 'events' | 'attendees' | 'venues' | 'analytics' | 'settings'
export type AppView = 'landing' | 'app' | 'business'

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
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  activities: [],
  currentView: 'dashboard',
  appView: 'landing',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  createDialogOpen: false,
  searchQuery: '',
  filterStatus: 'all',
  selectedEvent: null,
  editingEvent: null,

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
}))
