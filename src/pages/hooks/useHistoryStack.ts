/**
 * // TODO: 暂时关闭历史记录栈
 */
import type { IEvent } from 'fabric/fabric-impl'
import type { HistoryStackUtilsType } from '../type'
import { useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { store } from '../store'

let canvasFirstUpdate = true

export default function useHistoryStack(): HistoryStackUtilsType {
  const _renderJsonCanvas = useCallback(
    (jsonCanvas: string, callback?: () => void) => {
      const { canvas } = store.getState()
      if (!canvas) return
      canvas?.clear().renderAll()
      canvas?.loadFromJSON(jsonCanvas, () => {
        canvas?.renderAll()
        callback?.()
      })
    },
    [],
  )

  const _listenStackIndex = useCallback(() => {
    // TODO: 暂时关闭
    return
    if (!store.isValidAction()) return
    const { histroyStack, histroyStackIndex } = store.getState()
    if (histroyStackIndex > 0) {
      setState({ canUndo: true })
    } else {
      setState({ canUndo: false })
    }

    if (histroyStackIndex < histroyStack.length - 1) {
      setState({ canRedo: true })
    } else {
      setState({ canRedo: false })
    }
  }, [])

  const getStack = useCallback(() => {
    return store.getState('histroyStack')
  }, [])

  const getTop = useCallback(() => {
    const { histroyStack } = store.getState()
    return histroyStack[histroyStack.length - 1]
  }, [])

  const getStackIndex = useCallback(() => {
    return store.getState('histroyStackIndex')
  }, [])

  const getValue = useCallback(() => {
    const { histroyStack, histroyStackIndex } = store.getState()
    return { histroyStack, histroyStackIndex }
  }, [])

  const find = useCallback((object: string) => {
    const stack = getStack()
    return stack.find((o) => o === object)
  }, [])

  const findIndex = useCallback((object: string) => {
    const stack = getStack()
    return stack.findIndex((o) => o === object)
  }, [])

  const push = useCallback((object: string) => {
    const { histroyStack } = store.getState()
    histroyStack.push(object)
    store.setState({
      histroyStack,
      histroyStackIndex: histroyStack.length - 1,
    })
    _listenStackIndex()
    // console.log('histroyStack', histroyStack)
  }, [])

  const pushJson = useCallback(() => {
    const { histroyStack, canvas } = store.getState()
    const canvasJson = JSON.stringify(canvas)
    histroyStack.push(canvasJson as any)
    store.setState({
      histroyStack,
      histroyStackIndex: histroyStack.length - 1,
    })
    _listenStackIndex()
    // console.log('histroyStack', histroyStack, histroyStack.length - 1)
  }, [])

  const remove = useCallback((object: string) => {
    const { histroyStack } = store.getState()
    const index = histroyStack.findIndex((o) => o === object)
    index >= 0 && histroyStack.splice(index, 1)
  }, [])

  const setStack = useCallback((newStack: string[], resetIndex = true) => {
    store.setState({ histroyStack: newStack })
    resetIndex && store.setState({ histroyStackIndex: newStack.length - 1 })
    _listenStackIndex()
  }, [])

  const setStackIndex = useCallback((newIndex: number) => {
    store.setState({
      histroyStackIndex: newIndex,
    })
    _listenStackIndex()
  }, [])

  /**
   * 滑动栈
   * @param {number} slideIndex 滑动位置
   */
  const slideStackIndex = useCallback((slideIndex: number) => {
    const { histroyStack } = store.getState()

    _renderJsonCanvas(histroyStack[slideIndex], () => {
      setStackIndex(slideIndex)
    })
  }, [])

  const initStack = useCallback(() => {
    store.setState({
      histroyStack: [],
      histroyStackIndex: -1,
    })
  }, [])

  const resetStack = useCallback((callback?: () => void) => {
    // console.log('resetStack')
    const { histroyStack } = store.getState()
    const newStack = histroyStack.slice(0, 1)
    setStack(newStack)
    _renderJsonCanvas(newStack[0], () => {
      callback?.()
    })
  }, [])

  const _handleMouseDown = useCallback((options: IEvent) => {
    // console.log('mouseDown')
    if (!store.isValidAction()) return
    const { histroyStack, histroyStackIndex } = store.getState()
    if (histroyStackIndex !== histroyStack.length - 1) {
      // console.log('存在未恢复栈内存，清除')
      setStack(histroyStack.slice(0, histroyStackIndex + 1))
    } else {
      // console.log('不存在未恢复栈内存')
    }
  }, [])

  const _initEvent = useCallback((canvas) => {
    canvas.on(
      'object:removed',
      debounce((options: IEvent) => {
        if (!store.isValidAction()) return
        pushJson()
      }, 300),
    )

    canvas.on('mouse:down', _handleMouseDown)

    canvas.on('mouse:up', () => {
      if (!store.isValidAction()) return
      pushJson()
    })
  }, [])

  useEffect(() => {
    // const disposer = store.watch('canvas', (canvas) => {
    //   if (canvas) {
    //     if (canvasFirstUpdate) {
    //       canvasFirstUpdate = false
    //       _initEvent(canvas)
    //     }
    //   }
    // }, true)
    // return () => {
    //   disposer()
    // }
  }, [])

  return {
    push,
    pushJson,
    getTop,
    getStack,
    setStack,
    getStackIndex,
    getValue,
    find,
    findIndex,
    setStackIndex,
    slideStackIndex,
    remove,
    resetStack,
    initStack,
  }
}
