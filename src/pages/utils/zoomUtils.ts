import type { ZoomUtilsType } from '../type'
import type { IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { store } from '../store'

export default function zoomUtils(): ZoomUtilsType {
  function getState() {
    return store.getState('transformZoom')
  }

  function setState(newState: any) {
    let { transformZoom } = store.getState()
    transformZoom = { ...transformZoom, ...newState }
    store.setState({ transformZoom })
  }

  function resetState() {
    setState({
      x: 0,
      y: 0,
      zoom: 1,
    })
  }

  // 计算缩放时产生的偏移量
  function updateZoomState(newX: number, newY: number, newZoom: number) {
    const { transformZoom } = store.getState()
    transformZoom.x += newX / newZoom - newX / transformZoom.zoom
    transformZoom.y += newY / newZoom - newY / transformZoom.zoom
    transformZoom.zoom = newZoom
  }

  // 累计每一次移动时候的偏移量
  function updateMoveState(movementX: number, movementY: number) {
    const { transformZoom } = store.getState()
    transformZoom.x += movementX / transformZoom.zoom
    transformZoom.y += movementY / transformZoom.zoom
  }

  function getPostion(pointer: { x: number; y: number }) {
    const { transformZoom } = store.getState()
    return {
      left: pointer.x / transformZoom.zoom - transformZoom.x,
      top: pointer.y / transformZoom.zoom - transformZoom.y,
    }
  }

  function getNewZoom(deltaY: number) {
    const { canvas } = store.getState()
    if (!canvas) return 1
    let zoom = (deltaY > 0 ? 0.1 : -0.1) + canvas.getZoom()
    zoom = Math.max(0.5, zoom) // 最小为原来的1/2
    zoom = Math.min(2, zoom) // 最大是原来的2倍
    return zoom
  }

  // 返璞归真
  function restore() {
    const { canvas } = store.getState()
    if (!canvas) return
    const delta = new fabric.Point(0, 0)
    canvas.absolutePan(delta)
    canvas.setZoom(1)
    resetState()
  }

  function listenMouseWheel(options: IEvent) {
    const { canvas } = store.getState()
    const { e } = options
    if (!canvas || !e?.altKey) return
    canvas as fabric.Canvas

    const { transformZoom } = store.getState()
    const { offsetX = 0, offsetY = 0, deltaY = 0 } = e
    const newZoom = getNewZoom(deltaY)
    if (newZoom === transformZoom.zoom) return

    const zoomPoint = new fabric.Point(offsetX, offsetY)
    canvas?.zoomToPoint(zoomPoint, newZoom)
    updateZoomState(offsetX, offsetY, newZoom)
  }

  function listenMouseMove(options: IEvent) {
    const { e } = options
    const { canvas } = store.getState()
    if (!canvas || !e?.altKey) return
    canvas as fabric.Canvas

    const { movementX = 0, movementY = 0 } = e
    const delta = new fabric.Point(movementX, movementY)
    canvas?.relativePan(delta)
    updateMoveState(movementX, movementY)
  }

  return {
    getState,
    setState,
    getPostion,
    resetState,
    updateZoomState,
    updateMoveState,
    getNewZoom,
    restore,
    listenMouseWheel,
    listenMouseMove,
  }
}
