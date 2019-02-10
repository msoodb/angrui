<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
        <el-menu-item index="1" route="/dashboard">Dashboard</el-menu-item>
        <el-submenu index="2">
          <template slot="title">Data</template>
          <el-menu-item index="2-1" route="/aggrigators">Aggrigators</el-menu-item>
          <el-menu-item index="2-2" route="/content_providers">ContentProviders</el-menu-item>
          <el-menu-item index="2-3" route="/products">Products</el-menu-item>
          <el-menu-item index="2-4" route="/users">Users</el-menu-item>
        </el-submenu>
        </el-menu>
      <div class="line"></div>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="d-md-down-none">
          <i class="icon-bell"></i>
          <b-badge pill variant="danger">5</b-badge>
        </b-nav-item>
        <b-nav-item class="d-md-down-none">
          <i class="icon-list"></i>
        </b-nav-item>
        <b-nav-item class="d-md-down-none">
          <i class="icon-location-pin"></i>
        </b-nav-item>
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <AsideToggler class="d-none d-lg-block" />
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <div class="container-full">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed>
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://coreui.io">AngrUI</a>
        <span class="ml-1">&copy; 2018 creativeLabs.</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="https://coreui.io">CoreUI for Vue</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultAside from './DefaultAside'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'

export default {
  name: 'DefaultContainer',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data () {
    return {
      nav: nav.items,
      activeIndex: '1',
    }
  },
  methods: {
  },
  mounted(){
    this.loading = true;
    if(typeof(Storage) != "undefined"){
      if(!localStorage.getItem("jwtoken") || localStorage.getItem("jwtoken") == "undefined" || localStorage.getItem("jwtoken") == ""){
        var self = this;
        self.$router.push('/pages/login');
      }
    }
    else {
      console.log("Your browser does not support Web Storage.");
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label )
    }
  }
}
</script>
<style scoped>
  .el-menu-demo {
    line-height:54px;
    height:54px;
    border-bottom: 0px solid #c8ced3;
  }
  .el-menu-item{
    line-height:54px;
    height:54px;
  }
  .el-menu--horizontal >>> .el-submenu .el-submenu__title{
    line-height:54px;
    height:54px;
  }
  .header-fixed .app-header{
    height:56px;
  }
</style>
