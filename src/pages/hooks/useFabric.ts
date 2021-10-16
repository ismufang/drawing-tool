import type { fabric } from 'fabric'
import { useEffect } from 'react'
import { useInitCanvas, useAction } from '.'
import { store } from '../store'

export default function useFabric() {
  const ActionControl = useAction()
  const initCanvasUtils = useInitCanvas()

  useEffect(() => {
    const listens: any[] = []
    listens[listens.length] = store.watch('canvasOption', (newVal) => {
      ActionControl.canvasUtils.presetBrush()
    })

    listens[listens.length] = store.watch('drawType', (newVal) => {
      ActionControl.handleDarwType(newVal)
    })

    return () => {
      listens.forEach((unlisten) => unlisten())
      ActionControl.handleUnmount()
    }
  }, [])

  function initCanvas(
    el: HTMLCanvasElement | string,
    options: any = {},
    callback?: (canvas: fabric.Canvas) => void,
  ) {
    initCanvasUtils.init(el, (canvas: fabric.Canvas) => {
      if (options.bgImg) {
        ActionControl.canvasUtils.setBgImg(
          options.bgImg,
          canvas,
          (img: any) => {
            store.setState({
              bgImgVisible: true,
              bgImg: options.bgImg,
            })
            callback?.(canvas)
          },
        )
      } else {
        callback?.(canvas)
      }
    })
  }

  return {
    initCanvas,
    ...ActionControl,
  }
}
