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
export type AppView = 'landing' | 'app'

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

  setEvents: (events: EventItem[]) => void
  addEvent: (event: EventItem) => void
  setActivities: (activities: ActivityItem[]) => void
  setCurrentView: (view: ViewTab) => void
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setCreateDialogOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setFilterStatus: (status: EventStatus | 'all') => void
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

  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  setActivities: (activities) => set({ activities }),
  setCurrentView: (currentView) => set({ currentView }),
  setAppView: (appView) => set({ appView }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setCreateDialogOpen: (createDialogOpen) => set({ createDialogOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
}))
