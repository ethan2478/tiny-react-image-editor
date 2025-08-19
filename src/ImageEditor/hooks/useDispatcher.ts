import { useContext } from 'react'
import ImageEditorContext, { ImageEditorDispatcher } from '../context'

export default function useDispatcher (): ImageEditorDispatcher {
  const { dispatcher } = useContext(ImageEditorContext)

  return dispatcher
}
