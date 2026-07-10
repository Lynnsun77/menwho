<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">我的权限</h1>
        <div class="page-subtitle">查看已授权、即将到期、审批中的所有标签权限</div>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">已授权</div>
        <div class="kpi-card__value">{{ counts.granted }}</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><key /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">即将到期 (14 天内)</div>
        <div class="kpi-card__value">{{ counts.expiring }}</div>
        <div class="kpi-card__icon" style="background:#fef3c7;color:#f59e0b"><el-icon><timer /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">审批中</div>
        <div class="kpi-card__value">{{ counts.pending }}</div>
        <div class="kpi-card__icon" style="background:#dbeafe;color:#2563eb"><el-icon><clock /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">被拒绝 / 冻结</div>
        <div class="kpi-card__value">{{ counts.rejected + counts.frozen }}</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><circle-close /></el-icon></div>
      </div>
    </div>

    <div class="section-card" style="padding:8px 16px">
      <el-tabs v-model="tab">
        <el-tab-pane :label="`已授权 (${counts.granted})`" name="granted" />
        <el-tab-pane :label="`即将到期 (${counts.expiring})`" name="expiring" />
        <el-tab-pane :label="`审批中 (${counts.pending})`" name="pending" />
        <el-tab-pane :label="`被拒绝 (${counts.rejected})`" name="rejected" />
        <el-tab-pane :label="`已冻结 (${counts.frozen})`" name="frozen" />
      </el-tabs>

      <el-table :data="currentList" size="small" stripe>
        <el-table-column label="标签" min-width="200">
          <template #default="{ row }">
            <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
            <div class="row-desc">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="来源域" prop="sourceDomainLabel" width="120" />
        <el-table-column label="分级" width="90">
          <template #default="{ row }"><LevelTag :level="row.unifiedLevel" /></template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }"><PermissionStatus :status="row.permissionStatus" /></template>
        </el-table-column>
        <el-table-column label="有效期" width="140">
          <template #default="{ row }">
            <span v-if="row.validUntil">{{ row.validUntil }}</span>
            <span v-else style="color:#9ca3af">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="$router.push(`/market/${row.id}`)">查看</el-button>
            <el-button v-if="tab === 'granted' || tab === 'expiring'" size="small" type="primary" plain @click="onRenew(row)">续期</el-button>
            <el-button v-if="tab === 'rejected' || tab === 'expired'" size="small" type="primary" @click="onReapply(row)">重新申请</el-button>
            <el-button v-if="tab === 'frozen'" size="small" text type="warning">申诉</el-button>
            <el-button v-if="tab === 'pending'" size="small" text type="primary">催办</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <ApplyDialog ref="applyDialogRef" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'
import PermissionStatus from '@/components/PermissionStatus.vue'
import ApplyDialog from '@/components/ApplyDialog.vue'

const tagStore = useTagStore()
const applyDialogRef = ref(null)
const tab = ref('granted')

const lists = computed(() => ({
  granted: tagStore.tags.filter(t => t.permissionStatus === 'granted'),
  expiring: tagStore.tags.filter(t => t.permissionStatus === 'expiring'),
  pending: tagStore.tags.filter(t => t.permissionStatus === 'pending'),
  rejected: tagStore.tags.filter(t => t.permissionStatus === 'rejected'),
  frozen: tagStore.tags.filter(t => t.permissionStatus === 'frozen')
}))

const counts = computed(() => ({
  granted: lists.value.granted.length,
  expiring: lists.value.expiring.length,
  pending: lists.value.pending.length,
  rejected: lists.value.rejected.length,
  frozen: lists.value.frozen.length
}))

const currentList = computed(() => lists.value[tab.value] || [])

function onRenew(row) {
  ElMessageBox.confirm(`确认对「${row.name}」发起续期？`, '续期申请', { type: 'info' })
    .then(() => {
      row.permissionStatus = 'granted'
      row.validUntil = '2027-01-15'
      ElMessage.success('续期已生效，有效期延长 90 天')
    })
    .catch(() => {})
}
function onReapply(row) {
  applyDialogRef.value.open(row.id)
}
</script>

<style scoped>
.link { color: var(--color-primary); font-weight: 500; }
.row-desc { color: var(--text-tertiary); font-size: 12px; margin-top: 2px; }
</style>
