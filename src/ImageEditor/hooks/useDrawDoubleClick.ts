import { useEffect } from 'react'
import useEmiter from './useEmiter'
import { HistoryItemSource } from '../types'

export default function useDrawDoubleClick (
  onDrawDoubleClick: (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => unknown
): void {
  const emiter = useEmiter()

  useEffect(() => {
    emiter.on('drawdoubleclick', onDrawDoubleClick)
    return () => {
      emiter.off('drawdoubleclick', onDrawDoubleClick)
    }
  }, [onDrawDoubleClick, emiter])
}
