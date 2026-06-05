'use client'

import { useState } from 'react'
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
import { venues } from './data'

interface VenueData {
  name: string
  address: string
  capacity: number
  amenities: string[]
  status: 'Available' | 'Booked'
}

const addresses: Record<string, string> = {
  'Grand Convention Center': '500 Market St, San Francisco, CA',
  'Creative Hub Studio': '123 Art Lane, San Francisco, CA',
  'Riverside Amphitheater': '800 River Walk, San Francisco, CA',
  'Innovation Loft': '45 Startup Blvd, San Francisco, CA',
  'Tech Campus Hall': '200 Innovation Dr, San Francisco, CA',
  'Central Park Pavilion': '1 Park Avenue, San Francisco, CA',
  'Art Gallery Downtown': '78 Gallery Row, San Francisco, CA',
  'Blue Note Lounge': '350 Jazz Alley, San Francisco, CA',
  'Mountain View Resort': '1000 Summit Rd, Mountain View, CA',
  'Grand Hall': '250 Heritage Sq, San Francisco, CA',
}

const capacities: Record<string, number> = {
  'Grand Convention Center': 2000,
  'Creative Hub Studio': 60,
  'Riverside Amphitheater': 3000,
  'Innovation Loft': 120,
  'Tech Campus Hall': 500,
  'Central Park Pavilion': 200,
  'Art Gallery Downtown': 40,
  'Blue Note Lounge': 80,
  'Mountain View Resort': 100,
  'Grand Hall': 800,
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

const defaultVenues: VenueData[] = venues.map((v, i) => ({
  name: v,
  address: addresses[v] || `${100 + i} Main St, San Francisco, CA`,
  capacity: capacities[v] || 150,
  amenities: amenityOptions.filter(() => Math.random() > 0.35),
  status: i % 3 === 0 ? 'Booked' : 'Available',
}))

export function VenuesView() {
  const { events } = useEventStore()
  const [venueList, setVenueList] = useState<VenueData[]>(defaultVenues)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newCapacity, setNewCapacity] = useState('')

  const getUpcomingCount = (venueName: string) =>
    events.filter((e) => e.venue === venueName && (e.status === 'upcoming' || e.status === 'ongoing')).length

  const handleAddVenue = () => {
    if (!newName) return
    setVenueList((prev) => [
      ...prev,
      {
        name: newName,
        address: newAddress || '123 Main St, San Francisco, CA',
        capacity: parseInt(newCapacity) || 100,
        amenities: ['WiFi', 'Parking'],
        status: 'Available' as const,
      },
    ])
    setNewName('')
    setNewAddress('')
    setNewCapacity('')
    setAddDialogOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
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
        <DialogContent className="sm:max-w-[440px]">
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
                placeholder="123 Main St, San Francisco, CA"
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
                disabled={!newName}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Venue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
