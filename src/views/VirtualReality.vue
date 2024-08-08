
<template>
  <div class="card p-3 mt-3">Current Path: {{ currentPath.join('/') || '/' }}</div>
  <div class="bg-white">
    <div class="card p-1 mt-1">
      <div class="mb-2">
        <button @click="navigateBack"  class="btn btn-secondary btn-sm">Back</button>
      </div>
      <ul>
        <li v-for="folder in folders" :key="folder.id">
          <div class="m-3" @dblclick="handleFolderClick(folder)">
            <span v-if="folder.type === 'folder'">
              <img class="svgImage" src="../assets/img/small-logos/folder.svg" />
            </span>
            <span v-else>
              <img class="svgImage" src="../assets/img/small-logos/file.svg" />
            </span>
            <div>{{ folder.name }}</div>
          </div>
          <!-- Recursively render child folders -->
          <VirtualReality v-if="folder.children" :folders="folder.children" />
        </li>
      </ul>

      <div class="card">
        <div v-if="selectedFileData" class="row">
          <h2>File Data:</h2>
          <pre>{{ selectedFileData }}</pre>
        </div>
        <div v-if="warningMessage">
          <p>{{ warningMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
const currentPath = ref([])
const folders = ref([])
const selectedFileData = ref(null) // To store the data of the selected file
const warningMessage = ref('')

//
const fetchPreviosFolder = async (folderId) => {
  try {
    const response = await api.get('/api/service/get-previous-nodes', {
      params: { folderId },
    })
    folders.value = response.data
    console.log('Fetched folders:', folders.value)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return []
  }
}

//

const fetchFolders = async (folderId) => {
  try {
    console.log('folder Id:', folderId)
    const response = await api.get('/api/service/get-nodes', {
      params: { folderId },
    })
    console.log('folder Id:', folderId)
    folders.value = response.data
    console.log('Fetched folders:', folders.value)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return []
  }
}

const handleFolderClick = async (folder) => {
  if (folder.type === 'folder') {
    const children = await fetchFolders(folder.id)
    selectedFileData.value = null
    warningMessage.value = ''
    if (!currentPath.value.includes(folder.name)) {
      currentPath.value.push(folder.name)
    }
    // Update the current folder to include its children
    const folderData = folders.value.find((f) => f.id === folder.id)

    if (folderData) {
      folderData.children = children
    }
  } else if (folder.type === 'file') {
    handleFileClick(folder)
  }
}

const handleFileClick = (file) => {
  selectedFileData.value = null
  warningMessage.value = ''
  // Check if the file is in the current folder
  if (!currentPath.value.includes(file.name)) {
    currentPath.value.push(file.name)
  }
  const isInCurrentFolder = folders.value.some((f) => f.id === file.id)
  if (isInCurrentFolder) {
    const fileData = file.data

    if (fileData) {
      selectedFileData.value = fileData
      warningMessage.value = ''
    } else {
      selectedFileData.value = null
      warningMessage.value = 'No data available for this file.'
    }
  } else {
    selectedFileData.value = null
    warningMessage.value = 'File is not available in the current folder.'
  }
}
//
const navigateBack = async (folder) => {
  selectedFileData.value = null
  warningMessage.value = ''
  if (currentPath.value.length >= 1) {
    currentPath.value.pop() // Remove the last segment
    if (currentPath.value.length === 0) {
      const children  = await fetchFolders(null)
      const folderData = folders.value.find((f) => f.id === folder.id)
        if (folderData) {
        folderData.children = children
      }
    } else {
      const children = await fetchPreviosFolder(folder.id)

      const folderData = folders.value.find((f) => f.id === folder.id)

      if (folderData) {
        folderData.children = children
      }
    }
  }
}

onMounted(() => {
  fetchFolders(null) // Fetch the initial list of folders
})
</script>
<style scoped>
.svgImage {
  height: 40px;
  width: auto;
}
</style>
