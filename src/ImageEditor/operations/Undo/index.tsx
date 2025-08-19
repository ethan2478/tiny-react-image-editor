import React, { ReactElement, useCallback } from 'react'
import OperationButton from '../../components/OperationButton'
import useHistory from '../../hooks/useHistory'
import useLang from '../../hooks/useLang'

export default function Undo (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()

  const onClick = useCallback(() => {
    historyDispatcher.undo()
  }, [historyDispatcher])

  return (
    <OperationButton
      title={lang.operation_undo_title}
      icon='icon-undo'
      disabled={history.index === -1}
      onClick={onClick}
    />
  )
}
