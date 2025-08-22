import React from 'react'

type ImageLoadingSVGProps = {
  width?: number;
  height?: number;
  radius?: number;
};

const ImageLoadingSVG: React.FC<ImageLoadingSVGProps> = ({
  width = 200,
  height = 150,
  radius = 12
}) => {
  const vw = 200; const vh = 150 // 固定视窗，方便缩放

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='image loading'
    >
      <defs>
        {/* <!-- 闪动骨架渐变 --> */}
        <linearGradient id='shimmer' x1='-200' y1='0' x2='0' y2='0' gradientUnits='userSpaceOnUse'>
          <stop offset='0' stopColor='#eee' />
          <stop offset='0.5' stopColor='#f5f5f5' />
          <stop offset='1' stopColor='#eee' />
          <animate attributeName='x1' values='-200;200' dur='1.2s' repeatCount='indefinite' />
          <animate attributeName='x2' values='0;400' dur='1.2s' repeatCount='indefinite' />
        </linearGradient>

        {/* <!-- 圆角裁剪，保持外框圆角 --> */}
        <clipPath id='rclip'>
          <rect x='0' y='0' width='200' height='150' rx={radius} ry={radius} />
        </clipPath>
      </defs>

      {/* // <!-- 背景骨架 --> */}
      <rect x='0' y='0' width='200' height='150' rx={radius} ry={radius} fill='url(#shimmer)' />

      {/* // <!-- 图片占位符 --> */}
      <g clipPath='url(#rclip)' opacity='0.35'>
        <rect x='20' y='20' width='160' height='110' rx='8' fill='#fff' />
        <circle cx='72' cy='62' r='14' fill='#ddd' />
        <path d='M40 112 L95 72 L125 92 L160 68 L160 112 Z' fill='#ddd' />
      </g>
    </svg>
  )
}

export default ImageLoadingSVG
