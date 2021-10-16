import { defineConfig } from 'umi'

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
    { path: '/test', component: '@/pages/Test', exact: true },
  ],
})
