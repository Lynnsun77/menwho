<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">标签广场</h1>
        <div class="page-subtitle">跨域画像资产统一入口，支持多维筛选与快速申请</div>
      </div>
      <div class="header-actions">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="card"><el-icon><grid /></el-icon></el-radio-button>
          <el-radio-button label="table"><el-icon><menu /></el-icon></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-card">
      <el-input
        v-model="filters.q"
        placeholder="搜索标签名称 / 描述 / Owner"
        :prefix-icon="Search"
        clearable
        style="width:320px"
      />
      <div class="filter-group">
        <span class="filter-label">来源域</span>
        <el-select v-model="filters.domain" clearable placeholder="全部" style="width:140px">
          <el-option v-for="d in domains" :key="d.key" :label="d.label" :value="d.key" />
        </el-select>
      </div>
      <div class="filter-group">
        <span class="filter-label">统一分级</span>
        <el-select v-model="filters.level" clearable placeholder="全部" style="width:120px">
          <el-option v-for="l in levelOptions" :key="l.key" :label="l.label" :value="l.key" />
        </el-select>
      </div>
      <div class="filter-group">
        <span class="filter-label">权限状态</span>
        <el-select v-model="filters.status" clearable placeholder="全部" style="width:120px">
          <el-option v-for="s in statusOptions" :key="s.key" :label="s.label" :value="s.key" />
        </el-select>
      </div>
      <div class="filter-group">
        <span class="filter-label">应用场景</span>
        <el-select v-model="filters.scene" clearable placeholder="全部" style="width:130px">
          <el-option v-for="s in scenes" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-button v-if="hasFilters" text type="primary" @click="reset">清除筛选</el-button>
    </div>

    <div class="result-info">
      共 <b>{{ filtered.length }}</b> 个标签
      <template v-if="selectedIds.length">
        · 已选 <b>{{ selectedIds.length }}</b>
        <el-button size="small" type="primary" style="margin-left:8px" @click="batchApply">
          批量申请
        </el-button>
      </template>
    </div>

    <!-- Card view -->
    <div v-if="viewMode === 'card'" class="tag-grid">
      <div
        v-for="t in paged"
        :key="t.id"
        class="tag-card"
        :class="{ selected: selectedIds.includes(t.id) }"
      >
        <div class="tag-card__head">
          <el-checkbox
            :model-value="selectedIds.includes(t.id)"
            @change="toggleSelect(t.id)"
          />
          <router-link :to="`/market/${t.id}`" class="tag-card__name">{{ t.name }}</router-link>
          <LevelTag :level="t.unifiedLevel" />
        </div>
        <div class="tag-card__desc">{{ t.description }}</div>
        <div class="tag-card__meta">
          <span class="meta-item">
            <el-icon><collection /></el-icon> {{ t.sourceDomainLabel }}
          </span>
          <span class="meta-item">
            <el-icon><user /></el-icon> {{ t.owner }}
          </span>
          <span class="meta-item">
            <el-icon><data-line /></el-icon> {{ t.coverage }}%
          </span>
        </div>
        <div class="tag-card__scenes">
          <el-tag v-for="s in t.scenes.slice(0, 3)" :key="s" size="small" effect="plain">{{ s }}</el-tag>
        </div>
        <div class="tag-card__footer">
          <PermissionStatus :status="t.permissionStatus" />
          <div class="footer-actions">
            <router-link :to="`/market/${t.id}`">
              <el-button size="small" text type="primary">查看</el-button>
            </router-link>
            <el-button
              size="small"
              type="primary"
              :disabled="t.permissionStatus === 'granted' || t.permissionStatus === 'pending'"
              @click="onApply(t.id)"
            >
              {{ actionText(t.permissionStatus) }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table view -->
    <div v-else class="section-card">
      <el-table
        :data="paged"
        row-key="id"
        @selection-change="onSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="42" />
        <el-table-column label="标签名称" min-width="180">
          <template #default="{ row }">
            <div class="table-name">
              <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
              <el-tag v-if="row.isOfficial" size="small" type="success" effect="light">官方</el-tag>
            </div>
            <div class="table-desc">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="来源域" prop="sourceDomainLabel" width="130" />
        <el-table-column label="统一分级" width="110">
          <template #default="{ row }">
            <LevelTag :level="row.unifiedLevel" />
          </template>
        </el-table-column>
        <el-table-column label="Owner" prop="owner" width="100" />
        <el-table-column label="覆盖率" width="100" align="right">
          <template #default="{ row }">{{ row.coverage }}%</template>
        </el-table-column>
        <el-table-column label="更新频率" prop="updateFrequency" width="90" />
        <el-table-column label="权限状态" width="120">
          <template #default="{ row }">
            <PermissionStatus :status="row.permissionStatus" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="$router.push(`/market/${row.id}`)">查看</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="row.permissionStatus === 'granted' || row.permissionStatus === 'pending'"
              @click="onApply(row.id)"
            >
              {{ actionText(row.permissionStatus) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="filtered.length"
        layout="prev, pager, next, jumper"
        background
      />
    </div>

    <ApplyDialog ref="applyDialogRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'
import PermissionStatus from '@/components/PermissionStatus.vue'
import ApplyDialog from '@/components/ApplyDialog.vue'
import { SOURCE_DOMAINS, UNIFIED_LEVELS, PERMISSION_STATUS, APPLICATION_SCENES } from '@/mock/constants.js'

const route = useRoute()
const tagStore = useTagStore()
const applyDialogRef = ref(null)

const domains = SOURCE_DOMAINS
const scenes = APPLICATION_SCENES
const levelOptions = Object.values(UNIFIED_LEVELS)
const statusOptions = Object.values(PERMISSION_STATUS)

const viewMode = ref('card')
const page = ref(1)
const pageSize = 12
const selectedIds = ref([])

const filters = ref({
  q: '',
  domain: '',
  level: '',
  status: '',
  scene: ''
})

onMounted(() => {
  if (route.query.q) filters.value.q = String(route.query.q)
})

const hasFilters = computed(() =>
  filters.value.q || filters.value.domain || filters.value.level || filters.value.status || filters.value.scene
)

const filtered = computed(() => {
  return tagStore.tags.filter(t => {
    const f = filters.value
    if (f.q) {
      const q = f.q.toLowerCase()
      if (!(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.owner.toLowerCase().includes(q))) return false
    }
    if (f.domain && t.sourceDomain !== f.domain) return false
    if (f.level && t.unifiedLevel !== f.level) return false
    if (f.status && t.permissionStatus !== f.status) return false
    if (f.scene && !t.scenes.includes(f.scene)) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function reset() {
  filters.value = { q: '', domain: '', level: '', status: '', scene: '' }
}

function actionText(status) {
  const map = { none: '申请', pending: '审批中', granted: '已授权', expiring: '续期', expired: '重新申请', rejected: '重新申请', frozen: '已冻结' }
  return map[status] || '申请'
}

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  } else {
    selectedIds.value.push(id)
  }
}
function onSelectionChange(rows) {
  selectedIds.value = rows.map(r => r.id)
}
function onApply(id) {
  applyDialogRef.value.open(id)
}
function batchApply() {
  applyDialogRef.value.open(selectedIds.value)
  selectedIds.value = []
}
</script>

<style scoped>
.filter-card {
  background: #fff;
  border-radius: var(--border-radius);
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}
.filter-group { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 13px; color: var(--text-secondary); }
.result-info { font-size: 13px; color: var(--text-secondary); margin: 12px 4px; }
.result-info b { color: var(--color-primary); font-weight: 600; }

.header-actions { display: flex; gap: 8px; }

.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.tag-card {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.tag-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}
.tag-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.tag-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tag-card__name {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  flex: 1;
}
.tag-card__name:hover { color: var(--color-primary); }

.tag-card__desc {
  color: var(--text-secondary);
  font-size: 13px;
  min-height: 38px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tag-card__meta {
  display: flex;
  gap: 14px;
  color: var(--text-tertiary);
  font-size: 12px;
  flex-wrap: wrap;
}
.meta-item { display: inline-flex; align-items: center; gap: 4px; }

.tag-card__scenes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-card__footer {
  border-top: 1px dashed var(--border-color);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-actions { display: flex; gap: 4px; }

.pagination {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.table-name { display: flex; align-items: center; gap: 8px; }
.table-desc { color: var(--text-tertiary); font-size: 12px; margin-top: 2px; }
.link { color: var(--color-primary); }

@media (max-width: 640px) {
  .tag-grid { grid-template-columns: 1fr; }
}
</style>
