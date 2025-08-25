import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCursor from '../../hooks/useCursor'
import useHistory from '../../hooks/useHistory'
import useOperation from '../../hooks/useOperation'
import OperationButton from '../../components/OperationButton'
import SizeColor from '../../components/SizeColor'
import {
  HistoryItemEdit,
  HistoryItemSource,
  HistoryItemType,
  Point
} from '../../types'
import Textarea from '../../components/Textarea'
import useBounds from '../../hooks/useBounds'
import useDrawSelect from '../../hooks/useDrawSelect'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import useLang from '../../hooks/useLang'
import useDrawDoubleClick from '../../hooks/useDrawDoubleClick'

export interface TextData {
  size: number;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
  text: string;
}

export interface TextEditData {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface TextReEditData {
  size: number;
  color: string;
  text: string;
}

export interface TextareaBounds {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
}

const sizes: Record<number, number> = {
  3: 18,
  6: 32,
  9: 46
}

function draw (
  ctx: CanvasRenderingContext2D,
  action: HistoryItemSource<TextData, any>
) {
  const { size, color, fontFamily, x, y, text } = action.data

  const lastEditItem = action.editHistory.findLast(item => !!item.data.size)

  let finalColor = color
  let finalSize = size
  let finalText = text
  if (lastEditItem?.data) {
    finalColor = lastEditItem.data.color
    finalSize = lastEditItem.data.size
    finalText = (lastEditItem.data.text || '')
  }

  ctx.fillStyle = finalColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `${sizes[finalSize]}px ${fontFamily}`

  const distance = action.editHistory.reduce(
    (distance, { data }) => ({
      x: distance.x + (data.x2 || 0) - (data.x1 || 0),
      y: distance.y + (data.y2 || 0) - (data.y1 || 0)
    }),
    { x: 0, y: 0 }
  )

  finalText.split('\n').forEach((item, index) => {
    ctx.fillText(item, x + distance.x, y + distance.y + index * size)
  })
}

function isHit (
  ctx: CanvasRenderingContext2D,
  action: HistoryItemSource<TextData, any>,
  point: Point
) {
  const { size, color, fontFamily, text } = action.data

  const lastEditItem = action.editHistory.findLast(item => !!item.data.size)

  let finalColor = color
  let finalSize = size
  let finalText = text
  if (lastEditItem?.data) {
    finalColor = lastEditItem.data.color
    finalSize = lastEditItem.data.size
    finalText = (lastEditItem.data.text || '')
  }

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `${sizes[finalSize]}px ${fontFamily}`

  let width = 0
  let height = 0

  finalText.split('\n').forEach((item) => {
    const measured = ctx.measureText(item)
    if (width < measured.width) {
      width = measured.width
    }
    height += sizes[finalSize]
  })

  const distance = action.editHistory.reduce(
    (distance, { data }) => ({
      x: distance.x + (data.x2 || 0) - (data.x1 || 0),
      y: distance.y + (data.y2 || 0) - (data.y1 || 0)
    }),
    { x: 0, y: 0 }
  )

  const left = action.data.x + distance.x
  const top = action.data.y + distance.y
  const right = left + width
  const bottom = top + height

  return (
    point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
  )
}

export default function Text (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()
  const [bounds] = useBounds()
  const [operation, operationDispatcher] = useOperation()
  const [, cursorDispatcher] = useCursor()
  const canvasContextRef = useCanvasContextRef()
  const canvasPanelCtx = canvasContextRef.current?.panelCtx

  const [size, setSize] = useState(3)
  const [color, setColor] = useState('#ee5126')
  const [text, setText] = useState<string>('')

  const textRef = useRef<HistoryItemSource<TextData, TextEditData> | null>(
    null
  )
  const textEditRef = useRef<HistoryItemEdit<TextEditData, TextData> | null>(
    null
  )
  const textReEditRef = useRef<HistoryItemEdit<TextReEditData, TextData> | null>(
    null
  )
  const [textareaBounds, setTextareaBounds] = useState<TextareaBounds | null>(
    null
  )

  const checked = operation === 'Text'

  const selectText = useCallback(() => {
    operationDispatcher.set('Text')
    cursorDispatcher.set('default')
  }, [operationDispatcher, cursorDispatcher])

  const deselectText = useCallback(() => {
    operationDispatcher.reset()
    cursorDispatcher.reset()
  }, [operationDispatcher, cursorDispatcher])

  const onSelectText = useCallback(() => {
    if (checked) {
      deselectText()
      return
    }

    selectText()
    historyDispatcher.clearSelect()
  }, [checked, selectText, historyDispatcher, deselectText])

  const onSizeChange = useCallback((size: number) => {
    if (textRef.current) {
      textRef.current.data.size = size
    }

    if (textReEditRef.current) {
      textReEditRef.current.data.size = size
    }
    setSize(size)
  }, [])

  const onColorChange = useCallback((color: string) => {
    if (textRef.current) {
      textRef.current.data.color = color
    }

    if (textReEditRef.current) {
      textReEditRef.current.data.color = color
    }

    setColor(color)
  }, [])

  const onTextareaChange = useCallback(
    (value: string) => {
      setText(value)
      if (checked && textRef.current) {
        textRef.current.data.text = value
      }
    },
    [checked]
  )

  const onTextareaBlur = useCallback((value: string) => {
    // 首次编辑
    if (textRef.current && textRef.current.data.text) {
      historyDispatcher.push(textRef.current)
    }
    // 重新编辑
    if (textReEditRef.current) {
      textReEditRef.current.data.text = value || ''
      historyDispatcher.set(history)
    }

    textRef.current = null
    textReEditRef.current = null
    setText('')
    setTextareaBounds(null)
  }, [historyDispatcher, history])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Text') {
        return
      }

