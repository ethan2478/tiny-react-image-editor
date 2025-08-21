import type { Bounds } from '../types'

/**
 * 高保真绘制图片到canvas上
 */
export function drawCrispImage ({
  sourceImg,
  canvas,
  ctx,
  width,
  height,
  clear = true
}: {
  sourceImg: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  width: number;
  height: number;
  clear?: boolean;
}) {
  const dpr = window.devicePixelRatio || 1

  ctx = ctx || canvas.getContext('2d') as CanvasRenderingContext2D

  if (!ctx || !canvas || !sourceImg) return

  // 画布大小
  canvas.width = width * dpr
  canvas.height = height * dpr
  // 样式大小
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  // 缩放坐标系到dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // 抗锯齿
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (clear) {
    ctx.clearRect(0, 0, width, height)
  }

  ctx.drawImage(sourceImg, 0, 0, width, height)
}

export function copyCanvasRegion ({
  sourceCanvas,
  enableDpr = true,
  resultCanvas,
  resultCtx,
  bounds,
  clear = true
}: {
  sourceCanvas: HTMLCanvasElement;
  enableDpr?: boolean;
  resultCanvas: HTMLCanvasElement;
  resultCtx?: CanvasRenderingContext2D;
  bounds: Bounds;
  clear?: boolean;
}) {
  const dpr = window.devicePixelRatio || 1
  const { x, y, width, height } = bounds

  const canvas = resultCanvas
  const ctx = resultCtx || canvas.getContext('2d')

  if (!sourceCanvas || !canvas || !ctx) return

  // 画布大小
  canvas.width = enableDpr ? width * dpr : width
  canvas.height = enableDpr ? height * dpr : height
  // 样式大小
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  // 抗锯齿
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 缩放坐标系到dpr
  if (enableDpr) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  if (clear) {
    ctx.clearRect(0, 0, width, height)
  }

  const sx = enableDpr ? x * dpr : x
  const sy = enableDpr ? y * dpr : y
  const sw = enableDpr ? width * dpr : width
  const sh = enableDpr ? height * dpr : height

  ctx.drawImage(
    sourceCanvas, sx, sy, sw, sh,
    0, 0, width, height
  )
}
