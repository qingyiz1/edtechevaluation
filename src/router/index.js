import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Registration from '@/components/Registration.vue'
import Profile from '@/components/Profile'
import Framework from "@/components/Framework";
import * as firebase from "firebase"

Vue.use(VueRouter)

const routes = [
    {
        path:'/registration',
        name:'Registration',
        component: Registration
    },
    {
        path:'/login',
        name: 'Login',
        component: Login
    },
    {
        path:'/profile',
        name:'Profile',
        component: Profile,
        meta:{requiresAuth: true}
    },
    {
        path:'/framework',
        name:'Framework',
        component: Framework,
        meta:{requiresAuth: true}
    },
]
const router = new VueRouter({
    mode:'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next)=>{
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = firebase.auth().currentUser;
    if(requiresAuth && !isAuthenticated){
        next("/login")
    }else{
        next()
    }
})


export default router