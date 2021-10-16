import { defineConfig } from 'umi'

const devRoutes = process.env.NODE_ENV !== 'production' ? [{ path: '/test', component: '@/pages/Test', exact: true }] : []

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/', // 部署时非根目录需要配置路径前缀
  history: {
    type: 'hash',
  },
  routes: [
    { path: '/', component: '@/pages/index', exact: true },
    ...devRoutes
  ],
})
