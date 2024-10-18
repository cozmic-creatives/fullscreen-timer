<template>
  <div class="countdown-wrapper">
    <div class="countdown-container" :class="{ 'is-running': isRunning }">
      <!-- Active Task -->
      <input
        v-model="activeTask"
        type="text"
        placeholder="Enter task"
        @keyup.enter="handleEnter"
        class="active-task-input"
      />

      <!-- Countdown Timer -->
      <div class="countdown-timer">
        <div class="sliders">
          <NumberSlider
            :finalNumber="23"
            v-model:activeNumber="hours"
            :isRunning="isRunning"
          />
          <div class="colon">:</div>
          <NumberSlider
            :finalNumber="59"
            v-model:activeNumber="minutes"
            :isRunning="isRunning"
          />
          <div class="colon">:</div>
          <NumberSlider v-model:activeNumber="seconds" :scrollable="false" />
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button @click="handleButtonClick" class="button icon" tabindex="0">
          <Play v-if="!isRunning" />
          <Pause v-else />
        </button>
        <button @click="resetTimer" class="button icon" tabindex="0">
          <RefreshCcw />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, onMounted, watch } from "vue";
import NumberSlider from "./NumberSlider.vue";
import { Play, Pause, RefreshCcw } from "lucide-vue-next";

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(3);
const isRunning = ref(false);
let timer = null;

const activeTask = ref(""); // Add this line

const totalSeconds = computed(() => {
  return hours.value * 3600 + minutes.value * 60 + seconds.value;
});

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

function resetTimer() {
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
}

function handleButtonClick(event) {
  toggleTimer();
  if (document.activeElement === event.target) event.target.blur();
}

function saveTimerState() {
  localStorage.setItem(
    "timerState",
    JSON.stringify({
      hours: hours.value,
      minutes: minutes.value,
      seconds: seconds.value,
      isRunning: isRunning.value,
      activeTask: activeTask.value, // Add this line
    })
  );
}

function loadTimerState() {
  const savedState = JSON.parse(localStorage.getItem("timerState"));
  if (savedState) {
    hours.value = savedState.hours;
    minutes.value = savedState.minutes;
    seconds.value = savedState.seconds;
    isRunning.value = savedState.isRunning;
    activeTask.value = savedState.activeTask || ""; // Add this line
    if (isRunning.value) {
      startTimer();
    }
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// Load saved timer state from localStorage
onMounted(loadTimerState);

// Save timer state to localStorage whenever it changes
watch([hours, minutes, seconds, isRunning, activeTask], saveTimerState, {
  deep: true,
});
</script>

<style scoped>
.countdown-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.countdown-container {
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 1rem;
  justify-items: center;
  max-width: 100%;
  transition: gap 0.3s ease;
}

.countdown-container.is-running {
  gap: 0;
}

.countdown-timer {
  user-select: none;
  width: 100%;
}

.sliders {
  display: grid;
  grid-template-columns: repeat(5, auto);
  justify-content: center;
  align-items: center;
  height: var(--slider-height);
  position: relative;
  overflow: hidden;
}

.colon {
  font-size: calc(var(--slider-height) * 0.4);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  line-height: 1;
  padding-bottom: calc(var(--slider-height) * 0.05);
}

.sliders::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    black 10%,
    transparent 33%,
    transparent 67%,
    black 90%
  );
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.countdown-container.is-running .sliders::before {
  background: linear-gradient(
    to bottom,
    black 0% 33%,
    transparent 33% 67%,
    black 67% 100%
  );
}

.controls {
  display: flex;
  gap: 12px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.countdown-container.is-running .controls {
  opacity: 0;
}

.countdown-container.is-running:hover .controls {
  opacity: 1;
}

.active-task-input {
  background-color: transparent;
  font-size: calc(var(--number-size) / 2);
  font-weight: 700;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.active-task-input:focus {
  outline: none;
}

.active-task-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .countdown-container {
    gap: 1rem;
    padding: 1rem;
  }

  .active-task-input {
    font-size: calc(var(--number-size) / 4);
    padding: 6px 12px;
  }
}
</style>
