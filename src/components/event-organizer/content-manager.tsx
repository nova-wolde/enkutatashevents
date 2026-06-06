'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Sparkles,
  Wrench,
  MessageSquareQuote,
  Image as ImageIcon,
  BarChart3,
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

// ─── Icon mapping for services/stats/objectives ──────────────────────────────
const iconOptions = [
  'Megaphone', 'PartyPopper', 'Palette', 'Tent', 'Speaker', 'Armchair',
  'UtensilsCrossed', 'Gamepad2', 'CalendarDays', 'Users', 'Award', 'Star',
  'Heart', 'Sparkles', 'Shield', 'TrendingUp', 'Eye', 'Target',
  'CheckCircle2', 'Handshake', 'Lightbulb', 'Rocket', 'BarChart3',
]

const gradientOptions = [
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
  'from-indigo-500 to-blue-600',
  'from-orange-500 to-red-600',
  'from-lime-500 to-green-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-violet-400 via-purple-500 to-indigo-600',
  'from-amber-400 via-orange-500 to-red-500',
  'from-blue-400 via-indigo-500 to-violet-600',
  'from-green-400 via-yellow-500 to-red-500',
]

const bgGlowOptions = [
  'bg-amber-500/10', 'bg-emerald-500/10', 'bg-rose-500/10', 'bg-violet-500/10',
  'bg-cyan-500/10', 'bg-indigo-500/10', 'bg-orange-500/10', 'bg-lime-500/10',
]

// ─── Types ────────────────────────────────────────────────────────────────────
interface SiteContent {
  [key: string]: unknown
}

