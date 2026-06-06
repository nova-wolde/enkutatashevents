'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Inbox,
  MailOpen,
  MailX,
  Phone,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useEventStore, ContactSubmission } from './store'

type FilterType = 'all' | 'unread' | 'read'

export function MessagesView() {
  const { toast } = useToast()
  const { messages, setMessages, setUnreadCount } = useEventStore()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      if (data.submissions) {
        setMessages(data.submissions)
        const unread = data.submissions.filter((m: ContactSubmission) => !m.read).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [setMessages, setUnreadCount])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  const toggleRead = async (message: ContactSubmission) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id, read: !message.read }),
      })

      if (response.ok) {
        await fetchMessages()
        toast({
          title: message.read ? 'Marked as unread' : 'Marked as read',
          description: `Message from ${message.name}`,
        })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update message', variant: 'destructive' })
    }
  }

  const deleteMessage = async (message: ContactSubmission) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id }),
      })

      if (response.ok) {
        await fetchMessages()
        if (selectedMessage?.id === message.id) {
          setDetailOpen(false)
          setSelectedMessage(null)
        }
        toast({
          title: 'Message deleted',
          description: `Removed message from ${message.name}`,
        })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' })
    }
  }

  const openDetail = (message: ContactSubmission) => {
    setSelectedMessage(message)
    setDetailOpen(true)
    if (!message.read) {
      toggleRead(message)
    }
  }

  // Filter and search
  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread' && m.read) return false
    if (filter === 'read' && !m.read) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      )
    }
    return true
  })

  const unreadCount = messages.filter((m) => !m.read).length

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-xl animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-24 mb-2" />
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-xl animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-48" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-xl font-bold">{messages.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <MailOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-xl font-bold">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="text-xl font-bold">{messages.length - unreadCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchMessages} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No Messages</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || filter !== 'all'
                ? 'No messages match your current filters.'
                : 'No contact submissions yet. They will appear here when clients reach out.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  !message.read ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-500/5' : ''
                }`}
                onClick={() => openDetail(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                      !message.read
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                        : 'bg-muted'
                    }`}>
                      {message.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium truncate ${!message.read ? 'font-semibold' : ''}`}>
                          {message.name}
                        </p>
                        {!message.read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                        {message.eventType && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {message.eventType}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{formatDate(message.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleRead(message)}
                        title={message.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {message.read ? <MailX className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleRead(message)}>
                            {message.read ? 'Mark as Unread' : 'Mark as Read'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteMessage(message)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Message Details
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                  {selectedMessage.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedMessage.phone}</span>
                  </div>
                )}
                {selectedMessage.eventType && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">{selectedMessage.eventType}</Badge>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Received</p>
                <p className="text-sm">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-lg p-3">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRead(selectedMessage)}
                >
                  {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    deleteMessage(selectedMessage)
                    setDetailOpen(false)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
