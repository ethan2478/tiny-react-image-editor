import React, { MouseEvent, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import composeImage from './composeImage'
import ScreenshotsBackground from './ScreenshotsBackground'
import ScreenshotsCanvas from './ScreenshotsCanvas'
import ScreenshotsContext from './ScreenshotsContext'
import ScreenshotsOperations from './ScreenshotsOperations'
import { Bounds, Emiter, History } from './types'
import useGetLoadedImage from './useGetLoadedImage'
import zhCN, { Lang } from './zh_CN'
import './icons/iconfont.less'
import './index.less'

const prefix = 'tiny-react-image-editor'

export interface ScreenshotsProps {
  url: string
  // width?: number
  // height: number
  lang?: Partial<Lang>
  className?: string
  [key: string]: unknown
}

export default function Screenshots ({
  url,
  // width,
  // height,
  lang,
  className,
  ...props
}: ScreenshotsProps): ReactElement {
  const image = useGetLoadedImage(url)

  const [history, setHistory] = useState<History>({
    index: -1,
    stack: []
  })

  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [cursor, setCursor] = useState<string | undefined>('move')
  const [operation, setOperation] = useState<string | undefined>(undefined)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const canvasContextRef = useRef<CanvasRenderingContext2D>(null)
  const emiterRef = useRef<Emiter>({})
  const imageElRef = useRef<HTMLImageElement>(null)

  const store = {
    url,
    width,
    height,
    image,
    lang: {
      ...zhCN,
      ...lang
    },
    emiterRef,
    imageElRef,
    canvasContextRef,
    history,
    bounds,
    cursor,
    operation
  }

  const call = useCallback(
    <T extends unknown[]>(funcName: string, ...args: T) => {
      const func = props[funcName]
      if (typeof func === 'function') {
        func(...args)
      }
    },
    [props]
  )

  const dispatcher = {
    call,
    setWidth,
    setHeight,
    setHistory,
    setBounds,
    setCursor,
    setOperation
  }

  const reset = () => {
    emiterRef.current = {}
    setHistory({
      index: -1,
      stack: []
    })
    // setBounds({
    //   x: 0,
    //   y: 0,
    //   width,
    //   height
    // })
    setCursor('move')
    setOperation(undefined)
  }

  // url变化，重置截图区域
  useLayoutEffect(() => {
    reset()
  }, [url])

  const classNames = [`${prefix}-container`, className].filter(Boolean).join(' ')

  return (
    <ScreenshotsContext.Provider value={{ store, dispatcher }}>
      <div className={classNames}>
        <ScreenshotsBackground ref={imageElRef} />
        <ScreenshotsCanvas ref={canvasContextRef} />
        <ScreenshotsOperations />
      </div>
    </ScreenshotsContext.Provider>
  )
}
