import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Registration from '@/components/Registration.vue'

Vue.use(VueRouter)

const routes = [
    {
        path:'/Registration',
        name:'Registration',
        component: Registration
    },
    {
        path:'/login',
        name: 'Login',
        component: Login
    },
]
const router = new VueRouter({
    mode:'history',
    base: process.env.BASE_URL,
    routes
})

export default router