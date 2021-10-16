import type { ControlUtilsType } from '../type'
import { usePolyline, useHistoryStack, useRuler, usePolygon } from '.'
import {
  shapeUtils,
  canvasUtils,
  zoomUtils,
  objectUtils,
} from '../utils'

export default function useUtils(): ControlUtilsType {
  const polygonUtils = usePolygon()
  const rulerUtils = useRuler()
  const historyStackUtils = useHistoryStack()
  const polylineUtils = usePolyline()

  const ShapeUtils = shapeUtils()
  const CanvasUtils = canvasUtils()
  const ZoomUtils = zoomUtils()
  const ObjectUtils = objectUtils()

  return {
    canvasUtils: CanvasUtils,
    polygonUtils,
    rulerUtils,
    historyStackUtils,
    polylineUtils,
    shapeUtils: ShapeUtils,
    zoomUtils: ZoomUtils,
    objectUtils: ObjectUtils,
  }
}
