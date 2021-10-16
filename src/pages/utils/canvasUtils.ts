import type { CanvasUtilsType } from '../type'
import { DrawTypeEnum } from '../constant'
import { createImg, createDownloadAnchor } from './common'
import { fabric } from 'fabric'
import { store } from '@/pages/store'

export function setBgImg(
  bgImg: string | null | undefined,
  canvas: fabric.Canvas,
  callback?: (img?: HTMLImageElement | null) => void,
) {
  if (!canvas) return
  if (bgImg) {
    createImg(bgImg, (img) => {
      const image = new fabric.Image(img)
      canvas.setWidth(img.width ?? 1000)
      canvas.setHeight(img.height ?? 500)
      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas))
      callback?.(img)
    })
  } else {
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas))
    callback?.(null)
  }
}

export const setSelect = (selection: boolean, skipTargetFind = false) => {
  const { canvas } = store.getState()
  if (!canvas) return
  canvas as fabric.Canvas
  canvas.skipTargetFind = skipTargetFind
  canvas.selection = selection
}

export const disableSelect = (skipTargetFind = true) => {
  setSelect(false, skipTargetFind)
}

export const openSelect = (skipTargetFind = false) => {
  setSelect(true, skipTargetFind)
}

export default function canvasUtils(): CanvasUtilsType {
  function _solveObject(object: fabric.Object, mode = 'remove') {
    const canvas = store.getCanvas()
    if (!canvas) return
    if (mode === 'remove') {
      canvas.remove(object)
    }
    if (mode === 'add') {
      canvas.add(object)
    }
  }

  function addObject(object: fabric.Object) {
    _solveObject(object, 'add')
  }

  function removeObject(object: fabric.Object) {
    _solveObject(object, 'remove')
  }

  function setDrawingMode(bool: boolean) {
    const canvas = store.getCanvas()
    if (!canvas) return
    ;(canvas as fabric.Canvas).isDrawingMode = bool
  }

  function setSelection(bool: boolean) {
    const canvas = store.getCanvas()
    if (!canvas) return
    canvas as fabric.Canvas

    if (bool) {
      canvas.selection = true
      canvas.skipTargetFind = false
    } else {
      canvas.selection = false
      canvas.skipTargetFind = true
    }
  }

  function clearCanvas() {
    const canvas = store.getCanvas()
    if (!canvas) return
    canvas?.forEachObject((o: fabric.Object) => {
      canvas?.remove(o)
    })

    // const { histroyStack } = utils.getInternalState()
    // utils.setInternalState({
    //   histroyStack: [],
    //   histroyStackIndex: -1,
    // })
    // setState({
    //   canUndo: false,
    //   canRedo: false,
    // })
  }

  function downloadImg() {
    const canvas = store.getCanvas()
    if (!canvas) return
    const imgBase64 = canvas?.toDataURL()
    createDownloadAnchor(imgBase64 as string)
  }

  function presetBrush() {
    const canvas = store.getCanvas()
    if (!canvas) return
    canvas as fabric.Canvas
    const { canvasOption, drawType } = store.getState()
    if (drawType === DrawTypeEnum.BRUSH) {
      const brush: any = canvas?.freeDrawingBrush ?? {}
      brush.color = canvasOption.color
      brush.width = canvasOption.drawWidth
    }
  }

  function disableSelect(skipTargetFind = true) {
    const canvas = store.getCanvas()
    if (!canvas) return
    canvas as fabric.Canvas
    canvas.skipTargetFind = skipTargetFind
    canvas.selection = false
  }

  return {
    setDrawingMode,
    setSelection,
    clearCanvas,
    downloadImg,
    setBgImg,
    addObject,
    removeObject,
    presetBrush,
    disableSelect,
  }
}
