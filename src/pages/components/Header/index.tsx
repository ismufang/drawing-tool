import type { DrawContextType } from '@/pages/type'
import { DrawContext } from '@/pages/layouts/MainLayout'
import { Divider } from 'antd'
import React, { useContext } from 'react'
import { MainTool, MapInfo, ToolBox } from '..'
import { store } from '@/pages/store'

const Header: React.FC = () => {
  const drawContext = useContext<DrawContextType>(DrawContext)
  return (
    <>
      {/* <MapInfo />
      <Divider style={{ margin: '15px 0' }} /> */}
      <MainTool context={drawContext} setState={store.setState} />
      <Divider style={{ margin: '15px 0' }} />
      <ToolBox />
    </>
  )
}

export default Header
