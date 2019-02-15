import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Widgets = () => import('@/views/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const Flags = () => import('@/views/icons/Flags')
const FontAwesome = () => import('@/views/icons/FontAwesome')
const SimpleLineIcons = () => import('@/views/icons/SimpleLineIcons')
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

// Entities
const Entities = () => import('@/views/entities/Entities')
const Entity = () => import('@/views/entities/Entity')

// SecurityRoles
const SecurityRoles = () => import('@/views/security_roles/SecurityRoles')
const SecurityRole = () => import('@/views/security_roles/SecurityRole')

// UsersSecurityRoles
const UsersSecurityRoles = () => import('@/views/users_security_roles/UsersSecurityRoles')
const UsersSecurityRole = () => import('@/views/users_security_roles/UsersSecurityRole')

// Privileges
const Privileges = () => import('@/views/privileges/Privileges')
const Privilege = () => import('@/views/privileges/Privilege')

// Products
const Products = () => import('@/views/products/Products')
const Product = () => import('@/views/products/Product')

// Operators
const MobileOperators = () => import('@/views/mobile_operators/MobileOperators')
const MobileOperator = () => import('@/views/mobile_operators/MobileOperator')

// Aggrigators
const Aggrigators = () => import('@/views/aggrigators/Aggrigators')
const Aggrigator = () => import('@/views/aggrigators/Aggrigator')

// Aggrigators
const ContentProviders = () => import('@/views/content_providers/ContentProviders')
const ContentProvider = () => import('@/views/content_providers/ContentProvider')


//Charts
//const Charts = () => import('@/views/charts')
const ProductChart = () => import('@/views/charts/ProductChart')
const BarExample = () => import('@/views/charts/BarExample')



Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: 'charts',
          name: 'Charts',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'product',
              meta: { label: 'Product Chart'},
              name: 'ProductChart',
              component: ProductChart,
            },
            {
              path: 'bar',
              meta: { label: 'Bar Example'},
              name: 'Bar',
              component: BarExample,
            },
          ]
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'users',
          meta: { label: 'Users'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Users,
            },
            {
              path: ':id',
              meta: { label: 'User Details'},
              name: 'User',
              component: User,
            },
          ]
        },
        {
          path: 'entities',
          meta: { label: 'Entities'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Entities,
            },
            {
              path: ':id',
              meta: { label: 'Entity Details'},
              name: 'Entity',
              component: Entity,
            },
          ]
        },
        {
          path: 'privileges',
          meta: { label: 'Privileges'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Privileges,
            },
            {
              path: ':id',
              meta: { label: 'Privilege Details'},
              name: 'Privilege',
              component: Privilege,
            },
          ]
        },
        {
          path: 'security_roles',
          meta: { label: 'SecurityRoles'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: SecurityRoles,
            },
            {
              path: ':id',
              meta: { label: 'SecurityRole Details'},
              name: 'SecurityRole',
              component: SecurityRole,
            },
          ]
        },
        {
          path: 'users_security_roles',
          meta: { label: 'UsersSecurityRoles'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: UsersSecurityRoles,
            },
            {
              path: ':id',
              meta: { label: 'UsersSecurityRole Details'},
              name: 'UsersSecurityRole',
              component: UsersSecurityRole,
            },
          ]
        },
        {
          path: 'products',
          meta: { label: 'Products'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Products,
            },
            {
              path: ':id',
              meta: { label: 'Product Details'},
              name: 'Product',
              component: Product,
            },
          ]
        },
        {
          path: 'mobile_operators',
          meta: { label: 'MobileOperators'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: MobileOperators,
            },
            {
              path: ':id',
              meta: { label: 'MobileOperator Details'},
              name: 'MobileOperator',
              component: MobileOperator,
            },
          ]
        },
        {
          path: 'aggrigators',
          meta: { label: 'Aggrigators'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Aggrigators,
            },
            {
              path: ':id',
              meta: { label: 'Aggrigator Details'},
              name: 'Aggrigator',
              component: Aggrigator,
            },
          ]
        },
        {
          path: 'content_providers',
          meta: { label: 'ContentProvider'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: ContentProviders,
            },
            {
              path: ':id',
              meta: { label: 'ContentProvider Details'},
              name: 'ContentProvider',
              component: ContentProvider,
            },
          ]
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
})
