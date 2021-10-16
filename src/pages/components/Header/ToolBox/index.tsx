import { Divider } from 'antd'
import React, { useMemo } from 'react'
import BrushTool from './BrushTool'
import RulerTool from './RulerTool'
import ActionBar from './ActionBar'
import { store } from '@/pages/store'
import { observer } from 'mobx-react'
import CanvasOption from './CanvasOption'

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
}

const itemStyle: React.CSSProperties = {
  height: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 12,
  color: '#999999',
  marginTop: 10,
}

const dividerProps: any = {
  type: 'vertical',
  style: {
    margin: '0 20px',
    color: 'red',
    height: 'inherit',
  },
}

const ToolBox: React.FC = () => {
  const { drawType, canvasOption } = store.getState()
  const state = useMemo(() => {
    const rest = {
      setState: store.setState,
    }

    return {
      bushTool: {
        ...rest,
        drawType,
        canvasOption: { ...canvasOption },
      },
      rulerTool: {
        ...rest,
        drawType,
      },
      actionBar: {
        ...rest,
        drawType,
      },
    }
  }, [canvasOption, drawType])

  return (
    <div style={wrapperStyle}>
      <div style={itemStyle}>
        <CanvasOption/>
        <div style={titleStyle}>预设</div>
      </div>
      <Divider {...dividerProps} />
      <div style={itemStyle}>
        <RulerTool {...state.rulerTool} />
        <div style={titleStyle}>测量</div>
      </div>
      <Divider {...dividerProps} />
      <div style={{ ...itemStyle }}>
        <ActionBar {...state.actionBar} />
        <div style={titleStyle}>操作</div>
      </div>
    </div>
  )
}

export default observer(ToolBox)
