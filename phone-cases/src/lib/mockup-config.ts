export interface DeviceConfig {
  id: string
  label: string
  svgPath: string
  /** SVG coordinate space dimensions */
  viewBoxWidth: number
  viewBoxHeight: number
  /** Phone outline clip shape (rounded rect matching outer bezel) */
  clipX: number
  clipY: number
  clipWidth: number
  clipHeight: number
  clipRadius: number
}

export const DEVICES: DeviceConfig[] = [
  {
    id: 'iphone-15-pro-max',
    label: 'iPhone 15 Pro Max',
    svgPath: '/mockups/iphone-15-pro-max.svg',
    viewBoxWidth: 430,
    viewBoxHeight: 932,
    clipX: 5,
    clipY: 5,
    clipWidth: 420,
    clipHeight: 922,
    clipRadius: 52,
  },
  {
    id: 'iphone-15',
    label: 'iPhone 15',
    svgPath: '/mockups/iphone-15.svg',
    viewBoxWidth: 390,
    viewBoxHeight: 844,
    clipX: 5,
    clipY: 5,
    clipWidth: 380,
    clipHeight: 834,
    clipRadius: 48,
  },
  {
    id: 'iphone-13-mini',
    label: 'iPhone 13 Mini',
    svgPath: '/mockups/iphone-13-mini.svg',
    viewBoxWidth: 375,
    viewBoxHeight: 812,
    clipX: 5,
    clipY: 5,
    clipWidth: 365,
    clipHeight: 802,
    clipRadius: 44,
  },
  {
    id: 'samsung-s24-plus',
    label: 'Samsung Galaxy S24+',
    svgPath: '/mockups/samsung-galaxy-s24plus.svg',
    viewBoxWidth: 412,
    viewBoxHeight: 919,
    clipX: 3,
    clipY: 3,
    clipWidth: 406,
    clipHeight: 913,
    clipRadius: 46,
  },
  {
    id: 'pixel-8-pro',
    label: 'Google Pixel 8 Pro',
    svgPath: '/mockups/google-pixel-8-pro.svg',
    viewBoxWidth: 412,
    viewBoxHeight: 892,
    clipX: 3,
    clipY: 3,
    clipWidth: 406,
    clipHeight: 886,
    clipRadius: 42,
  },
]
