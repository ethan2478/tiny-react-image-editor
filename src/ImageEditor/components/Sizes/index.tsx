import React, { memo } from 'react'
import classNames from '../../utils/classNames'
import styles from './index.module.less'

const sizes = [3, 6, 9] as const

export interface SizesProps {
  value: number
  onChange: (value: number) => void
}

const Sizes: React.FC<SizesProps> = ({ value, onChange }) => {
  return (
    <div className={styles.sizes}>
      {sizes.map(size => {
        return (
          <div
            key={size}
            className={classNames(styles.sizeItem, {
              [styles.active]: size === value
            })}
            onClick={() => onChange && onChange(size)}
          >
            <div
              className={styles['size-pointer']}
              style={{
                width: size * 1.8,
                height: size * 1.8
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default memo(Sizes)
