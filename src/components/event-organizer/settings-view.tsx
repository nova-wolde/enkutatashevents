'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  User,
  Bell,
  Palette,
  Calendar,
  AlertTriangle,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface SettingsData {
  name: string
  email: string
  company: string
  emailNotif: boolean
  pushNotif: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  defaultVenue: string
  defaultCategory: string
  defaultMaxAttendees: string
}

const SETTINGS_KEY = 'enkutatash_settings'

function loadSettings(): SettingsData {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return {
    name: 'Enkutatash Owner',
    email: 'enkutatashevents@gmail.com',
    company: 'Enkutatash Event',
    emailNotif: true,
    pushNotif: true,
    eventReminders: true,
    weeklyDigest: false,
    defaultVenue: '',
    defaultCategory: '',
    defaultMaxAttendees: '100',
  }
}

function saveSettings(settings: SettingsData) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [settings, setSettings] = useState<SettingsData>(loadSettings)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Dynamic data from API
  const [venues, setVenues] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content) {
        setVenues(data.content.venues || [])
        setCategories(data.content.eventCategories || [])
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save settings to localStorage
      saveSettings(settings)

      // Also update the business name/email in site content if changed
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content) {
        const updates: Record<string, unknown> = {}
        if (settings.email !== data.content.email) updates.email = settings.email
        if (settings.businessName !== settings.company.replace(' Event', '')) {
          updates.businessName = settings.company.replace(' Event', '')
        }
        if (Object.keys(updates).length > 0) {
          await fetch('/api/content', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          })
        }
      }

      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save some settings.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-muted-foreground">Loading settings...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-3xl"
    >
      {/* Profile Settings */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-semibold">Profile Settings</CardTitle>
          </div>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input id="settings-name" value={settings.name} onChange={(e) => updateSetting('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-company">Company</Label>
            <Input id="settings-company" value={settings.company} onChange={(e) => updateSetting('company', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={settings.emailNotif} onCheckedChange={(v) => updateSetting('emailNotif', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get browser push notifications</p>
            </div>
            <Switch checked={settings.pushNotif} onCheckedChange={(v) => updateSetting('pushNotif', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Event Reminders</p>
              <p className="text-xs text-muted-foreground">Remind me before events start</p>
            </div>
            <Switch checked={settings.eventReminders} onCheckedChange={(v) => updateSetting('eventReminders', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Digest</p>
              <p className="text-xs text-muted-foreground">Get a weekly summary email</p>
            </div>
            <Switch checked={settings.weeklyDigest} onCheckedChange={(v) => updateSetting('weeklyDigest', v)} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-semibold">Appearance</CardTitle>
          </div>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event Defaults */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-semibold">Event Defaults</CardTitle>
          </div>
          <CardDescription>Set default values for new events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Venue</Label>
              <Select value={settings.defaultVenue || undefined} onValueChange={(v) => updateSetting('defaultVenue', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default venue" />
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
              <Label>Default Category</Label>
              <Select value={settings.defaultCategory || undefined} onValueChange={(v) => updateSetting('defaultCategory', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-max">Default Max Attendees</Label>
            <Input
              id="default-max"
              type="number"
              value={settings.defaultMaxAttendees}
              onChange={(e) => updateSetting('defaultMaxAttendees', e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-xl shadow-sm border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Reset Content to Defaults</p>
              <p className="text-xs text-muted-foreground">Reset all site content back to the original seed data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Reset Content
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all site content (services, portfolio, testimonials, etc.) back to the default values.
                    Custom changes will be lost. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/content', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ force: true }),
                        })
                        const data = await res.json()
                        if (data.success) {
                          toast({ title: 'Content Reset', description: 'All content has been reset to defaults.' })
                        }
                      } catch {
                        toast({ title: 'Error', description: 'Failed to reset content.', variant: 'destructive' })
                      }
                    }}
                  >
                    Reset Content
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-end pb-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  )
}
