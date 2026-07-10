<template>
  <el-dialog
    v-model="visible"
    title="发起标签权限申请"
    width="640px"
    :close-on-click-modal="false"
    align-center
    @close="reset"
  >
    <div class="apply-form">
      <div class="tags-preview">
        <div class="tags-preview__title">申请标签（{{ tagList.length }}）</div>
        <div class="tags-preview__list">
          <div v-for="t in tagList" :key="t.id" class="tag-chip">
            <span>{{ t.name }}</span>
            <LevelTag :level="t.unifiedLevel" />
          </div>
        </div>
        <div class="highest-hint">
          <el-icon><info-filled /></el-icon>
          组合最高分级：<LevelTag :level="highest" /> · 审批方式：{{ approvalMode }}
        </div>
      </div>

      <el-form :model="form" label-width="90px" ref="formRef" :rules="rules">
        <el-form-item label="使用场景" prop="scene">
          <el-select v-model="form.scene" placeholder="选择使用场景" style="width:100%">
            <el-option v-for="s in scenes" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="调用方式" prop="method">
          <el-select v-model="form.method" placeholder="选择调用方式" style="width:100%">
            <el-option label="Hive Join" value="Hive Join" />
            <el-option label="人群包" value="人群包" />
            <el-option label="在线特征" value="在线特征" />
            <el-option label="SQL 查询" value="SQL 查询" />
            <el-option label="API 服务" value="API 服务" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="duration">
          <el-radio-group v-model="form.duration">
            <el-radio-button :value="30">30 天</el-radio-button>
            <el-radio-button :value="90">90 天</el-radio-button>
            <el-radio-button :value="180">180 天</el-radio-button>
          </el-radio-group>
          <span class="tip">高敏建议 ≤30 天，受控 ≤90 天</span>
        </el-form-item>
        <el-form-item label="使用理由" prop="purpose">
          <el-input v-model="form.purpose" type="textarea" :rows="3" placeholder="请填写业务场景、预期收益、最小必要范围与脱敏方式" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="submitting">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import LevelTag from '@/components/LevelTag.vue'
import { APPLICATION_SCENES, UNIFIED_LEVELS } from '@/mock/constants.js'
import { useTagStore } from '@/store/tag.js'

const tagStore = useTagStore()
const visible = ref(false)
const submitting = ref(false)
const currentTagIds = ref([])

const form = ref({
  scene: '',
  method: '',
  duration: 90,
  purpose: ''
})

const rules = {
  scene: [{ required: true, message: '请选择使用场景', trigger: 'change' }],
  method: [{ required: true, message: '请选择调用方式', trigger: 'change' }],
  duration: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  purpose: [{ required: true, min: 5, message: '请填写至少 5 字使用理由', trigger: 'blur' }]
}

const formRef = ref(null)
const scenes = APPLICATION_SCENES

const tagList = computed(() =>
  currentTagIds.value.map(id => tagStore.findTag(id)).filter(Boolean)
)

const levelOrder = ['open', 'general', 'controlled', 'sensitive']
const highest = computed(() => {
  let h = 'open'
  tagList.value.forEach(t => {
    if (levelOrder.indexOf(t.unifiedLevel) > levelOrder.indexOf(h)) h = t.unifiedLevel
  })
  return h
})
const approvalMode = computed(() => UNIFIED_LEVELS[highest.value].approval)

function open(tagIds) {
  currentTagIds.value = Array.isArray(tagIds) ? tagIds : [tagIds]
  visible.value = true
}
function reset() {
  form.value = { scene: '', method: '', duration: 90, purpose: '' }
  currentTagIds.value = []
  submitting.value = false
}

async function onSubmit() {
  try {
    await formRef.value.validate()
  } catch (e) { return }
  submitting.value = true
  await new Promise(r => setTimeout(r, 500))
  const app = tagStore.applyForTags(currentTagIds.value, form.value)
  submitting.value = false
  visible.value = false
  if (app.status === 'granted') {
    ElMessage.success(`已自助授权：${app.tagNames.join('、')}`)
  } else {
    ElMessage.success(`申请已提交，单号：${app.id}`)
  }
}

defineExpose({ open })
</script>

<style scoped>
.apply-form { padding: 4px 0; }

.tags-preview {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.tags-preview__title {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}
.tags-preview__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 13px;
}
.highest-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  padding-top: 6px;
  border-top: 1px dashed var(--border-color);
}
.tip { color: var(--text-tertiary); font-size: 12px; margin-left: 8px; }
</style>
