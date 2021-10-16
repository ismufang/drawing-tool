import React, { useLayoutEffect, useCallback, useState, useMemo } from 'react'
import { useFabric } from './hooks'
import { DrawBar, Header, Content } from './components'
import { getMapFileFromLocal } from './utils/common'
import MainLayout from './layouts/MainLayout'
import { canvasId } from './components/Content'

export const ImgDefaultUrl = require('../assets/imgs/bgImg.jpeg')

const IndexPage: React.FC<any> = () => {
  const fabricControl = useFabric()
  const { initCanvas } = fabricControl
  const [loading, setLoading] = useState(true)

  const contextValue = useMemo(() => {
    return {
      ...fabricControl,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const init = useCallback(() => {
    const { imageUrl: bgImg = ImgDefaultUrl } = getMapFileFromLocal()
    initCanvas(canvasId, { bgImg }, () => {
      setLoading(false)
    })
  }, [initCanvas])

  useLayoutEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <MainLayout
        Header={<Header />}
        Sider={<DrawBar />}
        Content={<Content loading={loading} />}
        context={contextValue}
      />
    </>
  )
}

export default IndexPage
