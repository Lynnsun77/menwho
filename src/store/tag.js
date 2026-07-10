import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TAGS, APPLICATIONS } from '@/mock/data.js'

export const useTagStore = defineStore('tag', () => {
  const tags = ref(TAGS.map(t => ({ ...t })))
  const applications = ref(APPLICATIONS.map(a => ({ ...a })))

  const myGrantedTags = computed(() =>
    tags.value.filter(t => t.permissionStatus === 'granted' || t.permissionStatus === 'expiring')
  )
  const myPendingTags = computed(() =>
    tags.value.filter(t => t.permissionStatus === 'pending')
  )

  function findTag(id) {
    return tags.value.find(t => t.id === id)
  }

  function applyForTags(tagIds, form) {
    // 计算最高分级
    const levelOrder = ['open', 'general', 'controlled', 'sensitive']
    let highest = 'open'
    tagIds.forEach(id => {
      const t = findTag(id)
      if (!t) return
      if (levelOrder.indexOf(t.unifiedLevel) > levelOrder.indexOf(highest)) {
        highest = t.unifiedLevel
      }
      // 更新标签权限状态为申请中
      if (t.permissionStatus === 'none' || t.permissionStatus === 'rejected' || t.permissionStatus === 'expired') {
        t.permissionStatus = highest === 'general' || highest === 'open' ? 'granted' : 'pending'
        if (t.permissionStatus === 'granted') {
          t.validUntil = '2027-01-15'
        }
      }
    })
    const now = new Date()
    const id = 'APP-' + now.getTime().toString().slice(-10)
    const auto = highest === 'general' || highest === 'open'
    const app = {
      id,
      tagIds: [...tagIds],
      tagNames: tagIds.map(id => findTag(id)?.name || id),
      applicant: '孙淼璐',
      team: '交易增长-算法组',
      purpose: form.purpose,
      scene: form.scene,
      method: form.method || '-',
      duration: form.duration,
      highestLevel: highest,
      status: auto ? 'granted' : 'pending',
      submitAt: now.toISOString().replace('T', ' ').substring(0, 19),
      currentNode: auto ? '已授权' : (highest === 'sensitive' ? '源头合规审批' : 'Owner 审批'),
      approver: auto ? '系统自动' : (highest === 'sensitive' ? '源头合规系统' : '标签 Owner'),
      timeline: [
        { time: now.toISOString().replace('T', ' ').substring(0, 19), node: '提交申请', operator: '孙淼璐', status: 'done' },
        { time: auto ? now.toISOString().replace('T', ' ').substring(0, 19) : '', node: auto ? '自助审批通过' : (highest === 'sensitive' ? '跳转源头合规' : '路由到 Owner'), operator: '系统', status: auto ? 'done' : 'done' },
        auto
          ? { time: now.toISOString().replace('T', ' ').substring(0, 19), node: 'ACL 生效', operator: '系统', status: 'done' }
          : { time: '', node: highest === 'sensitive' ? '合规审批' : 'Owner 审批', operator: '待处理', status: 'active' }
      ]
    }
    applications.value.unshift(app)
    return app
  }

  return { tags, applications, myGrantedTags, myPendingTags, findTag, applyForTags }
})
