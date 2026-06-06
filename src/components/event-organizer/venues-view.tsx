'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Plus,
  Users,
  Wifi,
  Car,
  Monitor,
  UtensilsCrossed,
  Coffee,
  Building2,
  X,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useEventStore } from './store'
import { useToast } from '@/hooks/use-toast'

interface VenueData {
  name: string
  address: string
  capacity: number
  amenities: string[]
  status: 'Available' | 'Booked'
}

const amenityOptions = ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Green Room', 'Stage']
const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Parking: Car,
  'AV Equipment': Monitor,
  Catering: UtensilsCrossed,
  'Green Room': Coffee,
  Stage: Building2,
}

// Default venue details (used as fallback)
const defaultVenueDetails: Record<string, { address: string; capacity: number; amenities: string[] }> = {
  'Sheraton Addis Grand Ballroom': { address: 'Tito St, Addis Ababa, Ethiopia', capacity: 800, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Stage'] },
  'Hyatt Regency Addis Ababa': { address: 'Ras Desta Damtew Ave, Addis Ababa, Ethiopia', capacity: 500, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Green Room'] },
  'Millennium Hall': { address: 'Addis Ababa, Ethiopia', capacity: 5000, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Stage'] },
  'African Jazz Village': { address: 'Gabon St, Addis Ababa, Ethiopia', capacity: 250, amenities: ['WiFi', 'AV Equipment', 'Catering'] },
  'Meskel Square': { address: 'Meskel Square, Addis Ababa, Ethiopia', capacity: 10000, amenities: ['Parking', 'Stage'] },
  'Unity Park': { address: 'National Palace, Addis Ababa, Ethiopia', capacity: 2000, amenities: ['WiFi', 'Parking', 'Catering'] },
  'Addis Ababa University Main Hall': { address: '6 Kilo, Addis Ababa, Ethiopia', capacity: 500, amenities: ['WiFi', 'AV Equipment', 'Parking'] },
  'ICT Park': { address: 'Lideta, Addis Ababa, Ethiopia', capacity: 300, amenities: ['WiFi', 'AV Equipment', 'Parking'] },
  'Lemi Kuraa Sub-city Hall': { address: 'Lemi Kuraa, Addis Ababa, Ethiopia', capacity: 300, amenities: ['WiFi', 'Parking', 'AV Equipment'] },
  'National Palace Grounds': { address: 'National Palace, Addis Ababa, Ethiopia', capacity: 5000, amenities: ['Parking', 'Security', 'Stage'] },
  'Bole Millennium Hall': { address: 'Bole, Addis Ababa, Ethiopia', capacity: 3000, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Stage'] },
  'Ghion Hotel': { address: 'Ras Desta Damtew, Addis Ababa, Ethiopia', capacity: 600, amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'] },
  'Ras Hotel': { address: 'Churchill Rd, Addis Ababa, Ethiopia', capacity: 400, amenities: ['WiFi', 'Parking', 'Catering'] },
  'Hilton Addis Ababa': { address: 'Menelik II Ave, Addis Ababa, Ethiopia', capacity: 700, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Green Room'] },
  'Capital Hotel & Spa': { address: 'Rwanda St, Addis Ababa, Ethiopia', capacity: 350, amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'] },
}

export function VenuesView() {
  const { events } = useEventStore()
  const { toast } = useToast()
  const [venueList, setVenueList] = useState<VenueData[]>([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newCapacity, setNewCapacity] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch venues from API
  const fetchVenues = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content?.venues) {
        const venueData: VenueData[] = data.content.venues.map((v: string, i: number) => {
          const details = defaultVenueDetails[v] || {
            address: `${100 + i} Main St, Addis Ababa, Ethiopia`,
            capacity: 150,
            amenities: ['WiFi', 'Parking'],
          }
          return {
            name: v,
            address: details.address,
            capacity: details.capacity,
            amenities: details.amenities,
            status: i % 4 === 0 ? 'Booked' as const : 'Available' as const,
          }
        })
        setVenueList(venueData)
      }
    } catch {
      // Use empty list
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  const getUpcomingCount = (venueName: string) =>
    events.filter((e) => e.venue === venueName && (e.status === 'upcoming' || e.status === 'ongoing')).length

  const handleAddVenue = async () => {
    if (!newName) return
    setSaving(true)
    try {
      // Fetch current content
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content) {
        const currentVenues: string[] = data.content.venues || []
        if (currentVenues.includes(newName)) {
          toast({ title: 'Duplicate', description: 'This venue already exists.', variant: 'destructive' })
          setSaving(false)
          return
        }
        const updatedVenues = [...currentVenues, newName]
        // Save to API
        const saveRes = await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: { ...data.content, venues: updatedVenues } }),
        })
        const saveData = await saveRes.json()
        if (saveData.success) {
          // Add to local state
          setVenueList((prev) => [
            ...prev,
            {
              name: newName,
              address: newAddress || 'Addis Ababa, Ethiopia',
              capacity: parseInt(newCapacity) || 100,
              amenities: ['WiFi', 'Parking'],
              status: 'Available' as const,
            },
          ])
          toast({ title: 'Venue Added', description: `${newName} has been added successfully.` })
        } else {
          toast({ title: 'Error', description: 'Failed to add venue', variant: 'destructive' })
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
    setNewName('')
    setNewAddress('')
    setNewCapacity('')
    setAddDialogOpen(false)
  }

  const handleDeleteVenue = async (venueName: string) => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      if (data.content) {
        const updatedVenues = (data.content.venues as string[]).filter((v) => v !== venueName)
        const saveRes = await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: { ...data.content, venues: updatedVenues } }),
        })
        const saveData = await saveRes.json()
        if (saveData.success) {
          setVenueList((prev) => prev.filter((v) => v.name !== venueName))
          toast({ title: 'Venue Removed', description: `${venueName} has been removed.` })
        } else {
          toast({ title: 'Error', description: 'Failed to remove venue', variant: 'destructive' })
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-muted-foreground">Loading venues...</span>
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
      {/* Header with Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{venueList.length} venues managed</p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4" /> Add Venue
        </Button>
      </div>

      {/* Venue grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venueList.map((venue, index) => {
          const upcoming = getUpcomingCount(venue.name)
          return (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">{venue.name}</CardTitle>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${
                          venue.status === 'Available'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {venue.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDeleteVenue(venue.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Capacity & Events */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{upcoming} upcoming</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {venue.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity]
                      return (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs gap-1 bg-muted/50"
                        >
                          {Icon && <Icon className="h-3 w-3" />}
                          {amenity}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Add Venue Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Venue</DialogTitle>
            <DialogDescription>Enter the details for the new venue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input
                id="venue-name"
                placeholder="e.g. Sunset Rooftop Hall"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-address">Address</Label>
              <Input
                id="venue-address"
                placeholder="Addis Ababa, Ethiopia"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-capacity">Capacity</Label>
              <Input
                id="venue-capacity"
                type="number"
                placeholder="100"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button
                onClick={handleAddVenue}
                disabled={!newName || saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
                {saving ? 'Adding...' : 'Add Venue'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
