import React, { useRef, FocusEvent, useLayoutEffect, useState, memo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import calculateNodeSize from './calculateNodeSize'
import styles from './index.module.less'

export interface TextareaProps {
  x: number
  y: number
  maxWidth: number
  maxHeight: number
  size: number
  color: string
  value: string
  onChange: (value: string) => unknown
  onBlur: (value: string) => unknown
}

const Textarea: React.FC<TextareaProps> = ({
  x,
  y,
  maxWidth,
  maxHeight,
  size,
  color,
  value,
  onChange,
  onBlur
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const textareaFocusRef = useRef<boolean>(false)
  const textareaValueRef = useRef<string>(value)

  const getPopoverEl = () => {
    if (!popoverRef.current) {
      popoverRef.current = document.createElement('div')
    }
    return popoverRef.current
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value || ''
    onChange(value)
    textareaValueRef.current = value
  }

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    textareaValueRef.current = e.target.value || ''
  }

  const onFocus = () => {
    textareaFocusRef.current = true
  }

  useLayoutEffect(() => {
    if (popoverRef.current) {
      document.body.appendChild(popoverRef.current)
      requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    }

    return () => {
      popoverRef.current?.remove()
    }
  }, [])

  useLayoutEffect(() => {
    if (!textareaRef.current) {
      return
    }

    const { width, height } = calculateNodeSize(
      textareaRef.current,
      value,
      maxWidth,
      maxHeight
    )

    setWidth(width)
    setHeight(height)
  }, [value, maxWidth, maxHeight, size])

  // 聚焦时监听点击事件，判断是否触发onBlur事件
  useLayoutEffect(() => {
    if (!textareaFocusRef.current || !textareaRef.current) return

    const operations = document.getElementById('tinyReactImageEditorOperationButtonOptions')
    const whiteList = [textareaRef.current, operations]

    const handleClick = (e: Event) => {
      const isWhiteList = whiteList.some(item => item?.contains(e.target as Node))
      // 不在白名单中的话，触发外部的onBlur事件
      if (!isWhiteList) {
        textareaFocusRef.current = false
        onBlur(textareaValueRef.current)
      }
    }

    window.addEventListener('mousedown', handleClick)

    return () => {
      window.removeEventListener('mousedown', handleClick)
    }
  }, [onBlur])

  return createPortal(
    <textarea
      ref={textareaRef}
      className={styles.textarea}
      style={{
        color,
        width,
        height,
        maxWidth,
        maxHeight,
        fontSize: size,
        lineHeight: `${size}px`,
        transform: `translate(${x}px, ${y}px)`
      }}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={onFocus}
    />,
    getPopoverEl()
  )
}

export default memo(Textarea)
