import { store } from '@/pages/store'
import { Button, Space, InputNumber } from 'antd'
import React, { memo, useCallback } from 'react'
import { Flex } from 'rebass'
import { ColorOption, DrawTypeEnum } from '../../../constant'

const WidthOption = [
  {
    label: '细',
    value: 2,
  },
  {
    label: '中',
    value: 4,
  },
  {
    label: '粗',
    value: 6,
  },
]

const limitDecimals = (value: string | number | undefined): string => {
  if (value) {
    return String(value).replace(/^(0+)|[^\d]+/g, '')
  }
  return ''
}

const BrushTool: React.FC<any> = memo(
  ({ setState, drawType, canvasOption }) => {
    const handleBtnTap = useCallback(
      (key: DrawTypeEnum) => {
        if (!store.canAction()) return
        if (drawType === key) return
        setState({
          drawType: key,
        })
      },
      [drawType, setState],
    )

    const handleSelected = useCallback(
      (value: any, type: string = 'color') => {
        if (!store.canAction()) return
        const newState: any = {
          canvasOption,
        }
        if (type === 'color') {
          newState.canvasOption.color = value
        }

        if (type === 'width') {
          newState.canvasOption.drawWidth = value
        }

        // if (drawType !== DrawTypeEnum.BRUSH) {
        //   newState.drawType = DrawTypeEnum.BRUSH
        // }

        setState({
          ...newState,
        })
      },
      [canvasOption, setState],
    )

    return (
      <Space
        align="center"
      >
        <Space>
          <Button
            onClick={() => handleBtnTap(DrawTypeEnum.BRUSH)}
            type={drawType === DrawTypeEnum.BRUSH ? 'primary' : 'default'}
          >
            画笔
          </Button>
          <Button
            onClick={() => handleBtnTap(DrawTypeEnum.LINE)}
            type={drawType === DrawTypeEnum.LINE ? 'primary' : 'default'}
          >
            直线
          </Button>
        </Space>
        <Flex
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Space direction="horizontal" style={{ marginRight: 10 }}>
            {ColorOption.map((color: string) => (
              <div
                key={color}
                onClick={() => handleSelected(color, 'color')}
                style={{
                  width: 35,
                  height: 24,
                  backgroundColor: color,
                  border: '1px solid #dddddd',
                  borderColor: canvasOption.color === color ? 'red' : '#dddddd',
                }}
              ></div>
            ))}
          </Space>
          <Space direction="horizontal">
            {WidthOption.map((item: any) => (
              <Button
                key={item.label}
                type={
                  canvasOption.drawWidth === item.value ? 'primary' : 'default'
                }
                size="small"
                onClick={() => handleSelected(item.value, 'width')}
              >
                {item.label}
              </Button>
            ))}
          </Space>
        </Flex>
        <InputNumber
          value={canvasOption.drawWidth}
          min={1}
          max={100}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={(value: number) => handleSelected(value, 'width')}
        />
      </Space>
    )
  },
)

export default BrushTool
