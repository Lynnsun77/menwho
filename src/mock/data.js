import { SOURCE_DOMAINS, UNIFIED_LEVELS, APPLICATION_SCENES, PERMISSION_STATUS } from './constants.js'

// ========= 标签资产 =========
// 覆盖 8 大来源域、四档分级、丰富元信息
const rawTags = [
  // 电商 DMP
  ['ecom_dmp', 'general', '性别', '用户性别（推断）', ['人群圈选', '用户 360'], 98.5, '每日', '张伟', '电商DMP运营组', 'P2'],
  ['ecom_dmp', 'general', '年龄段', '用户年龄段（5 档）', ['人群圈选', '用户 360', '模型特征'], 96.2, '每日', '张伟', '电商DMP运营组', 'P2'],
  ['ecom_dmp', 'general', '城市等级', '常驻城市等级 T1~T5', ['人群圈选', '数据分析'], 99.1, '每周', '张伟', '电商DMP运营组', 'P2'],
  ['ecom_dmp', 'controlled', '消费力分层', '近 30 天消费能力分层', ['人群圈选', '模型特征', '营销投放'], 88.4, '每日', '李娜', '电商画像组', 'P1'],
  ['ecom_dmp', 'controlled', '品类偏好 Top3', '近 90 天品类偏好', ['人群圈选', '推荐召回'], 84.0, '每日', '李娜', '电商画像组', 'P1'],
  ['ecom_dmp', 'controlled', '商城 LTV 预测', '90 天生命周期价值预测', ['模型特征', '数据分析'], 75.6, '每周', '陈昊', '电商增长组', 'P1'],
  ['ecom_dmp', 'sensitive', '支付方式偏好', '含支付明细的偏好推断', ['模型特征'], 62.3, '每日', '陈昊', '电商增长组', 'P0'],
  ['ecom_dmp', 'sensitive', '风控评分', '交易风险综合评分', ['API 服务'], 95.5, '每日', '刘峰', '电商风控组', 'P0'],

  // 生服 LDMP
  ['ls_ldmp', 'general', '设备品牌', '常用设备品牌', ['人群圈选', '数据分析'], 97.8, '每日', '王芳', '生服画像组', 'L1'],
  ['ls_ldmp', 'general', '生活服务活跃度', '近 30 天到店/到家活跃分层', ['人群圈选'], 92.0, '每日', '王芳', '生服画像组', 'L1'],
  ['ls_ldmp', 'controlled', '到店偏好品类', '本地生活到店品类偏好', ['推荐召回', '营销投放'], 81.2, '每日', '孙浩', '本地生活组', 'L2'],
  ['ls_ldmp', 'controlled', '到家消费频次', '到家业务消费频次', ['人群圈选', '模型特征'], 78.5, '每日', '孙浩', '本地生活组', 'L2'],
  ['ls_ldmp', 'sensitive', '常驻 POI', '用户常驻兴趣点（精准）', ['模型特征'], 68.7, '每日', '周杰', '生服 LBS 组', 'L3'],
  ['ls_ldmp', 'sensitive', '精准经纬度', '实时精准位置', ['API 服务'], 71.4, '实时', '周杰', '生服 LBS 组', 'L3'],

  // 广告
  ['ad', 'general', '广告响应类型', '广告点击类型分层', ['数据分析'], 90.3, '每日', '林霞', '广告策略组', 'general'],
  ['ad', 'controlled', '广告主偏好', '偏好行业/广告主', ['营销投放', '推荐召回'], 82.4, '每日', '林霞', '广告策略组', 'controlled'],

  // AI 用户画像
  ['ai_portrait', 'general', 'AI 兴趣分层', '大模型推断的兴趣分层', ['推荐召回', '数据分析'], 91.6, '每周', '徐斌', 'AI 画像组', '-'],
  ['ai_portrait', 'controlled', 'AI 偏好推断', 'LLM 推断深度偏好', ['推荐召回', '模型特征'], 79.9, '每周', '徐斌', 'AI 画像组', '-'],
  ['ai_portrait', 'sensitive', '心理画像 Summary', '大模型生成的心理画像摘要', ['数据分析'], 55.2, '每月', '徐斌', 'AI 画像组', '-'],

  // 序列数据
  ['sequence', 'general', '聚合行为序列', '聚合的用户行为序列', ['数据分析'], 88.1, '每日', '高远', '数据平台序列组', '-'],
  ['sequence', 'controlled', '明细浏览序列', '详细浏览行为序列', ['模型特征'], 82.7, '每日', '高远', '数据平台序列组', '-'],
  ['sequence', 'sensitive', '支付明细序列', '含支付时间戳明细', ['模型特征'], 74.5, '每日', '高远', '数据平台序列组', '-'],

  // LLM 标签
  ['llm_tag', 'general', 'LLM 兴趣关键词', '大模型抽取的兴趣关键词', ['推荐召回'], 89.4, '每周', '罗曼', 'LLM 平台组', '-'],
  ['llm_tag', 'controlled', 'LLM 心理倾向', '深层心理倾向推断', ['数据分析'], 72.3, '每月', '罗曼', 'LLM 平台组', '-'],

  // 小端
  ['small_end', 'general', '小端活跃度', '小端用户活跃分层', ['数据分析'], 90.1, '每周', '朱敏', '小端运营组', '-'],
  ['small_end', 'controlled', '小端消费偏好', '小端场景消费偏好', ['推荐召回', '模型特征'], 76.9, '每周', '朱敏', '小端运营组', '-'],

  // 外采
  ['external', 'sensitive', '外采竞品行为', '外采竞品 App 使用行为', ['模型特征'], 45.6, '每月', '安全合规组', '安全组', '外采'],
  ['external', 'sensitive', '外采信用评分', '第三方信用评分', ['API 服务'], 52.1, '每月', '安全合规组', '安全组', '外采'],
  ['external', 'sensitive', '外采位置画像', '第三方位置画像', ['数据分析'], 40.8, '每月', '安全合规组', '安全组', '外采'],

  // 补充 - 开放级
  ['ecom_dmp', 'open', '性别覆盖分布', '性别聚合分布', ['数据分析'], 100.0, '每周', '张伟', '电商DMP运营组', 'P2'],
  ['ls_ldmp', 'open', '大盘活跃趋势', '生服大盘活跃趋势', ['数据分析'], 100.0, '每日', '王芳', '生服画像组', 'L1']
]

