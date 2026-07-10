<template>
  <div class="page-container dashboard">
    <!-- Hero -->
    <div class="hero section-card">
      <div class="hero__left">
        <div class="hero__greeting">
          <span class="hero__hi">Hi，{{ appStore.currentUser.name }}</span>
          <span class="hero__sub">当前身份：{{ currentRoleLabel }} · {{ appStore.currentUser.team }}</span>
        </div>
        <div class="hero__title">统一交易用户画像 · 画像集市门户</div>
        <div class="hero__desc">标签可发现 · 权限可申请 · 审批可路由 · 使用可审计 · Owner 可回看</div>
        <div class="hero__actions">
          <el-button type="primary" @click="$router.push('/market')">
            <el-icon><shop /></el-icon>&nbsp;去标签广场
          </el-button>
          <el-button plain @click="$router.push('/recommend')">
            <el-icon><magic-stick /></el-icon>&nbsp;智能推荐
          </el-button>
          <el-button plain @click="$router.push('/my-applications')">我的申请</el-button>
        </div>
      </div>
      <div class="hero__right">
        <div class="hero__meta">
          <div class="hero__meta-item">
            <div class="meta-value">{{ kpi.totalTags }}</div>
            <div class="meta-label">在架标签</div>
          </div>
          <div class="hero__meta-item">
            <div class="meta-value">{{ kpi.onlineDomains }}</div>
            <div class="meta-label">来源域</div>
          </div>
          <div class="hero__meta-item">
            <div class="meta-value">{{ kpi.activeConsumers }}</div>
            <div class="meta-label">活跃消费方</div>
          </div>
          <div class="hero__meta-item">
            <div class="meta-value">{{ kpi.metaComplete }}%</div>
            <div class="meta-label">元信息完整率</div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="kpi-grid" style="margin-top:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">本月申请单</div>
        <div class="kpi-card__value">{{ kpi.monthlyApplications }}</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>+12.4%</div>
        <div class="kpi-card__icon" style="background:#dbeafe;color:#2563eb"><el-icon><document /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">审批通过率</div>
        <div class="kpi-card__value">{{ kpi.approvalPassRate }}%</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>+2.1%</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><circle-check /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">平均审批时长</div>
        <div class="kpi-card__value">{{ kpi.avgApprovalHours }}h</div>
        <div class="kpi-card__delta negative"><el-icon><caret-bottom /></el-icon>-3.2h</div>
        <div class="kpi-card__icon" style="background:#fef3c7;color:#f59e0b"><el-icon><timer /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">无主标签</div>
        <div class="kpi-card__value">{{ kpi.orphanTags }}</div>
        <div class="kpi-card__delta negative"><el-icon><caret-top /></el-icon>+1</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><question-filled /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">今日异常事件</div>
        <div class="kpi-card__value">{{ kpi.anomaliesToday }}</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>关注中</div>
        <div class="kpi-card__icon" style="background:#ede9fe;color:#8b5cf6"><el-icon><warning /></el-icon></div>
      </div>
    </div>

    <!-- Charts row 1 -->
    <div class="grid-2" style="margin-top:16px">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">近 14 天申请趋势</div>
          <el-radio-group v-model="trendMode" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="approved">已通过</el-radio-button>
          </el-radio-group>
        </div>
        <EChart :option="trendOption" height="280px" />
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">统一分级分布</div>
          <span class="section-hint">依据 unified_level 汇总</span>
        </div>
        <EChart :option="levelOption" height="280px" />
      </div>
    </div>

    <!-- Charts row 2 -->
    <div class="grid-2" style="margin-top:16px">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">来源域标签数量</div>
        </div>
        <EChart :option="domainOption" height="280px" />
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">热门标签 TOP 8</div>
          <router-link to="/market">
            <el-button size="small" text type="primary">查看更多 ›</el-button>
          </router-link>
        </div>
        <el-table :data="hotList" size="small" :show-header="true" stripe>
          <el-table-column label="#" type="index" width="42" />
          <el-table-column label="标签" min-width="130">
            <template #default="{ row }">
              <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="来源域" prop="sourceDomainLabel" width="110" />
          <el-table-column label="分级" width="80">
            <template #default="{ row }">
              <LevelTag :level="row.unifiedLevel" />
            </template>
          </el-table-column>
          <el-table-column label="7 日调用量" width="110" align="right">
            <template #default="{ row }">
              {{ row.callCount7d.toLocaleString() }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Bottom entries -->
    <div class="grid-3" style="margin-top:16px">
      <div class="entry-card" @click="$router.push('/owner/pending')">
        <el-icon class="entry-card__icon" style="color:#f59e0b"><bell /></el-icon>
        <div class="entry-card__title">Owner 待审批</div>
        <div class="entry-card__desc">4 条待处理 · 1 条即将超时</div>
      </div>
      <div class="entry-card" @click="$router.push('/admin/anomaly')">
        <el-icon class="entry-card__icon" style="color:#ef4444"><alarm-clock /></el-icon>
        <div class="entry-card__title">异常事件</div>
        <div class="entry-card__desc">今日 6 起 · 高优 3 起</div>
      </div>
      <div class="entry-card" @click="$router.push('/admin/orphan')">
        <el-icon class="entry-card__icon" style="color:#6366f1"><question-filled /></el-icon>
        <div class="entry-card__title">无主标签治理</div>
        <div class="entry-card__desc">{{ kpi.orphanTags }} 条待认领</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import EChart from '@/components/EChart.vue'
import LevelTag from '@/components/LevelTag.vue'
import { useAppStore } from '@/store/app.js'
import {
  DASHBOARD_KPI, APPLICATION_TREND, hotTags, levelDistribution, domainDistribution
} from '@/mock/data.js'
import { UNIFIED_LEVELS, SOURCE_DOMAINS, ROLES } from '@/mock/constants.js'

const appStore = useAppStore()

const kpi = DASHBOARD_KPI
const hotList = hotTags(8)
const trendMode = ref('all')

const currentRoleLabel = computed(() => ROLES.find(r => r.key === appStore.currentRole)?.label || '消费方')

const trendOption = computed(() => {
  const isAll = trendMode.value === 'all'
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: isAll ? ['提交', '通过', '拒绝'] : ['通过'], bottom: 0 },
    grid: { left: 30, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: APPLICATION_TREND.map(d => d.date),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    series: isAll ? [
      { name: '提交', type: 'line', smooth: true, data: APPLICATION_TREND.map(d => d.submitted), itemStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59,130,246,0.12)' } },
      { name: '通过', type: 'line', smooth: true, data: APPLICATION_TREND.map(d => d.approved), itemStyle: { color: '#10b981' } },
      { name: '拒绝', type: 'line', smooth: true, data: APPLICATION_TREND.map(d => d.rejected), itemStyle: { color: '#ef4444' } }
    ] : [
      { name: '通过', type: 'line', smooth: true, data: APPLICATION_TREND.map(d => d.approved), itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } }
    ]
  }
})

