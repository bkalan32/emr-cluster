'use client'

import { useState } from 'react'
import { DEVICES } from '@/lib/mockup-config'
import MockupFrame from './MockupFrame'

interface MockupCarouselProps {
  cartoonUrl: string
}

export default function MockupCarousel({ cartoonUrl }: MockupCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const device = DEVICES[activeIndex]

  return (
    <div className="space-y-6">
      {/* Device tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {DEVICES.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setActiveIndex(i)}
            className={`device-tab ${i === activeIndex ? 'active' : ''}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center">
        <div className="drop-shadow-2xl">
          <MockupFrame device={device} cartoonUrl={cartoonUrl} />
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Previewing <span className="font-medium text-gray-700">{device.label}</span>
      </p>
    </div>
  )
}
