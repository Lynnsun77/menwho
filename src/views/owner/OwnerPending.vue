<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">待审批</h1>
        <div class="page-subtitle">Owner 视角：处理来自各消费方的标签权限申请</div>
      </div>
      <div class="header-actions">
        <el-tag type="warning" effect="light">
          <el-icon><timer /></el-icon>&nbsp;1 条即将超时（&lt;24h）
        </el-tag>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">待处理</div>
        <div class="kpi-card__value">{{ list.length }}</div>
        <div class="kpi-card__icon" style="background:#fef3c7;color:#f59e0b"><el-icon><bell /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">近 7 天通过</div>
        <div class="kpi-card__value">28</div>
        <div class="kpi-card__delta"><el-icon><caret-top /></el-icon>+15%</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><circle-check /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">平均耗时</div>
        <div class="kpi-card__value">12.6h</div>
        <div class="kpi-card__icon" style="background:#dbeafe;color:#2563eb"><el-icon><clock /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">SLA 达成率</div>
        <div class="kpi-card__value">96.4%</div>
        <div class="kpi-card__icon" style="background:#ede9fe;color:#8b5cf6"><el-icon><data-analysis /></el-icon></div>
      </div>
    </div>

    <div class="section-card">
      <el-table :data="list" size="default">
        <el-table-column label="申请单" prop="id" width="180" />
        <el-table-column label="申请人" width="140">
          <template #default="{ row }">
            <div>{{ row.applicant }}</div>
            <div class="team-tag">{{ row.team }}</div>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="180">
          <template #default="{ row }">
            <el-tag v-for="t in row.tags" :key="t" size="small" effect="plain" style="margin-right:4px">{{ t }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最高分级" width="100">
          <template #default="{ row }"><LevelTag :level="row.highestLevel" /></template>
        </el-table-column>
        <el-table-column label="场景" prop="scene" width="110" />
        <el-table-column label="用途" prop="purpose" min-width="200" show-overflow-tooltip />
        <el-table-column label="申请时长" width="100" align="center">
          <template #default="{ row }">{{ row.duration }} 天</template>
        </el-table-column>
        <el-table-column label="SLA 剩余" width="110" align="center">
          <template #default="{ row }">
            <span :class="row.risk === '即将超时' ? 'sla-warning' : 'sla-ok'">{{ row.slaLeft }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="onApprove(row)">通过</el-button>
            <el-button size="small" type="danger" plain @click="onReject(row)">拒绝</el-button>
            <el-button size="small" text type="primary" @click="onView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" title="申请详情" size="520px">
      <template v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="申请单号">{{ current.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ current.applicant }} · {{ current.team }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag v-for="t in current.tags" :key="t" size="small" effect="plain" style="margin-right:4px">{{ t }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最高分级"><LevelTag :level="current.highestLevel" /></el-descriptions-item>
          <el-descriptions-item label="使用场景">{{ current.scene }}</el-descriptions-item>
          <el-descriptions-item label="使用理由">{{ current.purpose }}</el-descriptions-item>
          <el-descriptions-item label="申请时长">{{ current.duration }} 天</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ current.submitAt }}</el-descriptions-item>
        </el-descriptions>

        <div class="risk-notice" style="margin-top:16px">
          <el-icon><warning /></el-icon>
          <div>
            <div class="risk-notice__title">Owner 复核建议</div>
            <div class="risk-notice__body">
              该申请为 <b>受控级</b>，请重点核对：<br>
              1. 使用场景是否与授权范围匹配<br>
              2. 有效期是否符合最小必要原则<br>
              3. 是否已存在同类替代标签
            </div>
          </div>
        </div>

        <div class="drawer-actions">
          <el-button type="primary" @click="onApprove(current)">通过</el-button>
          <el-button type="danger" plain @click="onReject(current)">拒绝</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LevelTag from '@/components/LevelTag.vue'
import { OWNER_PENDING } from '@/mock/data.js'

const list = ref(OWNER_PENDING.map(x => ({ ...x })))
const drawerVisible = ref(false)
const current = ref(null)

function onView(row) {
  current.value = row
  drawerVisible.value = true
}
function onApprove(row) {
  ElMessageBox.confirm(`确认通过「${row.id}」的申请？`, '审批通过', { type: 'success' })
    .then(() => {
      list.value = list.value.filter(x => x.id !== row.id)
      drawerVisible.value = false
      ElMessage.success('已通过，ACL 将在 5 分钟内生效')
    })
    .catch(() => {})
}
function onReject(row) {
  ElMessageBox.prompt('请输入拒绝原因（用户可见）', '拒绝申请', {
    inputPlaceholder: '如：使用场景与授权范围不符，请重新提交'
  }).then(({ value }) => {
    list.value = list.value.filter(x => x.id !== row.id)
    drawerVisible.value = false
    ElMessage.success(`已拒绝：${value || '-'}`)
  }).catch(() => {})
}
</script>

<style scoped>
.team-tag { color: var(--text-tertiary); font-size: 12px; margin-top: 2px; }
.sla-warning { color: var(--color-danger); font-weight: 600; }
.sla-ok { color: var(--text-secondary); }
.risk-notice {
  display: flex;
  gap: 10px;
  background: #fef3c7;
  border-radius: 8px;
  padding: 12px 14px;
  color: #92400e;
}
.risk-notice__title { font-weight: 600; margin-bottom: 4px; }
.risk-notice__body { font-size: 13px; line-height: 1.6; }
.drawer-actions { margin-top: 20px; display: flex; gap: 8px; }
.header-actions { display: flex; gap: 8px; }
</style>
