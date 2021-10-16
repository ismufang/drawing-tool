import { Form, InputNumber } from 'antd'
import React, { useCallback, useEffect } from 'react'
import InputColor from 'react-input-color'
import { useForm } from 'antd/lib/form/Form'
import { store } from '../../../store'
import { observer } from 'mobx-react';

interface PropsType {
  onChange?: (...params: any) => void
}

const CanvasOption: React.FC<PropsType> = ({ onChange }) => {
  const { canvasOption } = store.getState()
  const [form] = useForm()

  useEffect(() => {
    form.setFieldsValue({
      stroke: canvasOption.stroke,
      fill: canvasOption.fill,
      strokeWidth: canvasOption.strokeWidth,
    })
  }, [])

  const handleChange = useCallback(
    (value: any, values: any) => {
      const newValue = { ...value }
      if ('stroke' in value) {
        newValue.stroke = value.stroke.hex
      }

      if ('fill' in value) {
        newValue.fill = value.fill.hex
      }

      store.setState({ canvasOption: { ...canvasOption, ...newValue } })
      onChange?.(newValue, values)
    },
    [canvasOption, onChange],
  )

  return (
    <Form onValuesChange={handleChange} form={form} layout="inline">
      <Form.Item name="stroke" label="Stroke">
        <InputColor initialValue={canvasOption.stroke ?? '#000000'} />
      </Form.Item>
      <Form.Item name="fill" label="Fill">
        <InputColor initialValue={canvasOption.fill ?? '#000000'} />
      </Form.Item>
      <Form.Item name="strokeWidth" label="StrokeWidth">
        <InputNumber min={1} max={100} />
      </Form.Item>
    </Form>
  )
}

export default observer(CanvasOption)
