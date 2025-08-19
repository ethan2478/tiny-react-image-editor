import React, { memo } from 'react'
import classNames from '../../utils/classNames'
import styles from './index.module.less'

const colors = [
  '#ee5126',
  '#fceb4d',
  '#90e746',
  '#51c0fa',
  '#7a7a7a',
  '#ffffff'
] as const

export interface ColorsProps {
  value: string
  onChange: (value: string) => void
}

const Colors: React.FC<ColorsProps> = ({
  value, onChange
}) => {
  return (
    <div className={styles.colors}>
      {colors.map(color => {
        return (
          <div
            key={color}
            className={classNames(styles.colorItem, {
              [styles.active]: color === value
            })}
            style={{ backgroundColor: color }}
            onClick={() => onChange && onChange(color)}
          />
        )
      })}
    </div>
  )
}

export default memo(Colors)
