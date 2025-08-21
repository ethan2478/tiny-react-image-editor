import React, { ReactElement, useCallback } from 'react'
import composeImage from '../../utils/composeImage'
import useStore from '../../hooks/useStore'
import useCall from '../../hooks/useCall'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useHistory from '../../hooks/useHistory'
import useReset from '../../hooks/useReset'
import OperationButton from '../../components/OperationButton'

export default function Save (): ReactElement {
  const { image, bounds, lang } = useStore()
  const canvasContextRef = useCanvasContextRef()
  const canvasResultCtx = canvasContextRef.current?.resultCtx
  const [, historyDispatcher] = useHistory()
  const call = useCall()
  const reset = useReset()

  const onClick = useCallback(() => {
    historyDispatcher.clearSelect()
    setTimeout(() => {
      if (!canvasResultCtx || !image || !bounds) {
        return
      }
      composeImage(canvasResultCtx).then(blob => {
        call('onSave', blob, bounds)
        reset()
      })
    })
  }, [historyDispatcher, canvasResultCtx, image, bounds, call, reset])

  return <OperationButton title={lang.operation_save_title} icon='icon-save' onClick={onClick} />
}
