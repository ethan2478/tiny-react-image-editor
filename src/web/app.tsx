import React, { useCallback } from 'react'
import ImageEditor from '../ImageEditor'
import type { Bounds } from '../ImageEditor/types'
import './app.less'
import imageUrl from './image.jpg'

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

  return (
    <div className='body'>
      <ImageEditor
        url={imageUrl}
        lang={{
          operation_rectangle_title: 'Rectangle'
        }}
        onSave={onSave}
        onCancel={onCancel}
        onOk={onOk}
      />
    </div>
  )
}

export default App
