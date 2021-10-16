import type {
  DrawActionEnum,
  DrawTypeEnum,
  ShapeTypeEnum,
} from './constant'
import type { IEvent } from 'fabric/fabric-impl'

export interface CanvasOptionType {
  fill: string
  stroke: string
  strokeWidth: number
}

export interface GlobalStateType {
  canvas: fabric.Canvas | null
  canvasOption: CanvasOptionType
  color?: string
  drawWidth?: number
  drawType: DrawTypeEnum | null
  drawAction: DrawActionEnum | null
  bgImgVisible: boolean
  bgImg: string | undefined
  canUndo: boolean
  canRedo: boolean
  selectObject: fabric.Object | null
  isEditing: boolean
}

export interface TransformZoomType {
  /** 缩放比 */
  zoom: number
  /** x轴偏移量 */
  x: number
  /** y轴偏移量 */
  y: number
}

export interface InternalStateType extends GlobalStateType {
  mouseFrom: { x: number; y: number }
  mouseTo: { x: number; y: number }
  /** 当前绘制对象 */
  drawObject: any
  /** 需要持续按压绘图 */
  isDrawing: boolean
  histroyStack: string[]
  histroyStackIndex: number
  rulerStack: fabric.Object[]
  /** 不需要持续按压绘图 */
  doDrawing: boolean
  transformZoom: TransformZoomType
}

export type PointType = { x: number; y: number; code?: number | string }

export type SaveType = {
  imageBase64: string
  imageHeight: number
  imageWidth: number
}

export interface CanvasUtilsType {
  setDrawingMode: (bool: boolean) => void
  setSelection: (bool: boolean) => void
  clearCanvas: () => void
  downloadImg: () => void
  setBgImg: (
    bgImg: string | null | undefined,
    canvas: fabric.Canvas,
    callback?: (img?: HTMLImageElement | null) => void,
  ) => void
  addObject: (object: fabric.Object) => void
  removeObject: (object: fabric.Object) => void
  presetBrush: () => void
  disableSelect: (skipTargetFind: boolean) => void
}

export interface HistoryStackUtilsType {
  getTop: () => string
  getStack: () => string[]
  setStack: (newStack: string[], resetIndex: boolean) => void
  getStackIndex: () => number
  getValue: () => { histroyStack: string[]; histroyStackIndex: number }
  find: (object: string) => string | undefined
  findIndex: (object: string) => number
  push: (object: string) => void
  pushJson: () => void
  setStackIndex: (newIndex: number) => void
  slideStackIndex: (slideIndex: number) => void
  remove: (object: string) => void
  resetStack: (callback?: () => void) => void
  initStack: () => void
}

export interface ShapeUtilsType {
  generateId: (key: any, value: any, shapeType: string) => void
  setDoDrawing: (bool: boolean) => void
  getColor: () => string
  clearRulerStack: () => void
  drawingShape: (pointData: PointType[][], shapeType: ShapeTypeEnum) => void
  generatePloyline: (
    points: PointType[],
    callback?: (params?: any) => void,
  ) => void
  generatePolygon: (
    points: PointType[],
    callback?: (params?: any) => void,
  ) => void
  editPloyline: (
    points: PointType[],
    config: any,
    callback?: (object: any) => void,
  ) => void
}

export interface ZoomUtilsType {
  getState: () => TransformZoomType
  setState: (newState: any) => void
  getPostion: (pointer: { x: number; y: number }) => {
    left: number
    top: number
  }
  resetState: () => void
  updateZoomState: (newX: number, newY: number, newZoom: number) => void
  updateMoveState: (movementX: number, movementY: number) => void
  getNewZoom: (deltaY: number) => number
  restore: () => void
  listenMouseWheel: (options: IEvent) => void
  listenMouseMove: (options: IEvent) => void
}

export interface EditPolylineUtilsType {
  edit: () => void
  complete: () => void
  prevStep: () => void
  nextStep: () => void
  listenObjectMoving: (options: IEvent) => void
}

export interface ObjectUitlsType {
  deleteObject: () => void
  listenMouseDown: (options: IEvent) => void
  copy: () => void
  setObjectProps: (props: any) => void
  editPolylineUtils: EditPolylineUtilsType
  discardSelectObject: () => void
  listenObjectMoved: (e: IEvent) => void
}

export interface ControlUtilsType {
  canvasUtils: CanvasUtilsType
  polygonUtils: any
  rulerUtils: any
  historyStackUtils: HistoryStackUtilsType
  polylineUtils: any
  shapeUtils: any
  zoomUtils: ZoomUtilsType
  objectUtils: ObjectUitlsType
}

export interface ControlActionType extends ControlUtilsType {
  handleDarwType: (drawType: DrawTypeEnum | null) => void
  handleUndo: () => void
  handleRedo: () => void
  handleSave: (type: string) => void
  handleDownloadImg: () => void
  handleClearCanvas: () => void
  handleClearRulerStack: () => void
  handleDeleteObject: () => void
  handleUnmount: () => void
  handleZoomRestore: () => void
  handleObjectEdit: () => void
}

export interface DrawContextType extends ControlActionType {
  mapFile?: any
}

export interface FabricObject extends fabric.Object {
  id?: string
}
