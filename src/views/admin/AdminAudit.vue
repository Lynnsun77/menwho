<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">审计日志</h1>
        <div class="page-subtitle">申请 / 审批 / 授权 / 调用 / 续期 / 回收 / 冻结全链路留痕</div>
      </div>
      <el-button type="primary" plain>
        <el-icon><download /></el-icon>&nbsp;导出 CSV
      </el-button>
    </div>

    <div class="section-card">
      <div class="filter-row">
        <el-input v-model="q" placeholder="搜索操作人 / 标签 / audit_id" :prefix-icon="Search" clearable style="width:280px" size="small" />
        <el-select v-model="action" clearable placeholder="行为" size="small" style="width:110px">
          <el-option v-for="a in actions" :key="a" :label="a" :value="a" />
        </el-select>
        <el-select v-model="level" clearable placeholder="分级" size="small" style="width:110px">
          <el-option v-for="l in levels" :key="l.key" :label="l.label" :value="l.key" />
        </el-select>
        <el-select v-model="result" clearable placeholder="结果" size="small" style="width:110px">
          <el-option label="成功" value="success" />
          <el-option label="拦截" value="blocked" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          size="small"
          style="width:240px"
        />
      </div>

      <el-table :data="paged" size="small" stripe style="margin-top:12px">
        <el-table-column label="audit_id" prop="id" width="130" />
        <el-table-column label="时间" prop="timestamp" width="160" />
        <el-table-column label="操作人" prop="operator" width="100" />
        <el-table-column label="行为" prop="action" width="80">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tagName" min-width="140" />
        <el-table-column label="来源域" prop="sourceDomain" width="110" />
        <el-table-column label="分级" width="90">
          <template #default="{ row }"><LevelTag :level="row.unifiedLevel" /></template>
        </el-table-column>
        <el-table-column label="场景" prop="scene" width="100" />
        <el-table-column label="结果" width="90">
          <template #default="{ row }">
            <el-tag :type="row.result === 'success' ? 'success' : 'danger'" size="small" effect="light">
              {{ row.result === 'success' ? '成功' : '拦截' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="原因" prop="reason" min-width="140" show-overflow-tooltip />
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="filtered.length"
          layout="prev, pager, next, jumper, ->, total"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import LevelTag from '@/components/LevelTag.vue'
import { AUDIT_LOGS } from '@/mock/data.js'
import { UNIFIED_LEVELS } from '@/mock/constants.js'

const q = ref('')
const action = ref('')
const level = ref('')
const result = ref('')
const dateRange = ref([])
const page = ref(1)
const pageSize = 20

const actions = [...new Set(AUDIT_LOGS.map(l => l.action))]
const levels = Object.values(UNIFIED_LEVELS)

const filtered = computed(() => {
  return AUDIT_LOGS.filter(l => {
    if (q.value) {
      const kw = q.value.toLowerCase()
      if (!(l.operator.toLowerCase().includes(kw) || l.tagName.toLowerCase().includes(kw) || l.id.toLowerCase().includes(kw))) return false
    }
    if (action.value && l.action !== action.value) return false
    if (level.value && l.unifiedLevel !== level.value) return false
    if (result.value && l.result !== result.value) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})
</script>

<style scoped>
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.pagination { margin-top: 14px; display: flex; justify-content: flex-end; }
</style>
