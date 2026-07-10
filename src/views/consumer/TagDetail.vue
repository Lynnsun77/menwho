<template>
  <div class="page-container tag-detail" v-if="tag">
    <div class="detail-header">
      <div>
        <el-button text @click="$router.back()">
          <el-icon><arrow-left /></el-icon>&nbsp;返回
        </el-button>
        <div class="detail-title-row">
          <h1 class="page-title">{{ tag.name }}</h1>
          <LevelTag :level="tag.unifiedLevel" />
          <el-tag v-if="tag.isOfficial" type="success" effect="light">官方</el-tag>
        </div>
        <div class="detail-sub">{{ tag.description }}</div>
      </div>
      <div class="detail-actions">
        <PermissionStatus :status="tag.permissionStatus" />
        <el-button
          type="primary"
          :disabled="tag.permissionStatus === 'granted' || tag.permissionStatus === 'pending'"
          @click="applyDialogRef.open(tag.id)"
        >
          {{ actionText }}
        </el-button>
        <el-button plain @click="$router.push('/recommend')">
          <el-icon><magic-stick /></el-icon>&nbsp;智能推荐
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="detail-tabs">
      <el-tab-pane label="基础信息" name="basic">
        <div class="grid-2">
          <div class="section-card">
            <div class="section-title">基础展示字段</div>
            <el-descriptions :column="2" border size="default" style="margin-top:12px">
              <el-descriptions-item label="tag_id">{{ tag.id }}</el-descriptions-item>
              <el-descriptions-item label="来源域">{{ tag.sourceDomainLabel }}</el-descriptions-item>
              <el-descriptions-item label="更新频率">{{ tag.updateFrequency }}</el-descriptions-item>
              <el-descriptions-item label="覆盖率">{{ tag.coverage }}%</el-descriptions-item>
              <el-descriptions-item label="版本">{{ tag.version }}</el-descriptions-item>
              <el-descriptions-item label="上架时间">{{ tag.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="应用场景" :span="2">
                <el-tag v-for="s in tag.scenes" :key="s" size="small" effect="plain" style="margin-right:6px">{{ s }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="section-card">
            <div class="section-title">责任溯源字段</div>
            <el-descriptions :column="1" border size="default" style="margin-top:12px">
              <el-descriptions-item label="Owner">
                <el-avatar :size="20" style="margin-right:6px;background:#2563eb">{{ tag.owner[0] }}</el-avatar>
                {{ tag.owner }}
              </el-descriptions-item>
              <el-descriptions-item label="Owner Team">{{ tag.ownerTeam }}</el-descriptions-item>
              <el-descriptions-item label="原始分级">{{ tag.originalLevel }}</el-descriptions-item>
              <el-descriptions-item label="来源系统">{{ tag.sourceDomainLabel }} · 元信息同步</el-descriptions-item>
              <el-descriptions-item label="数据生产方">{{ tag.ownerTeam }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <div class="section-card" style="margin-top:16px">
          <div class="section-title">分级与权限约束</div>
          <div class="permission-block">
            <div class="permission-block__row">
              <div class="permission-block__col">
                <div class="col-label">统一分级</div>
                <div class="col-value"><LevelTag :level="tag.unifiedLevel" /></div>
                <div class="col-hint">{{ levelInfo.desc }}</div>
              </div>
              <div class="permission-block__col">
                <div class="col-label">审批方式</div>
                <div class="col-value">{{ levelInfo.approval }}</div>
                <div class="col-hint">按最高分级路由</div>
              </div>
              <div class="permission-block__col">
                <div class="col-label">默认有效期</div>
                <div class="col-value">{{ defaultDuration }} 天</div>
                <div class="col-hint">到期前 14/7 天提醒</div>
              </div>
              <div class="permission-block__col">
                <div class="col-label">导出策略</div>
                <div class="col-value">
                  {{ tag.unifiedLevel === 'sensitive' ? '禁止明文导出' : '允许（脱敏）' }}
                </div>
                <div class="col-hint">依据消费档位控制</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="使用约束 & 脱敏" name="constraints">
        <div class="section-card">
          <div class="section-title">使用约束</div>
          <el-table :data="constraintTable" style="margin-top:8px" size="default">
            <el-table-column label="约束项" prop="key" width="180" />
            <el-table-column label="策略" prop="value" />
          </el-table>
        </div>
        <div class="section-card" style="margin-top:16px">
          <div class="section-title">脱敏策略</div>
          <el-table :data="maskingTable" style="margin-top:8px" size="default">
            <el-table-column label="场景" prop="scene" width="180" />
            <el-table-column label="策略" prop="policy" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="调用趋势" name="trend">
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">近 30 天调用量</div>
            <div class="trend-summary">
              <span>近 7 日：<b>{{ tag.callCount7d.toLocaleString() }}</b></span>
              <span>已授权用户：<b>{{ tag.grantedUsers }}</b></span>
            </div>
          </div>
          <EChart :option="trendOption" height="280px" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="相关标签" name="related">
        <div class="section-card">
          <div class="section-title">同类替代 · 组合推荐</div>
          <div class="related-grid">
            <div v-for="r in relatedTags" :key="r.id" class="related-card">
              <div class="related-card__head">
                <router-link :to="`/market/${r.id}`" class="related-name">{{ r.name }}</router-link>
                <LevelTag :level="r.unifiedLevel" />
              </div>
              <div class="related-card__desc">{{ r.description }}</div>
              <div class="related-card__footer">
                <PermissionStatus :status="r.permissionStatus" />
                <el-button size="small" text type="primary" @click="$router.push(`/market/${r.id}`)">查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <ApplyDialog ref="applyDialogRef" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '@/store/tag.js'
import LevelTag from '@/components/LevelTag.vue'
import PermissionStatus from '@/components/PermissionStatus.vue'
import EChart from '@/components/EChart.vue'
import ApplyDialog from '@/components/ApplyDialog.vue'
import { UNIFIED_LEVELS } from '@/mock/constants.js'

const route = useRoute()
const tagStore = useTagStore()
const activeTab = ref('basic')
const applyDialogRef = ref(null)

const tag = computed(() => tagStore.findTag(route.params.id))

const levelInfo = computed(() => UNIFIED_LEVELS[tag.value?.unifiedLevel || 'general'])

const defaultDuration = computed(() => {
  const map = { open: 365, general: 180, controlled: 90, sensitive: 30 }
  return map[tag.value?.unifiedLevel] || 90
})

const actionText = computed(() => {
  const map = { none: '申请权限', pending: '审批中', granted: '已授权', expiring: '续期', expired: '重新申请', rejected: '重新申请', frozen: '已冻结' }
  return map[tag.value?.permissionStatus] || '申请'
})

const constraintTable = computed(() => {
  if (!tag.value) return []
  return [
    { key: '允许场景 (allowed_scenes)', value: tag.value.scenes.join('、') },
    { key: '允许操作 (allowed_methods)', value: '查询 / Join / 特征训练' + (tag.value.unifiedLevel === 'sensitive' ? '（禁止导出明文）' : '') },
    { key: '有效期策略 (expire_policy)', value: `${defaultDuration.value} 天，到期前 14/7 天提醒` },
    { key: '导出策略 (export_policy)', value: tag.value.unifiedLevel === 'sensitive' ? '高敏禁止导出' : '允许脱敏导出' },
    { key: '限额策略 (quota_policy)', value: '默认日调用量 100 万，可按需申请提额' },
    { key: '审计策略 (audit_policy)', value: '全量记录 who / when / what / where / why / result' }
  ]
})

const maskingTable = computed(() => {
  return [
    { scene: '无权限查看', policy: '仅展示元信息，不展示标签值' },
    { scene: '标签样例预览', policy: tag.value?.unifiedLevel === 'sensitive' || tag.value?.unifiedLevel === 'controlled' ? '采样 + 掩码' : '完整展示' },
    { scene: '用户 360 查询', policy: '字段级脱敏' },
    { scene: '导出', policy: tag.value?.unifiedLevel === 'sensitive' ? '禁止明文导出' : '允许脱敏导出' },
    { scene: '跨域传输', policy: '按接收方权限动态降粒度' }
  ]
})

const trendOption = computed(() => {
  const data = tag.value?.callCount30dTrend || []
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 30, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map((_, i) => `D-${29 - i}`),
      boundaryGap: false,
      axisLabel: { color: '#6b7280' },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    series: [{
      type: 'line',
      smooth: true,
      data,
      itemStyle: { color: '#2563eb' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(37,99,235,0.35)' },
            { offset: 1, color: 'rgba(37,99,235,0.02)' }
          ]
        }
      }
    }]
  }
})

const relatedTags = computed(() => {
  if (!tag.value) return []
  return tagStore.tags.filter(t =>
    t.id !== tag.value.id && (t.sourceDomain === tag.value.sourceDomain || t.scenes.some(s => tag.value.scenes.includes(s)))
  ).slice(0, 6)
})
</script>

<style scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  border-radius: var(--border-radius);
  padding: 20px 24px;
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}
.detail-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 4px;
}
.detail-sub { color: var(--text-secondary); font-size: 13px; }
.detail-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.detail-tabs :deep(.el-tabs__header) {
  background: #fff;
  padding: 0 24px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.permission-block__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 12px;
}
.permission-block__col {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}
.col-label { color: var(--text-tertiary); font-size: 12px; margin-bottom: 4px; }
.col-value { font-size: 15px; font-weight: 500; color: var(--text-primary); }
.col-hint { color: var(--text-tertiary); font-size: 12px; margin-top: 4px; }

.trend-summary { display: flex; gap: 20px; color: var(--text-secondary); font-size: 13px; }
.trend-summary b { color: var(--text-primary); font-weight: 600; }

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.related-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 14px;
  transition: border-color 0.15s;
}
.related-card:hover { border-color: var(--color-primary-light); }
.related-card__head { display: flex; justify-content: space-between; align-items: center; }
.related-name { color: var(--text-primary); font-weight: 500; }
.related-name:hover { color: var(--color-primary); }
.related-card__desc { color: var(--text-tertiary); font-size: 12px; margin: 6px 0 10px; }
.related-card__footer { display: flex; justify-content: space-between; align-items: center; }

@media (max-width: 900px) {
  .permission-block__row { grid-template-columns: 1fr 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
}
</style>
