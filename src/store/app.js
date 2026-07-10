import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CURRENT_USER } from '@/mock/data.js'

export const useAppStore = defineStore('app', () => {
  const currentRole = ref('consumer') // consumer | owner | admin
  const currentUser = ref({ ...CURRENT_USER })
  const collapsed = ref(false)

  function setRole(role) {
    currentRole.value = role
  }
  function toggleSidebar() {
    collapsed.value = !collapsed.value
  }

  return { currentRole, currentUser, collapsed, setRole, toggleSidebar }
})