      selectText()

      textEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY
        },
        source: action as HistoryItemSource<TextData, TextEditData>
      }

      historyDispatcher.select(action)
    },
    [selectText, historyDispatcher]
  )

  const onDrawDoubleClick = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Text' || !bounds) {
        return
      }

      const canvasPanelRect = canvasPanelCtx?.canvas.getBoundingClientRect()
      if (!canvasPanelRect) return

      selectText()

      // 禁止移动
      textEditRef.current = null

      const editHistory = action.editHistory as HistoryItemEdit<any, TextData>[]
      const latest = editHistory.findLast(item => !!item.data.size)

      const sourceData = action.data as TextData
      const mergeData = {
        ...(sourceData || {}),
        color: latest?.data.color || sourceData.color,
        size: latest?.data.size || sourceData.size,
        text: latest?.data.text || sourceData.text
      } as TextData

      textReEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          color: mergeData.color,
          size: mergeData.size,
          text: ''
        },
        source: action as HistoryItemSource<TextData, TextReEditData>
      }

      /************ 重新在文本框中显示文本 ************/
      const { x: dx, y: dy } = editHistory.reduce(
        (distance, { data }) => ({
          x: distance.x + (data.x2 || 0) - (data.x1 || 0),
          y: distance.y + (data.y2 || 0) - (data.y1 || 0)
        }),
        { x: 0, y: 0 }
      )

      const x = sourceData.x + dx + canvasPanelRect.x
      const y = sourceData.y + dy + canvasPanelRect.y

      setTextareaBounds({
        x,
        y,
        maxWidth: canvasPanelRect.width - sourceData.x,
        maxHeight: canvasPanelRect.height - sourceData.y
      })

      setSize(mergeData.size)
      setColor(mergeData.color)
      setText(mergeData.text)

      /************ 触发重新绘图 ************/
      textReEditRef.current.source.editHistory.push(textReEditRef.current)
      historyDispatcher.push(textReEditRef.current)
    }, [bounds, canvasPanelCtx?.canvas, historyDispatcher, selectText])

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasPanelCtx || textRef.current || !bounds) {
        return
      }

      const { left, top, width, height } = canvasPanelCtx.canvas.getBoundingClientRect()
      const fontFamily = window.getComputedStyle(canvasPanelCtx.canvas).fontFamily
      const x = e.clientX - left
      const y = e.clientY - top

      textRef.current = {
        name: 'Text',
        type: HistoryItemType.Source,
        data: {
          size,
          color,
          fontFamily,
          x,
          y,
          text: ''
        },
        editHistory: [],
        draw,
        isHit
      }

      setTextareaBounds({
        x: e.clientX,
        y: e.clientY,
        maxWidth: width - x,
        maxHeight: height - y
      })
    },
    [checked, size, color, bounds, canvasPanelCtx]
  )

  const onMousemove = useCallback(
    (e: MouseEvent): void => {
      if (!checked) {
        return
      }

      if (textEditRef.current) {
        textEditRef.current.data.x2 = e.clientX
        textEditRef.current.data.y2 = e.clientY
        if (history.top !== textEditRef.current) {
          textEditRef.current.source.editHistory.push(textEditRef.current)
          historyDispatcher.push(textEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, history, historyDispatcher]
  )

  const onMouseup = useCallback((): void => {
    if (!checked) {
      return
    }

    textEditRef.current = null
  }, [checked])

  useDrawSelect(onDrawSelect)
  useDrawDoubleClick(onDrawDoubleClick)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <>
      <OperationButton
        title={lang.operation_text_title}
        icon='icon-text'
        checked={checked}
        onClick={onSelectText}
        option={
          <SizeColor
            size={size}
            color={color}
            onSizeChange={onSizeChange}
            onColorChange={onColorChange}
          />
        }
      />
      {checked && textareaBounds && (
        <Textarea
          x={textareaBounds.x}
          y={textareaBounds.y}
          maxWidth={textareaBounds.maxWidth}
          maxHeight={textareaBounds.maxHeight}
          size={sizes[size]}
          color={color}
          value={text}
          onChange={onTextareaChange}
          onBlur={onTextareaBlur}
        />
      )}
    </>
  )
}
