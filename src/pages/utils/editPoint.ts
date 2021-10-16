/**
 * Changing a point position is actually easy:
 * fabricObject.points[index].x = number; fabricObject.points[index].y =  number;
 * The difficult part is making sure that the object remains in the correct position while the dimensions are changed.
 */
import { fabric } from 'fabric'

export default function editPoint(canvas: fabric.Canvas, zoomUtils) {
  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  // 此函数查看控件的 pointIndex 并返回该特定点的当前画布位置。以这种方式执行交互和渲染
  function polygonPositionHandler(
    dim: {
      x: number
      y: number
    },
    finalMatrix: any,
    fabricObject: fabric.Object,
    currentControl: fabric.Control,
  ) {
    // console.log('fabricObject', fabricObject)
    const x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x
    const y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y
    const { left, top } = zoomUtils.getPostion({ x, y } ?? { x: 0, y: 0 })
    // console.log('x', x, 'y', y)
    // console.log('left', x, 'top', top)
    return fabric.util.transformPoint(
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix(),
      ),
    )
  }

  // define a function that will define what the control does
  // this function will be called on every mouse move after a control has been
  // clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  function actionHandler(
    eventData: MouseEvent,
    transformData: fabric.Transform,
    x: number,
    y: number,
  ) {
    const polygon = transformData.target
    const currentControl = polygon.controls[polygon.__corner]
    const mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      'center',
      'center',
    )
    const polygonBaseSize = polygon._getNonTransformedDimensions()
    const size = polygon._getTransformedDimensions(0, 0)
    const finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    }
    polygon.points[currentControl.pointIndex] = finalPointPosition
    return true
  }

  // define a function that can keep the polygon in the same position when we change its
  // width/height/top/left.
  function anchorWrapper(anchorIndex: number, fn: Function) {
    return function (
      eventData: MouseEvent,
      transform: fabric.Transform,
      x: number,
      y: number,
    ) {
      const fabricObject = transform.target
      const absolutePoint = fabric.util.transformPoint(
        new fabric.Point(
          fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
        ),
        fabricObject.calcTransformMatrix(),
      )
      const actionPerformed = fn(eventData, transform, x, y)
      // newDim = fabricObject._setPositionDimensions({}),
      const polygonBaseSize = fabricObject._getNonTransformedDimensions()
      const newX =
        (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
        polygonBaseSize.x
      const newY =
        (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
        polygonBaseSize.y
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
      return actionPerformed
    }
  }

  function edit() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    var poly = canvas.getActiveObject()
    // canvas.setActiveObject(poly);
    poly.edit = !poly.edit
    if (poly.edit) {
      console.log('potints', poly.points)
      var lastControl = poly.points.length - 1
      // poly.cornerStyle = 'circle';
      // poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.controls = poly.points.reduce(function (
        acc: any,
        point: any,
        index: number,
      ) {
        acc['p' + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler,
          ),
          actionName: 'modifyPolygon',
          pointIndex: index,
        })
        // console.log('acc', acc)
        return acc
      },
      {})
    } else {
      // poly.cornerColor = 'blue';
      // poly.cornerStyle = 'rect';
      poly.controls = fabric.Object.prototype.controls
    }
    poly.hasBorders = !poly.edit
    canvas.requestRenderAll()
  }

  return { edit }
}
