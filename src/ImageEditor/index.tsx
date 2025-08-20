import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import Background from './components/Background'
import Canvas from './components/Canvas'
import ImageEditorContext from './context'
import Operations from './components/Operations'
import { Bounds, Emiter, History } from './types'
import useGetLoadedImage from './hooks/useGetLoadedImage'
import zhCN, { Lang } from './zh_CN'
import classNames from './utils/classNames'
import './icons/iconfont.less'
import styles from './index.module.less'

const prefix = 'tiny-react-image-editor'

export interface ImageEditorProps {
  url: string
  lang?: Partial<Lang>
  className?: string
  /** z-index 默认1000 */
  zIndex?: number
  [key: string]: unknown
}

const ImageEditorIndex: React.FC<ImageEditorProps> = ({
  url,
  lang,
  className,
  zIndex = 1000,
  ...props
}) => {
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
    setCursor('move')
    setOperation(undefined)
  }

  // url变化，重置截图区域
  useLayoutEffect(() => {
    reset()
  }, [url])

  return (
    <ImageEditorContext.Provider value={{ store, dispatcher }}>
      <div
        className={classNames(styles[prefix], className)}
        style={{
          '--tiny-react-image-editor-zIndex': zIndex
        } as React.CSSProperties}
      >
        <Background ref={imageElRef} />
        <Canvas ref={canvasContextRef} />
        <Operations />
      </div>
    </ImageEditorContext.Provider>
  )
}

export default ImageEditorIndex