const statuses = ['none', 'granted', 'pending', 'expiring', 'granted', 'granted', 'none', 'rejected', 'granted', 'none', 'granted', 'expiring']

function pickStatus(index, level) {
  // 高敏默认多为未申请
  if (level === 'sensitive') {
    const pool = ['none', 'none', 'pending', 'granted', 'rejected', 'frozen']
    return pool[index % pool.length]
  }
  return statuses[index % statuses.length]
}

export const TAGS = rawTags.map(([domain, level, name, desc, scenes, coverage, freq, owner, ownerTeam, originalLevel], i) => {
  const domainInfo = SOURCE_DOMAINS.find(d => d.key === domain)
  const status = pickStatus(i, level)
  return {
    id: `tag_${String(i + 1).padStart(4, '0')}`,
    name,
    description: desc,
    sourceDomain: domain,
    sourceDomainLabel: domainInfo?.label || domain,
    unifiedLevel: level,
    originalLevel,
    coverage,
    updateFrequency: freq,
    version: 'v1.2',
    isOfficial: i < 20,
    owner,
    ownerTeam,
    scenes,
    permissionStatus: status,
    callCount7d: Math.round(1000 + Math.random() * 50000),
    callCount30dTrend: Array.from({ length: 30 }, () => Math.round(500 + Math.random() * 4000)),
    grantedUsers: Math.round(5 + Math.random() * 80),
    validUntil: status === 'granted' ? '2026-10-15' : (status === 'expiring' ? '2026-07-22' : null),
    createdAt: '2026-01-15'
  }
})

// ========= 用户 =========
export const CURRENT_USER = {
  id: 'u_1001',
  name: '孙淼璐',
  team: '交易增长-算法组',
  email: 'sunmiaolu@example.com',
  avatar: '孙'
}

