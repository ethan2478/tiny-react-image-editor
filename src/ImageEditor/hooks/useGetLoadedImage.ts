import { useEffect, useState } from 'react'

interface GetLoadedImageRet {
  isLoading: boolean;
  image: HTMLImageElement | null;
}

export default function useGetLoadedImage (url?: string): GetLoadedImageRet {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 先置空图片
    setImage(null)
    if (url == null) {
      return
    }

    setIsLoading(true)
    const $image = document.createElement('img')

    $image.onload = function () {
      console.log('IMAGE_EDITOR:: image loaded success', url)
      setImage($image)
      setIsLoading(false)
    }
    $image.onerror = function () {
      console.log('IMAGE_EDITOR:: image loaded error', url)
      setImage(null)
      setIsLoading(false)
    }
    $image.src = url

    return () => {
      $image.onload = null
      $image.onerror = null
    }
  }, [url])

  return {
    isLoading,
    image
  }
}
