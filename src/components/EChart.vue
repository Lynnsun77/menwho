<template>
  <div ref="containerRef" :style="{ width, height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart, FunnelChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent,
  ToolboxComponent, MarkLineComponent, MarkAreaComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart, BarChart, PieChart, FunnelChart, ScatterChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent,
  ToolboxComponent, MarkLineComponent, MarkAreaComponent,
  LabelLayout, UniversalTransition,
  CanvasRenderer
])

const props = defineProps({
  option: { type: Object, required: true },
  width: { type: String, default: '100%' },
  height: { type: String, default: '320px' }
})

const containerRef = ref(null)
const chart = shallowRef(null)

function resize() {
  chart.value?.resize()
}

onMounted(() => {
  chart.value = echarts.init(containerRef.value)
  chart.value.setOption(props.option)
  window.addEventListener('resize', resize)
})

watch(() => props.option, (opt) => {
  chart.value?.setOption(opt, true)
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart.value?.dispose()
})
</script>
