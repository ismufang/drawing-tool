import type { fabric } from 'fabric'
import rewriteControl from './rewriteControl'
import { rewriteConetxtmenu } from '../utils/common'
import rewriteTouch from './rewriteTouch'
import { store } from '../store'

export function initMixin(canvas: fabric.Canvas) {
  initBrush(canvas)
  rewriteControl()
  rewriteConetxtmenu()
  rewriteTouch()
}

function initBrush(canvas: fabric.Canvas) {
  const { canvasOption } = store.getState()
  canvas.freeDrawingBrush.color = canvasOption.stroke
  canvas.freeDrawingBrush.width = canvasOption.strokeWidth
}
