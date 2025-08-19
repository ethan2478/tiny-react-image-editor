import React, {
  memo,
  PointerEvent,
  ReactNode,
  useCallback
} from 'react'
import classNames from '../../utils/classNames'
import OperationButtonOptions from '../OperationButtonOptions'
import styles from './index.module.less'

export interface OperationButtonProps {
  title: string;
  icon: string;
  checked?: boolean;
  disabled?: boolean;
  option?: ReactNode;
  onClick?: (e: PointerEvent<HTMLDivElement>) => unknown;
}

const OperationButton: React.FC<OperationButtonProps> = ({
  title,
  icon,
  checked,
  disabled,
  option,
  onClick
}) => {
  const onButtonClick = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || !onClick) {
        return
      }
      onClick(e)
    },
    [disabled, onClick]
  )

  return (
    <OperationButtonOptions open={checked} content={option}>
      <div
        className={classNames(styles.oprationButton, {
          [styles.checked]: checked,
          [styles.disabled]: disabled
        })}
        title={title}
        onClick={onButtonClick}
      >
        <span className={icon} />
      </div>
    </OperationButtonOptions>
  )
}

export default memo(OperationButton)
