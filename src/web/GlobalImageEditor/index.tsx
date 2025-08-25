import React, { useCallback } from 'react'
import { createPortal } from 'react-dom'
import ImageEditor from '../../ImageEditor'
import { Bounds } from '../../ImageEditor/types'
import './index.less'

interface GlobalImageEditorProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
  src: string;
  // TODO: 动画配置，false为不启用动画
  animition?:
    | boolean
    | {
        // 显示时动画
        show?: string;
        // 隐藏时动画
        hide?: string;
      };
  // TODO: 关闭按钮配置，false为不展示关闭按钮
  closeIcon?: React.ReactNode;
  // TODO: 点击蒙层是否关闭，默认为false
  maskClosable?: boolean;
  // TODO: 是否支持ESC关闭，默认为false
  keyboard?: boolean;
  // TODO: 是否展示加载态，默认为true
  loading?: boolean;
  // TODO: 图片是否加载成功，以及图片加载失败占位图
}

const ns = 'c-globalImageEditor'
const GlobalImageEditor: React.FC<GlobalImageEditorProps> = ({
  open = true,
  onClose,
  className,
  src,
  animition = true,
  closeIcon,
  maskClosable = false,
  keyboard = false,
  loading = false
}) => {
  console.log('onClose==>>', onClose, src, open)

  // TODO: 点击蒙层处理
  const onMaskClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    console.log('点击了蒙层====>>>', e)
  }, [])

  const handleSave = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('save', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])

  const handleConfirm = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('ok', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])

  return (
    <div className={ns}>
      <div className={`${ns}-mask`} onClick={onMaskClick} />
      <div className={`${ns}-wrapper`}>
        <div className={`${ns}-content`}>
          <div className={`${ns}-img-container`}>
            <ImageEditor
              url={src}
              // lang={}
              onOk={handleConfirm}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mountPortal = (
  props: GlobalImageEditorProps & {
    container?: Element;
  }
) => {
  const { container, ...others } = props

  if (!others.src || !others.open) return null

  return createPortal(
    <GlobalImageEditor {...others} />,
    container ?? document.body
  )
}

export default mountPortal
