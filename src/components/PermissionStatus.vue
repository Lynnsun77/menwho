<template>
  <span class="perm-status">
    <span class="status-dot" :class="info.dot"></span>
    {{ info.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { PERMISSION_STATUS } from '@/mock/constants.js'

const props = defineProps({
  status: { type: String, required: true }
})

const info = computed(() => PERMISSION_STATUS[props.status] || PERMISSION_STATUS.none)
</script>

<style scoped>
.perm-status {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
