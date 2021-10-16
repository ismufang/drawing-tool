import type { DrawContextType } from '../../type'
import type { fabric } from 'fabric'
import type { FabricObject } from '../../type'
import Iconfont from '@/components/Iconfont'
import { Button, Modal, Space } from 'antd'
import React, { useCallback, useState } from 'react'
import { DrawActionEnum, DrawActionMap } from '../../constant'
import { store } from '@/pages/store'
import { ImgCropper } from '../index'
import { observer } from 'mobx-react'
import { setBgImg } from '@/pages/utils/canvasUtils'
import { openSelect } from '../../utils/canvasUtils'
import { generateImgPolygon } from '@/pages/utils/shapeUtils'

const MainTool: React.FC<{
  setState: any
  context: DrawContextType
}> = ({ setState, context }) => {
  const {
    handleClearCanvas,
    handleDownloadImg,
    handleSave,
    handleZoomRestore,
    zoomUtils,
  } = context
  const { bgImg } = store.getState()
  const [modalVisible, setModalVisible] = useState(false)
  const [imgCropperVisible, setImgCropperVisible] = useState(false)

  const showModal = useCallback((bool: boolean) => {
    setModalVisible(bool)
  }, [])

  const resolveSave = useCallback((type: string = 'Save') => {
    zoomUtils.restore()
    showModal(false)
    setState({
      drawType: null,
    })
    handleSave(type)
  }, [])

  const handleBtnTap = useCallback((key: DrawActionEnum) => {
    if (!store.canAction()) return
    switch (key) {
      case DrawActionEnum.SAVE:
        showModal(true)
        break
      case DrawActionEnum.DOWNLOAD:
        zoomUtils.restore()
        setTimeout(() => {
          handleDownloadImg()
        }, 500)
        break
      case DrawActionEnum.CLEAR:
        handleClearCanvas()
        break
      case DrawActionEnum.UNDO:
        break
      case DrawActionEnum.REDO:
        break
      default:
        break
    }
  }, [])

  const setBgImgVisible = useCallback(() => {
    const { bgImgVisible, bgImg, canvas } = store.getState()
    setBgImg(bgImgVisible ? null : bgImg, canvas as fabric.Canvas)
    setState({ bgImgVisible: !bgImgVisible })
  }, [setState])

  const showImgCropper = () => {
    if (!store.canAction()) return
    store.removeActionType()
    setImgCropperVisible(true)
  }

  const handleImgCropConfirm = useCallback((imgInfo) => {
    imgInfo &&
      generateImgPolygon(imgInfo, (img: FabricObject) => {
        const { canvas } = store.getState()
        openSelect()
        canvas.add(img).setActiveObject(img)
      })
    setImgCropperVisible(false)
  }, [])

  const handleImgCropCancel = useCallback(() => {
    setImgCropperVisible(false)
  }, [])

  return (
    <>
      <Space direction="horizontal">
        {[...DrawActionMap]
          .filter(([key, value]: any) => value.show)
          .map(([key, value]: any) => (
            <Button key={key} onClick={() => handleBtnTap(key)}>
              <Iconfont type={value.icon} />
              {value.name}
            </Button>
          ))}
        <Button onClick={setBgImgVisible}>
          <Iconfont type="icon-drawtupian" />
          背景图片显示/隐藏
        </Button>
        <Button onClick={handleZoomRestore}>归位</Button>
        <Button onClick={showImgCropper}>裁切</Button>
      </Space>
      <Modal
        visible={modalVisible}
        title={'提示'}
        onCancel={() => showModal(false)}
        footer={[
          <Button key="SaveAs" onClick={() => resolveSave('SaveAs')}>
            另存
          </Button>,
          <Button key="Save" type="primary" onClick={() => resolveSave('Save')}>
            覆盖
          </Button>,
        ]}
      >
        <p>请确认当前绘图操作</p>
      </Modal>
      <ImgCropper
        visible={imgCropperVisible}
        img={bgImg}
        onCancel={handleImgCropCancel}
        onConfirm={handleImgCropConfirm}
      />
    </>
  )
}

export default observer(MainTool)
