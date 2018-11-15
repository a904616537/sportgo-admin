import Login    from './views/Login.vue'
import NotFound from './views/404.vue'
import Home     from './views/Home.vue'
import Main     from './views/Main.vue'
import Table    from './views/nav1/Table.vue'
import Admin    from './views/nav1/admin.vue'
import Banner   from './views/nav1/banner.vue'
import Form     from './views/nav1/Form.vue'
import Product  from './views/nav1/product.vue'
import Course  from './views/nav1/course.vue'
import Order    from './views/nav1/order.vue'

let routes = [
    {
        path      : '/login',
        component : Login,
        name      : '',
        hidden    : true
    },
    {
        path      : '/404',
        component : NotFound,
        name      : '',
        hidden    : true
    },
    //{ path: '/main', component: Main },
    {
        path      : '/',
        component : Home,
        name      : 'User',
        iconCls   : 'fa fa-address-card',//图标样式class
        leaf      : true,
        children  : [
            { path: '/', component: Table, name: 'Wechat Users' }
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Banner',
        iconCls   : 'fa fa-unlock-alt',//图标样式class
        leaf      : true,
        children  : [
            { path: '/banner', component: Banner, name: 'Banner' }
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Admin',
        iconCls   : 'fa fa-unlock-alt',//图标样式class
        leaf      : true,
        children  : [
            { path: '/admin', component: Admin, name: 'Admin' }
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Course',
        iconCls   : 'fa fa-fighter-jet',
        leaf      : true,
        children  : [
            { path: '/course', component: Course, name: 'Course' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;