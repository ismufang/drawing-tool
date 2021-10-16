import React, { memo } from 'react'
import { getMapFileFromLocal } from '../../utils/common'
import { Space, Typography } from 'antd'

const { Text } = Typography

const MapInfo: React.FC = memo(() => {
  const mapFile = getMapFileFromLocal()

  return (
    <Space>
      <Text style={{ wordBreak: 'break-all' }}>{mapFile.name ?? 'The Title'}</Text>
    </Space>
  )
})

export default MapInfo
