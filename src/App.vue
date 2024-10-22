<template>
  <div class="app-container">
    <CountdownTimer v-if="!showInfo" />
    <InfoPage v-else />
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import CountdownTimer from "./components/CountdownTimer.vue";
import InfoPage from "./components/InfoPage.vue";
const showInfo = ref(false);

const toggleInfo = () => {
  showInfo.value = !showInfo.value;
};

provide("showInfo", showInfo);
provide("toggleInfo", toggleInfo);
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
