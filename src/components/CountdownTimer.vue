<template>
  <div class="countdown-container" :class="{ 'is-running': isRunning }">
    <!-- Active Task -->
    <div class="confetti-container">
      <div id="confetti" ref="confetti"></div>
      <input
        v-model="activeTask"
        type="text"
        placeholder="Enter task"
        @keyup.enter="handleEnter"
        class="active-task-input"
        :class="{ 'opacity-0': confettiIsActive }"
      />
    </div>

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
      <button
        @click="toggleWakeLock"
        class="button icon"
        :class="{ ghost: !isWakeLockActive }"
        tabindex="0"
      >
        <Lightbulb v-if="isWakeLockActive" />
        <LightbulbOff v-else />
      </button>
      <button @click="toggleInfo" class="button icon ghost" tabindex="0">
        <Info />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, onMounted, watch, inject } from "vue";
import NumberSlider from "./NumberSlider.vue";
import {
  Play,
  Pause,
  RefreshCcw,
  Info,
  Lightbulb,
  LightbulbOff,
} from "lucide-vue-next";

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isRunning = ref(false);
const confetti = ref(null);
const confettiIsActive = ref(false);
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
      toggleConfetti(); // Add this line to trigger confetti when timer reaches zero
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

const isWakeLockActive = ref(false);
let wakeLock = null;

async function toggleWakeLock() {
  if (!isWakeLockActive.value) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      isWakeLockActive.value = true;
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  } else {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
    isWakeLockActive.value = false;
  }
}

function initConfetti() {
  let confetti = new Confetti("confetti");
  confetti.setCount(75);
  confetti.setSize(1);
  confetti.setPower(25);
  confetti.setFade(false);
  confetti.destroyTarget(true);
}

function toggleConfetti() {
  confettiIsActive.value = true;
  const rect = confetti.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const bottomY = rect.bottom;

  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: centerX,
    clientY: bottomY,
  });

  confetti.value.dispatchEvent(event);

  setTimeout(() => {
    confettiIsActive.value = false;
  }, 3000);
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (wakeLock) wakeLock.release();
});

// Load saved timer state from localStorage
onMounted(() => {
  loadTimerState();
  initConfetti();
});

// Save timer state to localStorage whenever it changes
watch([hours, minutes, seconds, isRunning, activeTask], saveTimerState, {
  deep: true,
});

const toggleInfo = inject("toggleInfo");
</script>

<style scoped>
.countdown-container {
  --transform-distance: 2rem;
}

.countdown-container {
  z-index: 0;
  display: grid;
  grid-template-rows: auto auto auto;
  justify-items: center;
  max-width: 100%;
  transition: gap 0.3s ease;
}

.countdown-container.is-running .active-task-input {
  transform: translateY(var(--transform-distance));
}

.countdown-timer {
  user-select: none;
  width: 100%;
  z-index: 0;
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
  gap: 15px;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.countdown-container.is-running .controls {
  opacity: 0;
  transform: translateY(calc(-1 * var(--transform-distance)));
}

.countdown-container.is-running:hover .controls {
  opacity: 1;
}

.confetti-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.confetti-container #confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(-100%);
}

.active-task-input {
  background-color: transparent;
  font-size: calc(var(--number-size) / 2);
  font-weight: 700;
  border: none;
  color: white;
  padding: 0;
  text-align: center;
  transition: transform 0.3s ease, opacity 0.2s ease;
  height: 100%;
}

.active-task-input:focus {
  outline: none;
}

.active-task-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>
