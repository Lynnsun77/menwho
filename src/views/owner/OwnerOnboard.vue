<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">标签接入</h1>
        <div class="page-subtitle">上架新标签资产，提交元信息并等待平台审核</div>
      </div>
    </div>

    <el-steps :active="step" finish-status="success" simple>
      <el-step title="1. 基础信息" />
      <el-step title="2. 责任溯源" />
      <el-step title="3. 权限约束" />
      <el-step title="4. 提交审核" />
    </el-steps>

    <div class="section-card" style="margin-top:16px">
      <el-form :model="form" label-width="140px" ref="formRef" :rules="rules">
        <template v-if="step === 0">
          <div class="section-title">基础展示字段</div>
          <el-form-item label="tag_name" prop="tag_name">
            <el-input v-model="form.tag_name" placeholder="如：消费力分层" style="max-width:360px" />
          </el-form-item>
          <el-form-item label="description" prop="description">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="标签口径说明" />
          </el-form-item>
          <el-form-item label="source_domain" prop="source_domain">
            <el-select v-model="form.source_domain" placeholder="选择来源域" style="width:220px">
              <el-option v-for="d in domains" :key="d.key" :label="d.label" :value="d.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="application_scenes">
            <el-select v-model="form.application_scenes" multiple placeholder="选择应用场景" style="width:400px">
              <el-option v-for="s in scenes" :key="s" :label="s" :value="s" />
            </el-select>
          </el-form-item>
          <el-form-item label="update_frequency">
            <el-select v-model="form.update_frequency" style="width:180px">
              <el-option v-for="f in ['实时', '每日', '每周', '每月']" :key="f" :label="f" :value="f" />
            </el-select>
          </el-form-item>
          <el-form-item label="coverage">
            <el-slider v-model="form.coverage" show-input :max="100" style="max-width:400px" />
          </el-form-item>
        </template>

        <template v-else-if="step === 1">
          <div class="section-title">责任溯源字段</div>
          <el-form-item label="owner" prop="owner">
            <el-input v-model="form.owner" placeholder="标签负责人" style="max-width:260px" />
          </el-form-item>
          <el-form-item label="owner_team" prop="owner_team">
            <el-input v-model="form.owner_team" placeholder="Owner 所属团队" style="max-width:260px" />
          </el-form-item>
          <el-form-item label="source_table">
            <el-input v-model="form.source_table" placeholder="来源表 / Hive 路径" style="max-width:400px" />
          </el-form-item>
          <el-form-item label="original_level">
            <el-input v-model="form.original_level" placeholder="来源方原始分级，如 P1 / L2" style="max-width:260px" />
          </el-form-item>
        </template>

        <template v-else-if="step === 2">
          <div class="section-title">权限与消费约束</div>
          <el-form-item label="unified_level">
            <div class="level-picker">
              <div
                v-for="l in levelOptions"
                :key="l.key"
                class="level-option"
                :class="{ active: form.unified_level === l.key, [`level-${l.key}`]: true }"
                @click="form.unified_level = l.key"
              >
                <LevelTag :level="l.key" />
                <div class="level-desc">{{ l.desc }}</div>
                <div class="level-approval">{{ l.approval }}</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="allowed_scenes">
            <el-checkbox-group v-model="form.allowed_scenes">
              <el-checkbox v-for="s in scenes" :key="s" :value="s">{{ s }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="expire_policy">
            <el-radio-group v-model="form.expire_policy">
              <el-radio value="30">30 天</el-radio>
              <el-radio value="90">90 天</el-radio>
              <el-radio value="180">180 天</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="masking_policy">
            <el-input v-model="form.masking_policy" placeholder="脱敏策略（如：字段级掩码 / 采样）" style="max-width:400px" />
          </el-form-item>
        </template>

        <template v-else>
          <div class="section-title">提交前预览</div>
          <el-alert
            v-if="form.unified_level === 'sensitive'"
            title="高敏标签需要安全 / 法务复核，预计审核时间 3-5 工作日"
            type="warning"
            :closable="false"
            style="margin-bottom:16px"
          />
          <el-descriptions :column="2" border>
            <el-descriptions-item label="标签名">{{ form.tag_name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="来源域">{{ domainLabel(form.source_domain) }}</el-descriptions-item>
            <el-descriptions-item label="Owner">{{ form.owner }}</el-descriptions-item>
            <el-descriptions-item label="Owner Team">{{ form.owner_team }}</el-descriptions-item>
            <el-descriptions-item label="统一分级">
              <LevelTag v-if="form.unified_level" :level="form.unified_level" />
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="有效期">{{ form.expire_policy }} 天</el-descriptions-item>
            <el-descriptions-item label="应用场景" :span="2">
              <el-tag v-for="s in form.application_scenes" :key="s" size="small" effect="plain" style="margin-right:4px">{{ s }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ form.description }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-form>

      <div class="step-actions">
        <el-button v-if="step > 0" @click="step--">上一步</el-button>
        <el-button v-if="step < 3" type="primary" @click="next">下一步</el-button>
        <el-button v-else type="primary" @click="submit">提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import LevelTag from '@/components/LevelTag.vue'
import { SOURCE_DOMAINS, UNIFIED_LEVELS, APPLICATION_SCENES } from '@/mock/constants.js'

const step = ref(0)
const domains = SOURCE_DOMAINS
const scenes = APPLICATION_SCENES
const levelOptions = Object.values(UNIFIED_LEVELS)

const form = ref({
  tag_name: '',
  description: '',
  source_domain: '',
  application_scenes: [],
  update_frequency: '每日',
  coverage: 80,
  owner: '',
  owner_team: '',
  source_table: '',
  original_level: '',
  unified_level: '',
  allowed_scenes: [],
  expire_policy: '90',
  masking_policy: ''
})

const rules = {
  tag_name: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
  description: [{ required: true, message: '请填写口径说明', trigger: 'blur' }],
  source_domain: [{ required: true, message: '请选择来源域', trigger: 'change' }],
  owner: [{ required: true, message: '请填写 Owner', trigger: 'blur' }],
  owner_team: [{ required: true, message: '请填写 Owner Team', trigger: 'blur' }]
}
const formRef = ref(null)

function next() {
  formRef.value?.validate().then(() => {
    if (step.value === 2 && !form.value.unified_level) {
      ElMessage.warning('请选择统一分级')
      return
    }
    step.value++
  }).catch(() => {})
}

function submit() {
  ElMessage.success('接入申请已提交，等待平台审核（预计 24-72h）')
  step.value = 0
  form.value = { tag_name: '', description: '', source_domain: '', application_scenes: [], update_frequency: '每日', coverage: 80, owner: '', owner_team: '', source_table: '', original_level: '', unified_level: '', allowed_scenes: [], expire_policy: '90', masking_policy: '' }
}

function domainLabel(k) {
  return domains.find(d => d.key === k)?.label || '-'
}
</script>

<style scoped>
.level-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.level-option {
  border: 2px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.level-option:hover { border-color: var(--color-primary-light); }
.level-option.active { border-color: var(--color-primary); background: rgba(37, 99, 235, 0.04); }
.level-desc { font-size: 12px; color: var(--text-secondary); }
.level-approval { font-size: 11px; color: var(--text-tertiary); }

.step-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
