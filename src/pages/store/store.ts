import type { InternalStateType } from '../type'
import deepCopy from 'deepcopy'
import { message } from 'antd'
import { observable, makeObservable, action, observe } from 'mobx'
import type { CanvasOptionType } from '../type'

const BrushLevelDefaultValue: CanvasOptionType = {
  stroke: '#ffffff',
  fill: '#000000',
  strokeWidth: 1,
}

const StateDefaultValues: InternalStateType = {
  // reactable state with view
  canvas: null,
  canvasOption: {
    ...BrushLevelDefaultValue
  },
  drawType: null, // 绘制类型
  drawAction: null, // 绘制操作
  bgImgVisible: false,
  bgImg: undefined, // 背景图
  canUndo: true, // 回撤
  canRedo: true, // 恢复
  selectObject: null, // 当前选中对象
  isEditing: false, // 当前是否为编辑模式

  // internal state
  mouseFrom: { x: 0, y: 0 },
  mouseTo: { x: 0, y: 0 },
  drawObject: null, // 鼠标按压绘制的对象
  isDrawing: false, // 鼠标按压绘制
  histroyStack: [], // 回撤历史栈
  histroyStackIndex: -1,
  rulerStack: [], // 直尺栈
  doDrawing: false, // 非鼠标按压绘制
  transformZoom: { x: 0, y: 0, zoom: 1 }, // 缩放
}

/**
 * 非视图响应内部数据
 *
 * @class Store
 */
class Store {
  public state: any
  constructor() {
    this.state = deepCopy(StateDefaultValues)
    makeObservable(this.state, {
      canvas: observable,
      canvasOption: observable,
      drawType: observable,
      drawAction: observable,
      bgImgVisible: observable,
      bgImg: observable,
      canUndo: observable,
      canRedo: observable,
      selectObject: observable,
      isEditing: observable,
    })
    makeObservable(this, {
      setState: action,
    })
  }

  public getState(key?: any) {
    return key ? this.state?.[key] : this.state
  }

  private updateState(newState: any) {
    const [key, value] = newState
    if (this.state.hasOwnProperty(key)) {
      this.state[key] = value
    }
  }

  public setState = (newState: any) => {
    // if ('selectObject' in newState) {
    //   debugger
    // }
    Object.keys(newState).forEach((item) => {
      this.updateState([item, newState[item]])
    })
  }

  public resetState() {
    this.setState(deepCopy(StateDefaultValues))
  }

  public isValidAction() {
    const { drawType } = this.getState()
    if (!drawType) return false
    return true
  }

  public removeActionType() {
    this.setState({
      drawType: null,
    })
  }

  public canAction(): boolean {
    const { isDrawing, isEditing, doDrawing } = this.getState()
    if (isDrawing || isEditing || doDrawing) {
      message.warning('请先完成当前操作！')
      return false
    }
    return true
  }

  public getCanvas() {
    return this.getState('canvas')
  }

  public watch(
    key: string,
    callback: (newValue: any, oldValue: any) => void,
    invokeImmediately: boolean = false,
  ) {
    return observe(
      this.state,
      key,
      (change) => {
        // console.log(`${key} changed`, change)
        callback(change.newValue, change.oldValue)
      },
      invokeImmediately,
    )
  }
}

const store = new Store()

export default store