// ========= 权限申请单 =========
export const APPLICATIONS = [
  {
    id: 'APP-2026070101',
    tagIds: ['tag_0004', 'tag_0011'],
    tagNames: ['消费力分层', '到店偏好品类'],
    applicant: '孙淼璐',
    team: '交易增长-算法组',
    purpose: '用于新客补贴模型特征输入，提升 ROI',
    scene: '模型特征',
    method: 'Hive Join',
    duration: 90,
    highestLevel: 'controlled',
    status: 'pending',
    submitAt: '2026-07-08 14:23',
    currentNode: 'Owner 审批',
    approver: '李娜',
    timeline: [
      { time: '2026-07-08 14:23', node: '提交申请', operator: '孙淼璐', status: 'done' },
      { time: '2026-07-08 14:24', node: '路由到 Owner', operator: '系统', status: 'done' },
      { time: '', node: 'Owner 审批', operator: '李娜', status: 'active' },
      { time: '', node: 'ACL 生效', operator: '系统', status: 'pending' }
    ]
  },
  {
    id: 'APP-2026070102',
    tagIds: ['tag_0007'],
    tagNames: ['支付方式偏好'],
    applicant: '孙淼璐',
    team: '交易增长-算法组',
    purpose: '风控预警场景',
    scene: 'API 服务',
    method: '在线特征',
    duration: 30,
    highestLevel: 'sensitive',
    status: 'pending',
    submitAt: '2026-07-06 10:11',
    currentNode: '源头合规审批',
    approver: '电商 DMP 合规',
    timeline: [
      { time: '2026-07-06 10:11', node: '提交申请', operator: '孙淼璐', status: 'done' },
      { time: '2026-07-06 10:12', node: '跳转 DMP 合规', operator: '系统', status: 'done' },
      { time: '', node: 'DMP 合规审批', operator: '电商 DMP 合规', status: 'active' }
    ]
  },
  {
    id: 'APP-2026070103',
    tagIds: ['tag_0002'],
    tagNames: ['年龄段'],
    applicant: '王小明',
    team: '广告策略组',
    purpose: '广告定向',
    scene: '营销投放',
    method: '人群包',
    duration: 180,
    highestLevel: 'general',
    status: 'granted',
    submitAt: '2026-07-05 09:00',
    currentNode: '已授权',
    approver: '系统自动',
    timeline: [
      { time: '2026-07-05 09:00', node: '提交申请', operator: '王小明', status: 'done' },
      { time: '2026-07-05 09:01', node: '自助审批通过', operator: '系统', status: 'done' },
      { time: '2026-07-05 09:01', node: 'ACL 生效', operator: '系统', status: 'done' }
    ]
  },
  {
    id: 'APP-2026070104',
    tagIds: ['tag_0013'],
    tagNames: ['常驻 POI'],
    applicant: '陈鹏',
    team: '推荐算法组',
    purpose: '本地生活个性化推荐特征',
    scene: '推荐召回',
    method: 'Hive Join',
    duration: 30,
    highestLevel: 'sensitive',
    status: 'rejected',
    submitAt: '2026-07-04 16:40',
    currentNode: '被拒绝',
    approver: 'LDMP 权限中心',
    rejectReason: '未提供最小必要范围说明，请补充脱敏方式后重新提交。',
    timeline: [
      { time: '2026-07-04 16:40', node: '提交申请', operator: '陈鹏', status: 'done' },
      { time: '2026-07-04 16:41', node: '跳转 LDMP', operator: '系统', status: 'done' },
      { time: '2026-07-04 20:12', node: '被拒绝', operator: 'LDMP 权限中心', status: 'done' }
    ]
  },
  {
    id: 'APP-2026070105',
    tagIds: ['tag_0021'],
    tagNames: ['明细浏览序列'],
    applicant: '孙淼璐',
    team: '交易增长-算法组',
    purpose: '推荐排序模型训练',
    scene: '模型特征',
    method: 'Hive Join',
    duration: 90,
    highestLevel: 'controlled',
    status: 'granted',
    submitAt: '2026-06-20 11:30',
    currentNode: '已授权（即将到期）',
    approver: '高远',
    timeline: [
      { time: '2026-06-20 11:30', node: '提交申请', operator: '孙淼璐', status: 'done' },
      { time: '2026-06-20 15:00', node: 'Owner 审批通过', operator: '高远', status: 'done' },
      { time: '2026-06-20 15:01', node: 'ACL 生效', operator: '系统', status: 'done' }
    ]
  }
]

