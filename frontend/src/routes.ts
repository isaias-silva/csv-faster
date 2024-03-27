import { createRouter, createWebHistory } from 'vue-router'
import homePage from './views/homePage.vue'
import mmrChartVue from './views/mmrChart.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: homePage
},
{
    path: '/mmr',
    name: 'chartmmr',
    component: mmrChartVue
}
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router