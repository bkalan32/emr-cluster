'use client'

import { DeviceConfig } from '@/lib/mockup-config'

interface MockupFrameProps {
  device: DeviceConfig
  cartoonUrl: string
}

export default function MockupFrame({ device, cartoonUrl }: MockupFrameProps) {
  const { id, svgPath, viewBoxWidth, viewBoxHeight, clipX, clipY, clipWidth, clipHeight, clipRadius } = device
  const clipId = `phone-clip-${id}`

  return (
    <div className="relative mx-auto select-none" style={{ maxWidth: '260px' }}>
      {/* Layer 1: User image clipped to phone outline shape */}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={clipX} y={clipY}
              width={clipWidth} height={clipHeight}
              rx={clipRadius} ry={clipRadius}
            />
          </clipPath>
        </defs>
        <image
          href={cartoonUrl}
          x={clipX} y={clipY}
          width={clipWidth} height={clipHeight}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      </svg>

      {/* Layer 2: Phone chrome overlay (camera bump, buttons, border) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={svgPath}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-auto pointer-events-none"
      />
    </div>
  )
}
