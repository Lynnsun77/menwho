// 统一四档消费管控
export const UNIFIED_LEVELS = {
  open: { key: 'open', label: '开放级', color: 'level-open', desc: '聚合统计 / 公开数据', approval: '自助订阅' },
  general: { key: 'general', label: '通用级', color: 'level-general', desc: '基础属性 / 粗粒度分层', approval: '自助申请 + 留痕' },
  controlled: { key: 'controlled', label: '受控级', color: 'level-controlled', desc: '行为偏好 / 消费力 / 深层推断', approval: 'Owner 审批' },
  sensitive: { key: 'sensitive', label: '高敏级', color: 'level-sensitive', desc: '精准地理 / 支付 / 外采 / 强识别', approval: '源头合规审批' }
}

// 来源域
export const SOURCE_DOMAINS = [
  { key: 'ecom_dmp', label: '电商 DMP', color: '#2563eb' },
  { key: 'ls_ldmp', label: '生服 LDMP', color: '#10b981' },
  { key: 'ad', label: '广告', color: '#8b5cf6' },
  { key: 'ai_portrait', label: 'AI 用户画像', color: '#f97316' },
  { key: 'sequence', label: '序列数据', color: '#0ea5e9' },
  { key: 'llm_tag', label: 'LLM 理解标签', color: '#ec4899' },
  { key: 'small_end', label: '小端', color: '#14b8a6' },
  { key: 'external', label: '外采数据', color: '#ef4444' }
]

// 权限状态
export const PERMISSION_STATUS = {
  none: { key: 'none', label: '未申请', dot: 'none' },
  pending: { key: 'pending', label: '审批中', dot: 'pending' },
  granted: { key: 'granted', label: '已授权', dot: 'granted' },
  expiring: { key: 'expiring', label: '即将到期', dot: 'expiring' },
  expired: { key: 'expired', label: '已过期', dot: 'expired' },
  rejected: { key: 'rejected', label: '被拒绝', dot: 'rejected' },
  frozen: { key: 'frozen', label: '已冻结', dot: 'frozen' }
}

// 应用场景
export const APPLICATION_SCENES = [
  '人群圈选', '用户 360', '模型特征', '营销投放', '数据分析', 'API 服务', 'A/B 实验', '推荐召回'
]

// 角色
export const ROLES = [
  { key: 'consumer', label: '消费方', desc: '算法 / 运营 / 营销 / 数据分析' },
  { key: 'owner', label: 'Owner', desc: '标签负责人' },
  { key: 'admin', label: '平台 / 合规', desc: 'PM / 安全 / 法务' }
]
