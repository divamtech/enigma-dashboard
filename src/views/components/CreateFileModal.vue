<template>
  <div v-if="props.isVisible" class="modal fade show d-block" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create {{props.belongsTo }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Please Enter the {{props.belongsTo }} Name.</p>
          <input v-model="pathNode" placeholder="Enter Name" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="saveChanges">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  belongsTo: String
});
const pathNode = ref("")
const emit = defineEmits(['update:isVisible']);



const closeModal=()=> {
  emit('update:isVisible', false);
}
function saveChanges() {
  const type =props.belongsTo
  emit('save-path', pathNode.value,type); // Emit the path to the parent component
  closeModal();
  pathNode.value=""
}

</script>

<style scoped>
.modal.show {
  display: block;
}
</style>
