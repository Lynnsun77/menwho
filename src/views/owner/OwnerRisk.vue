<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">风险提醒</h1>
        <div class="page-subtitle">高频调用、跨场景使用、无主标签、即将到期</div>
      </div>
    </div>

    <div class="risk-grid">
      <div v-for="r in risks" :key="r.id" class="risk-card">
        <div class="risk-card__head">
          <el-icon :size="18" :style="{ color: severityColor(r.severity) }">
            <component :is="r.icon" />
          </el-icon>
          <div class="risk-card__title">{{ r.title }}</div>
          <el-tag :type="severityTagType(r.severity)" size="small" effect="light">{{ r.severityLabel }}</el-tag>
        </div>
        <div class="risk-card__body">
          <div class="risk-info-row">
            <span class="info-label">相关标签：</span>
            <span>{{ r.tag }}</span>
          </div>
          <div class="risk-info-row">
            <span class="info-label">触发原因：</span>
            <span>{{ r.reason }}</span>
          </div>
          <div class="risk-info-row">
            <span class="info-label">发现时间：</span>
            <span>{{ r.time }}</span>
          </div>
        </div>
        <div class="risk-card__actions">
          <el-button size="small" type="primary" plain>查看详情</el-button>
          <el-button size="small" type="primary">{{ r.action }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const risks = [
  {
    id: 1, icon: 'TrendCharts', severity: 'high', severityLabel: '高',
    title: '高频调用异常',
    tag: '风控评分',
    reason: '刘峰在过去 2 小时内调用 5.2 万次，超过日均阈值 3 倍',
    time: '2026-07-10 03:12',
    action: '通知消费方'
  },
  {
    id: 2, icon: 'Warning', severity: 'high', severityLabel: '高',
    title: '越权尝试',
    tag: '常驻 POI',
    reason: '陈鹏尝试调用未授权标签 12 次',
    time: '2026-07-09 22:41',
    action: '已封禁'
  },
  {
    id: 3, icon: 'Timer', severity: 'medium', severityLabel: '中',
    title: '权限即将到期',
    tag: '消费力分层',
    reason: '3 位消费方权限将在 7 天内到期',
    time: '2026-07-10',
    action: '提醒续期'
  },
  {
    id: 4, icon: 'QuestionFilled', severity: 'medium', severityLabel: '中',
    title: '跨场景使用',
    tag: '消费力分层',
    reason: '王小明在营销投放场景调用受控标签，与授权场景不一致',
    time: '2026-07-09 15:08',
    action: '要求补申请'
  },
  {
    id: 5, icon: 'DocumentDelete', severity: 'medium', severityLabel: '中',
    title: '批量导出预警',
    tag: '明细浏览序列',
    reason: '范伟单次导出量超过 500 万条阈值',
    time: '2026-07-09 11:20',
    action: '二次审批'
  },
  {
    id: 6, icon: 'InfoFilled', severity: 'low', severityLabel: '低',
    title: '标签覆盖率下降',
    tag: '品类偏好 Top3',
    reason: '覆盖率环比下降 3.2%',
    time: '2026-07-08',
    action: '核查数据'
  }
]

function severityColor(s) {
  return { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6' }[s]
}
function severityTagType(s) {
  return { high: 'danger', medium: 'warning', low: 'info' }[s]
}
</script>

<style scoped>
.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}
.risk-card {
  background: #fff;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 18px 20px;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.risk-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.risk-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.risk-card__title { font-size: 15px; font-weight: 600; flex: 1; }
.risk-card__body { font-size: 13px; color: var(--text-secondary); }
.risk-info-row { margin-bottom: 4px; }
.info-label { color: var(--text-tertiary); }
.risk-card__actions { display: flex; gap: 8px; }
</style>
