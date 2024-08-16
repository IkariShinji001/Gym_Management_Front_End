<template>
  <div class="page-container">
    <div class="search-add-div">
      <q-input outlined v-model="text" label="Search" class="search-bar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn class="add-icon" round icon="add" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const text = ref("");

    return {
      text,
    };
  },
};
</script>

<style scoped>
.page-container {
  width: 100%;
  height: 100vh;
  padding: 20px 20px;

  background-color: rgb(241, 241, 241);
}

.search-add-div {
  display: flex;
  align-items: center;
}

.search-bar {
  width: 300px;
  margin-right: 15px;
  background-color: white;
}
.add-icon {
  width: 30px;
  height: 30px;
  background-color: white;
  color: blue;
}

.add-button {
  margin-left: 20px;
}


</style>
