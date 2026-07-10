<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">智能推荐</h1>
        <div class="page-subtitle">按业务目标智能组合标签，权限成本一目了然</div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">描述你的业务目标</div>
      <div class="prompt-row">
        <el-input
          v-model="prompt"
          placeholder="例如：为大促营销找一批高消费力用户"
          :prefix-icon="MagicStick"
          size="large"
          clearable
          style="flex:1"
        />
        <el-button type="primary" size="large" @click="run">
          <el-icon><promotion /></el-icon>&nbsp;生成推荐
        </el-button>
      </div>
      <div class="prompt-tags">
        <span class="prompt-hint">试试：</span>
        <el-tag v-for="q in quickPrompts" :key="q" effect="plain" style="cursor:pointer;margin-right:8px" @click="prompt = q; run()">{{ q }}</el-tag>
      </div>
    </div>

    <div v-if="loading" class="section-card" style="margin-top:16px">
      <el-skeleton :rows="6" animated />
    </div>

    <div v-else class="recommend-list">
      <div v-for="b in bundles" :key="b.id" class="bundle-card">
        <div class="bundle-card__head">
          <div>
            <div class="bundle-card__title">{{ b.title }}</div>
            <div class="bundle-card__desc">{{ b.description }}</div>
          </div>
          <div class="bundle-card__badge">
            <LevelTag :level="b.highestLevel" />
            <div class="bundle-card__approval">{{ b.estimateApproval }}</div>
          </div>
        </div>

        <el-table :data="tagsOf(b.tagIds)" size="small" style="margin-top:12px">
          <el-table-column label="标签" min-width="140">
            <template #default="{ row }">
              <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="来源域" prop="sourceDomainLabel" width="110" />
          <el-table-column label="分级" width="100">
            <template #default="{ row }">
              <LevelTag :level="row.unifiedLevel" />
            </template>
          </el-table-column>
          <el-table-column label="权限状态" width="120">
            <template #default="{ row }">
              <PermissionStatus :status="row.permissionStatus" />
            </template>
          </el-table-column>
          <el-table-column label="预估获取难度" width="130">
            <template #default="{ row }">
              <el-progress
                :percentage="difficulty(row.unifiedLevel)"
                :color="difficultyColor(row.unifiedLevel)"
                :show-text="false"
                style="width:80px;display:inline-block;vertical-align:middle"
              />
              <span style="margin-left:6px;font-size:12px;color:#6b7280">{{ difficultyLabel(row.unifiedLevel) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="bundle-card__footer">
          <div class="bundle-card__meta">
            <span><el-icon><collection /></el-icon>&nbsp;场景：{{ b.scene }}</span>
            <span><el-icon><data-line /></el-icon>&nbsp;综合覆盖率：{{ b.coverage }}%</span>
          </div>
          <div class="bundle-card__actions">
            <el-button plain @click="showAlt(b)">
              <el-icon><document-remove /></el-icon>&nbsp;查看替代方案
            </el-button>
            <el-button type="primary" @click="applyBundle(b)">
              一键申请组合
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <ApplyDialog ref="applyDialogRef" />

    <el-drawer v-model="altVisible" title="替代方案" size="480px">
      <div class="alt-note">
        <el-icon><info-filled /></el-icon>
        <span>系统按 <b>已授权 → 通用级 → 聚合口径 → 脱敏版本 → 同域低风险</b> 顺序推荐。</span>
      </div>
      <el-table :data="altTags" size="small" style="margin-top:12px">
        <el-table-column label="替代标签" min-width="140">
          <template #default="{ row }">
            <router-link :to="`/market/${row.id}`" class="link">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="分级" width="80">
          <template #default="{ row }"><LevelTag :level="row.unifiedLevel" /></template>
        </el-table-column>
        <el-table-column label="权限" width="100">
          <template #default="{ row }"><PermissionStatus :status="row.permissionStatus" /></template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'
import PermissionStatus from '@/components/PermissionStatus.vue'
import ApplyDialog from '@/components/ApplyDialog.vue'
import { RECOMMEND_BUNDLES } from '@/mock/data.js'

const tagStore = useTagStore()
const applyDialogRef = ref(null)

const prompt = ref('')
const loading = ref(false)
const bundles = ref(RECOMMEND_BUNDLES)
const altVisible = ref(false)
const altTags = ref([])

const quickPrompts = [
  '为大促营销找一批高消费力用户',
  '本地生活推荐排序特征',
  '低成本自助分析组合',
  '交易风控预警特征'
]

function tagsOf(ids) {
  return ids.map(id => tagStore.findTag(id)).filter(Boolean)
}

function run() {
  loading.value = true
  setTimeout(() => {
    // 简单根据 prompt 关键词过滤
    if (!prompt.value.trim()) {
      bundles.value = RECOMMEND_BUNDLES
    } else {
      const q = prompt.value
      const filtered = RECOMMEND_BUNDLES.filter(b =>
        b.title.includes(q) || b.description.includes(q) ||
        q.includes('生活') && b.id === 'BUNDLE-2' ||
        q.includes('营销') && b.id === 'BUNDLE-1' ||
        q.includes('分析') && b.id === 'BUNDLE-3' ||
        q.includes('风控')
      )
      bundles.value = filtered.length ? filtered : RECOMMEND_BUNDLES
    }
    loading.value = false
  }, 400)
}

function difficulty(level) {
  return { open: 15, general: 35, controlled: 65, sensitive: 90 }[level] || 50
}
function difficultyColor(level) {
  return { open: '#10b981', general: '#3b82f6', controlled: '#f59e0b', sensitive: '#ef4444' }[level]
}
function difficultyLabel(level) {
  return { open: '容易', general: '一般', controlled: '较难', sensitive: '困难' }[level]
}

function applyBundle(b) {
  applyDialogRef.value.open(b.tagIds)
}

function showAlt(b) {
  const original = tagsOf(b.tagIds)
  const scenes = original.flatMap(t => t.scenes)
  const alt = tagStore.tags
    .filter(t => !b.tagIds.includes(t.id))
    .filter(t => t.scenes.some(s => scenes.includes(s)))
    .filter(t => t.unifiedLevel === 'open' || t.unifiedLevel === 'general' || t.permissionStatus === 'granted')
    .slice(0, 8)
  altTags.value = alt
  altVisible.value = true
}
</script>

<style scoped>
.prompt-row { display: flex; gap: 12px; margin-top: 6px; }
.prompt-tags { margin-top: 12px; }
.prompt-hint { color: var(--text-tertiary); font-size: 12px; margin-right: 8px; }

.recommend-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
.bundle-card {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px 22px;
  transition: box-shadow 0.15s;
}
.bundle-card:hover { box-shadow: var(--shadow-lg); }

.bundle-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
.bundle-card__title { font-size: 16px; font-weight: 600; }
.bundle-card__desc { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
.bundle-card__badge { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.bundle-card__approval { color: var(--text-tertiary); font-size: 12px; }

.bundle-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
  flex-wrap: wrap;
  gap: 10px;
}
.bundle-card__meta { display: flex; gap: 20px; font-size: 13px; color: var(--text-secondary); }
.bundle-card__actions { display: flex; gap: 8px; }

.link { color: var(--color-primary); }

.alt-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 8px;
}
</style>
