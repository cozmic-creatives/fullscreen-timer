<template>
  <div class="number-slider-container" v-if="scrollable">
    <div class="number-slider-box" v-show="isFocused"></div>
    <div
      class="number-slider"
      tabindex="0"
      @focus="isFocused = true"
      @blur="isFocused = false"
      ref="sliderContainer"
      :class="{
        'is-running': isRunning,
        'is-focused': isFocused,
        'cursor-grabbing': pressed && scrollable,
        'snap-scroll': !pressed && scrollable,
      }"
    >
      <div class="slider-inner">
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
    </div>
  </div>

  <div v-else class="slider-item">
    {{ formatNumber(activeNumber) }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import {
  useScroll,
  useMouse,
  useMousePressed,
  useDebounceFn,
} from "@vueuse/core";

const props = defineProps({
  finalNumber: {
    type: Number,
    default: 0,
  },
  activeNumber: {
    type: Number,
    default: 0,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:activeNumber"]);

const sliderContainer = ref(null);
const isFocused = ref(false);

const { isScrolling, y: scrollY } = useScroll(sliderContainer);
const { y: mouseY } = useMouse();
const { pressed } = useMousePressed({ target: sliderContainer });

const initialMouseY = ref(0);

const itemHeight = computed(() => {
  if (!props.scrollable) return 0;
  return (
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--slider-height"
      )
    ) / 3
  );
});

function formatNumber(value: number): string {
  return value.toString().padStart(2, "0");
}

function updateActiveNumber(scrollPosition: number) {
  const newValue = Math.round(scrollPosition / itemHeight.value);
  const clampedValue = Math.min(Math.max(newValue, 0), props.finalNumber);
  emit("update:activeNumber", clampedValue);
}

watch(isScrolling, (scrolling) => {
  if (!scrolling && props.scrollable) debouncedUpdateActiveNumber();
});

const debouncedUpdateActiveNumber = useDebounceFn(() => {
  updateActiveNumber(scrollY.value);
}, 1000);

function handleDragging(isPressed: boolean, currentMouseY: number) {
  if (isPressed) {
    if (initialMouseY.value === 0) initialMouseY.value = currentMouseY;

    const diff = currentMouseY - initialMouseY.value;
    scrollY.value -= diff;
    initialMouseY.value = currentMouseY;
  } else {
    initialMouseY.value = 0;
  }
}

// const scrollToNumber = (number: number) => {
//   sliderContainer.value?.scrollTo({
//     top: number * itemHeight.value,
//     behavior: "smooth",
//   });
// };

function updateScrollPosition(newVal: number) {
  if (newVal === props.finalNumber) {
    scrollY.value = (props.finalNumber + 1) * itemHeight.value;
  } else {
    scrollY.value = newVal * itemHeight.value;
  }
}

const addFocusListener = () => {
  sliderContainer.value?.addEventListener("focus", () => {
    isFocused.value = true;
  });
};

watch([pressed, mouseY], ([isPressed, currentMouseY]) => {
  if (props.scrollable) handleDragging(isPressed, currentMouseY);
});

watch(
  () => props.activeNumber,
  (newVal) => {
    if (props.scrollable) updateScrollPosition(newVal);
  }
);

onMounted(() => {
  if (props.scrollable) addFocusListener();
});
</script>

<style scoped>
.number-slider-container {
  position: relative;
  height: var(--slider-height);
  width: calc(var(--slider-height) / 1.4);
}

.number-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  outline: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  cursor: grab;
}

.number-slider-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(var(--slider-height) / 1.7);
  height: calc(var(--slider-height) / 2.7);
  pointer-events: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  z-index: 1;
  border-radius: 8px;
}

.snap-scroll {
  scroll-snap-type: y mandatory;
}

.number-slider::-webkit-scrollbar {
  display: none;
}

.slider-inner {
  transition: transform 0.3s ease;
}

.slider-item {
  height: calc(var(--slider-height) / 3);
  width: calc(var(--slider-height) / 1.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--number-size);
  font-weight: bold;
  scroll-snap-align: center;
}

.number-slider:focus {
  box-shadow: none;
}

.active-number-box {
  position: absolute;
  width: 60px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #000;
  opacity: 0.5;
  border-radius: 4px;
  z-index: 2;
  display: none;
}

.number-slider.is-focused .active-number-box {
  display: block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
