import type { IEvent } from 'fabric/fabric-impl'
import { useCallback, useRef } from 'react'
import {
  objectUtils,
  shapeUtils,
  zoomUtils,
  editPloylineUtils,
} from '../utils'
import { DrawTypeEnum, ShapeTypeEnum } from '../constant'
import { fabric } from 'fabric'
import { store } from '../store'
import { generateId } from '../utils/common'

export default function useBindEvent() {
  const ZoomUtils = zoomUtils()
  const ObjectUtils = objectUtils()
  const ShapeUtils = shapeUtils()
  const EditPloylineUtils = editPloylineUtils()

  const state = useRef({
    panning: false,
  })

  const _getState = useCallback(() => {
    return state.current
  }, [])

  const _setState = useCallback((newState: any) => {
    state.current = { ...state.current, ...newState }
  }, [])

  const _handleObjectMoved = useCallback((options: IEvent) => {
    ObjectUtils.listenObjectMoved(options)
  }, [])

  const _handleMouseDown = useCallback((options: IEvent) => {
    // console.log('_handleMouseDown', options)
    if (options.e.altKey) {
      _setState({
        panning: true,
      })
    }

    ObjectUtils.listenMouseDown(options)
  }, [])

  const _handleMouseWheel = useCallback((options: IEvent) => {
    ZoomUtils.listenMouseWheel(options)
  }, [])

  const _handleMouseMove = useCallback((options: IEvent) => {
    const { panning } = _getState()
    panning && ZoomUtils.listenMouseMove(options)
  }, [])

  const _handleMouseUp = useCallback((options: IEvent) => {
    const { panning } = _getState()
    panning &&
      _setState({
        panning: false,
      })
  }, [])

  const _handleObjectMoving = useCallback((options: IEvent) => {
    EditPloylineUtils.listenObjectMoving(options)
  }, [])

  const _handleDomClick = useCallback((e: any) => {
    const { target } = e
    const domTokenList: DOMTokenList = target.classList
    if (!domTokenList.contains('upper-canvas')) {
      ShapeUtils.clearRulerStack()
    }
  }, [])

  const _drawing = useCallback((canvas: fabric.Canvas) => {
    const { mouseFrom, mouseTo, drawObject, drawType, canvasOption } =
      store.getState()
    const { stroke, strokeWidth, fill } = canvasOption
    if (drawObject) {
      canvas?.remove(drawObject)
    }

    let canvasObject: any = null
    const left = mouseFrom.x
    const top = mouseFrom.y
    // console.log('drawType', drawType)

    switch (drawType) {
      case DrawTypeEnum.BRUSH:
        {
          const brush: any = canvas?.freeDrawingBrush
          brush.color = stroke
          brush.width = strokeWidth
        }
        break
      case DrawTypeEnum.LINE:
        canvasObject = new fabric.Line(
          [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
          {
            stroke,
            strokeWidth,
            id: generateId('drawType', DrawTypeEnum.LINE, ShapeTypeEnum.LINE),
          },
        )
        break
      case DrawTypeEnum.CIRCLE:
        {
          const radius =
            Math.sqrt(
              (mouseTo.x - left) * (mouseTo.x - left) +
                (mouseTo.y - top) * (mouseTo.y - top),
            ) / 2
          canvasObject = new fabric.Circle({
            left,
            top,
            stroke,
            fill,
            radius,
            strokeWidth,
            id: generateId('drawType', DrawTypeEnum.CIRCLE, ShapeTypeEnum.CIRCLE),
          })
        }
        break
      case DrawTypeEnum.ELLIPSE:
          canvasObject = new fabric.Ellipse({
            left,
            top,
            stroke,
            fill,
            originX: 'center',
            originY: 'center',
            rx: Math.abs(left - mouseTo.x),
            ry: Math.abs(top - mouseTo.y),
            strokeWidth,
            id: generateId('drawType', DrawTypeEnum.ELLIPSE, ShapeTypeEnum.ELLIPSE),
          })
        break
      case DrawTypeEnum.RECTANGLE:
        {
          const path =
            'M ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' z'
          canvasObject = new fabric.Path(path, {
            left,
            top,
            stroke,
            strokeWidth,
            fill,
            id: generateId('drawType', DrawTypeEnum.RECTANGLE, ShapeTypeEnum.RECTANGLE),
          })
        }
        break
      default:
        break
    }

    if (canvasObject) {
      canvas.add(canvasObject)
      store.setState({
        drawObject: canvasObject,
      })
    }
  }, [])

  // 工具类事件
  const _bindDefaultEvent = useCallback((canvas: fabric.Canvas) => {
    canvas.on('mouse:down', (options: IEvent) => {
      const { left: x, top: y } = ZoomUtils.getPostion(
        options.pointer ?? { x: 0, y: 0 },
      )
      store.setState({
        mouseFrom: { x, y },
        isDrawing: true,
      })
    })

    canvas.on('mouse:up', (options: IEvent) => {
      const { left: x, top: y } = ZoomUtils.getPostion(
        options.pointer ?? { x: 0, y: 0 },
      )
      store.setState({
        mouseTo: { x, y },
        drawObject: null,
        isDrawing: false,
      })
    })

    canvas.on('mouse:move', (options: IEvent) => {
      const { isDrawing } = store.getState()
      if (!isDrawing) return
      const { left: x, top: y } = ZoomUtils.getPostion(
        options.pointer ?? { x: 0, y: 0 },
      )
      store.setState({
        mouseTo: { x, y },
      })
      _drawing(canvas)
    })
  }, [])

  function on(canvas: fabric.Canvas) {
    _bindDefaultEvent(canvas)
    canvas.on('object:moved', _handleObjectMoved)
    canvas.on('object:moving', _handleObjectMoving)

    canvas.on('mouse:down', _handleMouseDown)
    canvas.on('mouse:move', _handleMouseMove)
    canvas.on('mouse:up', _handleMouseUp)
    canvas.on('mouse:wheel', _handleMouseWheel)
    document.addEventListener('click', _handleDomClick)
  }

  function off(canvas: fabric.Canvas) {
    canvas.off('object:moved', _handleObjectMoved)
    canvas.off('object:moving', _handleObjectMoving)

    canvas.off('mouse:down', _handleMouseDown)
    canvas.off('mouse:move', _handleMouseMove)
    canvas.off('mouse:up', _handleMouseUp)
    canvas.off('mouse:wheel', _handleMouseWheel)
    document.removeEventListener('click', _handleDomClick)
  }

  return {
    on,
    off,
  }
}
