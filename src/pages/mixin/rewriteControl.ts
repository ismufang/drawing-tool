import { fabric } from 'fabric'

export default function rewriteControl() {

  // fabric.Control.prototype.visible = false
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = '#1976D2'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.padding = 15
  // fabric.Object.prototype.lockScalingX = true
  // fabric.Object.prototype.lockScalingY = true
  // fabric.Object.prototype.lockRotation = true
  fabric.Object.prototype.borderColor = '#2196F3'
  // fabric.Object.prototype.hasBorders = false
  // fabric.Object.prototype.hasControls = false
}
