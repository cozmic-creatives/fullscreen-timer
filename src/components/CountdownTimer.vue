<template>
  <div class="countdown-timer">
    <div class="sliders">
      <NumberSlider
        :finalNumber="23"
        v-model:activeNumber="hours"
        :isRunning="isRunning"
        tabindex="0"
      />
      <div class="colon">:</div>
      <NumberSlider
        :finalNumber="59"
        v-model:activeNumber="minutes"
        :isRunning="isRunning"
        tabindex="0"
      />
      <div class="colon">:</div>
      <div class="seconds-display">
        {{ formatNumber(seconds) }}
      </div>
    </div>
    <button @click="handleButtonClick" class="toggle-button" tabindex="0">
      {{ isRunning ? "Pause" : "Start" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";
import NumberSlider from "./NumberSlider.vue";

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isRunning = ref(false);
let timer = null;

const totalSeconds = computed(() => {
  return hours.value * 3600 + minutes.value * 60 + seconds.value;
});

function formatNumber(value) {
  return value.toString().padStart(2, "0");
}

function toggleTimer() {
  isRunning.value ? pauseTimer() : startTimer();
}

function startTimer() {
  if (totalSeconds.value === 0) return;

  isRunning.value = true;
  timer = setInterval(() => {
    if (totalSeconds.value > 0) {
      if (seconds.value > 0) {
        seconds.value--;
      } else if (minutes.value > 0) {
        minutes.value--;
        seconds.value = 59;
      } else {
        hours.value--;
        minutes.value = 59;
        seconds.value = 59;
      }
    } else {
      pauseTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning.value = false;
  clearInterval(timer);
}

function handleButtonClick(event) {
  toggleTimer();
  if (document.activeElement === event.target) event.target.blur();
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.countdown-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sliders {
  display: flex;
  justify-content: center;
  height: 120px;
  position: relative;
  overflow: hidden;
  gap: 10px;
}

.seconds-display {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.toggle-button {
  width: 100%;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid gray;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease; /* Add smooth transition for visual changes */
  margin-top: 10px;
}

.toggle-button:hover {
  outline: none;
  background-color: #f0f0f0; /* Light gray background on hover */
}

.toggle-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); /* Blue glow effect */
  border-color: #007bff; /* Change border color when focused */
}

.colon {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
