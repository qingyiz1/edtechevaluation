import Vue from 'vue'
import VueRouter from 'vue-router'
import {auth} from "@/tools/firebaseConfig"
import Login from '@/components/Login.vue'
import Registration from '@/components/Registration.vue'
import Profile from '@/components/Profile'
import Framework from "@/components/Framework";
import Evaluations from "@/components/Evaluations";
import EditEva from "@/components/EditEva";
import DisplayEva from "@/components/DisplayEva";
import Framework_Template from "@/components/FrameworkTemplate";
import Userlist from "@/components/UserList";


Vue.use(VueRouter)

const routes = [
    {
        path:'/registration',
        name:'Registration',
        component: Registration,
        meta:{requiresAuth: true}
    },
    {
        path:'/login',
        name: 'Login',
        component: Login
    },
    {
        path:'/profile/:nickname',
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
    {
        path:'/framework/new_framework',
        name:'Framework_Template',
        component: Framework_Template,
        meta:{requiresAuth: true}
    },
    {
        path:'/evaluation',
        name:'Evaluation',
        component:Evaluations,
        meta:{requiresAuth: true}
    },
    {
        path:'/EditEva/:evaId',
        name:'EditEva',
        component:EditEva,
        meta:{requiresAuth: true}
    },
    {
        path:'/DisplayEva/:evaId',
        name:'DisplayEva',
        component:DisplayEva,
        meta:{requiresAuth: true}
    },
    {
        path:'/userlist',
        name:'Userlist',
        component: Userlist,
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
    const isAuthenticated = auth.currentUser;
    if(requiresAuth && !isAuthenticated){
        next("/login")
    }else{
        next()
    }
})


export default router