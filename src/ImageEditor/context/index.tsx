import React, { Dispatch, SetStateAction } from 'react'
import { EmiterRef, History, Bounds, CanvasContextRef } from '../types'
import zhCN, { Lang } from '../zh_CN'

export interface ImageEditorContextStore {
  url?: string
  image: HTMLImageElement | null
  width: number
  height: number
  lang: Lang
  emiterRef: EmiterRef
  imageElRef: React.RefObject<HTMLImageElement>
  canvasContextRef: CanvasContextRef
  history: History
  bounds: Bounds | null
  cursor?: string
  operation?: string
}

export interface ImageEditorDispatcher {
  call?: <T>(funcName: string, ...args: T[]) => void
  setHistory?: Dispatch<SetStateAction<History>>
  setBounds?: Dispatch<SetStateAction<Bounds | null>>
  setCursor?: Dispatch<SetStateAction<string | undefined>>
  setOperation?: Dispatch<SetStateAction<string | undefined>>
  setWidth?: Dispatch<SetStateAction<number>>
  setHeight?: Dispatch<SetStateAction<number>>
}

export interface ImageEditorContextValue {
  store: ImageEditorContextStore
  dispatcher: ImageEditorDispatcher
}

export default React.createContext<ImageEditorContextValue>({
  store: {
    url: undefined,
    image: null,
    width: 0,
    height: 0,
    lang: zhCN,
    emiterRef: { current: {} },
    imageElRef: { current: null },
    canvasContextRef: { current: null },
    history: {
      index: -1,
      stack: []
    },
    bounds: null,
    cursor: 'move',
    operation: undefined
  },
  dispatcher: {
    call: undefined,
    setHistory: undefined,
    setBounds: undefined,
    setCursor: undefined,
    setOperation: undefined,
    setWidth: undefined,
    setHeight: undefined
  }
})
