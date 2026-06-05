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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useEventStore, ViewTab } from './store'

const navItems: { id: ViewTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'attendees', label: 'Attendees', icon: Users },
  { id: 'venues', label: 'Venues', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function NavContent({ collapsed = false }: { collapsed?: boolean }) {
  const { currentView, setCurrentView, setMobileSidebarOpen } = useEventStore()

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const isActive = currentView === item.id
        const Icon = item.icon
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
            <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-emerald-600 dark:text-emerald-400')} />
            {!collapsed && <span>{item.label}</span>}
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
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Pro Plan</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Unlimited events & venues</p>
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
              Event<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
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
