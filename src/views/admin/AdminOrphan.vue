<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">无主标签治理</h1>
        <div class="page-subtitle">Owner 离职或转岗后，无主标签需 Owner Team 兜底或重新认领</div>
      </div>
    </div>

    <el-alert
      title="⚠️ 无主标签风险提示"
      type="warning"
      :closable="false"
      show-icon
      style="margin-bottom:16px"
    >
      共 {{ list.length }} 条无主标签，其中 <b style="color:#ef4444">{{ waitCount }}</b> 条待认领超过 3 天。高敏或受控级无主标签已临时冻结新增申请入口。
    </el-alert>

    <div class="section-card">
      <div class="section-header">
        <div class="section-title">无主标签列表</div>
      </div>
      <el-table :data="list" size="default" stripe>
        <el-table-column label="标签 ID" prop="tagId" width="120" />
        <el-table-column label="标签名" prop="tagName" min-width="160" />
        <el-table-column label="来源域" prop="sourceDomain" width="130" />
        <el-table-column label="分级" width="90">
          <template #default="{ row }"><LevelTag :level="row.unifiedLevel" /></template>
        </el-table-column>
        <el-table-column label="原 Owner" prop="ownerLast" width="120" />
        <el-table-column label="Owner Team" prop="ownerTeam" width="140" />
        <el-table-column label="标记时间" prop="markedAt" width="120" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '待认领' ? 'danger' : 'warning'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="onClaim(row)">认领</el-button>
            <el-button size="small" type="warning" plain @click="onFreeze(row)">冻结</el-button>
            <el-button size="small" text type="danger">通知 Team Leader</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="claimDialog" title="Owner 认领" width="440px">
      <el-form label-width="100px">
        <el-form-item label="标签">{{ currentRow?.tagName }}</el-form-item>
        <el-form-item label="新 Owner">
          <el-input v-model="claimForm.owner" placeholder="请输入员工姓名 / 邮箱" />
        </el-form-item>
        <el-form-item label="Owner Team">
          <el-input v-model="claimForm.team" placeholder="所属团队" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="claimDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmClaim">确认认领</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import LevelTag from '@/components/LevelTag.vue'
import { ORPHAN_TAGS } from '@/mock/data.js'

const list = ref(ORPHAN_TAGS.map(x => ({ ...x })))
const claimDialog = ref(false)
const currentRow = ref(null)
const claimForm = ref({ owner: '', team: '' })

const waitCount = computed(() => list.value.filter(x => x.status === '待认领').length)

function onClaim(row) {
  currentRow.value = row
  claimForm.value = { owner: '', team: row.ownerTeam }
  claimDialog.value = true
}
function confirmClaim() {
  if (!claimForm.value.owner) {
    ElMessage.warning('请填写新 Owner')
    return
  }
  list.value = list.value.filter(x => x.tagId !== currentRow.value.tagId)
  claimDialog.value = false
  ElMessage.success(`「${currentRow.value.tagName}」已由 ${claimForm.value.owner} 认领`)
}
function onFreeze(row) {
  ElMessage.info(`「${row.tagName}」已冻结新增申请入口`)
}
</script>
