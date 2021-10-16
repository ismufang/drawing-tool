import type { EditPolylineUtilsType, PointType } from '../type'
import type { IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import shapeUtils from './shapeUtils'
import { message } from 'antd'
import { store } from '@/pages/store'

let circleList: any[] = []
let lineList: any[] = []
let oldObject: any = null
let currentIndex: number = 0

export default function editPloylineUtils(): EditPolylineUtilsType {
  const ShapeUtils = shapeUtils()

  function _generateCircle(
    left: number,
    top: number,
    pointIndex: number,
  ): fabric.Circle {
    return new fabric.Circle({
      radius: 5,
      fill: '#ff0000',
      stroke: '#000000',
      strokeWidth: 0.5,
      left,
      top,
      selectable: true,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
      pointIndex,
    })
  }

  function _generateLine(points: number[], pointIndex: number) {
    const line = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: '#333333',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
      pointIndex,
    })

    return line
  }

  /**
   * 画图
   *
   * @param {fabric.Canvas} canvas
   * @param {fabric.Polyline} object
   */
  function _drawShape(callback?: () => void) {
    const { canvas } = store.getState()
    if (!canvas) return
    const { id, _points: points = [] } = oldObject
    const circles: fabric.Circle[] = points?.map(
      (point: any, index: number) => {
        const circle = _generateCircle(point.x, point.y, index)
        circleList.push(circle)
        return circle
      },
    )

    currentIndex = circleList.length - 1

    const lines = points.map((point: any, index: number, arr: any[]) => {
      const nextPoint = index === arr.length - 1 ? point : arr[index + 1]
      const points = [point.x, point.y, nextPoint.x, nextPoint.y]
      const line = _generateLine(points, index)
      lineList.push(line)
      return line
    })
    lines.splice(-1, 1)
    canvas.add(...lines, ...circles)
    callback?.()
  }

  function listenObjectMoving(options: IEvent) {
    const { target } = options
    const { canvas } = store.getState()
    if (!canvas) return

    const { pointIndex } = target
    if (pointIndex != null) {
      const line: fabric.Line = lineList[pointIndex]
      const prevLine = lineList[pointIndex - 1]
      const nextLine = lineList[pointIndex]
      if (prevLine) {
        prevLine.set({
          x2: target?.left,
          y2: target?.top,
        })
      }
      if (nextLine) {
        line.set({
          x1: target?.left,
          y1: target?.top,
        })
      }
      canvas.renderAll()
    }
  }

  function _transformShape(mode: string) {
    const { canvas } = store.getState()

    if (mode === 'prev') {
      const removeCircleIndex = currentIndex + 1
      const removeLineIndex = currentIndex
      canvas?.remove(circleList[removeCircleIndex])
      removeLineIndex && canvas?.remove(lineList[removeLineIndex])
    }

    if (mode === 'next') {
      canvas?.add(lineList[currentIndex - 1], circleList[currentIndex])
    }
  }

  function _resetState() {
    circleList = []
    lineList = []
    oldObject = null
    currentIndex = 0
  }

  function prevStep() {
    currentIndex -= 1
    if (currentIndex < 1) {
      message.warning('无法操作')
      currentIndex = 1
      return
    }
    _transformShape('prev')
  }

  function nextStep() {
    currentIndex += 1
    if (currentIndex > circleList.length - 1) {
      message.warning('无法操作')
      currentIndex = circleList.length - 1
      return
    }
    _transformShape('next')
  }

  function edit() {
    const { canvas } = store.getState()
    const object = canvas?.getActiveObject()
    if (!object) return
    object?.clone(
      (clonedObject: fabric.Object) => {
        oldObject = clonedObject
      },
      ['id', '_points'],
    )

    store.setState({ isEditing: true })
    // _initEvent()
    _drawShape(() => {
      canvas?.remove(object)
    })
  }

  function complete() {
    const { canvas } = store.getState()
    if (!canvas || !oldObject) return
    const points: PointType[] = []
    circleList
      .filter((c, i) => i <= currentIndex)
      .forEach((circle: fabric.Circle) => {
        points.push({
          x: circle.left ?? 0,
          y: circle.top ?? 0,
        })
        canvas.remove(circle)
      })
    lineList.forEach((line: fabric.Line) => {
      canvas.remove(line)
    })

    oldObject as fabric.Polyline

    const config = {
      id: oldObject.get('id'),
      stroke: oldObject.get('stroke'),
      strokeWidth: oldObject.get('strokeWidth'),
      hasControls: false,
    }

    ShapeUtils.editPloyline(points, config, (object: fabric.Polyline) => {
      canvas.setActiveObject(object)
      store.setState({ isEditing: false, selectObject: object })
      // console.log('编辑完成')
    })

    _resetState()
  }

  return { edit, complete, prevStep, nextStep, listenObjectMoving }
}
