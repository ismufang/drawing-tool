import { store } from '@/pages/store'
import { Button, Space } from 'antd'
import React, { memo, useCallback } from 'react'
import { DrawTypeEnum } from '../../../constant'

const RulerTool: React.FC<any> = memo(({ drawType, setState }) => {
  const handleBtnTap = useCallback(
    (key: DrawTypeEnum) => {
      if (key === drawType) return
      if (!store.canAction()) return
      setState({
        drawType: key,
      })
    },
    [drawType, setState],
  )

  return (
    <Space direction="vertical">
      <Button
        type={drawType === DrawTypeEnum.RULER ? 'primary' : 'default'}
        onClick={() => {
          handleBtnTap(DrawTypeEnum.RULER)
        }}
      >
        尺子
      </Button>
    </Space>
  )
})

export default RulerTool
