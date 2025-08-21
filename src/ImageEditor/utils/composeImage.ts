export default function composeImage (canvasResultCtx: CanvasRenderingContext2D): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    if (!canvasResultCtx) {
      return reject(new Error('convert image to blob fail'))
    }

    canvasResultCtx.canvas.toBlob(blob => {
      if (!blob) {
        return reject(new Error('canvas toBlob fail'))
      }
      resolve(blob)
    }, 'image/png')
  })
}
