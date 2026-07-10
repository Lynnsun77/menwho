import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '工作台', icon: 'DataBoard' } },

      // 消费方视角
      { path: 'market', name: 'TagMarket', component: () => import('@/views/consumer/TagMarket.vue'), meta: { title: '标签广场', icon: 'Shop', group: 'consumer' } },
      { path: 'market/:id', name: 'TagDetail', component: () => import('@/views/consumer/TagDetail.vue'), meta: { title: '标签详情', hidden: true, group: 'consumer' } },
      { path: 'recommend', name: 'Recommend', component: () => import('@/views/consumer/Recommend.vue'), meta: { title: '智能推荐', icon: 'MagicStick', group: 'consumer' } },
      { path: 'my-permissions', name: 'MyPermissions', component: () => import('@/views/consumer/MyPermissions.vue'), meta: { title: '我的权限', icon: 'Key', group: 'consumer' } },
      { path: 'my-applications', name: 'MyApplications', component: () => import('@/views/consumer/MyApplications.vue'), meta: { title: '我的申请', icon: 'Document', group: 'consumer' } },

      // 供给方视角
      { path: 'owner/pending', name: 'OwnerPending', component: () => import('@/views/owner/OwnerPending.vue'), meta: { title: '待审批', icon: 'Bell', group: 'owner' } },
      { path: 'owner/my-tags', name: 'OwnerMyTags', component: () => import('@/views/owner/OwnerMyTags.vue'), meta: { title: '名下标签', icon: 'PriceTag', group: 'owner' } },
      { path: 'owner/usage', name: 'OwnerUsage', component: () => import('@/views/owner/OwnerUsage.vue'), meta: { title: '使用回写', icon: 'TrendCharts', group: 'owner' } },
      { path: 'owner/risk', name: 'OwnerRisk', component: () => import('@/views/owner/OwnerRisk.vue'), meta: { title: '风险提醒', icon: 'Warning', group: 'owner' } },
      { path: 'owner/onboard', name: 'OwnerOnboard', component: () => import('@/views/owner/OwnerOnboard.vue'), meta: { title: '标签接入', icon: 'Upload', group: 'owner' } },

      // 平台/合规
      { path: 'admin/overview', name: 'AdminOverview', component: () => import('@/views/admin/AdminOverview.vue'), meta: { title: '接入总览', icon: 'Grid', group: 'admin' } },
      { path: 'admin/orphan', name: 'AdminOrphan', component: () => import('@/views/admin/AdminOrphan.vue'), meta: { title: '无主标签', icon: 'QuestionFilled', group: 'admin' } },
      { path: 'admin/anomaly', name: 'AdminAnomaly', component: () => import('@/views/admin/AdminAnomaly.vue'), meta: { title: '异常事件', icon: 'AlarmClock', group: 'admin' } },
      { path: 'admin/audit', name: 'AdminAudit', component: () => import('@/views/admin/AdminAudit.vue'), meta: { title: '审计日志', icon: 'Files', group: 'admin' } },
      { path: 'admin/report', name: 'AdminReport', component: () => import('@/views/admin/AdminReport.vue'), meta: { title: '合规报表', icon: 'DocumentCopy', group: 'admin' } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
