import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function preProcess(to, from, next){
    console.log('preProcess')
    next();
}

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main',
            redirect: { name: 'project' },
            component: require('@/views/main').default,
            children: [
                {
                    path: 'project',
                    name: 'project',
                    component: () => import('../views/project/index.vue')
                },
                {
                    path: 'report',
                    name: 'report',
                    component: () => import('../views/report/index.vue')
                },
                {
                    path: 'test',
                    name: 'test',
                    component: () => import('../views/test/index.vue')
                },
                {
                    path: 'setting',
                    name: 'setting',
                    beforeEnter:preProcess,
                    component: () => import('../views/setting/index.vue')
                },
            ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
