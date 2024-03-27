<template>
  <div class="container">
    <label for="file"> {{ file?.name||'selecionar arquivo' }} </label>
    <input
      id="file"
      type="file"
      @change="handleFileUpload"
      accept=".csv"
      class="file-input"
    />
    <button @click="uploadFile" class="upload-button">Upload</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      file: null as File | null,
    };
  },
  methods: {
    handleFileUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.file = target.files[0];
      }
    },
    async uploadFile() {
      if (!this.file) {
        alert("Selecione um arquivo CSV primeiro.");
        return;
      }
    },
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

.container label {
  margin-top: 20px;
  margin-bottom: 20px;
 background-color: rgb(0, 82, 206);
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  color: white;
}

.container label:hover {
  background-color: rgb(0, 22, 59);

}

.container input {
  display: none;
}

.container button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.container button:hover {
  background-color: #45a049;
}
</style>
