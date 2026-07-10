<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">名下标签</h1>
        <div class="page-subtitle">Owner 视角管理，查看标签健康度、调用趋势、授权数量</div>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card">
        <div class="kpi-card__label">名下标签</div>
        <div class="kpi-card__value">{{ myTags.length }}</div>
        <div class="kpi-card__icon" style="background:#dbeafe;color:#2563eb"><el-icon><price-tag /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">授权用户</div>
        <div class="kpi-card__value">{{ totalGranted }}</div>
        <div class="kpi-card__icon" style="background:#d1fae5;color:#10b981"><el-icon><user /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">7 日调用总量</div>
        <div class="kpi-card__value">{{ formatN(totalCall) }}</div>
        <div class="kpi-card__icon" style="background:#ede9fe;color:#8b5cf6"><el-icon><trend-charts /></el-icon></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__label">高敏标签</div>
        <div class="kpi-card__value">{{ sensitiveCount }}</div>
        <div class="kpi-card__icon" style="background:#fee2e2;color:#ef4444"><el-icon><lock /></el-icon></div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="section-title">标签列表</div>
        <el-input v-model="q" placeholder="搜索标签名" size="small" style="width:220px" :prefix-icon="Search" clearable />
      </div>
      <el-table :data="filtered" size="default" stripe>
        <el-table-column label="标签" min-width="180">
          <template #default="{ row }">
            <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
            <div class="row-desc">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="来源域" prop="sourceDomainLabel" width="120" />
        <el-table-column label="分级" width="90">
          <template #default="{ row }"><LevelTag :level="row.unifiedLevel" /></template>
        </el-table-column>
        <el-table-column label="覆盖率" width="90" align="right">
          <template #default="{ row }">{{ row.coverage }}%</template>
        </el-table-column>
        <el-table-column label="授权用户" width="110" align="right">
          <template #default="{ row }">{{ row.grantedUsers }}</template>
        </el-table-column>
        <el-table-column label="7日调用量" width="120" align="right">
          <template #default="{ row }">{{ row.callCount7d.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="$router.push(`/market/${row.id}`)">详情</el-button>
            <el-button size="small" text type="primary">修改口径</el-button>
            <el-button size="small" text type="warning">分级调整</el-button>
            <el-button size="small" text type="danger">下线</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'

const tagStore = useTagStore()
const q = ref('')

// 假设当前 Owner 拥有电商 DMP + 生服 LDMP 部分标签
const myTags = computed(() => tagStore.tags.filter(t => ['ecom_dmp', 'ls_ldmp'].includes(t.sourceDomain)))

const filtered = computed(() => {
  if (!q.value) return myTags.value
  const kw = q.value.toLowerCase()
  return myTags.value.filter(t => t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw))
})

const totalGranted = computed(() => myTags.value.reduce((s, t) => s + t.grantedUsers, 0))
const totalCall = computed(() => myTags.value.reduce((s, t) => s + t.callCount7d, 0))
const sensitiveCount = computed(() => myTags.value.filter(t => t.unifiedLevel === 'sensitive').length)

function formatN(n) {
  if (n > 10000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}
</script>

<style scoped>
.link { color: var(--color-primary); font-weight: 500; }
.row-desc { color: var(--text-tertiary); font-size: 12px; margin-top: 2px; }
</style>
