import type { IEvent } from 'fabric/fabric-impl'
import { useEffect, useCallback, useRef } from 'react'
import { fabric } from 'fabric'
import { DrawTypeEnum, ShapeTypeEnum } from '../constant'
import { shapeUtils, zoomUtils } from '../utils'
import { store } from '../store'
import { disableSelect } from '../utils/canvasUtils'

let canvasFirstUpdate = true

export default function usePolyline() {
  const ShapeUtils = shapeUtils()
  const ZoomUtils = zoomUtils()

  const state = useRef<any>({
    pointArray: [],
    lineArray: [],
    activeLine: null,
    activeShape: null,
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
      lineArray: [],
      activeLine: null,
      activeShape: null,
      isEnd: false,
    })
  }, [])

  const _canDraw = useCallback((options?: IEvent) => {
    const { drawType } = store.getState()
    const { isEnd } = _getState()
    if (options && options?.e?.altKey) return false
    if (!drawType || isEnd) return false
    if (drawType && drawType !== DrawTypeEnum.POLYLINE) return false
    return true
  }, [])

  const _addPoint = useCallback((options: IEvent) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { pointArray, lineArray } = _getState()
    const { left, top } = ZoomUtils.getPostion(
      options.pointer ?? { x: 0, y: 0 },
    )
    const circle = new fabric.Circle({
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

    const points = [left, top, left, top]

    const line = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: ShapeUtils.getColor(),
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
    })

    pointArray.push(circle)
    lineArray.push(line)

    _setState({
      pointArray,
      lineArray,
      activeLine: line,
    })

    canvas?.add(line)
    canvas?.add(circle)
  }, [])

  const _generateShape = useCallback(() => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { lineArray, activeLine, pointArray } = _getState()
    const points: { x: number; y: number }[] = []
    // 移除所有点
    pointArray.forEach((point: any) => {
      points.push({
        x: point.left,
        y: point.top,
      })
      canvas?.remove(point)
    })

    // 移除所有线
    lineArray.forEach((line: any) => {
      canvas?.remove(line)
    })

    // 移除活跃对象
    canvas.remove(activeLine as fabric.Line)

    ShapeUtils.generatePloyline(points, () => {
      _resetState()
    })
  }, [])

  const initDraw = useCallback((points: any[] = []) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    if (points.length) {
      ShapeUtils.drawingShape(points, ShapeTypeEnum.POLYLINE)
    }
    _resetState()
    disableSelect()
  }, [])

  const _handleDbClick = useCallback(() => {
    if (!_canDraw()) return
    _setState({ isEnd: true })
    _generateShape()
  }, [])

  const _handleMouseDown = useCallback((options: IEvent) => {
    if (!_canDraw(options)) return
    ShapeUtils.setDoDrawing(true)
    _addPoint(options)
  }, [])

  const _handleMouseMove = useCallback((options: IEvent) => {
    const { canvas } = store.getState()
    const { activeLine } = _getState()
    if (!_canDraw(options) || !canvas) return
    canvas as fabric.Canvas
    if (activeLine && activeLine instanceof fabric.Line) {
      const { left, top } = ZoomUtils.getPostion(
        options.pointer ?? { x: 0, y: 0 },
      )
      activeLine.set({ x2: left, y2: top })
      canvas?.renderAll()
    }
  }, [])

  const _initEvent = useCallback((canvas) => {
    document.addEventListener('dblclick', _handleDbClick)
    canvas?.on('mouse:down', _handleMouseDown)
    canvas?.on('mouse:move', _handleMouseMove)
  }, [])

  const _init = useCallback((canvas) => {
    _initEvent(canvas)
  }, [])

  useEffect(() => {
    const disposer = store.watch(
      'canvas',
      (canvas) => {
        if (canvas) {
          disableSelect()
          if (canvasFirstUpdate) {
            canvasFirstUpdate = false
            _init(canvas)
          }
        }
      },
      true,
    )
    return () => {
      const { canvas } = store.getState()
      canvasFirstUpdate = true
      disposer()
      document.removeEventListener('dblclick', _handleDbClick)
      canvas?.off('mouse:down', _handleMouseDown)
      canvas?.off('mouse:move', _handleMouseMove)
    }
  }, [])

  return {
    initDraw,
  }
}
