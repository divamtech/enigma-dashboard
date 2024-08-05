<template>
  <li>
    <div @click="toggleOpen">
      <span v-if="isFolder">{{ isOpen ? '📂' : '📁' }} {{ name }}</span>
      <span v-else>📄 {{ name }}</span>
    </div>
    <ul v-if="isFolder && isOpen">
      <ShowFileStructure
        v-for="(child, key) in node"
        :key="key"
        :node="child"
        :name="key"
      />
    </ul>
    <div v-if="!isFolder && isOpen">
      <pre>{{ node }}</pre>
    </div>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  node: {
    type: [Object, String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const isOpen = ref(false);

const isFolder = computed(() => typeof props.node === 'object');

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 1em;
}

li {
  cursor: pointer;
}
</style>
