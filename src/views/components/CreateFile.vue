
<template>
  <div>
    <!-- Create File/Folder Section -->
    <h2>Create File/Folder</h2>
    <input v-model="path" placeholder="Enter file/folder path" />
    <button @click="createFile">Create File</button>
  

    <h2>Virtual File System</h2>
  
  </div>
</template>

<script setup>
import { ref, reactive,defineEmits } from 'vue';


// Reactive virtual file system object
const virtualFileSystem = reactive({});

const emit = defineEmits(['pathCreated']);
// User input states
const path = ref('');
const content = ref('');
const isFile = ref(false);

// Function to create a file
const createFile = () => {
  isFile.value = true;
  const parts = path.value.split('/');
  let current = virtualFileSystem;
  for (let i = 0; i < parts.length; i++) {
    if (i === parts.length - 1) {
      current[parts[i]] = content.value;
    } else {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
  }
  emit('pathCreated', path.value);
  alert('Virtual file created successfully');
  path.value = '';
  content.value = '';
};


</script>

<style scoped>
/* Add your styles here */
</style>