const levelOption = computed(() => {
  const dist = levelDistribution()
  const palette = { open: '#10b981', general: '#3b82f6', controlled: '#f59e0b', sensitive: '#ef4444' }
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, icon: 'circle' },
    series: [{
      name: '分级',
      type: 'pie',
      radius: ['55%', '80%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: Object.keys(dist).map(k => ({
        name: UNIFIED_LEVELS[k].label,
        value: dist[k],
        itemStyle: { color: palette[k] }
      }))
    }]
  }
})

const domainOption = computed(() => {
  const dist = domainDistribution()
  const names = Object.keys(dist)
  const values = names.map(n => dist[n])
  const colors = names.map(n => SOURCE_DOMAINS.find(d => d.label === n)?.color || '#3b82f6')
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 90, right: 30, top: 10, bottom: 20 },
    xAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
    yAxis: { type: 'category', data: names, axisLine: { show: false }, axisLabel: { color: '#374151' } },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors[i], borderRadius: [0, 6, 6, 0] } })),
      barWidth: 14,
      label: { show: true, position: 'right', color: '#6b7280' }
    }]
  }
})
</script>

<style scoped>
.dashboard { display: block; }

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(120deg, #1e293b 0%, #2563eb 100%);
  color: #fff;
  border: none;
  padding: 24px 28px;
  gap: 24px;
  flex-wrap: wrap;
}

.hero__greeting {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}
.hero__hi { font-size: 15px; opacity: 0.85; }
.hero__sub { font-size: 12px; opacity: 0.65; }
.hero__title { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
.hero__desc { font-size: 13px; opacity: 0.7; margin-bottom: 16px; }
.hero__actions { display: flex; gap: 10px; flex-wrap: wrap; }
.hero__actions :deep(.el-button) {
  --el-button-bg-color: rgba(255,255,255,0.14);
  --el-button-border-color: rgba(255,255,255,0.25);
  --el-button-text-color: #fff;
  --el-button-hover-bg-color: rgba(255,255,255,0.24);
  --el-button-hover-border-color: rgba(255,255,255,0.3);
  --el-button-hover-text-color: #fff;
}
.hero__actions :deep(.el-button--primary) {
  --el-button-bg-color: #fff;
  --el-button-text-color: #2563eb;
  --el-button-hover-bg-color: #f1f5f9;
  --el-button-hover-text-color: #1d4ed8;
}

.hero__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(90px, 1fr));
  gap: 24px;
}
.hero__meta-item { text-align: center; }
.meta-value { font-size: 24px; font-weight: 600; }
.meta-label { font-size: 12px; opacity: 0.7; margin-top: 2px; }

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.entry-card {
  background: #fff;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 18px 20px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.entry-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}
.entry-card__icon { font-size: 22px; }
.entry-card__title { font-weight: 600; font-size: 15px; color: var(--text-primary); }
.entry-card__desc { color: var(--text-tertiary); font-size: 12px; }

.section-hint { font-size: 12px; color: var(--text-tertiary); }

.link { color: var(--color-primary); }

@media (max-width: 1024px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .hero__meta { grid-template-columns: repeat(2, 1fr); }
}
</style>
