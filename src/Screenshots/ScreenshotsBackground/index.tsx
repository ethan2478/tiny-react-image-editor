import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import useBounds from '../hooks/useBounds'
import useStore from '../hooks/useStore'
import useDispatcher from '../hooks/useDispatcher'
import './index.less'

const ScreenshotsBackground = React.forwardRef<HTMLImageElement>((props, ref) => {
  const { url, image } = useStore()
  const { setWidth, setHeight } = useDispatcher()
  const [bounds, boundsDispatcher] = useBounds()

  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({})

  // 图片加载后重新设置宽高和bounds
  const onLoad = useCallback((e: React.SyntheticEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()

    setWidth?.(rect.width)
    setHeight?.(rect.height)
    // 防止窗口缩放时图片也跟着缩放
    setImgStyle({
      width: rect.width,
      height: rect.height
    })
    boundsDispatcher.set({
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height
    })
  }, [setWidth, setHeight, boundsDispatcher])

  // url改变时重置style
  useLayoutEffect(() => {
    setImgStyle({})
  }, [url, image])

  // TODO: 加载失败时展示的展位图
  // 没有加载完不显示图片
  if (!url || !image) {
    return null
  }

  return (
    <div className='screenshots-background'>
      <img
        ref={ref}
        className='screenshots-background-image'
        src={url}
        onLoad={onLoad}
        style={imgStyle}
      />
      <div className='screenshots-background-mask' />
    </div>
  )
})

export default memo(ScreenshotsBackground)
