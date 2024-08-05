<!-- <template>
  <div>
    <input v-model="newPath" placeholder="Enter file or folder path" />
    <div><img class="svgImage" src="../../assets/img/small-logos/file.svg"  @click="createFile" /> create env file</div>
    <span><img class="svgImage" src="../../assets/img/small-logos/folder.svg" @click="createFolder" />Create Folder</span>
    <p v-if="error">{{ error }}</p>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../services/api'


const newPath = ref('')
const message = ref('')
const error = ref('')

const createFile = async () => {
  try {
    // await api.post('/api/files/create-file', { path: newPath.value })

    console.log(newPath.value)
    message.value = 'File created successfully'
  } catch (err) {
    error.value = 'Error creating file'
  }
}

const createFolder = async () => {
  try {
    await api.post('/api/files/create-folder', { path: newPath.value })
    message.value = 'Folder created successfully'
    console.log(newPath.value)
  } catch (err) {
    error.value = 'Error creating folder'
  }
}
</script>
<style scoped>
.svgImage{
  height: 30px;
  width: auto;
}
</style> -->
<template>
  <div>
    <!-- Create File/Folder Section -->
    <h2>Create File/Folder</h2>
    <input v-model="path" placeholder="Enter file/folder path" />
    <button @click="createFile">Create File</button>
  

    <!-- Virtual File System Display -->
    <h2>Virtual File System</h2>
    <ul>
      <ShowFileStructure :node="virtualFileSystem" :name="'Root'" />
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive,defineEmits } from 'vue';
import ShowFileStructure from './ShowFileStructure.vue'; // Import the FileFolderNode component

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

