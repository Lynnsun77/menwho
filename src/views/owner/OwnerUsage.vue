<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">使用回写</h1>
        <div class="page-subtitle">标签下游使用情况、消费团队分布、业务效果</div>
      </div>
      <el-select v-model="selectedTagId" style="width:220px" placeholder="选择标签" filterable>
        <el-option v-for="t in myTags" :key="t.id" :label="t.name" :value="t.id" />
      </el-select>
    </div>

    <div v-if="tag" class="grid-2">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">30 天调用趋势</div>
          <div class="chart-hint">调用量 · 授权用户数</div>
        </div>
        <EChart :option="trendOption" height="280px" />
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">消费团队 TOP 6</div>
        </div>
        <EChart :option="teamOption" height="280px" />
      </div>
    </div>

    <div class="grid-2" v-if="tag">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">消费场景占比</div>
        </div>
        <EChart :option="sceneOption" height="260px" />
      </div>
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">下游效果回写</div>
        </div>
        <el-table :data="effectData" size="small">
          <el-table-column label="业务方" prop="team" />
          <el-table-column label="场景" prop="scene" />
          <el-table-column label="A/B 提升" width="120" align="right">
            <template #default="{ row }">
              <span style="color:#10b981;font-weight:600">+{{ row.lift }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="业务收益" prop="value" width="130" align="right" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useTagStore } from '@/store/tag.js'
import EChart from '@/components/EChart.vue'

const tagStore = useTagStore()
const myTags = computed(() => tagStore.tags.filter(t => ['ecom_dmp', 'ls_ldmp'].includes(t.sourceDomain)))
const selectedTagId = ref('')

watch(myTags, (list) => {
  if (!selectedTagId.value && list.length) selectedTagId.value = list[0].id
}, { immediate: true })

const tag = computed(() => tagStore.findTag(selectedTagId.value))

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0 },
  grid: { left: 40, right: 40, top: 20, bottom: 40 },
  xAxis: { type: 'category', data: tag.value?.callCount30dTrend.map((_, i) => `D-${29 - i}`), boundaryGap: false, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
  yAxis: [
    { type: 'value', name: '调用量', axisLabel: { color: '#6b7280' }, splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
    { type: 'value', name: '授权用户', axisLabel: { color: '#6b7280' }, splitLine: { show: false } }
  ],
  series: [
    { name: '调用量', type: 'line', smooth: true, data: tag.value?.callCount30dTrend, itemStyle: { color: '#2563eb' }, areaStyle: { color: 'rgba(37,99,235,0.15)' } },
    { name: '授权用户', type: 'bar', yAxisIndex: 1, data: tag.value?.callCount30dTrend.map(v => Math.round(v / 200)), itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }, barWidth: 8 }
  ]
}))

const teamOption = computed(() => {
  const teams = ['交易增长-算法组', '交易营销组', '推荐算法组', '数据分析组', '广告策略组', '本地生活组']
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 130, right: 30, top: 10, bottom: 20 },
    xAxis: { type: 'value', axisLabel: { color: '#6b7280' }, splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
    yAxis: { type: 'category', data: teams, axisLine: { show: false }, axisLabel: { color: '#374151' } },
    series: [{
      type: 'bar',
      data: teams.map((_, i) => Math.round(3000 + Math.random() * 8000 - i * 500)),
      barWidth: 12,
      itemStyle: { color: '#3b82f6', borderRadius: [0, 6, 6, 0] },
      label: { show: true, position: 'right', color: '#6b7280' }
    }]
  }
})

const sceneOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, icon: 'circle' },
  series: [{
    type: 'pie',
    radius: ['48%', '75%'],
    center: ['50%', '45%'],
    label: { show: false },
    itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 4 },
    data: [
      { name: '模型特征', value: 42, itemStyle: { color: '#2563eb' } },
      { name: '人群圈选', value: 28, itemStyle: { color: '#10b981' } },
      { name: '数据分析', value: 15, itemStyle: { color: '#f59e0b' } },
      { name: '推荐召回', value: 10, itemStyle: { color: '#8b5cf6' } },
      { name: '其他', value: 5, itemStyle: { color: '#94a3b8' } }
    ]
  }]
}))

const effectData = [
  { team: '交易增长-算法组', scene: '新客补贴', lift: 8.6, value: '¥ 210 万' },
  { team: '推荐算法组', scene: '本地推荐', lift: 4.2, value: 'CTR +4.2%' },
  { team: '广告策略组', scene: '广告定向', lift: 6.9, value: 'ROI +7%' },
  { team: '数据分析组', scene: 'Q3 流失专题', lift: 0, value: '分析报告' }
]
</script>

<style scoped>
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-hint { font-size: 12px; color: var(--text-tertiary); }
@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
}
</style>
