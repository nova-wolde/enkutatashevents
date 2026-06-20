'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEventStore } from './store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export function ActivityFeed() {
  const { activities } = useEventStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        </CardHeader>
          <CardContent className="pb-4">
            <ScrollArea className="max-h-80">
            <motion.div
              className="space-y-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="flex gap-3 py-3 relative"
                >
                  {/* Timeline line */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-[17px] top-[44px] bottom-0 w-px bg-border" />
                  )}

                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug break-words">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