// ========= Owner 待审批列表（作为 Owner 视角）=========
export const OWNER_PENDING = [
  {
    id: 'APP-2026070201',
    applicant: '陈斌',
    team: '交易营销组',
    tags: ['消费力分层', 'LTV 预测'],
    scene: '营销投放',
    purpose: '大促人群圈选，投放 5000 万级人群',
    duration: 90,
    highestLevel: 'controlled',
    submitAt: '2026-07-09 09:12',
    slaLeft: '54h',
    risk: '常规'
  },
  {
    id: 'APP-2026070202',
    applicant: '李昱',
    team: '搜索算法组',
    tags: ['品类偏好 Top3'],
    scene: '模型特征',
    purpose: '搜索排序模型特征',
    duration: 90,
    highestLevel: 'controlled',
    submitAt: '2026-07-09 14:22',
    slaLeft: '58h',
    risk: '常规'
  },
  {
    id: 'APP-2026070203',
    applicant: '张昊',
    team: '广告投放组',
    tags: ['消费力分层'],
    scene: '营销投放',
    purpose: '广告定向',
    duration: 180,
    highestLevel: 'controlled',
    submitAt: '2026-07-06 17:00',
    slaLeft: '7h',
    risk: '即将超时'
  },
  {
    id: 'APP-2026070204',
    applicant: '范伟',
    team: '数据分析组',
    tags: ['明细浏览序列'],
    scene: '数据分析',
    purpose: '专题分析 Q3 用户流失',
    duration: 30,
    highestLevel: 'controlled',
    submitAt: '2026-07-10 08:00',
    slaLeft: '69h',
    risk: '常规'
  }
]

// ========= 审计日志 =========
const scenesPool = ['人群圈选', '用户 360', '模型特征', '营销投放', '数据分析', 'API 服务']
const actionsPool = ['申请', '审批', '授权', '调用', '续期', '回收', '冻结']
const resultsPool = ['success', 'success', 'success', 'blocked', 'success']
const usersPool = ['孙淼璐', '陈斌', '李昱', '张昊', '王小明', '徐斌', '林霞', '范伟', '刘峰']

export const AUDIT_LOGS = Array.from({ length: 120 }).map((_, i) => {
  const tag = TAGS[i % TAGS.length]
  const action = actionsPool[i % actionsPool.length]
  const result = resultsPool[i % resultsPool.length]
  const date = new Date(2026, 6, 10, 9 - Math.floor(i / 15), 59 - (i % 60))
  return {
    id: `AUD-${String(9000 - i).padStart(6, '0')}`,
    timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
    operator: usersPool[i % usersPool.length],
    action,
    tagId: tag.id,
    tagName: tag.name,
    sourceDomain: tag.sourceDomainLabel,
    unifiedLevel: tag.unifiedLevel,
    scene: scenesPool[i % scenesPool.length],
    result,
    reason: result === 'blocked' ? '权限不足 / 场景不匹配' : ''
  }
})

// ========= 异常事件 =========
export const ANOMALY_EVENTS = [
  { id: 'ANO-001', type: '高频调用', tag: '风控评分', operator: '刘峰', team: '电商风控组', level: 'sensitive', detectedAt: '2026-07-10 03:12', status: '已通知', severity: 'high' },
  { id: 'ANO-002', type: '越权尝试', tag: '常驻 POI', operator: '陈鹏', team: '推荐算法组', level: 'sensitive', detectedAt: '2026-07-09 22:41', status: '已封禁', severity: 'high' },
  { id: 'ANO-003', type: '跨场景使用', tag: '消费力分层', operator: '王小明', team: '广告策略组', level: 'controlled', detectedAt: '2026-07-09 15:08', status: '拦截补申请', severity: 'medium' },
  { id: 'ANO-004', type: '批量导出', tag: '明细浏览序列', operator: '范伟', team: '数据分析组', level: 'controlled', detectedAt: '2026-07-09 11:20', status: '二次审批', severity: 'medium' },
  { id: 'ANO-005', type: '非工时调用', tag: '外采信用评分', operator: '未知服务', team: '-', level: 'sensitive', detectedAt: '2026-07-08 02:35', status: '已限流', severity: 'high' },
  { id: 'ANO-006', type: '高敏集中申请', tag: '多个', operator: '陈鹏', team: '推荐算法组', level: 'sensitive', detectedAt: '2026-07-07 10:12', status: '人工复核', severity: 'high' }
]

