'use client'

import { motion } from 'framer-motion'
import {
  Plus,
  MapPin,
  UserPlus,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEventStore } from './store'

const actions = [
  {
    label: 'Create Event',
    icon: Plus,
    primary: true,
    action: 'create' as const,
  },
  {
    label: 'Add Venue',
    icon: MapPin,
    primary: false,
    action: 'venue' as const,
  },
  {
    label: 'Invite Attendees',
    icon: UserPlus,
    primary: false,
    action: 'invite' as const,
  },
  {
    label: 'Export Report',
    icon: Download,
    primary: false,
    action: 'export' as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

export function QuickActions() {
  const { setCreateDialogOpen, setCurrentView, setBookingDialogOpen } = useEventStore()

  const handleAction = (action: string) => {
    if (action === 'create') {
      setCreateDialogOpen(true)
    } else if (action === 'venue') {
      setCurrentView('venues')
    } else if (action === 'invite') {
      setBookingDialogOpen(true)
    } else if (action === 'export') {
      setCurrentView('analytics')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <motion.div
            className="grid grid-cols-2 gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div key={action.label} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={action.primary ? 'default' : 'outline'}
                    className={`w-full h-auto py-3 px-3 flex flex-col items-center gap-2 ${
                      action.primary
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                    onClick={() => handleAction(action.action)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
