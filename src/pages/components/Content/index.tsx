import { Spin } from 'antd'
import React from 'react'
import { ObjectActionBar } from '..'

export const canvasId = 'myCanvas'

const loadingStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const Content: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <>{loading && (
      <div style={loadingStyle}>
        <Spin tip="画布加载中..." />
      </div>
    )}
      <ObjectActionBar />
      <div style={{ position: 'relative' }}>
        <canvas id={canvasId} />
      </div>
    </>
  )
}

export default Content
