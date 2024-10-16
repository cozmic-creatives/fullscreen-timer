<template>
  <div
    class="number-slider"
    @wheel="handleWheel"
    @mousedown="startDrag"
    @mousemove="drag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
    @click="focus"
    @focus="focus"
    @keydown="handleKeyDown"
    ref="sliderContainer"
    :class="{ 'countdown-running': isRunning, 'is-focused': isFocused }"
  >
    <div class="slider-inner" ref="sliderInner">
      <div class="slider-item spacer"></div>
      <div
        v-for="i in finalNumber + 1"
        :key="`number-${i - 1}`"
        class="slider-item"
      >
        {{ formatNumber(i - 1) }}
      </div>
      <div class="slider-item spacer"></div>
    </div>
    <div class="active-number-box" v-if="isFocused"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  finalNumber: {
    type: Number,
    required: true,
  },
  activeNumber: {
    type: Number,
    required: true,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:activeNumber"]);

const sliderInner = ref(null);
const isDragging = ref(false);
const startY = ref(0);
const startValue = ref(0);

const itemHeight = 40;

const scrollSensitivity = 0.02; // Adjust this value as needed
let accumulatedDelta = 0; // Add this line

const isInteractive = computed(() => !props.isRunning);

const isFocused = ref(false);

function formatNumber(value) {
  return value.toString().padStart(2, "0");
}

function handleWheel(event) {
  if (!isInteractive.value) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  const delta = event.deltaY;
  accumulatedDelta += delta * scrollSensitivity;

  if (Math.abs(accumulatedDelta) >= 1) {
    const change =
      Math.sign(accumulatedDelta) * Math.floor(Math.abs(accumulatedDelta));
    updateValue(change);
    accumulatedDelta -= change;
  }
}

function startDrag(event) {
  if (!isInteractive.value) return;
  isDragging.value = true;
  startY.value = event.clientY;
  startValue.value = props.activeNumber;
}

function drag(event) {
  if (!isInteractive.value || !isDragging.value) return;
  const deltaY = startY.value - event.clientY;
  const delta = Math.round(deltaY / itemHeight);
  if (delta !== 0) {
    updateValue(delta);
    startY.value = event.clientY;
  }
}

function stopDrag() {
  isDragging.value = false;
  snapSlider();
}

function updateValue(delta) {
  const newValue = Math.min(
    Math.max(props.activeNumber + delta, 0),
    props.finalNumber
  );
  emit("update:activeNumber", newValue);
}

function snapSlider() {
  const snapPosition = calculateSnapPosition();
  sliderInner.value.style.transition = "transform 0.3s ease";
  sliderInner.value.style.transform = `translateY(${snapPosition}px)`;
  setTimeout(() => {
    sliderInner.value.style.transition = "";
  }, 300);
}

watch(
  () => props.activeNumber,
  (newValue) => {
    sliderInner.value.style.transform = `translateY(-${
      newValue * itemHeight
    }px)`;
  }
);

const sliderContainer = ref(null);

function focus() {
  if (!isInteractive.value) return;
  sliderContainer.value.focus();
  isFocused.value = true;
}

function handleKeyDown(event) {
  if (!isInteractive.value) return;
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const delta = event.key === "ArrowUp" ? -1 : 1;
    updateValue(delta);
  }
}

function handleBlur() {
  isFocused.value = false;
}

onMounted(() => {
  sliderContainer.value.addEventListener("blur", handleBlur);
});
</script>

<style scoped>
.number-slider {
  position: relative;
  overflow: hidden;
  outline: none; /* Remove default focus outline */
}

.number-slider::before,
.number-slider::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  z-index: 1;
  pointer-events: none;
  transition: all 0.3s ease;
}

.number-slider::before {
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(240, 240, 240, 1) 20%,
    rgba(240, 240, 240, 0)
  );
}

.number-slider::after {
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(240, 240, 240, 1) 20%,
    rgba(240, 240, 240, 0)
  );
}

.number-slider.countdown-running::before,
.number-slider.countdown-running::after {
  height: calc(50% - 30px);
  background: rgba(240, 240, 240, 1);
}

.number-slider.countdown-running::before {
  top: 0;
}

.number-slider.countdown-running::after {
  bottom: 0;
}

.slider-inner {
  transition: transform 0.3s ease;
}

.slider-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.slider-item.spacer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-slider:focus {
  box-shadow: none; /* Remove the focus box-shadow */
}

.number-slider.countdown-running {
  pointer-events: auto;
}

.active-number-box {
  position: absolute;
  width: 60px;
  height: 30px;
  top: 50%;
  left: 50%; /* Position it at the center horizontally */
  transform: translate(
    -50%,
    -50%
  ); /* Adjust for exact center both vertically and horizontally */
  border: 2px solid #000;
  opacity: 0.5;
  border-radius: 4px;
  pointer-events: none;
  z-index: 2;
}

.number-slider.is-focused .active-number-box {
  display: block;
}

.number-slider:not(.is-focused) .active-number-box {
  display: none;
}
</style>