// ========= 无主标签 =========
export const ORPHAN_TAGS = [
  { tagId: 'tag_0999', tagName: '内容偏好深度分层', ownerLast: '离职员工A', sourceDomain: 'AI 用户画像', unifiedLevel: 'controlled', ownerTeam: 'AI 画像组', markedAt: '2026-06-28', status: '待认领' },
  { tagId: 'tag_0998', tagName: '广告场景敏感度', ownerLast: '离职员工B', sourceDomain: '广告', unifiedLevel: 'general', ownerTeam: '广告策略组', markedAt: '2026-06-30', status: '待认领' },
  { tagId: 'tag_0997', tagName: '实验人群标签', ownerLast: '转岗员工C', sourceDomain: '电商 DMP', unifiedLevel: 'general', ownerTeam: '电商画像组', markedAt: '2026-07-02', status: 'Team 兜底' }
]

// ========= 推荐组合 =========
export const RECOMMEND_BUNDLES = [
  {
    id: 'BUNDLE-1',
    title: '大促精准营销组合',
    description: '面向大促场景的高转化人群圈选',
    tagIds: ['tag_0001', 'tag_0002', 'tag_0004', 'tag_0005'],
    scene: '营销投放',
    highestLevel: 'controlled',
    estimateApproval: 'Owner 审批 24-72h',
    coverage: 92.1
  },
  {
    id: 'BUNDLE-2',
    title: '本地生活推荐特征包',
    description: '生服 LDMP 推荐排序模型特征',
    tagIds: ['tag_0010', 'tag_0011', 'tag_0012'],
    scene: '推荐召回',
    highestLevel: 'controlled',
    estimateApproval: 'Owner 审批 24-72h',
    coverage: 84.7
  },
  {
    id: 'BUNDLE-3',
    title: '用户画像轻量分析包',
    description: '基础属性 + 兴趣分层，快速自助',
    tagIds: ['tag_0001', 'tag_0002', 'tag_0003', 'tag_0017'],
    scene: '数据分析',
    highestLevel: 'general',
    estimateApproval: '自助 + 留痕',
    coverage: 96.3
  }
]

// ========= 首页看板数据 =========
export const DASHBOARD_KPI = {
  totalTags: TAGS.length,
  metaComplete: 96.4,
  onlineDomains: SOURCE_DOMAINS.length,
  activeConsumers: 328,
  monthlyApplications: 1247,
  approvalPassRate: 87.6,
  avgApprovalHours: 18.4,
  orphanTags: ORPHAN_TAGS.length,
  anomaliesToday: 6
}

// 分级分布
export function levelDistribution() {
  const dist = { open: 0, general: 0, controlled: 0, sensitive: 0 }
  TAGS.forEach(t => dist[t.unifiedLevel]++)
  return dist
}

// 来源域分布
export function domainDistribution() {
  const dist = {}
  SOURCE_DOMAINS.forEach(d => (dist[d.label] = 0))
  TAGS.forEach(t => (dist[t.sourceDomainLabel] = (dist[t.sourceDomainLabel] || 0) + 1))
  return dist
}

// 近 14 天申请趋势
export const APPLICATION_TREND = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 5, 27 + i)
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    submitted: Math.round(30 + Math.random() * 40),
    approved: Math.round(20 + Math.random() * 35),
    rejected: Math.round(Math.random() * 8)
  }
})

// 热门 TOP 标签（按调用量）
export function hotTags(limit = 8) {
  return [...TAGS].sort((a, b) => b.callCount7d - a.callCount7d).slice(0, limit)
}
