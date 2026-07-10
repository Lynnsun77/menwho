<template>
  <span class="level-tag" :class="colorClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { UNIFIED_LEVELS } from '@/mock/constants.js'

const props = defineProps({
  level: { type: String, required: true }
})

const info = computed(() => UNIFIED_LEVELS[props.level] || UNIFIED_LEVELS.general)
const label = computed(() => info.value.label)
const colorClass = computed(() => info.value.color)
</script>
