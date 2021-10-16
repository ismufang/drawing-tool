import React, { useRef, useState } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Modal } from 'antd'
import { ImgDefaultUrl } from '..'

interface PropsType {
  img: string
  visible: boolean
  onConfirm: (imgBase64: string) => void
  onCancel: () => void
}

const TestDarkRoom: React.FC<PropsType> = ({
  img = ImgDefaultUrl,
  visible = true,
  onConfirm,
  onCancel,
}) => {
  const [imgInfo, setImgInfo] = useState<any>(null)
  const cropperRef = useRef<HTMLImageElement>(null)
  const onCrop = () => {
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    const CroppedCanvas = cropper.getCroppedCanvas()
    const { width, height } = CroppedCanvas
    setImgInfo({
      width,
      height,
      base64: CroppedCanvas.toDataURL(),
    })
  }

  const handleOk = () => {
    onConfirm(imgInfo)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title="裁切"
      width={1000}
      bodyStyle={{ padding: 0 }}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
      <Cropper
        src={img}
        initialAspectRatio={16 / 9}
        guides={false}
        crop={onCrop}
        ref={cropperRef}
        style={{
          width: 1000,
          height: 500,
        }}
        minCanvasHeight={30}
        minCanvasWidth={30}
      />
    </Modal>
  )
}

export default TestDarkRoom
