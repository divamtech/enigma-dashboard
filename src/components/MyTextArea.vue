<template>
  <div class="textarea-wrapper">
    <div class="line-numbers" ref="lineNumbers">
      <span v-for="(line, index) in lineNumbersArray" :key="index">{{ index + 1 }}</span>
    </div>
    <textarea
      :disabled="disabled"
      ref="textarea"
      v-model="localValue"
      @blur="emitUpdate"
      @input="updateLineNumbers"
      @scroll="syncScroll"
      rows="10"
      class="textarea"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits } from 'vue'

// Props to receive initial content from parent component

const props = defineProps({
  modelValue: String,
  mode: String,
  disabled: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  },
)

const emitUpdate = () => {
  emits('update:modelValue', localValue.value)
}

// Compute line numbers based on content
const lineNumbersArray = computed(() => {
  return localValue.value.split('\n')
})

// Update line numbers (can be triggered by @input)
const updateLineNumbers = () => {
  // The computed property automatically updates
}

// Synchronize scrolling between line numbers and textarea
const syncScroll = () => {
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

const textareaRef = ref(null)
const lineNumbersRef = ref(null)

// Watch for changes in content to ensure line numbers stay updated

// Initialize line numbers when the component mounts
onMounted(() => {
  updateLineNumbers()
})
</script>

<style scoped>
.textarea-wrapper {
  display: flex;
  position: relative;
}

.line-numbers {
  background: #f0f0f0;
  padding: 10px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  width: 50px; /* Adjust according to your needs */
}

.line-numbers span {
  display: block;
  height: 1.5em; /* Adjust according to your line height */
}

.textarea {
  border: none;
  outline: none;
  padding: 10px;
  width: calc(100% - 50px); /* Adjust to fit the line numbers width */
  resize: none;
  overflow: auto;
  line-height: 1.5em; /* Adjust according to your line height */
  font-family: monospace;
}
</style>