export function ContentManager() {
  const { toast } = useToast()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('business')

  // Fetch content
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content) {
        setContent(data.content)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load content', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Save content
  const saveContent = async (updated: SiteContent) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updated }),
      })
      const data = await res.json()
      if (data.success) {
        setContent(updated)
        toast({ title: 'Saved!', description: 'Content updated successfully.' })
      } else {
        toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // Update a field
  const updateField = (key: string, value: unknown) => {
    if (!content) return
    setContent({ ...content, [key]: value })
  }

  // Update nested array item
  const updateArrayItem = (arrayKey: string, index: number, updates: Record<string, unknown>) => {
    if (!content) return
    const arr = [...(content[arrayKey] as Record<string, unknown>[])]
    arr[index] = { ...arr[index], ...updates }
    setContent({ ...content, [arrayKey]: arr })
  }

  // Add array item
  const addArrayItem = (arrayKey: string, item: Record<string, unknown>) => {
    if (!content) return
    const arr = [...(content[arrayKey] as Record<string, unknown>[]), item]
    setContent({ ...content, [arrayKey]: arr })
  }

  // Remove array item
  const removeArrayItem = (arrayKey: string, index: number) => {
    if (!content) return
    const arr = (content[arrayKey] as Record<string, unknown>[]).filter((_, i) => i !== index)
    setContent({ ...content, [arrayKey]: arr })
  }

  // Move array item
  const moveArrayItem = (arrayKey: string, fromIndex: number, direction: 'up' | 'down') => {
    if (!content) return
    const arr = [...(content[arrayKey] as Record<string, unknown>[])]
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= arr.length) return
    ;[arr[fromIndex], arr[toIndex]] = [arr[toIndex], arr[fromIndex]]
    setContent({ ...content, [arrayKey]: arr })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-muted-foreground">Loading content...</span>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No content found. Please seed the database first.</p>
        <Button onClick={fetchContent} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Content Manager</h2>
          <p className="text-sm text-muted-foreground">Manage all site content from here</p>
        </div>
        <Button onClick={() => saveContent(content)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="business" className="text-xs gap-1"><Building2 className="h-3 w-3" />Business</TabsTrigger>
          <TabsTrigger value="hero" className="text-xs gap-1"><Sparkles className="h-3 w-3" />Hero & About</TabsTrigger>
          <TabsTrigger value="services" className="text-xs gap-1"><Wrench className="h-3 w-3" />Services</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs gap-1"><MessageSquareQuote className="h-3 w-3" />Testimonials</TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs gap-1"><ImageIcon className="h-3 w-3" />Portfolio</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs gap-1"><BarChart3 className="h-3 w-3" />Stats</TabsTrigger>
          <TabsTrigger value="venues" className="text-xs gap-1"><MapPin className="h-3 w-3" />Venues</TabsTrigger>
          <TabsTrigger value="team" className="text-xs gap-1"><Users className="h-3 w-3" />Team</TabsTrigger>
        </TabsList>

        {/* Business Info Tab */}
        <TabsContent value="business">
          <Card className="rounded-xl">
            <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Business Name</Label><Input value={content.businessName as string || ''} onChange={(e) => updateField('businessName', e.target.value)} /></div>
                <div><Label>Business Name (Amharic)</Label><Input value={content.businessNameAmharic as string || ''} onChange={(e) => updateField('businessNameAmharic', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Tagline</Label><Input value={content.tagline as string || ''} onChange={(e) => updateField('tagline', e.target.value)} /></div>
                <div><Label>Tagline (Amharic)</Label><Input value={content.taglineAmharic as string || ''} onChange={(e) => updateField('taglineAmharic', e.target.value)} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={content.description as string || ''} onChange={(e) => updateField('description', e.target.value)} rows={2} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Email</Label><Input value={content.email as string || ''} onChange={(e) => updateField('email', e.target.value)} /></div>
                <div><Label>Founded Year</Label><Input value={content.foundedYear as string || ''} onChange={(e) => updateField('foundedYear', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Address</Label><Input value={content.address as string || ''} onChange={(e) => updateField('address', e.target.value)} /></div>
                <div><Label>Address (Amharic)</Label><Input value={content.addressAmharic as string || ''} onChange={(e) => updateField('addressAmharic', e.target.value)} /></div>
              </div>

              {/* Phones */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Phone Numbers</Label>
                  <Button size="sm" variant="outline" onClick={() => {
                    const phones = [...(content.phones as string[] || []), '']
                    const links = [...(content.phoneLinks as string[] || []), '']
                    setContent({ ...content, phones, phoneLinks: links })
                  }}><Plus className="h-3 w-3 mr-1" />Add</Button>
                </div>
                {(content.phones as string[] || []).map((phone, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={phone} placeholder="Display" onChange={(e) => {
                      const phones = [...(content.phones as string[])]
                      phones[i] = e.target.value
                      setContent({ ...content, phones })
                    }} />
                    <Input value={(content.phoneLinks as string[] || [])[i] || ''} placeholder="Link (tel:)" onChange={(e) => {
                      const links = [...(content.phoneLinks as string[] || [])]
                      links[i] = e.target.value
                      setContent({ ...content, phoneLinks: links })
                    }} />
                    <Button size="icon" variant="ghost" onClick={() => {
                      const phones = (content.phones as string[]).filter((_, j) => j !== i)
                      const links = (content.phoneLinks as string[] || []).filter((_, j) => j !== i)
                      setContent({ ...content, phones, phoneLinks: links })
                    }}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                  </div>
                ))}
              </div>

              {/* Working Hours */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Working Hours</Label>
                  <Button size="sm" variant="outline" onClick={() => addArrayItem('workingHours', { day: '', hours: '' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
                </div>
                {(content.workingHours as Record<string, string>[] || []).map((wh, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={wh.day} placeholder="Day" onChange={(e) => updateArrayItem('workingHours', i, { day: e.target.value })} />
                    <Input value={wh.hours} placeholder="Hours" onChange={(e) => updateArrayItem('workingHours', i, { hours: e.target.value })} />
                    <Button size="icon" variant="ghost" onClick={() => removeArrayItem('workingHours', i)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Social Links</Label>
                  <Button size="sm" variant="outline" onClick={() => addArrayItem('socialLinks', { platform: '', url: '' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
                </div>
                {(content.socialLinks as Record<string, string>[] || []).map((sl, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={sl.platform} placeholder="Platform" onChange={(e) => updateArrayItem('socialLinks', i, { platform: e.target.value })} />
                    <Input value={sl.url} placeholder="URL" onChange={(e) => updateArrayItem('socialLinks', i, { url: e.target.value })} />
                    <Button size="icon" variant="ghost" onClick={() => removeArrayItem('socialLinks', i)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero & About Tab */}
        <TabsContent value="hero">
          <div className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Hero Badge</Label><Input value={content.heroBadge as string || ''} onChange={(e) => updateField('heroBadge', e.target.value)} /></div>
                <div><Label>Hero Title (Amharic) — shown above heading</Label><Input value={content.heroTitleAmharic as string || ''} onChange={(e) => updateField('heroTitleAmharic', e.target.value)} /></div>
                <div><Label>Hero Title</Label><Input value={content.heroTitle as string || ''} onChange={(e) => updateField('heroTitle', e.target.value)} /></div>
                <div><Label>Hero Subtitle</Label><Textarea value={content.heroSubtitle as string || ''} onChange={(e) => updateField('heroSubtitle', e.target.value)} rows={3} /></div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader><CardTitle className="text-base">About Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>About Title</Label><Input value={content.aboutTitle as string || ''} onChange={(e) => updateField('aboutTitle', e.target.value)} /></div>
                <div><Label>About Subtitle (Amharic)</Label><Input value={content.aboutSubtitle as string || ''} onChange={(e) => updateField('aboutSubtitle', e.target.value)} /></div>
                <div><Label>About Description</Label><Textarea value={content.aboutDescription as string || ''} onChange={(e) => updateField('aboutDescription', e.target.value)} rows={3} /></div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>About Highlights</Label>
                    <Button size="sm" variant="outline" onClick={() => {
                      const highlights = [...(content.aboutHighlights as string[] || []), '']
                      setContent({ ...content, aboutHighlights: highlights })
                    }}><Plus className="h-3 w-3 mr-1" />Add</Button>
                  </div>
                  {(content.aboutHighlights as string[] || []).map((h, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input value={h} onChange={(e) => {
                        const highlights = [...(content.aboutHighlights as string[])]
                        highlights[i] = e.target.value
                        setContent({ ...content, aboutHighlights: highlights })
                      }} />
                      <Button size="icon" variant="ghost" onClick={() => {
                        const highlights = (content.aboutHighlights as string[]).filter((_, j) => j !== i)
                        setContent({ ...content, aboutHighlights: highlights })
                      }}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader><CardTitle className="text-base">Vision & Mission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Vision</Label><Textarea value={content.vision as string || ''} onChange={(e) => updateField('vision', e.target.value)} rows={2} /></div>
                <div><Label>Vision Amharic Label</Label><Input value={content.visionAmharic as string || ''} onChange={(e) => updateField('visionAmharic', e.target.value)} /></div>
                <div><Label>Mission</Label><Textarea value={content.mission as string || ''} onChange={(e) => updateField('mission', e.target.value)} rows={2} /></div>
                <div><Label>Mission Amharic Label</Label><Input value={content.missionAmharic as string || ''} onChange={(e) => updateField('missionAmharic', e.target.value)} /></div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader><CardTitle className="text-base">Goals</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-end">
                  <Button size="sm" variant="outline" onClick={() => addArrayItem('goals', { icon: 'Heart', title: '', titleAmharic: '', gradient: 'from-emerald-500 to-teal-600' })}><Plus className="h-3 w-3 mr-1" />Add Goal</Button>
                </div>
                {(content.goals as Record<string, string>[] || []).map((goal, i) => (
                  <div key={i} className="flex gap-2 items-start border rounded-lg p-3">
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('goals', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('goals', i, 'down')} disabled={i === (content.goals as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input value={goal.title} placeholder="Title" onChange={(e) => updateArrayItem('goals', i, { title: e.target.value })} />
                      <Input value={goal.titleAmharic} placeholder="Amharic" onChange={(e) => updateArrayItem('goals', i, { titleAmharic: e.target.value })} />
                      <Select value={goal.icon} onValueChange={(v) => updateArrayItem('goals', i, { icon: v })}>
                        <SelectTrigger><SelectValue placeholder="Icon" /></SelectTrigger>
                        <SelectContent>{iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeArrayItem('goals', i)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader><CardTitle className="text-base">Objectives</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-end">
                  <Button size="sm" variant="outline" onClick={() => addArrayItem('objectives', { icon: 'Target', title: '', description: '' })}><Plus className="h-3 w-3 mr-1" />Add Objective</Button>
                </div>
                {(content.objectives as Record<string, string>[] || []).map((obj, i) => (
                  <div key={i} className="flex gap-2 items-start border rounded-lg p-3">
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('objectives', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('objectives', i, 'down')} disabled={i === (content.objectives as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input value={obj.title} placeholder="Title" onChange={(e) => updateArrayItem('objectives', i, { title: e.target.value })} />
                      <Input value={obj.description} placeholder="Description" onChange={(e) => updateArrayItem('objectives', i, { description: e.target.value })} />
                      <Select value={obj.icon} onValueChange={(v) => updateArrayItem('objectives', i, { icon: v })}>
                        <SelectTrigger><SelectValue placeholder="Icon" /></SelectTrigger>
                        <SelectContent>{iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeArrayItem('objectives', i)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Services</CardTitle><CardDescription>Manage your service offerings</CardDescription></div>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('services', { id: `s${Date.now()}`, title: '', titleAmharic: '', description: '', descriptionAmharic: '', icon: 'Megaphone', gradient: 'from-emerald-500 to-teal-600', bgGlow: 'bg-emerald-500/10' })}><Plus className="h-3 w-3 mr-1" />Add Service</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(content.services as Record<string, string>[] || []).map((service, i) => (
                <div key={service.id || i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('services', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('services', i, 'down')} disabled={i === (content.services as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                      </div>
                      <Badge variant="secondary">{service.icon}</Badge>
                      <span className="font-medium text-sm">{service.title || 'Untitled'}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeArrayItem('services', i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label className="text-xs">Title</Label><Input value={service.title} onChange={(e) => updateArrayItem('services', i, { title: e.target.value })} /></div>
                    <div><Label className="text-xs">Title (Amharic)</Label><Input value={service.titleAmharic || ''} onChange={(e) => updateArrayItem('services', i, { titleAmharic: e.target.value })} /></div>
                  </div>
                  <div><Label className="text-xs">Description</Label><Textarea value={service.description} onChange={(e) => updateArrayItem('services', i, { description: e.target.value })} rows={2} /></div>
                  <div><Label className="text-xs">Description (Amharic)</Label><Textarea value={service.descriptionAmharic || ''} onChange={(e) => updateArrayItem('services', i, { descriptionAmharic: e.target.value })} rows={2} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><Label className="text-xs">Icon</Label>
                      <Select value={service.icon} onValueChange={(v) => updateArrayItem('services', i, { icon: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-xs">Gradient</Label>
                      <Select value={service.gradient} onValueChange={(v) => updateArrayItem('services', i, { gradient: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{gradientOptions.map((g) => <SelectItem key={g} value={g}><span className="text-xs">{g}</span></SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-xs">Background Glow</Label>
                      <Select value={service.bgGlow} onValueChange={(v) => updateArrayItem('services', i, { bgGlow: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{bgGlowOptions.map((b) => <SelectItem key={b} value={b}><span className="text-xs">{b}</span></SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Testimonials</CardTitle></div>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('testimonials', { id: `t${Date.now()}`, name: '', nameAmharic: '', role: '', roleAmharic: '', avatar: '', quote: '', quoteAmharic: '', rating: 5, event: '' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(content.testimonials as Record<string, unknown>[] || []).map((t, i) => (
                <div key={t.id as string || i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{(t.name as string) || 'Unnamed'}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('testimonials', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('testimonials', i, 'down')} disabled={i === (content.testimonials as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeArrayItem('testimonials', i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label className="text-xs">Name</Label><Input value={t.name as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { name: e.target.value })} /></div>
                    <div><Label className="text-xs">Name (Amharic)</Label><Input value={t.nameAmharic as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { nameAmharic: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label className="text-xs">Role</Label><Input value={t.role as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { role: e.target.value })} /></div>
                    <div><Label className="text-xs">Role (Amharic)</Label><Input value={t.roleAmharic as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { roleAmharic: e.target.value })} /></div>
                  </div>
                  <div><Label className="text-xs">Quote</Label><Textarea value={t.quote as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { quote: e.target.value })} rows={2} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><Label className="text-xs">Avatar (initials/char)</Label><Input value={t.avatar as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { avatar: e.target.value })} /></div>
                    <div><Label className="text-xs">Rating</Label><Input type="number" min={1} max={5} value={t.rating as number || 5} onChange={(e) => updateArrayItem('testimonials', i, { rating: parseInt(e.target.value) || 5 })} /></div>
                    <div><Label className="text-xs">Event</Label><Input value={t.event as string || ''} onChange={(e) => updateArrayItem('testimonials', i, { event: e.target.value })} /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Portfolio Events</CardTitle></div>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('portfolioEvents', { id: `p${Date.now()}`, title: '', titleAmharic: '', category: 'Cultural', attendees: '', image: '/events/event-1.jpg', description: '', descriptionAmharic: '', gradient: 'from-emerald-400 via-teal-500 to-cyan-600' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(content.portfolioEvents as Record<string, string>[] || []).map((evt, i) => (
                <div key={evt.id || i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{evt.title || 'Untitled'}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('portfolioEvents', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('portfolioEvents', i, 'down')} disabled={i === (content.portfolioEvents as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeArrayItem('portfolioEvents', i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><Label className="text-xs">Title</Label><Input value={evt.title} onChange={(e) => updateArrayItem('portfolioEvents', i, { title: e.target.value })} /></div>
                    <div><Label className="text-xs">Title (Amharic)</Label><Input value={evt.titleAmharic} onChange={(e) => updateArrayItem('portfolioEvents', i, { titleAmharic: e.target.value })} /></div>
                    <div><Label className="text-xs">Category</Label><Input value={evt.category} onChange={(e) => updateArrayItem('portfolioEvents', i, { category: e.target.value })} /></div>
                  </div>
                  <div><Label className="text-xs">Description</Label><Textarea value={evt.description} onChange={(e) => updateArrayItem('portfolioEvents', i, { description: e.target.value })} rows={2} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><Label className="text-xs">Image Path</Label><Input value={evt.image} onChange={(e) => updateArrayItem('portfolioEvents', i, { image: e.target.value })} /></div>
                    <div><Label className="text-xs">Attendees</Label><Input value={evt.attendees} onChange={(e) => updateArrayItem('portfolioEvents', i, { attendees: e.target.value })} /></div>
                    <div><Label className="text-xs">Gradient</Label>
                      <Select value={evt.gradient} onValueChange={(v) => updateArrayItem('portfolioEvents', i, { gradient: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{gradientOptions.map((g) => <SelectItem key={g} value={g}><span className="text-xs">{g}</span></SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Statistics Cards</CardTitle></div>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('stats', { value: '', label: '', labelAmharic: '', icon: 'CalendarDays' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(content.stats as Record<string, string>[] || []).map((stat, i) => (
                <div key={i} className="flex gap-2 items-center border rounded-lg p-3">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('stats', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('stats', i, 'down')} disabled={i === (content.stats as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                  </div>
                  <Input value={stat.value} placeholder="Value" className="w-24" onChange={(e) => updateArrayItem('stats', i, { value: e.target.value })} />
                  <Input value={stat.label} placeholder="Label" className="flex-1" onChange={(e) => updateArrayItem('stats', i, { label: e.target.value })} />
                  <Select value={stat.icon} onValueChange={(v) => updateArrayItem('stats', i, { icon: v })}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" onClick={() => removeArrayItem('stats', i)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Venues</CardTitle></div>
                <Button size="sm" variant="outline" onClick={() => {
                  const venues = [...(content.venues as string[] || []), '']
                  setContent({ ...content, venues })
                }}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {(content.venues as string[] || []).map((venue, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input value={venue} onChange={(e) => {
                    const venues = [...(content.venues as string[])]
                    venues[i] = e.target.value
                    setContent({ ...content, venues })
                  }} />
                  <Button size="icon" variant="ghost" onClick={() => {
                    const venues = (content.venues as string[]).filter((_, j) => j !== i)
                    setContent({ ...content, venues })
                  }}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Team Members</CardTitle></div>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('teamMembers', { id: `tm${Date.now()}`, name: '', role: '', avatar: '', gradient: 'from-emerald-500 to-teal-600', bio: '' })}><Plus className="h-3 w-3 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(content.teamMembers as Record<string, string>[] || []).map((member, i) => (
                <div key={member.id || i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{member.name || 'Unnamed'}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('teamMembers', i, 'up')} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveArrayItem('teamMembers', i, 'down')} disabled={i === (content.teamMembers as unknown[]).length - 1}><ChevronDown className="h-3 w-3" /></Button>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeArrayItem('teamMembers', i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><Label className="text-xs">Name</Label><Input value={member.name} onChange={(e) => updateArrayItem('teamMembers', i, { name: e.target.value })} /></div>
                    <div><Label className="text-xs">Role</Label><Input value={member.role} onChange={(e) => updateArrayItem('teamMembers', i, { role: e.target.value })} /></div>
                    <div><Label className="text-xs">Avatar (initials)</Label><Input value={member.avatar} onChange={(e) => updateArrayItem('teamMembers', i, { avatar: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label className="text-xs">Bio</Label><Textarea value={member.bio} onChange={(e) => updateArrayItem('teamMembers', i, { bio: e.target.value })} rows={2} /></div>
                    <div><Label className="text-xs">Gradient</Label>
                      <Select value={member.gradient} onValueChange={(v) => updateArrayItem('teamMembers', i, { gradient: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{gradientOptions.map((g) => <SelectItem key={g} value={g}><span className="text-xs">{g}</span></SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
