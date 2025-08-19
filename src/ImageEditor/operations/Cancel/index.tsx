import React, { ReactElement, useCallback } from 'react'
import useCall from '../../hooks/useCall'
import useLang from '../../hooks/useLang'
import useReset from '../../hooks/useReset'
import OperationButton from '../../components/OperationButton'

export default function Cancel (): ReactElement {
  const call = useCall()
  const reset = useReset()
  const lang = useLang()

  const onClick = useCallback(() => {
    call('onCancel')
    reset()
  }, [call, reset])

  return <OperationButton title={lang.operation_cancel_title} icon='icon-cancel' onClick={onClick} />
}
