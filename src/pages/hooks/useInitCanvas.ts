import { fabric } from 'fabric'
import { useCallback, useEffect } from 'react'
import { initMixin } from '../mixin/initMixin'
import useBindEvent from './useBindEvent'
import { store } from '@/pages/store'

export const CanvasDefaultConfig: fabric.ICanvasOptions = {
  width: 1000,
  height: 500,
  backgroundColor: '#f4f4f4',
  isDrawingMode: false,
  skipTargetFind: false,
  selection: false,
}

export default function useInitCanvas() {
  const EventHandlers = useBindEvent()

  useEffect(() => {
    return () => {
      const { canvas } = store.getState()
      if (!canvas) return
      EventHandlers.off(canvas)
    }
  }, [])

  // 绑定画布事件
  const _bindCanvasEvent = useCallback((canvas: fabric.Canvas) => {
    EventHandlers.on(canvas)
  }, [])

  const init = useCallback(
    (
      el: HTMLCanvasElement | string,
      callback?: (canvas: fabric.Canvas) => void,
    ) => {
      // console.log('useInitCanvas init')
      const canvas = new fabric.Canvas(el, {
        ...CanvasDefaultConfig,
      })
      store.setState({ canvas })
      initMixin(canvas)
      // 绑定画板事件
      _bindCanvasEvent(canvas)
      // store.setState({ canvas })
      callback?.(canvas)
    },
    [_bindCanvasEvent],
  )

  return {
    init,
  }
}
