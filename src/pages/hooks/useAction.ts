import type { ControlActionType, SaveType } from '../type'
import { fabric } from 'fabric'
import { useCallback } from 'react'
import { DrawTypeEnum, ShapeTypeEnum } from '../constant'
import { useUtils } from '.'
import { getMapFileFromLocal, generateId } from '../utils/common'
import { store } from '../store'

const useAction = (): ControlActionType => {
  const ControlUtils = useUtils()

  const _canAction = () => {
    return store.getCanvas() != null && store.canAction()
  }

  const handleDarwType = useCallback((drawType: DrawTypeEnum | null) => {
    const { canvas } = store.getState()
    if (!_canAction()) return
    const { canvasOption } = store.getState()
    const { stroke, strokeWidth, fill } = canvasOption

    ControlUtils.canvasUtils.setDrawingMode(drawType === DrawTypeEnum.BRUSH)
    ControlUtils.canvasUtils.setSelection(drawType === DrawTypeEnum.SELECT)

    switch (drawType) {
      case DrawTypeEnum.BRUSH:
        {
          const brush: any = canvas?.freeDrawingBrush
          brush.color = stroke
          brush.width = strokeWidth
        }
        break
      case DrawTypeEnum.LINE:
        break
      case DrawTypeEnum.SELECT:
        canvas.selection = false
        canvas.skipTargetFind = false
        break
      case DrawTypeEnum.TEXT:
        {
          ControlUtils.canvasUtils.setSelection(true)
          const textbox = new fabric.Textbox('请输入文本...', {
            left: 100,
            top: 100,
            width: 150,
            fontSize: 18,
            borderColor: '#2c2c2c',
            // stroke,
            fill,
            hasControls: true,
            lockScalingX: false,
            lockScalingY: false,
            lockRotation: false,
            id: generateId('drawType', DrawTypeEnum.TEXT, ShapeTypeEnum.TEXT),
          })
          canvas?.add(textbox)?.setActiveObject(textbox)
        }
        break
      case DrawTypeEnum.POLYGON:
        ControlUtils.polygonUtils.initDraw()
        break
      case DrawTypeEnum.RULER:
        ControlUtils.rulerUtils.initDraw()
        break
      case DrawTypeEnum.POLYLINE:
        ControlUtils.polylineUtils.initDraw()
        break
      default:
        break
    }
  }, [])

  const handleUndo = useCallback(() => {
    const { canvas } = store.getState()
    if (!_canAction()) return
    canvas as fabric.Canvas
    const { histroyStackIndex } =
      ControlUtils.historyStackUtils.getValue()
    const step = histroyStackIndex - 1
    if (step >= 0) {
      ControlUtils.historyStackUtils.slideStackIndex(step)
    } else {
      console.log('无法回撤')
    }
  }, [])

  const handleRedo = useCallback(() => {
    const { canvas } = store.getState()
    if (!_canAction()) return
    canvas as fabric.Canvas
    const { histroyStack, histroyStackIndex } =
      ControlUtils.historyStackUtils.getValue()
    const step = histroyStackIndex + 1
    if (step <= histroyStack.length - 1) {
      ControlUtils.historyStackUtils.slideStackIndex(step)
    } else {
      console.log('无法恢复')
    }
  }, [])

  const handleSave = useCallback((type) => {
    const { bgImg, canvas } = store.getState()
    if (!_canAction()) return
    canvas as fabric.Canvas
    const mapFile = getMapFileFromLocal()
    const { width = mapFile.imageWidth, height = mapFile.imageHeight } = canvas

    if (bgImg) {
      const url = canvas?.toDataURL()
      const data: SaveType = {
        imageBase64: url,
        imageHeight: height,
        imageWidth: width,
      }
      console.log('handleSave type', type, 'data:', data)
    }
  }, [])

  const handleDownloadImg = useCallback(() => {
    if (!_canAction()) return
    ControlUtils.canvasUtils.downloadImg()
  }, [])

  const handleClearCanvas = useCallback(() => {
    if (!_canAction()) return
    ControlUtils.canvasUtils.clearCanvas()
  }, [])

  const handleClearRulerStack = useCallback(() => {
    if (!_canAction()) return
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
  }, [])

  const handleDeleteObject = useCallback(() => {
    ControlUtils.shapeUtils.deleteObject()
  }, [])

  const handleUnmount = useCallback(() => {
    store.resetState()
    console.log('handleUnmount', store.getState())
  }, [])

  const handleZoomRestore = useCallback(() => {
    ControlUtils.zoomUtils.restore()
  }, [])

  const handleObjectEdit = useCallback(() => {
    const { canvas } = store.getState()
    const object = canvas?.getActiveObject()
    switch (object?.type) {
      case ShapeTypeEnum.POLYLINE:
        ControlUtils.polylineUtils.editPoint()
        break
      default:
        break
    }
  }, [])

  return {
    handleDarwType,
    handleUndo,
    handleRedo,
    handleSave,
    handleDownloadImg,
    handleClearCanvas,
    handleClearRulerStack,
    handleDeleteObject,
    handleUnmount,
    handleZoomRestore,
    handleObjectEdit,
    ...ControlUtils,
  }
}

export default useAction
