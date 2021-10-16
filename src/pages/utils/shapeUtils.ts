import type { PointType, ShapeUtilsType } from '../type'
import { fabric } from 'fabric'
import {
  ShapeTypeEnum,
} from '../constant'
import { generateId } from './common'
import { store } from '@/pages/store'

export const generateImgPolygon = (
  imgInfo: { base64: string; width: number; height: number },
  callback: (img: any) => void,
) => {
  const { base64 } = imgInfo
  fabric.Image.fromURL(base64, (img) => {
    img.set({
      left: 16,
      top: 16,
      hasControls: true,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      id: generateId(null, null, ShapeTypeEnum.CROPPEDIMG),
    })
    callback(img)
  })
}

export default function shapeUtils(): ShapeUtilsType {
  function setDoDrawing(bool: boolean) {
    store.setState({ doDrawing: bool })
  }

  /**
   * 获取当前颜色
   *
   * @returns {string} color
   */
  function getColor() {
    const { canvasOption } = store.getState()
    return canvasOption.fill
  }

  /**
   * 清理尾部重复点位
   *
   * @param {PointType[]} points
   * @returns {PointType[]} points
   */
  function resolvePoints(points: PointType[]): PointType[] {
    const lastPoint = points[points.length - 1]
    const secondLastPoint = points[points.length - 2]
    if (lastPoint && secondLastPoint) {
      if (
        lastPoint.x === secondLastPoint.x &&
        lastPoint.y === secondLastPoint.y
      ) {
        return points.slice(0, -1)
      }
    }

    return points
  }

  /**
   * 清理直尺堆栈
   *
   */
  function clearRulerStack() {
    const { canvas, rulerStack } = store.getState()
    if (rulerStack.length === 0) return
    rulerStack.forEach((o: any) => {
      canvas?.remove(o.text)
      canvas?.remove(o.line)
    })
    canvas?.renderAll()
    store.setState({
      rulerStack: [],
    })
  }

  /**
   * 编辑折线
   *
   * @param {PointType[]} points
   * @param {*} [config={}]
   * @param {Function} [callback]
   */
  function editPloyline(
    points: PointType[],
    config: any = {},
    callback?: (polyline: fabric.Polyline) => void,
  ) {
    const canvas = store.getCanvas()
    const _config = {
      strokeWidth: 2,
      stroke: '#333333',
      fill: '',
      hasControls: true,
      ...config,
    }
    const polyline = new fabric.Polyline(points, _config)
    polyline._points = [...points]
    canvas?.add(polyline)
    setDoDrawing(false)
    callback?.(polyline)
  }

  /**
   * 生成折线
   *
   * @param {PointType[]} points
   * @param {(params?: any) => void} [callback]
   */
  function generatePloyline(
    points: PointType[],
    callback?: (params?: any) => void,
  ) {
    points = resolvePoints(points)
    const { canvas, drawType } = store.getState()
    const color = getColor()
    const config = {
      strokeWidth: 2,
      stroke: color,
      fill: '',
      hasControls: false,
      id: generateId('drawType', drawType, ShapeTypeEnum.POLYLINE),
    }
    const polyline = new fabric.Polyline(points, config)
    polyline._points = [...points]

    canvas?.add(polyline)
    setDoDrawing(false)
    callback?.()
  }

  /**
   * 生成多边形
   *
   * @param {PointType[]} points
   * @param {(params?: any) => void} [callback]
   */
  function generatePolygon(
    points: PointType[],
    callback?: (params?: any) => void,
  ) {
    points = resolvePoints(points)
    const canvas = store.getCanvas()
    const { drawType } = store.getState()
    const color = getColor()
    points = points.map((item: any) => ({ x: item.x, y: item.y }))
    const config = {
      stroke: color,
      strokeWidth: 1,
      fill: color,
      opacity: drawType ? 1 : 0.8,
      lockScalingX: drawType ? false : true,
      lockScalingY: drawType ? false : true,
      lockRotation: drawType ? false : true,
      hasControls: drawType ? true : false,
      id: generateId('drawType', drawType, ShapeTypeEnum.POLYGON),
    }
    const polygon = new fabric.Polygon(points, config)
    polygon._points = [...points]

    canvas?.add(polygon)
    setDoDrawing(false)
    callback?.()
  }

  /**
   * 绘制来自csv数据图形
   * @param pointData
   * @param shapeType
   * @returns
   */
  function drawingShape(pointData: PointType[][], shapeType: ShapeTypeEnum) {
    if (!pointData.length) return
    switch (shapeType) {
      case ShapeTypeEnum.POLYLINE:
        // console.log('path pointData', pointData)
        pointData.forEach((p) => {
          generatePloyline(p)
        })
        break
      case ShapeTypeEnum.POLYGON:
        // console.log('polygon pointData', pointData)
        pointData.forEach((p) => {
          generatePolygon(p)
        })
        break
      default:
        break
    }
  }

  return {
    generateId,
    setDoDrawing,
    getColor,
    clearRulerStack,
    drawingShape,
    generatePloyline,
    generatePolygon,
    editPloyline,
  }
}
