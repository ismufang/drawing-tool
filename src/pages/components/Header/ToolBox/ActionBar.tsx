import { Iconfont } from '@/components'
import { Button, Space } from 'antd'
import React, { useCallback } from 'react'
import { DrawTypeEnum } from '@/pages/constant'
import { store } from '@/pages/store'

const ActionBar: React.FC<{
  drawType: DrawTypeEnum | null
  setState: any
}> = ({ drawType, setState }) => {
  const handleDrawChange = useCallback(
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
    <Space wrap>
      <Button
        type={drawType === DrawTypeEnum.SELECT ? 'primary' : 'default'}
        onClick={() => handleDrawChange(DrawTypeEnum.SELECT)}
      >
        <Iconfont type="icon-drawxuanze" />
        选择
      </Button>
      {/* <Button onClick={handleUndo} disabled={!globalState.canUndo}><Iconfont type="icon-drawundo" />撤回</Button>
    <Button onClick={handleRedo} disabled={!globalState.canRedo}><Iconfont type="icon-drawredo" />恢复</Button> */}
    </Space>
  )
}

export default ActionBar
