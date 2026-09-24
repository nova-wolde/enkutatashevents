'use client'

import { motion } from 'framer-motion'
import {
  Home,
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Settings,
  X,
  Mail,
  CalendarCheck,
  FileEdit,
  LogOut,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useEventStore, ViewTab } from './store'

const navGroups: { label: string; items: { id: ViewTab; label: string; icon: React.ElementType; badgeKey?: string }[] }[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badgeKey: 'pending' },
      { id: 'attendees', label: 'Attendees', icon: Users },
      { id: 'venues', label: 'Venues', icon: MapPin },
    ],
  },
  {
    label: 'Site',
    items: [
      { id: 'messages', label: 'Messages', icon: Mail, badgeKey: 'unread' },
      { id: 'content', label: 'Content', icon: FileEdit },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

function NavContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { currentView, setCurrentView, setMobileSidebarOpen, unreadCount, pendingBookingsCount } = useEventStore()

  const getBadge = (badgeKey?: string) => {
    if (badgeKey === 'unread' && unreadCount > 0) return unreadCount
    if (badgeKey === 'pending' && pendingBookingsCount > 0) return pendingBookingsCount
    return 0
  }

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 px-3 pb-4">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && 'mt-5')}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/40">
                {group.label}
              </p>
            )}
            {collapsed && gi > 0 && <div className="mx-3 mb-2 border-t border-white/10" />}
            {group.items.map((item) => {
              const isActive = currentView === item.id
              const Icon = item.icon
              const badge = getBadge(item.badgeKey)
              return (
                <button
                  key={item.id}
                  type="button"
                  title={collapsed ? item.label : undefined}
                  onClick={() => {
                    setCurrentView(item.id)
                    setMobileSidebarOpen(false)
                    onNavigate?.()
                  }}
                  className={cn(
                    'group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-all duration-200',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-white/10 font-medium text-white shadow-sm'
                      : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {/* Active indicator */}
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 transition-all duration-200',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="relative shrink-0">
                    <Icon className={cn('h-4 w-4', isActive ? 'text-emerald-300' : 'text-emerald-200/50 group-hover:text-emerald-200')} />
                    {collapsed && badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-emerald-400 px-0.5 text-[8px] font-bold text-emerald-950">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </span>
                  {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!collapsed && badge > 0 && (
                    <Badge className="h-5 min-w-5 border-0 bg-emerald-400 px-1 text-[10px] font-bold text-emerald-950">
                      {badge > 99 ? '99+' : badge}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </ScrollArea>
  )
}

function BrandHeader({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5 px-4 pb-2 pt-4', collapsed && 'justify-center px-2')}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
        <Image
          src="/enkutatash-logo.png"
          alt="Enkutatash Events"
          width={22}
          height={22}
          unoptimized
          className="h-[22px] w-[22px] object-contain"
        />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-white">Enkutatash</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300/70">Admin Panel</p>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen, handleLogout } = useEventStore()

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn(
          'sticky top-16 hidden h-[calc(100vh-4rem)] flex-col border-r border-emerald-950/40 bg-gradient-to-b from-[#052e22] via-[#052319] to-[#031a12] transition-all duration-300 md:flex',
          sidebarCollapsed ? 'w-[4.5rem]' : 'w-60'
        )}
      >
        <BrandHeader collapsed={sidebarCollapsed} />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            'absolute -right-3 top-16 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground md:flex',
            sidebarCollapsed && 'rotate-180'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeftClose className="h-3 w-3" />
        </button>

        <div className="min-h-0 flex-1">
          <NavContent collapsed={sidebarCollapsed} />
        </div>

        {/* Fixed footer: user + site link */}
        <div className="shrink-0 border-t border-white/10 p-3">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-1 pb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-emerald-950">
                EE
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-[11px] font-bold text-emerald-950">
                  EE
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">Enkutatash Owner</p>
                  <p className="truncate text-[10px] text-emerald-200/50">Premium Event Organizer</p>
                </div>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-emerald-100/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Globe className="h-3.5 w-3.5" />
                View Public Site
              </a>
            </>
          )}
        </div>
      </motion.aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 border-0 bg-gradient-to-b from-[#052e22] via-[#052319] to-[#031a12] p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="relative">
            <BrandHeader />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 h-8 w-8 text-emerald-100/60 hover:bg-white/5 hover:text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-[calc(100%-4.5rem)] flex-col">
            <div className="min-h-0 flex-1">
              <NavContent onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
            <div className="shrink-0 border-t border-white/10 p-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-[11px] font-bold text-emerald-950">
                  EE
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">Enkutatash Owner</p>
                  <p className="truncate text-[10px] text-emerald-200/50">Premium Event Organizer</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-emerald-100/50 hover:bg-white/5 hover:text-white"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
