import './MainLayout.less'
import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

export const DrawContext = React.createContext<any>({
  // getDrawUtils: () => { },
  masterProps: {},
})

const MainLayout: React.FC<any> = ({ Header, Sider, Content, context }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{'绘图工具'}</title>
        <meta name="description" content={'绘图工具'} />
      </Helmet>
      <DrawContext.Provider value={context}>
        <div className="draw-container draw">
          {/* <div className="draw-title">Draw Tool</div> */}
          <div className="draw-header" id="draw-header">
            {Header}
          </div>
          <div className="draw-body">
            <div className="draw-body-sider">{Sider}</div>
            <div className="draw-body-board">{Content}</div>
          </div>
        </div>
      </DrawContext.Provider>
    </HelmetProvider>
  )
}

export default MainLayout
