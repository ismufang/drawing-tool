// import hasha from 'hasha'
import { parse } from 'querystring'

export const getBase64Image = (img: HTMLImageElement) => {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ;(ctx as CanvasRenderingContext2D).drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

export const createImg = (
  url: string,
  callback?: (img: HTMLImageElement) => void,
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    if (/(\.png|\.jpg|\.jpeg)$/.test(url) || /^http/.test(url)) {
      // 设置 image 的 url, 添加时间戳，防止浏览器缓存图片
      img.src = url + '?time=' + new Date().getTime()
      // 重要，设置 crossOrigin 属性，否则图片跨域会报错
      img.setAttribute('crossOrigin', 'Anonymous')
    }
    img.onload = () => {
      callback?.(img)
      resolve(img)
    }
    img.onerror = (err) => {
      console.log('image onerror', err)
      reject(err)
    }
  })
}

/**
 * @name 获取url参数
 * @return object { key: value }
 */
export const getUrlQuery = () => {
  return parse(window.location.search.slice(1)) || {}
}

export const getPageQuery = () => {
  const page = window.location.href.split('#')[1].split('?')[1]
  return parse(page) || {}
}

export const createDownloadAnchor = (url: string) => {
  const a: HTMLAnchorElement = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'mydraw'
  a.id = 'tempDownloadAnchor'
  a.addEventListener('click', () => {
    setTimeout(() => {
      a.remove()
    }, 1000)
  })
  a.click()
}

export function createHash(url: string, options?: any) {
  // const hash = hasha(url, {
  //   algorithm: 'md5',
  //   ...options,
  // })
  // return hash
}

export function rewriteConetxtmenu() {
  document.oncontextmenu = (e) => {
    e.preventDefault()
    console.log('clicked right')
  }
}

export function getMapFileFromLocal() {
  const mapFile = JSON.parse(localStorage.getItem('MAP_FILE') ?? '{}')
  return mapFile
}

/**
 * 解析id
 * @export
 * @param {string} id
 * @returns {string[]} [key, value, shapeType, timestamp]
 */
export function parseId(id: string = ''): string[] {
  const splitIds = id.split('-')
  return splitIds
}

/**
 * 构造id
 * @export
 * @param {*} [key='0']
 * @param {*} [value='0']
 * @param {ShapeTypeEnum} [shapeType='shape']
 * @returns
 */
export function generateId(
  key: any = '0',
  value: any = '0',
  shapeType: string = 'shape',
) {
  // 默认：绘图类型 + 时间戳
  // 自定义：绘图模式名 + 绘图模式值 + 默认
  const ret = `${key}-${value}-${shapeType}-${new Date().getTime()}`
  return ret
}

export function copyId(id: string) {
  return id.split('-').slice(0, -1).join('-') + '-' + new Date().getTime()
}

export default {
  getBase64Image,
  createImg,
  getUrlQuery,
  getPageQuery,
  createDownloadAnchor,
  createHash,
  rewriteConetxtmenu,
  getMapFileFromLocal,
}
