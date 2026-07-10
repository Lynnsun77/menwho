<template>
  <el-container class="main-layout">
    <!-- Sidebar -->
    <el-aside :width="collapsed ? '64px' : '232px'" class="sidebar">
      <div class="sidebar__logo" @click="$router.push('/dashboard')">
        <div class="logo-mark">Π</div>
        <span v-if="!collapsed" class="logo-text">画像集市</span>
      </div>

      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="collapsed"
          :collapse-transition="false"
          background-color="transparent"
          text-color="#cbd5e1"
          active-text-color="#ffffff"
          router
          unique-opened
        >
          <el-menu-item index="/dashboard">
            <el-icon><data-board /></el-icon>
            <template #title>工作台</template>
          </el-menu-item>

          <el-sub-menu index="consumer">
            <template #title>
              <el-icon><user /></el-icon>
              <span>消费方</span>
            </template>
            <el-menu-item
              v-for="r in consumerRoutes"
              :key="r.path"
              :index="`/${r.path}`"
            >
              <el-icon><component :is="r.meta.icon" /></el-icon>
              <template #title>{{ r.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="owner">
            <template #title>
              <el-icon><avatar /></el-icon>
              <span>供给方 / Owner</span>
            </template>
            <el-menu-item
              v-for="r in ownerRoutes"
              :key="r.path"
              :index="`/${r.path}`"
            >
              <el-icon><component :is="r.meta.icon" /></el-icon>
              <template #title>{{ r.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="admin">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>平台 / 合规</span>
            </template>
            <el-menu-item
              v-for="r in adminRoutes"
              :key="r.path"
              :index="`/${r.path}`"
            >
              <el-icon><component :is="r.meta.icon" /></el-icon>
              <template #title>{{ r.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>

      <div class="sidebar__footer" v-if="!collapsed">
        <div class="version">v0.1.0 · Demo</div>
      </div>
    </el-aside>

    <!-- Main -->
    <el-container>
      <el-header class="topbar" :height="'56px'">
        <div class="topbar__left">
          <el-icon class="collapse-btn" @click="appStore.toggleSidebar()">
            <fold v-if="!collapsed" />
            <expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path">
              {{ crumb.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="topbar__right">
          <el-input
            v-model="quickSearch"
            placeholder="搜索标签 / Owner / 场景"
            class="quick-search"
            :prefix-icon="Search"
            clearable
            @keyup.enter="onSearch"
          />
          <el-dropdown trigger="click" @command="onRoleCommand">
            <span class="role-chip">
              <el-icon><user-filled /></el-icon>
              <span class="role-chip__label">{{ currentRoleLabel }}</span>
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="r in roles" :key="r.key" :command="r.key" :disabled="r.key === appStore.currentRole">
                  <div class="role-item">
                    <div class="role-item__label">{{ r.label }}</div>
                    <div class="role-item__desc">{{ r.desc }}</div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-badge :value="3" class="notify-badge">
            <el-icon class="notify-icon"><bell /></el-icon>
          </el-badge>

          <div class="user-info">
            <el-avatar :size="32" style="background:#2563eb">
              {{ appStore.currentUser.avatar }}
            </el-avatar>
            <div class="user-info__meta">
              <div class="user-info__name">{{ appStore.currentUser.name }}</div>
              <div class="user-info__team">{{ appStore.currentUser.team }}</div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/app.js'
import { ROLES } from '@/mock/constants.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const { collapsed } = storeToRefs(appStore)

const quickSearch = ref('')
const roles = ROLES

const allRoutes = computed(() => router.options.routes[0].children)
const consumerRoutes = computed(() => allRoutes.value.filter(r => r.meta?.group === 'consumer' && !r.meta.hidden))
const ownerRoutes = computed(() => allRoutes.value.filter(r => r.meta?.group === 'owner' && !r.meta.hidden))
const adminRoutes = computed(() => allRoutes.value.filter(r => r.meta?.group === 'admin' && !r.meta.hidden))

const currentRoleLabel = computed(() => roles.find(r => r.key === appStore.currentRole)?.label || '消费方')

const activeMenu = computed(() => route.path)

const breadcrumbs = computed(() => {
  const list = []
  const groupMap = { consumer: '消费方', owner: '供给方 / Owner', admin: '平台 / 合规' }
  const meta = route.meta
  if (meta?.group) list.push({ path: '', title: groupMap[meta.group] })
  if (meta?.title) list.push({ path: route.path, title: meta.title })
  return list
})

function onRoleCommand(role) {
  appStore.setRole(role)
  // 角色切换后自动跳转到对应默认页
  const roleHome = {
    consumer: '/market',
    owner: '/owner/pending',
    admin: '/admin/overview'
  }
  router.push(roleHome[role] || '/dashboard')
}

function onSearch() {
  if (quickSearch.value.trim()) {
    router.push({ path: '/market', query: { q: quickSearch.value.trim() } })
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar__logo {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: serif;
  font-size: 18px;
}

.logo-text {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.sidebar :deep(.el-menu) {
  border-right: none;
}

.sidebar :deep(.el-menu-item),
.sidebar :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin: 2px 8px;
  border-radius: 8px;
}

.sidebar :deep(.el-menu-item:hover),
.sidebar :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.06) !important;
}

.sidebar :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.28), rgba(59, 130, 246, 0.06)) !important;
  color: #fff !important;
  border-left: 3px solid #3b82f6;
  padding-left: 17px !important;
}

.sidebar__footer {
  padding: 12px 18px;
  color: #64748b;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.topbar {
  background: #fff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
}

.collapse-btn:hover { color: var(--color-primary); }

.topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-search {
  width: 260px;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: filter 0.15s;
}

.role-chip:hover { filter: brightness(0.96); }

.role-item {
  display: flex;
  flex-direction: column;
}
.role-item__label { font-size: 13px; font-weight: 500; }
.role-item__desc { font-size: 12px; color: var(--text-tertiary); }

.notify-icon {
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
}

.notify-badge :deep(.el-badge__content) {
  transform: translate(0, -50%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info__meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-info__name { font-size: 13px; font-weight: 500; }
.user-info__team { font-size: 11px; color: var(--text-tertiary); }

.main {
  background: var(--bg-page);
  padding: 0;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .quick-search { width: 160px; }
  .user-info__meta { display: none; }
}

@media (max-width: 640px) {
  .quick-search { display: none; }
  .role-chip__label { display: none; }
}
</style>
