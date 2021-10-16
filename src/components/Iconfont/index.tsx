import React, { memo } from 'react'
import config from '@/config'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: config.iconfontUrl,
})

interface PropsType {
  type: string
  className?: string | undefined
  style?: React.CSSProperties | undefined
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined
  onFocus?: React.FocusEventHandler<HTMLDivElement> | undefined
}

const Iconfont = ({
  type,
  onClick,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: PropsType) => {
  return (
    <IconFont
      className={className}
      style={style}
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
    />
  )
}

export default memo(Iconfont)
