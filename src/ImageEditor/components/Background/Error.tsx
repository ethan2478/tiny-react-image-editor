import React from 'react'

type ImageLoadingSVGProps = {
  width?: number;
  height?: number;
  errorText?: string;
};

const ImageLoadError: React.FC<ImageLoadingSVGProps> = ({
  width = 200,
  height = 150,
  errorText = 'Load Fail'
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
      <g opacity='0.35'>
        <rect x='20' y='20' width='160' height='110' rx='8' fill='#fff' />
        <circle cx='72' cy='62' r='14' fill='#ddd' />
        <path d='M40 112 L95 72 L125 92 L160 68 L160 112 Z' fill='#ddd' />
      </g>
      <text x='50%' y='50%' fontSize='20' textAnchor='middle' fill='#888' dy='.3em'>
        {errorText}
      </text>
    </svg>
  )
}

export default ImageLoadError
