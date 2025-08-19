import React, {
  forwardRef,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react'
import useBounds from '../../hooks/useBounds'
import useCursor from '../../hooks/useCursor'
import useEmiter from '../../hooks/useEmiter'
import useHistory from '../../hooks/useHistory'
import useOperation from '../../hooks/useOperation'
import useStore from '../../hooks/useStore'
import { Bounds, HistoryItemType, Point } from '../../types'
import getBoundsByPoints from './getBoundsByPoints'
import getPoints from './getPoints'
import isPointInDraw from './isPointInDraw'
import styles from './index.module.less'

const borders = ['top', 'right', 'bottom', 'left']

export enum ResizePoints {
  ResizeTop = 'top',
  ResizetopRight = 'top-right',
  ResizeRight = 'right',
  ResizeRightBottom = 'right-bottom',
  ResizeBottom = 'bottom',
  ResizeBottomLeft = 'bottom-left',
  ResizeLeft = 'left',
  ResizeLeftTop = 'left-top',
  Move = 'move',
}

const resizePoints = [
  ResizePoints.ResizeTop,
  ResizePoints.ResizetopRight,
  ResizePoints.ResizeRight,
  ResizePoints.ResizeRightBottom,
  ResizePoints.ResizeBottom,
  ResizePoints.ResizeBottomLeft,
  ResizePoints.ResizeLeft,
  ResizePoints.ResizeLeftTop
]

const Canvas = forwardRef<CanvasRenderingContext2D>(function ScreenshotsCanvas (
  props,
  ref
): ReactElement | null {
  const { image, width, height, imageElRef } = useStore()

  const emiter = useEmiter()
  const [history] = useHistory()
  const [cursor] = useCursor()
  const [bounds, boundsDispatcher] = useBounds()
  const [operation] = useOperation()

  const resizeOrMoveRef = useRef<string>()
  const pointRef = useRef<Point | null>(null)
  const boundsRef = useRef<Bounds | null>(null)

  const canvasPanelRef = useRef<HTMLCanvasElement>(null)
  const panelCtxRef = useRef<CanvasRenderingContext2D | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const isCanResize = !!bounds && !operation

  const onCanvasPanelMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || !operation) {
      return
    }

    const draw = isPointInDraw(
      width,
      height,
      canvasPanelRef.current,
      history,
      e.nativeEvent
    )

    if (draw) {
      emiter.emit('drawselect', draw, e.nativeEvent)
    } else {
      emiter.emit('mousedown', e.nativeEvent)
    }
  }, [emiter, height, history, operation, width])

  const onBoundsMouseDown = useCallback(
    (e: React.MouseEvent, resizeOrMove: string) => {
      if (e.button !== 0 || !bounds) {
        return
      }

      resizeOrMoveRef.current = resizeOrMove
      pointRef.current = {
        x: e.clientX,
        y: e.clientY
      }
      boundsRef.current = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      }
    },
    [bounds]
  )

  const updateBounds = useCallback(
    (e: MouseEvent) => {
      if (
        !resizeOrMoveRef.current ||
        !pointRef.current ||
        !boundsRef.current ||
        !bounds
      ) {
        return
      }
      const points = getPoints(
        e,
        resizeOrMoveRef.current,
        pointRef.current,
        boundsRef.current
      )
      boundsDispatcher.set(
        getBoundsByPoints(
          points[0],
          points[1],
          bounds,
          width,
          height,
          resizeOrMoveRef.current
        )
      )
    },
    [width, height, bounds, boundsDispatcher]
  )

  const draw = useCallback(() => {
    if (!bounds || !ctxRef.current || !canvasPanelRef.current) {
      return
    }

    // 每次绘制前先重置画板
    if (panelCtxRef.current && imageElRef.current) {
      const panelCtx = panelCtxRef.current
      panelCtx.imageSmoothingEnabled = true
      panelCtx.imageSmoothingQuality = 'low'
      panelCtx.clearRect(0, 0, width, height)
      panelCtx.drawImage(imageElRef.current, 0, 0, width, height)
    }

    history.stack.slice(0, history.index + 1).forEach((item) => {
      if (item.type === HistoryItemType.Source && panelCtxRef.current) {
        item.draw(panelCtxRef.current, item)
      }
    })

    const ctx = ctxRef.current
    ctx.imageSmoothingEnabled = true
    // 设置太高，图片会模糊
    ctx.imageSmoothingQuality = 'low'
    ctx.clearRect(0, 0, bounds.width, bounds.height)
    ctx.drawImage(
      canvasPanelRef.current,
      bounds.x, bounds.y,
      bounds.width, bounds.height,
      0, 0,
      bounds.width, bounds.height
    )
  }, [bounds, ctxRef, history, width, height, imageElRef])

  // 初始化canvas画板，后续所有的操作都是在这个画板上进行
  const initCanvasPanel = useCallback(() => {
    if (!bounds || !panelCtxRef.current || !imageElRef.current) {
      return
    }

    const ctx = panelCtxRef.current
    ctx.imageSmoothingEnabled = true
    // 设置太高，图片会模糊
    ctx.imageSmoothingQuality = 'low'
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(imageElRef.current, 0, 0, width, height)
  }, [bounds, height, imageElRef, width])

  useLayoutEffect(() => {
    if (!image || !bounds || !canvasPanelRef.current || !imageElRef.current) {
      panelCtxRef.current = null
      return
    }

    if (!panelCtxRef.current) {
      panelCtxRef.current = canvasPanelRef.current.getContext('2d')
    }

    initCanvasPanel()
  }, [image, bounds, initCanvasPanel, imageElRef])

  useLayoutEffect(() => {
    if (!image || !bounds || !canvasRef.current) {
      ctxRef.current = null
      return
    }

    if (!ctxRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d')
    }

    draw()
  }, [image, bounds, draw])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!operation) {
        if (
          !resizeOrMoveRef.current ||
          !pointRef.current ||
          !boundsRef.current
        ) {
          return
        }
        updateBounds(e)
      } else {
        emiter.emit('mousemove', e)
      }
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!operation) {
        if (
          !resizeOrMoveRef.current ||
          !pointRef.current ||
          !boundsRef.current
        ) {
          return
        }
        updateBounds(e)
        resizeOrMoveRef.current = undefined
        pointRef.current = null
        boundsRef.current = null
      } else {
        emiter.emit('mouseup', e)
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [updateBounds, operation, emiter])

  // 放到最后，保证panelCtxRef.current存在
  useImperativeHandle<
    CanvasRenderingContext2D | null,
    CanvasRenderingContext2D | null
  >(ref, () => panelCtxRef.current)

  return (
    <div className={styles.canvasWrapper}>
      <div
        className={styles.canvasPanelContainer}
        style={{ cursor: cursor === 'move' ? 'default' : cursor }}
        onMouseDown={(e) => onCanvasPanelMouseDown(e)}
      >
        <canvas
          ref={canvasPanelRef}
          className={styles.canvasPanel}
          width={width || 0}
          height={height || 0}
        />
        <div hidden={!!operation} className={styles.canvasPanelMask} />
      </div>
      <div
        className={styles.canvas}
        hidden={!!operation}
        style={{
          width: bounds?.width || 0,
          height: bounds?.height || 0,
          transform: bounds
            ? `translate(${bounds.x}px, ${bounds.y}px)`
            : 'none'
        }}
      >
        <div className={styles.canvasResultContainer}>
          <canvas
            ref={canvasRef}
            className='canvas-result'
            width={bounds?.width || 0}
            height={bounds?.height || 0}
          />
        </div>
        <div
          className={styles.canvasResultMask}
          style={{ cursor }}
          onMouseDown={(e) => onBoundsMouseDown(e, 'move')}
        >
          {isCanResize && bounds && (
            <div className={styles.canvasBoundsSize}>
              {bounds.width} &times; {bounds.height}
            </div>
          )}
        </div>
        {borders.map((border) => {
          return (
            <div key={border} className={styles[`canvas-border-${border}`]} />
          )
        })}
        {isCanResize && resizePoints.map((resizePoint) => {
          return (
            <div
              key={resizePoint}
              className={styles[`canvas-point-${resizePoint}`]}
              onMouseDown={(e) => onBoundsMouseDown(e, resizePoint)}
            />
          )
        })}
      </div>
    </div>
  )
})

export default memo(Canvas)
