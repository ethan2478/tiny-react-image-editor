import React, { useCallback } from 'react'
import ImageEditor from '../ImageEditor'
import type { Bounds } from '../ImageEditor/types'
import './app.less'
import imageUrl from './image.jpg'
import imageUrl2 from './image2.jpeg'
import imageUrl3 from './778899.jpeg'
import GlobalImageEditor from './GlobalImageEditor'

const App = () => {
  const onSave = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('save', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])

  const onCancel = useCallback(() => {
    console.log('cancel')
  }, [])

  const onOk = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('ok', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])

  // TODO: 无法编辑的问题
  return (
    <div className='body'>
      <GlobalImageEditor src={imageUrl3} open />
    </div>
  )
}

export default App
