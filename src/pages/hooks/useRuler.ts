import type { IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { useEffect, useRef, useCallback } from 'react'
import { DrawTypeEnum } from '../constant'
import { shapeUtils, zoomUtils } from '../utils'
import { getMapFileFromLocal } from '../utils/common'
import { store } from '../store'
import { disableSelect } from '../utils/canvasUtils'

interface PointType extends fabric.Circle {
  id?: number | string
}

type LineType = fabric.Line

let canvasFirstUpdate = true

export default function useRuler() {
  const ShapeUtils = shapeUtils()
  const ZoomUtils = zoomUtils()

  const state = useRef<any>({
    pointArray: [],
    activeLine: null,
    activeText: null,
    isEnd: false,
  })

  const _getState = useCallback(() => {
    return state.current
  }, [])

  const _setState = useCallback((newState: any) => {
    state.current = { ...state.current, ...newState }
  }, [])

  const _resetState = useCallback(() => {
    _setState({
      pointArray: [],
      activeLine: null,
      activeText: null,
      isEnd: false,
    })
  }, [])

  const _canDraw = useCallback((options?: IEvent) => {
    const { drawType } = store.getState()
    const { isEnd, pointArray } = _getState()
    if (options && options?.e?.altKey) return false
    if (drawType !== DrawTypeEnum.RULER || pointArray.length > 1 || isEnd)
      return false
    return true
  }, [])

  const _addLine = useCallback((points: number[]) => {
    const { canvas } = store.getState()
    const { pointArray } = _getState()
    if (pointArray.length > 1) return
    const line: LineType = new fabric.Line(points, {
      strokeWidth: 3,
      stroke: '#f4a261',
      fill: '#f4a261',
    })
    _setState({ activeLine: line })
    canvas?.add(line)
  }, [])

  const _setActiveLine = useCallback((pointer: { x: number; y: number }) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { activeLine } = _getState()
    activeLine.set({ x2: pointer?.x, y2: pointer?.y })
    _setState({ activeLine })
  }, [])

  const _setActiveText = useCallback((pointer: { x: number; y: number }) => {
    function computeLength(width: number = 0, height: number = 0) {
      if (width === 0) height
      if (height === 0) width

      // eslint-disable-next-line no-restricted-properties
      return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    }

    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { activeLine, activeText } = _getState()
    const { width = 0, height = 0 } = activeLine

    if (activeText) {
      canvas.remove(activeText)
    }
    // 单位转换
    const mapFile = getMapFileFromLocal()
    const { resolution = 1 } = mapFile
    const length = (computeLength(width, height) * resolution).toFixed(2)
    const str = `距离：${length}px`
    const text = new fabric.Text(str, {
      top: pointer.y - 20,
      left: pointer.x - 30,
      fontSize: 12,
    })
    _setState({ activeText: text })
    canvas.add(text)
  }, [])

  const _pushToRulerStack = useCallback(
    (item: { text: fabric.Text; line: fabric.Line }) => {
      const { rulerStack } = store.getState()
      store.setState({ rulerStack: [...rulerStack, item] })
    },
    [],
  )

  const _generateShape = useCallback((pointArray: PointType[]) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const points: number[] = []

    // 移除所有点
    pointArray.forEach((point: any) => {
      points.push(point.left)
      points.push(point.top)
      canvas?.remove(point)
    })

    _pushToRulerStack({
      text: _getState().activeText,
      line: _getState().activeLine,
    })

    _setState({
      activeLine: null,
      pointArray: [],
      isEnd: false,
    })
    ShapeUtils.setDoDrawing(false)
  }, [])

  const _addPoint = useCallback((options: any) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { pointArray } = _getState()
    if (pointArray.length === 1) {
      _setState({ isEnd: true })
      _generateShape(pointArray)
      return
    }
    if (pointArray.length === 0) {
      ShapeUtils.clearRulerStack()
    }
    const { left, top } = ZoomUtils.getPostion(
      options.pointer ?? { x: 0, y: 0 },
    )
    const circle: PointType = new fabric.Circle({
      radius: 5,
      fill: pointArray.length === 0 ? 'red' : '#ffffff',
      stroke: '#000000',
      strokeWidth: 0.5,
      left,
      top,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
    })

    pointArray.push(circle)
    _setState({ pointArray })

    const points = [left, top, left, top]
    _addLine(points)
    canvas?.add(circle)
  }, [])

  const initDraw = useCallback(() => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    _resetState()
    disableSelect()
  }, [])

  const _handleMouseDown = useCallback((options: IEvent) => {
    if (!_canDraw(options)) return
    ShapeUtils.setDoDrawing(true)
    _addPoint(options)
  }, [])

  const _handleMouseMove = useCallback((options: IEvent) => {
    const { canvas } = store.getState()
    const { activeLine } = _getState()
    if (!_canDraw(options)) return
    if (activeLine && activeLine instanceof fabric.Line) {
      const pointer = (canvas as fabric.Canvas).getPointer(options.e)
      _setActiveLine(pointer)
      _setActiveText(pointer)
    }
  }, [])

  const _initEvent = useCallback((canvas) => {
    canvas?.on('mouse:down', _handleMouseDown)
    canvas?.on('mouse:move', _handleMouseMove)
  }, [])

  useEffect(() => {
    const disposer = store.watch(
      'canvas',
      (canvas) => {
        if (canvas) {
          disableSelect()
          if (canvasFirstUpdate) {
            canvasFirstUpdate = false
            _initEvent(canvas)
          }
        }
      },
      true,
    )

    return () => {
      const { canvas } = store.getState()
      canvasFirstUpdate = true
      disposer()
      canvas?.off('mouse:down', _handleMouseDown)
      canvas?.off('mouse:move', _handleMouseMove)
    }
  }, [])

  return {
    initDraw,
  }
}
