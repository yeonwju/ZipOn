import { Suspense } from 'react'

import CalendarContent from '@/components/features/calendar/CalendarContent'
import { CalendarSkeleton } from '@/components/skeleton/calendar'

export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarContent />
    </Suspense>
  )
}
