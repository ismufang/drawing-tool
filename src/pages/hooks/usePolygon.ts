import type { IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { useCallback, useEffect, useRef } from 'react'
import { DrawTypeEnum, ShapeTypeEnum } from '../constant'
import { shapeUtils, zoomUtils } from '../utils'
import { store } from '../store'
import { disableSelect } from '../utils/canvasUtils'

interface PointType extends fabric.Circle {
  id?: number | string
}

type LineType = fabric.Line

let canvasFirstUpdate = true

export default function usePolygon() {
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
    if (drawType && drawType !== DrawTypeEnum.POLYGON) return false
    return true
  }, [])

  const _addPoint = useCallback((options: any) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { pointArray, lineArray, activeShape } = _getState()
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

    const points = [left, top, left, top]

    const line: LineType = new fabric.Line(points, {
      strokeWidth: 2,
      fill: '#999999',
      stroke: '#999999',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
    })

    let polygon = null
    if (activeShape) {
      const points: any[] = activeShape?.get('points') ?? []
      points.push({
        x: left,
        y: top,
      })

      polygon = new fabric.Polygon(points, {
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#cccccc',
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
      })

      canvas?.remove(activeShape)
    } else {
      const polyPoint = [
        {
          x: left,
          y: top,
        },
      ]
      polygon = new fabric.Polygon(polyPoint, {
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#cccccc',
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
      })
    }

    pointArray.push(circle)
    lineArray.push(line)

    _setState({
      pointArray,
      lineArray,
      activeLine: line,
      activeShape: polygon,
    })
    canvas?.add(polygon, line, circle)
  }, [])

  const _generateShape = useCallback(() => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    const { lineArray, activeShape, activeLine, pointArray } = _getState()
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
    canvas
      ?.remove(activeShape as fabric.Polygon)
      .remove(activeLine as fabric.Line)

    ShapeUtils.generatePolygon(points, () => {
      _resetState()
    })
  }, [])

  const initDraw = useCallback((points: any[] = []) => {
    const { canvas } = store.getState()
    if (!canvas) return
    canvas as fabric.Canvas
    if (points.length) {
      ShapeUtils.drawingShape(points, ShapeTypeEnum.POLYGON)
    }
    _resetState()
    disableSelect()
  }, [])

  const _handleDbClick = useCallback(() => {
    if (!_canDraw()) return
    const { pointArray } = _getState()
    if (pointArray.length < 4) {
      return
    }
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
    const { activeLine, activeShape, pointArray } = _getState()
    if (!_canDraw(options)) return
    if (activeLine && activeLine instanceof fabric.Line) {
      const { left, top } = ZoomUtils.getPostion(
        options.pointer ?? { x: 0, y: 0 },
      )
      activeLine.set({ x2: left, y2: top })
      const points: any[] = activeShape?.get('points') ?? []
      points[pointArray.length] = {
        x: left,
        y: top,
      }
      activeShape?.set({
        points,
      })
      canvas?.renderAll()
    }
  }, [])

  const _initEvent = useCallback((canvas) => {
    document.addEventListener('dblclick', _handleDbClick)
    canvas?.on('mouse:down', _handleMouseDown)
    canvas?.on('mouse:move', _handleMouseMove)
  }, [])

  const _init = useCallback((canvas: fabric.Canvas) => {
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
