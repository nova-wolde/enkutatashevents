'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Megaphone,
  PartyPopper,
  Palette,
  Tent,
  Speaker,
  Armchair,
  UtensilsCrossed,
  Gamepad2,
  Send,
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useEventStore } from './store'

const serviceOptions = [
  { id: 'advert', label: 'Advert & Promotion', icon: Megaphone },
  { id: 'organization', label: 'Event Organization', icon: PartyPopper },
  { id: 'decoration', label: 'Decoration', icon: Palette },
  { id: 'stage-tent', label: 'Stage & Tent Rent', icon: Tent },
  { id: 'sound-light', label: 'Sound & Light Supply', icon: Speaker },
  { id: 'chair-table', label: 'Chair & Table Supply', icon: Armchair },
  { id: 'catering', label: 'Catering Supply', icon: UtensilsCrossed },
  { id: 'kids', label: 'Kids Game Material', icon: Gamepad2 },
]

const eventTypes = ['Wedding', 'Corporate', 'Cultural', 'Concert', 'Conference', 'Symposium', 'Government', 'Social', 'Other']

const venueOptions = [
  'Sheraton Addis', 'Hyatt Regency', 'Millennium Hall', 'African Jazz Village',
  'Meskel Square', 'Unity Park', 'Bole Millennium Hall', 'Hilton Addis Ababa',
  'Capital Hotel', 'Other / Not decided',
]

export function BookingDialog() {
  const { bookingDialogOpen, setBookingDialogOpen } = useEventStore()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    venue: '',
    services: [] as string[],
    message: '',
  })

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guestCount: '',
      venue: '',
      services: [],
      message: '',
    })
    setStep(1)
    setSubmitted(false)
    setSubmitError('')
  }

  const handleClose = (open: boolean) => {
    setBookingDialogOpen(open)
    if (!open) {
      setTimeout(resetForm, 300)
    }
  }

  const toggleService = (serviceId: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          guestCount: Number(form.guestCount) || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMsg = data.errors?.join(', ') || 'Something went wrong. Please try again.'
        setSubmitError(errorMsg)
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceedStep1 = form.name.trim().length >= 2 && form.email.includes('@')
  const canProceedStep2 = form.eventType && form.eventDate

  return (
    <Dialog open={bookingDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {submitted ? 'Booking Submitted!' : 'Book an Event — ዝግጅት ያስይዙ'}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? 'Thank you for your booking request. Our team will reach out shortly.'
              : 'Fill in the details below and our team will get back to you with a tailored plan.'}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You! — አመሰግታለሁ!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your booking has been submitted successfully. We will contact you within 24 hours to discuss the details.
            </p>
            <Button
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleClose(false)}
            >
              Done
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-0.5 transition-all ${
                        step > s ? 'bg-emerald-600' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold mb-1">Your Information</h3>
                    <p className="text-xs text-muted-foreground">Tell us how to reach you</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-name" className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Full Name
                      </Label>
                      <Input
                        id="bk-name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-email" className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </Label>
                      <Input
                        id="bk-email"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-phone" className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Phone Number
                      </Label>
                      <Input
                        id="bk-phone"
                        placeholder="+251 ..."
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Next <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Event Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold mb-1">Event Details</h3>
                    <p className="text-xs text-muted-foreground">Tell us about your event</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Event Type
                      </Label>
                      <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bk-date" className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" /> Event Date
                      </Label>
                      <Input
                        id="bk-date"
                        type="date"
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bk-guests" className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Estimated Guests
                      </Label>
                      <Input
                        id="bk-guests"
                        type="number"
                        placeholder="e.g. 200"
                        value={form.guestCount}
                        onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                        className="h-10"
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Next <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Services & Submit */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold mb-1">Services & Details</h3>
                    <p className="text-xs text-muted-foreground">Choose what you need and add any extra info</p>
                  </div>

                  <div className="space-y-3">
                    {/* Services checkboxes */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Services Needed</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {serviceOptions.map((service) => {
                          const Icon = service.icon
                          const isSelected = form.services.includes(service.id)
                          return (
                            <label
                              key={service.id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                  : 'border-border hover:border-emerald-300'
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleService(service.id)}
                                className="shrink-0"
                              />
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{service.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Venue preference */}
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> Venue Preference
                      </Label>
                      <Select value={form.venue} onValueChange={(v) => setForm({ ...form, venue: v })}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select preferred venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {venueOptions.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional message */}
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-message" className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Additional Message
                      </Label>
                      <Textarea
                        id="bk-message"
                        placeholder="Any special requirements, preferences, or questions..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-500 dark:text-red-400 text-center bg-red-500/10 rounded-lg px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                    >
                      {submitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Booking
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
