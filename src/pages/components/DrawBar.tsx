import type { DrawTypeEnum } from '../constant'
import { Button, Space, Tooltip } from 'antd'
import React, { useCallback } from 'react'
import Iconfont from '@/components/Iconfont'
import { DrawTypeMap } from '../constant'
import { store } from '../store'
import { observer } from 'mobx-react'

const DrawBar: React.FC = () => {
  const { drawType } = store.getState()
  const handleBtnTap = useCallback(
    (key: DrawTypeEnum) => {
      if (key === drawType) return
      if (!store.canAction()) return
      store.setState({
        drawType: key,
      })
    },
    [drawType],
  )

  return (
    <Space direction="vertical">
      {[...DrawTypeMap]
        .filter(([key, value]: any) => value.show)
        .map(([key, value]: any) => (
          <Tooltip title={value.name} placement={'right'} key={key}>
            <Button
              type={drawType === key ? 'primary' : 'default'}
              onClick={() => handleBtnTap(key)}
              style={{ width: '100%' }}
            >
              <Iconfont type={value.icon} />
              {/* {value.name} */}
            </Button>
          </Tooltip>
        ))}
    </Space>
  )
}

export default observer(DrawBar)
