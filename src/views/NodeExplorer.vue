<template>
  <div class="card p-3 mt-3">Current Path: {{ currentPath.join('/') || '/' }}</div>
  <div class="bg-white">
    <div class="p-1 mt-1">
      <div class="mb-2 d-flex position-relative">
        <button @click="navigateBack" class="btn btn-secondary btn-sm">Back</button>
        <div class="d-flex position-absolute top-0 end-1 gap-1" v-if="!isFileOpen">
          <div>
            <button @click="createFolder()" class="btn btn-secondary btn-sm">Add New Folder</button>
          </div>
          <div>
            <button @click="createFile()" class="btn btn-secondary btn-sm">Add New File</button>
          </div>
        </div>
      </div>
      <!-- Modal for creating files and folders -->
      <CreateFileModal
        @save-path="handleSavePath"
        :isVisible="openFileModal"
        :belongsTo="createdFolderType"
        @update:isVisible="openFileModal = $event"
      />
      <!-- Folder and file listing -->
      <div class="folder-container">
        <div v-for="folder in folders" :key="folder.id" class="folder-item" @dblclick="handleFolderClick(folder)">
          <template v-if="!isFileOpen">
            <span v-if="folder.type === 'folder'">
              <img class="svgImage" src="../assets/img/small-logos/folder.svg" />
            </span>
            <span v-else>
              <img class="svgImage" src="../assets/img/small-logos/file.svg" />
            </span>
            <div>{{ folder.name }}</div>
          </template>
        </div>
      </div>

      <!-- Render Rtl component only when a file is open -->
      <div v-if="isFileOpen">
        <h2>File Data:</h2>
        <div>
          <Rtl :data="selectedFileData" :nodeId="fileNodeId" />
        </div>
      </div>

      <!-- Warning message -->
      <div class="card">
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
import Rtl from './Rtl.vue'
import CreateFileModal from './components/CreateFileModal.vue'
import { useRouter } from 'vue-router'

const currentPath = ref([])
const folders = ref([])
const selectedFileData = ref(null)
const warningMessage = ref('')
const currentFolderId = ref(null)
const folderStack = ref([])
const openFileModal = ref(false)
const createdFolderType = ref('')
const isFileOpen = ref(false)
const fileNodeId = ref(null)

const router = useRouter()

const fetchFolders = async (folderId) => {
  try {
    const response = await api.get('/api/service/get-nodes', {
      params: { folderId },
    })
    folders.value = response.data
    currentFolderId.value = folderId
    console.log('Fetched folders:', folders.value)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return []
  }
}

// Handle create file
const createFile = () => {
  openFileModal.value = true
  createdFolderType.value = 'file'
}

// Handle create folder
const createFolder = () => {
  openFileModal.value = true
  createdFolderType.value = 'folder'
}

// Handle saving the path node
const handleSavePath = async (pathNode, type) => {
  console.log(pathNode, 'type', type)

  const newNode = {
    parentId: currentFolderId.value,
    name: pathNode,
    type: type,
    data: type === 'file' ? pathNode.data : null,
  }
  console.log('newnodedata', newNode)
  try {
    const response = await api.post('/api/service/save-node', newNode)

    if (type === 'folder') {
      folders.value.push({
        id: response.data.id,
        name: pathNode,
        type: 'folder',
        children: [],
      })
    } else if (type === 'file') {
      folders.value.push({
        id: response.data.id,
        name: pathNode,
        type: 'file',
        data: pathNode.data || null,
      })
    }

    currentPath.value.push(pathNode)

    console.log('New node saved and added locally:', response.data)
  } catch (error) {
    console.error('Error saving the new node to the backend:', error)
  }
}

// Handle the folder click event
const handleFolderClick = async (folder) => {
  if (folder.type === 'folder') {
    folderStack.value.push(currentFolderId.value) // Push the current folder id onto the stack
    const children = await fetchFolders(folder.id)
    selectedFileData.value = null
    warningMessage.value = ''
    if (!currentPath.value.includes(folder.name)) {
      currentPath.value.push(folder.name)
    }
    router.push({ name: 'Folders', params: { folderId: currentFolderId.value } })
    // Update the current folder to include its children
    const folderData = folders.value.find((f) => f.id === folder.id)
    if (folderData) {
      folderData.children = children
    }
  } else if (folder.type === 'file') {
    handleFileClick(folder)
  }
}

// Handle the file click event
const handleFileClick = (file) => {
  isFileOpen.value = true
  selectedFileData.value = file.data || null
  warningMessage.value = file.data ? '' : 'No data available for this file.'
  if (!currentPath.value.includes(file.name)) {
    currentPath.value.push(file.name)
  }
  fileNodeId.value = file.id
  router.push({ name: 'Folders', params: { folderId: file.parentId, fileId: file.id } })
  const fileData = file.data
  if (fileData) {
    selectedFileData.value = fileData
    warningMessage.value = ''
  } else {
    selectedFileData.value = null
    warningMessage.value = 'No data available for this file.'
  }
}

// Navigate back to the previous folder
const navigateBack = async () => {
  // Close the file if it's open
  if (isFileOpen.value) {
    isFileOpen.value = false
    selectedFileData.value = null
    warningMessage.value = ''
    currentPath.value.pop() // Remove the file name from the path
  } else {
    // Update the currentPath
    currentPath.value.pop()

    if (folderStack.value.length > 0) {
      const previousFolderId = folderStack.value.pop()
      await fetchFolders(previousFolderId)
    } else {
      // If at the root level
      await fetchFolders(null)
    }
  }

  // Navigate back to the previous folder
  router.push({ name: 'Folders', params: { folderId: currentFolderId.value } })
}

onMounted(() => {
  fetchFolders(null) // Start with the root folder
})
</script>

<style scoped>
.folder-container {
  display: flex;
  flex-wrap: wrap;
}

.folder-item {
  margin: 0.5rem;
  text-align: center;
  width: 120px; /* Adjust the width based on your design */
}

.svgImage {
  width: 50px; /* Adjust the size of the folder/file icon */
  height: auto;
}
</style>
