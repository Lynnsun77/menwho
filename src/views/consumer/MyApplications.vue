<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">我的申请</h1>
        <div class="page-subtitle">查看历史申请单、审批进度、拒绝原因</div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="section-title">申请列表</div>
        <el-select v-model="statusFilter" placeholder="全部" clearable size="small" style="width:120px">
          <el-option label="全部" value="" />
          <el-option label="审批中" value="pending" />
          <el-option label="已授权" value="granted" />
          <el-option label="被拒绝" value="rejected" />
        </el-select>
      </div>

      <el-table :data="filtered" size="small" @row-click="onRow" style="cursor:pointer">
        <el-table-column label="申请单号" prop="id" width="180" />
        <el-table-column label="标签" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="n in row.tagNames.slice(0, 2)" :key="n" size="small" effect="plain" style="margin-right:4px">{{ n }}</el-tag>
            <span v-if="row.tagNames.length > 2" class="more-count">+{{ row.tagNames.length - 2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最高分级" width="110">
          <template #default="{ row }"><LevelTag :level="row.highestLevel" /></template>
        </el-table-column>
        <el-table-column label="场景" prop="scene" width="110" />
        <el-table-column label="有效期" width="90">
          <template #default="{ row }">{{ row.duration }}天</template>
        </el-table-column>
        <el-table-column label="提交时间" prop="submitAt" width="160" />
        <el-table-column label="当前节点" prop="currentNode" width="130" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small" effect="light">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" size="520px" :title="`申请单详情 ${current?.id}`">
      <template v-if="current">
        <el-descriptions :column="1" border size="default">
          <el-descriptions-item label="申请人">{{ current.applicant }} · {{ current.team }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag v-for="n in current.tagNames" :key="n" size="small" effect="plain" style="margin-right:4px">{{ n }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最高分级"><LevelTag :level="current.highestLevel" /></el-descriptions-item>
          <el-descriptions-item label="使用场景">{{ current.scene }}</el-descriptions-item>
          <el-descriptions-item label="调用方式">{{ current.method }}</el-descriptions-item>
          <el-descriptions-item label="有效期">{{ current.duration }} 天</el-descriptions-item>
          <el-descriptions-item label="使用理由">{{ current.purpose }}</el-descriptions-item>
          <el-descriptions-item label="审批人">{{ current.approver }}</el-descriptions-item>
          <el-descriptions-item v-if="current.rejectReason" label="拒绝原因">
            <span style="color:#ef4444">{{ current.rejectReason }}</span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="section-title" style="margin-top:20px">审批时间线</div>
        <el-steps direction="vertical" :active="activeStep(current)" style="margin-top:12px">
          <el-step
            v-for="(node, i) in current.timeline"
            :key="i"
            :title="node.node"
            :description="`${node.time || '待处理'} · ${node.operator}`"
            :status="stepStatus(node.status)"
          />
        </el-steps>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'

const tagStore = useTagStore()
const statusFilter = ref('')
const drawerVisible = ref(false)
const current = ref(null)

const filtered = computed(() => {
  if (!statusFilter.value) return tagStore.applications
  return tagStore.applications.filter(a => a.status === statusFilter.value)
})

function statusLabel(s) {
  return { pending: '审批中', granted: '已授权', rejected: '被拒绝' }[s] || s
}
function statusTagType(s) {
  return { pending: 'warning', granted: 'success', rejected: 'danger' }[s] || 'info'
}
function onRow(row) {
  current.value = row
  drawerVisible.value = true
}
function activeStep(app) {
  const idx = app.timeline.findIndex(n => n.status === 'active')
  return idx >= 0 ? idx : app.timeline.length
}
function stepStatus(s) {
  if (s === 'done') return 'success'
  if (s === 'active') return 'process'
  return 'wait'
}
</script>

<style scoped>
.more-count { color: var(--text-tertiary); font-size: 12px; }
</style>
