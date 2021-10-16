import type { DrawContextType } from '../../type'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Slider, Space, Typography } from 'antd'
import { DrawContext } from '../../layouts/MainLayout'
import { parseId } from '../../utils/common'
import { ShapeTypeEnum } from '../../constant'
import { store } from '@/pages/store'
import { observer } from 'mobx-react'
import InputColor from 'react-input-color'

const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 200,
  padding: 10,
  border: '1px solid #dddddd',
  backgroundColor: '#ffffff',
  zIndex: 999,
}

const keyStyle: React.CSSProperties = {
  width: 50,
}

const shapeMap: Map<string, string[]> = new Map([
  ['fill', [ShapeTypeEnum.POLYGON, ShapeTypeEnum.TEXT, ShapeTypeEnum.CIRCLE, ShapeTypeEnum.RECTANGLE]],
  [
    'stroke',
    [ShapeTypeEnum.POLYGON, ShapeTypeEnum.POLYLINE, ShapeTypeEnum.LINE, ShapeTypeEnum.CIRCLE, ShapeTypeEnum.ELLIPSE, ShapeTypeEnum.RECTANGLE],
  ],
  [
    'strokeWidth',
    [...Object.values(ShapeTypeEnum)],
  ],
  ['edit', [ShapeTypeEnum.POLYLINE]],
])

const ObjectActionBar: React.FC = () => {
  const drawContext = useContext<DrawContextType>(DrawContext)
  const { objectUtils } = drawContext
  const { selectObject, isEditing } = store.getState()
  const { deleteObject, copy, setObjectProps, editPolylineUtils } =
    objectUtils ?? {}
  const { edit, complete, prevStep, nextStep } = editPolylineUtils ?? {}
  const [key, value, shapeType] = selectObject?.id
    ? parseId(selectObject?.id)
    : []

  const [state, setState] = useState<any>({
    fill: undefined,
    stroke: undefined,
    strokeWidth: 1,
  })

  useEffect(() => {
    // console.log('selectObject', selectObject)
    setState({
      fill: selectObject?.fill,
      stroke: selectObject?.stroke,
      strokeWidth: selectObject?.strokeWidth,
    })
  }, [selectObject])
  return (
    <Space
      style={{ ...wrapperStyle, display: selectObject ? 'block' : 'none' }}
      direction="vertical"
      id="objectActionBar"
    >
      <Button
        onClick={deleteObject}
        disabled={isEditing}
        style={{ marginBottom: 10 }}
      >
        删除
      </Button>
      {shapeType === ShapeTypeEnum.CROPPEDIMG && (
        <Button
          onClick={copy}
          style={{ marginBottom: 10 }}
          disabled={isEditing}
        >
          复制
        </Button>
      )}
      {shapeMap.get('edit')?.includes(shapeType) && (
        <Space wrap style={{ marginBottom: 10 }}>
          <Button onClick={edit} disabled={isEditing}>
            编辑
          </Button>
          <Button onClick={complete} disabled={!isEditing}>
            完成
          </Button>
          {isEditing && (
            <>
              <Button onClick={prevStep}>上一步</Button>
              <Button onClick={nextStep}>下一步</Button>
            </>
          )}
        </Space>
      )}
      {key === 'drawType' && !isEditing && (
        <>
          <Button
            onClick={copy}
            style={{ marginBottom: 10 }}
            disabled={isEditing}
          >
            复制
          </Button>
          {shapeMap.get('stroke')?.includes(shapeType) && (
            <Space>
              <Typography style={keyStyle}>
                Stroke
              </Typography>
              <InputColor initialValue={state.stroke ?? '#000000'} onChange={(color) => {
                setObjectProps({ stroke: color.hex })
                setState({
                  ...state,
                  stroke: color.hex
                })
              }} />
            </Space>
          )}
          {shapeMap.get('fill')?.includes(shapeType) && (
            <Space>
              <Typography style={keyStyle}>
                Fill
              </Typography>
              <InputColor initialValue={state.fill ?? '#000000'} onChange={(color) => {
                setObjectProps({ fill: color.hex })
                setState({
                  ...state,
                  fill: color.hex
                })
              }} />
            </Space>
          )}
          {shapeMap.get('strokeWidth')?.includes(shapeType) && (
            <Space>
              <Typography style={keyStyle}>StrokeWidth</Typography>
              <Slider
                style={{ width: 100 }}
                min={1}
                max={10}
                value={state.strokeWidth}
                onChange={(value) => {
                  setObjectProps({ strokeWidth: value })
                  setState({
                    ...state,
                    strokeWidth: value
                  })
                }}
              />
            </Space>
          )}
        </>
      )}
    </Space>
  )
}

export default observer(ObjectActionBar)
