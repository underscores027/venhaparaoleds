import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default route(function () {
  let historyType
  if (process.env.SERVER) {
    historyType = createMemoryHistory
  } else {
    historyType = process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory
  }
  const createHistory = historyType
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  return Router
})
