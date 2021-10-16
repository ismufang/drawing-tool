export enum DrawTypeEnum {
  /** 画笔 */
  BRUSH = 'BRUSH',
  /** 直线 */
  LINE = 'LINE',
  /** 直尺 */
  RULER = 'RULER',
  /** 正圆 */
  CIRCLE = 'CIRCLE',
  /** 椭圆 */
  ELLIPSE = 'ELLIPSE',
  /** 矩形 */
  RECTANGLE = 'RECTANGLE',
  /** 文本 */
  TEXT = 'TEXT',
  /** 选择 */
  SELECT = 'SELECT',
  /** 多边形 */
  POLYGON = 'POLYGON',
  /** 路径 */
  PATH = 'PATH',
  /** 折线 */
  POLYLINE = 'POLYLINE',
}

export enum DrawActionEnum {
  /** 保存 */
  SAVE = 'SAVE',
  /** 下载 */
  DOWNLOAD = 'DOWNLOAD',
  /** 清空 */
  CLEAR = 'CLEAR',
  /** 撤回 */
  UNDO = 'UNDO',
  /** 恢复 */
  REDO = 'REDO',
  /** 复制 */
  COPY = 'COPY',
  /** 粘贴 */
  PASTE = 'PASTE',
}

export const ColorOption = ['#ffffff', '#cccccc', '#000000']

export enum ShapeTypeEnum {
  /** 路径 */
  PATH = 'path',
  /** 折线 */
  POLYLINE = 'polyline',
  /** 多边形 */
  POLYGON = 'polygon',
  /** 直线 */
  LINE = 'line',
  /** 文本 */
  TEXT = 'text',
  /** 裁切图片 */
  CROPPEDIMG = 'croppedimg',
  /** 正圆 */
  CIRCLE = 'circle',
  /** 椭圆 */
  ELLIPSE = 'ellipse',
  /** 矩形 */
  RECTANGLE = 'rectangle',
}

export const DrawTypeMap = new Map([
  [
    DrawTypeEnum.SELECT,
    { icon: 'icon-drawxuanze1', name: '选择', show: false },
  ],
  [DrawTypeEnum.BRUSH, { icon: 'icon-drawhuabi', name: '画笔', show: true }],
  [DrawTypeEnum.LINE, { icon: 'icon-drawline', name: '直线', show: true }],
  [
    DrawTypeEnum.RULER,
    { icon: 'icon-drawzhichiicon', name: '直尺', show: true },
  ],
  [
    DrawTypeEnum.CIRCLE,
    { icon: 'icon-drawzhengyuan', name: '正圆', show: true },
  ],
  [
    DrawTypeEnum.ELLIPSE,
    { icon: 'icon-drawtuoyuan', name: '椭圆', show: true },
  ],
  [
    DrawTypeEnum.RECTANGLE,
    { icon: 'icon-drawjuxing', name: '矩形', show: true },
  ],
  [DrawTypeEnum.TEXT, { icon: 'icon-drawtext', name: '文本', show: true }],
  [
    DrawTypeEnum.POLYGON,
    { icon: 'icon-drawduobianxing', name: '多边形', show: true },
  ],
  [DrawTypeEnum.PATH, { icon: 'icon-drawpath', name: '路径', show: false }],
  [DrawTypeEnum.POLYLINE, { icon: 'icon-drawpath', name: '折线', show: true }],
])

export const DrawActionMap = new Map([
  [DrawActionEnum.SAVE, { icon: 'icon-drawsave', name: '保存', show: true }],
  [
    DrawActionEnum.DOWNLOAD,
    { icon: 'icon-drawxiazai', name: '下载', show: true },
  ],
  [
    DrawActionEnum.CLEAR,
    { icon: 'icon-drawqingkong', name: '清空', show: true },
  ],
  [DrawActionEnum.UNDO, { icon: 'icon-drawundo', name: '撤销', show: false }],
  [DrawActionEnum.REDO, { icon: 'icon-drawredo', name: '恢复', show: false }],
  [DrawActionEnum.COPY, { icon: 'icon-drawredo', name: '复制', show: false }],
  [DrawActionEnum.PASTE, { icon: 'icon-drawredo', name: '粘贴', show: false }],
])
