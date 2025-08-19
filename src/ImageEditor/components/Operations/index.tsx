import React, { memo, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import useBounds from '../../hooks/useBounds'
import useStore from '../../hooks/useStore'
import OperationButtons from '../../operations'
import { Bounds, Position } from '../../types'
import styles from './index.module.less'

export const OperationsCtx = React.createContext<Bounds | null>(null)

const Operations: React.FC = () => {
  const { imageElRef } = useStore()
  const [bounds] = useBounds()
  const [operationsRect, setOperationsRect] = useState<Bounds | null>(null)
  const [position, setPosition] = useState<Position | null>(null)

  const elRef = useRef<HTMLDivElement>(null)

  const onDoubleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // 将操作栏定位到容器右下角
  useEffect(() => {
    if (!bounds || !elRef.current || !imageElRef.current) {
      return
    }

    const containerRef = imageElRef.current.getBoundingClientRect()
    const elRect = elRef.current.getBoundingClientRect()

    // 右下角坐标
    const rightBottomX = containerRef.x + containerRef.width
    const rightBottomY = containerRef.y + containerRef.height

    // 计算操作栏坐标
    let x = rightBottomX - elRect.width
    let y = rightBottomY + 10

    if (x < 0) {
      x = 0
    }

    // 对齐到右下角
    if (x < rightBottomX - elRect.width) {
      x = rightBottomX - elRect.width
    }

    if (y > document.documentElement.clientHeight) {
      y = document.documentElement.clientHeight - elRect.height - 10
    }

    // 小数存在精度问题
    if (!position || Math.abs(position.x - x) > 1 || Math.abs(position.y - y) > 1) {
      setPosition({
        x,
        y
      })
    }

    // 小数存在精度问题
    if (
      !operationsRect ||
      Math.abs(operationsRect.x - elRect.x) > 1 ||
      Math.abs(operationsRect.y - elRect.y) > 1 ||
      Math.abs(operationsRect.width - elRect.width) > 1 ||
      Math.abs(operationsRect.height - elRect.height) > 1
    ) {
      setOperationsRect({
        x: elRect.x,
        y: elRect.y,
        width: elRect.width,
        height: elRect.height
      })
    }
  }, [bounds, imageElRef, operationsRect, position])

  if (!bounds) {
    return null
  }

  return (
    <OperationsCtx.Provider value={operationsRect}>
      <div
        ref={elRef}
        className={styles.operations}
        style={{
          visibility: position ? 'visible' : 'hidden',
          transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`
        }}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div className={styles.operationsButtons}>
          {OperationButtons.map((OperationButton, index) => {
            if (OperationButton === '|') {
              return <div key={index} className={styles.operationDivider} />
            } else {
              return <OperationButton key={index} />
            }
          })}
        </div>
      </div>
    </OperationsCtx.Provider>
  )
}

export default memo(Operations)
