<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">合规报表</h1>
        <div class="page-subtitle">权限概览 · 安全事件 · 合规审计 · 使用影响力</div>
      </div>
    </div>

    <el-tabs v-model="tab" class="section-card" style="padding:8px 16px">
      <el-tab-pane label="权限概览周报" name="permission">
        <div class="report-grid">
          <div class="report-block">
            <div class="report-block__title">申请审批漏斗</div>
            <EChart :option="funnelOption" height="280px" />
          </div>
          <div class="report-block">
            <div class="report-block__title">审批时长分布</div>
            <EChart :option="durationOption" height="280px" />
          </div>
        </div>
        <el-descriptions :column="3" border style="margin-top:16px">
          <el-descriptions-item label="本周新增申请">1,247</el-descriptions-item>
          <el-descriptions-item label="通过率">87.6%</el-descriptions-item>
          <el-descriptions-item label="超时率">3.2%</el-descriptions-item>
          <el-descriptions-item label="平均审批时长">18.4h</el-descriptions-item>
          <el-descriptions-item label="自助审批占比">62%</el-descriptions-item>
          <el-descriptions-item label="Owner 审批占比">31%</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <el-tab-pane label="安全事件日报" name="security">
        <div class="report-block">
          <div class="report-block__title">安全事件趋势</div>
          <EChart :option="securityOption" height="300px" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="合规审计月报" name="compliance">
        <div class="report-block">
          <div class="report-block__title">高敏授权 / 无主标签 / 过期权限</div>
          <el-table :data="complianceRows" size="default">
            <el-table-column label="指标" prop="metric" />
            <el-table-column label="本月" prop="current" width="120" align="right" />
            <el-table-column label="上月" prop="last" width="120" align="right" />
            <el-table-column label="环比" width="120" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.delta > 0 ? '#ef4444' : '#10b981' }">
                  {{ row.delta > 0 ? '+' : '' }}{{ row.delta }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="目标" prop="target" width="130" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="使用影响力报表" name="impact">
        <div class="report-block">
          <div class="report-block__title">Owner 资产影响力 TOP 10</div>
          <EChart :option="impactOption" height="360px" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import EChart from '@/components/EChart.vue'

const tab = ref('permission')

const funnelOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'funnel',
    left: '10%', right: '10%',
    label: { position: 'inside', color: '#fff', formatter: '{b}: {c}' },
    data: [
      { value: 1247, name: '提交申请' },
      { value: 1180, name: '路由成功' },
      { value: 1092, name: '审批通过' },
      { value: 1080, name: 'ACL 生效' },
      { value: 1050, name: '实际调用' }
    ],
    itemStyle: { color: '#2563eb' }
  }]
}))

const durationOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category', data: ['<1h', '1-6h', '6-24h', '24-72h', '>72h'] },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
  series: [{
    type: 'bar', data: [612, 285, 210, 108, 32],
    barWidth: 32,
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#3b82f6' },
          { offset: 1, color: 'rgba(59,130,246,0.3)' }
        ]
      }
    }
  }]
}))

const securityOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0 },
  grid: { left: 40, right: 30, top: 20, bottom: 40 },
  xAxis: { type: 'category', data: Array.from({ length: 14 }, (_, i) => `${6 + Math.floor((i + 27) / 30)}/${((i + 27) % 30) + 1}`) },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
  series: [
    { name: '越权尝试', type: 'line', smooth: true, data: Array.from({ length: 14 }, () => Math.round(Math.random() * 8)), itemStyle: { color: '#ef4444' } },
    { name: '高频调用', type: 'line', smooth: true, data: Array.from({ length: 14 }, () => Math.round(2 + Math.random() * 10)), itemStyle: { color: '#f59e0b' } },
    { name: '批量导出', type: 'line', smooth: true, data: Array.from({ length: 14 }, () => Math.round(Math.random() * 5)), itemStyle: { color: '#8b5cf6' } }
  ]
}))

const complianceRows = [
  { metric: '高敏标签授权数', current: 128, last: 115, delta: 11.3, target: '≤ 150' },
  { metric: '无主标签数量', current: 3, last: 6, delta: -50, target: '≤ 3' },
  { metric: '过期未回收权限', current: 12, last: 20, delta: -40, target: '≤ 15' },
  { metric: '审批超时率', current: 3.2, last: 5.1, delta: -37.3, target: '≤ 5%' },
  { metric: '违规调用事件', current: 8, last: 12, delta: -33.3, target: '≤ 10' }
]

const impactOption = computed(() => {
  const owners = ['张伟', '李娜', '王芳', '陈昊', '孙浩', '周杰', '徐斌', '高远', '罗曼', '朱敏']
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: ['被调用次数(万)', '下游团队数'] },
    grid: { left: 60, right: 60, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: owners, axisLabel: { color: '#6b7280' } },
    yAxis: [
      { type: 'value', name: '调用量(万)', splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } } },
      { type: 'value', name: '下游团队', splitLine: { show: false } }
    ],
    series: [
      { name: '被调用次数(万)', type: 'bar', barWidth: 18, data: owners.map((_, i) => Math.round(15 + Math.random() * 60 - i * 3)), itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] } },
      { name: '下游团队数', type: 'line', yAxisIndex: 1, smooth: true, data: owners.map((_, i) => Math.round(6 + Math.random() * 12 - i * 0.5)), itemStyle: { color: '#f59e0b' } }
    ]
  }
})
</script>

<style scoped>
.report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.report-block { background: #f9fafb; border-radius: 10px; padding: 16px; }
.report-block__title { font-size: 14px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary); }
@media (max-width: 900px) {
  .report-grid { grid-template-columns: 1fr; }
}
</style>
