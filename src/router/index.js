import Vue from 'vue'
import VueRouter from 'vue-router'
import {auth} from "@/tools/firebaseConfig"
import Login from '@/components/Authentication/Login.vue'
import Registration from '@/components/Authentication/Registration.vue'
import Profile from '@/components/User/Profile'
import Framework from "@/components/Framework/Framework";
import Evaluations from "@/components/Evaluation/Evaluations";
import EditEva from "@/components/Evaluation/EditEva";
import DisplayEva from "@/components/Evaluation/DisplayEva";
import Reports from "@/components/Report/Reports";
import Framework_Template from "@/components/Framework/FrameworkTemplate";
import Userlist from "@/components/UserManagement/UserList";
import CreateUser from "@/components/UserManagement/CreateUser";
import Dashboard from "@/components/User/Dashboard";
import ViewReport from "@/components/Report/ViewReport";
import EditReport from "@/components/Report/EditReport";
Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:'Dashboard',
        component: Dashboard,
        meta:{requiresAuth: true}
    },
    {
        path:'/registration',
        name:'Registration',
        component: Registration,
    },
    {
        path:'/createuser',
        name:'CreateUser',
        component: CreateUser,
        meta:{requiresAuth: true}
    },
    {
        path:'/login',
        name: 'Login',
        component: Login
    },
    {
        path:'/profile/:uid',
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
        path:'/framework/:id',
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
        path:'/editEva/:evaId',
        name:'editEva',
        component:EditEva,
        meta:{requiresAuth: true}
    },
    {
        path:'/displayEva/:evaId',
        name:'displayEva',
        component:DisplayEva,
        meta:{requiresAuth: true}
    },
    {
        path:'/userlist',
        name:'Userlist',
        component: Userlist,
        meta:{requiresAuth: true}
    },
    {
        path:'/reports',
        name:'reports',
        component: Reports,
        meta:{requiresAuth: true}
    },
    {
        path:'/editReport/:reportId',
        name:'editReport',
        component: EditReport,
        meta:{requiresAuth: true}
    },
    {
        path:'/viewReport/:reportId',
        name:'ViewReport',
        component: ViewReport,
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