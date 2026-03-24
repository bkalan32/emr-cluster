import sharp from 'sharp'

const MAX_DIMENSION = 1500

/**
 * Applies a cartoon-style effect to an image using sharp:
 * 1. Resize to max 1500px (performance)
 * 2. Smooth colors with median filter
 * 3. Boost saturation for vivid cartoon palette
 * 4. Detect edges via Laplacian convolution
 * 5. Composite black edges over the colorized base
 */
export async function applyCartoonEffect(inputBuffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(inputBuffer).metadata()
  const { width = 1000, height = 1000 } = metadata

  // Step 0: Resize if needed
  let workingBuffer = inputBuffer
  if (Math.max(width, height) > MAX_DIMENSION) {
    workingBuffer = await sharp(inputBuffer)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .toBuffer()
  }

  // Step 1: Color layer — smooth + vivid
  const colorLayer = await sharp(workingBuffer)
    .removeAlpha()
    .median(3)
    .modulate({ saturation: 2.2, brightness: 1.03 })
    .toBuffer()

  // Step 2: Edge mask — Laplacian kernel on grayscale
  // Non-edges become white (255), edges become black (0)
  const edgeMask = await sharp(workingBuffer)
    .removeAlpha()
    .greyscale()
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      scale: 1,
      offset: 0,
    })
    .normalise()
    .threshold(22)   // edges = white (255)
    .negate()        // edges = black (0), non-edges = white (255)
    .toColourspace('srgb')
    .toBuffer()

  // Step 3: Composite — multiply blend applies black lines at edge positions
  const result = await sharp(colorLayer)
    .composite([{ input: edgeMask, blend: 'multiply' }])
    .png({ compressionLevel: 6 })
    .toBuffer()

  return result
}
