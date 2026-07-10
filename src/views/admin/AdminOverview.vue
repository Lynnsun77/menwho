<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">全域接入总览</h1>
        <div class="page-subtitle">监控标签接入情况、元信息完整率、分级分布、风险资产</div>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">在架标签总数</div>
        <div class="kpi-card__value">{{ kpi.totalTags }}</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>+8 本周</div>
        <div class="kpi-card__icon" style="background:#dbeafe;color:#2563eb"><el-icon><price-tag /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">元信息完整率</div>
        <div class="kpi-card__value">{{ kpi.metaComplete }}%</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>+1.2%</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><circle-check /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">分级覆盖率</div>
        <div class="kpi-card__value">100%</div>
        <div class="kpi-card__icon" style="background:#ede9fe;color:#8b5cf6"><el-icon><collection /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">无主标签</div>
        <div class="kpi-card__value">{{ kpi.orphanTags }}</div>
        <div class="kpi-card__delta negative"><el-icon><caret-top /></el-icon>+1</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><question-filled /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">审批超时数</div>
        <div class="kpi-card__value">2</div>
        <div class="kpi-card__icon" style="background:#fef3c7;color:#f59e0b"><el-icon><timer /></el-icon></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">各来源域接入情况</div>
        </div>
        <EChart :option="domainOption" height="300px" />
      </div>
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">四档分级分布</div>
        </div>
        <EChart :option="levelOption" height="300px" />
      </div>
    </div>

    <div class="section-card" style="margin-top:16px">
      <div class="section-header">
        <div class="section-title">高敏标签清单</div>
        <span class="section-hint">高敏标签必须回到源头合规审批，禁止明文导出</span>
      </div>
      <el-table :data="sensitiveList" size="small" max-height="400">
        <el-table-column label="标签" min-width="160">
          <template #default="{ row }">
            <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="来源域" prop="sourceDomainLabel" width="120" />
        <el-table-column label="Owner" prop="owner" width="120" />
        <el-table-column label="授权用户" prop="grantedUsers" width="100" align="right" />
        <el-table-column label="7日调用量" width="120" align="right">
          <template #default="{ row }">{{ row.callCount7d.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="$router.push(`/market/${row.id}`)">详情</el-button>
            <el-button size="small" text type="warning">合规复核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EChart from '@/components/EChart.vue'
import { useTagStore } from '@/store/tag.js'
import { DASHBOARD_KPI, levelDistribution, domainDistribution } from '@/mock/data.js'
import { SOURCE_DOMAINS, UNIFIED_LEVELS } from '@/mock/constants.js'

const tagStore = useTagStore()
const kpi = DASHBOARD_KPI

const sensitiveList = computed(() => tagStore.tags.filter(t => t.unifiedLevel === 'sensitive'))

const domainOption = computed(() => {
  const dist = domainDistribution()
  const names = Object.keys(dist)
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: ['标签数', '完整率(%)'] },
    grid: { left: 40, right: 40, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: names, axisLabel: { color: '#6b7280', interval: 0, rotate: 20 } },
    yAxis: [
      { type: 'value', name: '标签数', splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
      { type: 'value', name: '完整率(%)', max: 100, splitLine: { show: false } }
    ],
    series: [
      { name: '标签数', type: 'bar', data: names.map(n => dist[n]), barWidth: 20, itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] } },
      { name: '完整率(%)', type: 'line', yAxisIndex: 1, smooth: true, data: names.map(() => 90 + Math.round(Math.random() * 10)), itemStyle: { color: '#f59e0b' } }
    ]
  }
})

const levelOption = computed(() => {
  const dist = levelDistribution()
  const palette = { open: '#10b981', general: '#3b82f6', controlled: '#f59e0b', sensitive: '#ef4444' }
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)' },
    legend: { bottom: 0, icon: 'circle' },
    series: [{
      type: 'pie',
      radius: ['48%', '76%'],
      center: ['50%', '45%'],
      label: { show: true, formatter: '{b}\n{c}', color: '#374151' },
      itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 4 },
      data: Object.keys(dist).map(k => ({
        name: UNIFIED_LEVELS[k].label,
        value: dist[k],
        itemStyle: { color: palette[k] }
      }))
    }]
  }
})
</script>

<style scoped>
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.section-hint { font-size: 12px; color: var(--text-tertiary); }
.link { color: var(--color-primary); }
@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
}
</style>
