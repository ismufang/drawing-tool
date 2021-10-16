import type { IEvent } from 'fabric/fabric-impl'
import type { ObjectUitlsType, PointType } from '../type'
import editPloyline from './editPloylineUtils'
import { store } from '@/pages/store'
import { copyId, parseId } from './common'
import { ShapeTypeEnum } from '../constant'

/**
 * 丢弃选中对象
 *
 * @export
 */
export function discardSelectObject () {
  const { canvas, selectObject } = store.getState()
  if (!selectObject) return
  canvas?.discardActiveObject()
  canvas.requestRenderAll()
  store.setState({
    selectObject: null
  })
}

export default function objectUtils(): ObjectUitlsType {
  const EditPolylineUtils = editPloyline()

  /**
   * 删除选择对象
   *
   */
  function deleteObject() {
    const { canvas } = store.getState()
    const selectObject = canvas?.getActiveObject()
    if (selectObject) {
      canvas?.remove(selectObject)
    }
  }

  function listenMouseDown(options: IEvent) {
    const { target } = options
    const { selectObject, isEditing } = store.getState()
    if (isEditing) return
    if (target) {
      if (!selectObject || !target?.id || selectObject?.id !== target.id) {
        store.setState({
          selectObject: target,
        })
      }
    } else if (selectObject) {
      store.setState({
        selectObject: null,
      })
    }
  }

  /**
   * 更新_points
   *
   * @param {*} target
   */
   function _updateObjectPoints(target: any) {
    const { points = [] } = target
    const [key, value, shape] = parseId(target?.id)
    if (shape !== ShapeTypeEnum.POLYGON && shape !== ShapeTypeEnum.POLYLINE)
      return
    if (points.length === 0) return
    const { left = 0, top = 0 } = target
    const minLeft = Math.min(...points.map((p: PointType) => p.x))
    const minTop = Math.min(...points.map((p: PointType) => p.y))
    const diffLeft = left - minLeft
    const diffTop = top - minTop
    const _points: PointType[] = []
    points.forEach((point: fabric.Point) => {
      const _point: PointType = {}
      _point.x = point.x + diffLeft
      _point.y = point.y + diffTop
      _points.push(_point)
    })
    target._points = _points
  }

  function listenObjectMoved(options: IEvent) {
    const { target } = options
    const { isEditing } = store.getState()
    if (target?.id && !isEditing) {
      _updateObjectPoints(target)
    }
  }

  /**
   * 对象拷贝
   *
   */
  function copy() {
    const { canvas } = store.getState()
    canvas?.getActiveObject().clone(
      (clonedObj: fabric.Object) => {
        if (!clonedObj) return
        canvas.discardActiveObject()
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          id: copyId(clonedObj.id),
        })
        canvas.add(clonedObj)
        canvas.setActiveObject(clonedObj)
        canvas.requestRenderAll()
        store?.setState({
          selectObject: clonedObj,
        })
      },
      [
        'id',
        'hasControls',
        'lockScalingX',
        'lockScalingY',
        'lockRotation',
        '_points',
      ],
    )
  }

  /**
   * 设置对象属性
   *
   * @param {*} props
   */
  function setObjectProps(props: any) {
    const { selectObject, canvas } = store.getState()
    // eslint-disable-next-line guard-for-in
    for (const key in props) {
      selectObject?.set(key, props[key])
    }
    selectObject?.setCoords()
    canvas?.requestRenderAll()
  }

  return {
    deleteObject,
    listenMouseDown,
    copy,
    setObjectProps,
    editPolylineUtils: EditPolylineUtils,
    discardSelectObject,
    listenObjectMoved,
  }
}
