<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">异常事件</h1>
        <div class="page-subtitle">高频调用、越权尝试、批量导出等异常事件监控</div>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">今日事件</div>
        <div class="kpi-card__value">6</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><warning /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">高优事件</div>
        <div class="kpi-card__value">3</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><warning /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">已处理</div>
        <div class="kpi-card__value">4</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><circle-check /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">待处理</div>
        <div class="kpi-card__value">2</div>
        <div class="kpi-card__icon" style="background:#fef3c7;color:#f59e0b"><el-icon><clock /></el-icon></div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="section-title">异常事件列表</div>
        <div class="filter-row">
          <el-select v-model="severity" placeholder="严重度" clearable size="small" style="width:110px">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
          <el-select v-model="typeFilter" placeholder="事件类型" clearable size="small" style="width:140px">
            <el-option v-for="t in types" :key="t" :label="t" :value="t" />
          </el-select>
        </div>
      </div>
      <el-table :data="filtered" size="small" stripe>
        <el-table-column label="事件 ID" prop="id" width="110" />
        <el-table-column label="类型" prop="type" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="严重度" width="90">
          <template #default="{ row }">
            <el-tag :type="severityType(row.severity)" size="small" effect="dark">{{ severityLabel(row.severity) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="相关标签" prop="tag" min-width="140" />
        <el-table-column label="分级" width="90">
          <template #default="{ row }"><LevelTag :level="row.level" /></template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" width="110" />
        <el-table-column label="团队" prop="team" width="140" />
        <el-table-column label="检测时间" prop="detectedAt" width="160" />
        <el-table-column label="处理状态" prop="status" width="120">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default>
            <el-button size="small" text type="primary">查看链路</el-button>
            <el-button size="small" text type="danger">冻结权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LevelTag from '@/components/LevelTag.vue'
import { ANOMALY_EVENTS } from '@/mock/data.js'

const severity = ref('')
const typeFilter = ref('')
const types = [...new Set(ANOMALY_EVENTS.map(x => x.type))]

const filtered = computed(() => {
  return ANOMALY_EVENTS.filter(e => {
    if (severity.value && e.severity !== severity.value) return false
    if (typeFilter.value && e.type !== typeFilter.value) return false
    return true
  })
})

function severityLabel(s) { return { high: '高', medium: '中', low: '低' }[s] || s }
function severityType(s) { return { high: 'danger', medium: 'warning', low: 'info' }[s] }
</script>

<style scoped>
.filter-row { display: flex; gap: 8px; }
</style>
