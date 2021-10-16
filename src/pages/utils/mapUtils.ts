import { math } from '.'

/**
 * 将激光雷达数据点，转换为极坐标点集合
 * @param {object} frame 激光雷达数据帧
 * @param {number} angle 机器人的角度
 * @return {{angle :number, distance:number}} 激光数据的极坐标点集合
 */
export function toPolarCoordinates(frame, angle) {
  const coordinates = []
  for (let i = 0; i < frame.measurements.length; i++) {
    const p = {}
    p.angle = frame.minAngle + i * frame.angleIncrement + angle
    p.distance = frame.measurements[i]
    if (p.distance > frame.maxRange) p.distance = frame.maxRange
    if (p.distance < frame.minRange) p.distance = 0
    coordinates.push(p)
  }
  return coordinates
}

/**
 * 机器人极坐标点转笛卡尔坐标
 * @param {number} distance 极坐标距离
 * @param {number} angle 极坐标角度
 * @return {{x:number, y:number}}笛卡尔坐标点
 */
export function p2d(distance, angle) {
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}

/**
 * 转换slam坐标至地图像素坐标
 * @param {number} x slam坐标x
 * @param {number} y slam坐标y
 * @param {number} height 所在地图像素高度
 * @param {{x:number, y:number}} origin 地图slam原点信息
 * @param {number} resolution 地图分辨率
 * @return {{x:number, y:number}}
 */
export function slam2pixel(x, y, height, origin, resolution) {
  if (resolution <= 0) {
    throw new Error('无效的地图分辨率')
  }

  const a = math.format(math.evaluate(`${x}-${origin[0]}`))
  const b = math.format(math.evaluate(`${y}-${origin[1]}`))

  return {
    x: math.format(math.evaluate(`${a}/${resolution}`)) * 1,
    y: math.format(math.evaluate(`${height}-${b}/${resolution}`)) * 1,
    // x: (x - origin[0]) / resolution,
    // y: height - (y - origin[1]) / resolution,
  }
}

/**
 * 转换像素坐标成slam坐标
 * @param {number} x 像素坐标x
 * @param {number} y 像素坐标y
 * @param {number} height 所在地图像素高度
 * ＠param {{x:number, y:number}} origin 地图slam原点信息
 * @param {number} resolution 地图分辨率
 * @return {{x:number, y:number}}
 */
export function pixel2slam(x, y, height, origin, resolution) {
  // console.log(x, y, height, origin, resolution)
  if (resolution <= 0) {
    throw new Error('无效的地图分辨率')
  }
  const a = math.format(math.evaluate(`${height}-${y}`))
  return {
    x: math.format(math.evaluate(`${x}*${resolution}+${origin[0]}`)) * 1,
    y: math.format(math.evaluate(`${a}*${resolution}+${origin[1]}`)) * 1,
    // x: x * resolution + origin[0],
    // y: (height - y) * resolution + origin[1],
  }
}

/**
 * 获取slam坐标像素位置
 * @param {number} x
 * @param {number} y
 * @param {object} data
 * @param {object} { position,imageHeight,imageWidth,origin,resolution }
 */
export const getPxPos = async (x, y, data = {}) => {
  if (Object.keys(data).length === 0) {
    throw new Error('getPxPos need data')
  }
  const imageUrl = data.imageUrl ?? ''
  const origin = data.origin
  const resolution = data.resolution ?? 0
  let imageHeight = data.imageHeight ?? 0
  let imageWidth = data.imageWidth ?? 0
  let position = {
    x: 0,
    y: 0,
  }

  // 获取实际图片大小
  if (!imageHeight || !imageWidth) {
    const { height, width } = await getRealImg(imageUrl)
    imageHeight = height
    imageWidth = width
    data.imageHeight = height
    data.imageWidth = width
  }

  if (imageHeight && origin && resolution) {
    position = slam2pixel(x, y, imageHeight, origin, resolution)
  }

  return {
    position,
    imageHeight,
    imageWidth,
    origin,
    resolution,
  }
}

export default {
  toPolarCoordinates,
  p2d,
  slam2pixel,
  pixel2slam,
}
