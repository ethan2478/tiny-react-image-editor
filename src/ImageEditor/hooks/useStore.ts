import { useContext } from 'react'
import ImageEditorContext, { ImageEditorContextStore } from '../context'

export default function useStore (): ImageEditorContextStore {
  const { store } = useContext(ImageEditorContext)

  return store
}
