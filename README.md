# react-image-editor

> 一款开源的react图片编辑组件，目前基于[开源代码](https://github.com/nashaofu/screenshots)进行二次开发（后续考虑重构）

## 安装依赖

```bash
npm install tiny-react-image-editor
```

## 使用

```ts
import React, { useCallback } from 'react'
import ImageEditor, { type Bounds } from 'tiny-react-image-editor'
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
```

## Props

```ts
interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Lang {
  operation_ok_title: string;
  operation_cancel_title: string;
  operation_save_title: string;
  operation_redo_title: string;
  operation_undo_title: string;
  operation_mosaic_title: string;
  operation_text_title: string;
  operation_brush_title: string;
  operation_arrow_title: string;
  operation_ellipse_title: string;
  operation_rectangle_title: string;
}
```

| 名称     | 说明                 | 类型                                   | 是否必选 |
| -------- | -------------------- | -------------------------------------- | -------- |
| url      | 要编辑的图像资源地址 | `string`                               | 是       |
| lang     | 多语言支持，默认中文 | `Partial<Lang>`                        | 否       |
| className| 样式设置 | `string`                        | 否       |
| onSave   | 保存按钮回调         | `(blob: Blob, bounds: Bounds) => void` | 否       |
| onCancel | 取消按钮回调         | `() => void`                           | 否       |
| onOk     | 取消按钮回调         | `(blob: Blob, bounds: Bounds) => void` | 否       |

## Icons

[Iconfont](https://at.alicdn.com/t/project/572327/6f652e79-fb8b-4164-9fb3-40a705433d93.html?spm=a313x.7781069.1998910419.34)

## TODO
> 目前只是一个简单的版本，后续陆续迭代

- 编辑组件定位问题
- 窗口缩放时编辑组件定位未改变的问题
- eslint stylelint prettier husky commitlint等接入
- 代码逻辑不清晰，维护成本高，后续考虑重构
