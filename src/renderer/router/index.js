import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main',
            redirect: { name: 'project' },
            component: require('@/views/main').default,
            children: [
                {
                    path: 'music',
                    name: 'music',
                    component: () => import('../views/music/index.vue')
                }, {
                    path: 'playlist-detail',
                    name: 'playlist-detail',
                    component: () => import('../views/playlist/detail')
                },
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
