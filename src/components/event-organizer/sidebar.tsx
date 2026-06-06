'use client'

import { motion } from 'framer-motion'
import {
  Home,
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Settings,
  Sparkles,
  X,
  Mail,
  CalendarCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useEventStore, ViewTab } from './store'

const navItems: { id: ViewTab; label: string; icon: React.ElementType; badgeKey?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: Mail, badgeKey: 'unread' },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badgeKey: 'pending' },
  { id: 'attendees', label: 'Attendees', icon: Users },
  { id: 'venues', label: 'Venues', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function NavContent({ collapsed = false }: { collapsed?: boolean }) {
  const { currentView, setCurrentView, setMobileSidebarOpen, unreadCount, pendingBookingsCount } = useEventStore()

  const getBadge = (item: typeof navItems[0]) => {
    if (item.badgeKey === 'unread' && unreadCount > 0) return unreadCount
    if (item.badgeKey === 'pending' && pendingBookingsCount > 0) return pendingBookingsCount
    return 0
  }

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const isActive = currentView === item.id
        const Icon = item.icon
        const badge = getBadge(item)
        return (
          <Button
            key={item.id}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 h-10 transition-all duration-200',
              isActive && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-500/15',
              !isActive && 'text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center px-0'
            )}
            onClick={() => {
              setCurrentView(item.id)
              setMobileSidebarOpen(false)
            }}
          >
            <div className="relative">
              <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-emerald-600 dark:text-emerald-400')} />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[8px] font-bold px-0.5">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="flex-1 text-left">{item.label}</span>
            )}
            {!collapsed && badge > 0 && (
              <Badge className="h-5 min-w-5 px-1 text-[10px] bg-emerald-600 text-white border-0">
                {badge > 99 ? '99+' : badge}
              </Badge>
            )}
          </Button>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useEventStore()

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-background transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16',
          sidebarCollapsed ? 'w-16' : 'w-56'
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-auto"
            onClick={toggleSidebar}
          >
            <X className={cn('h-3.5 w-3.5 transition-transform duration-300', sidebarCollapsed && 'rotate-45')} />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <NavContent collapsed={sidebarCollapsed} />
        </ScrollArea>
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Enkutatash Event</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Premium Event Organizer</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              Enkutatash<span className="text-emerald-600 dark:text-emerald-400"> Event</span>
            </span>
          </div>
          <ScrollArea className="flex-1 px-2 py-4">
            <NavContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
