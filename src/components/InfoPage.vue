<template>
  <div class="info-page container hide-scrollbar">
    <button @click="toggleInfo" class="button icon ghost">
      <ArrowLeft />
    </button>
    <h1>Focus Timer</h1>
    <p>
      This app is a downloadable timer for your phone that can be installed as a
      PWA (Progressive Web App). To install, simply use the "Add to Home Screen"
      option in your browser.
    </p>
    <h2>How the Focus Timer works:</h2>
    <ol>
      <li>
        Enter a task into the input field. This is the task you'll stay focused
        on.
      </li>
      <li>
        Select the amount of time you want to allocate to this task by scrolling
        up and down to choose hours and minutes.
      </li>
      <li>
        Keep your phone's display on by activating the "Always On Display"
        feature.
      </li>
      <li>Work intensely and deeply on the task until the timer is up.</li>
      <li>
        Enjoy the confetti celebration when you complete your focused work
        session!
      </li>
      <li>Repeat the process until your to-do list is all checked off.</li>
    </ol>
    <p>
      By using this app, you can work in focused, uninterrupted sessions and
      boost your productivity. Happy focusing!
    </p>

    <h2 class="legend-title">Legend:</h2>
    <div class="legend">
      <div>
        <button class="button icon">
          <Play />
        </button>
        <span>Start</span>
      </div>
      <div>
        <button class="button icon">
          <RefreshCcw />
        </button>
        <span>Reset</span>
      </div>
      <div>
        <button class="button icon">
          <Sun />
        </button>
        <span>Always On Display</span>
      </div>
    </div>

    <div class="credit">
      <span>Made with</span>
      <Heart color="red" class="beating-heart" />
      <span>by</span>
      <a
        href="https://matthewbracke.notion.site/Matt-s-Portfolio-14d6d26a6c4344aaa8c38189e7528ce0?pvs=74"
        target="_blank"
        rel="noopener noreferrer"
        >Matthew Bracke</a
      >
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { ArrowLeft, Play, RefreshCcw, Sun, Heart } from "lucide-vue-next";
const toggleInfo = inject("toggleInfo");
</script>

<style scoped>
.info-page {
  overflow: scroll;
  padding-top: 30px;
  padding-bottom: 30px;
}

.legend-title {
  text-align: center;
  text-decoration: underline;
}

.legend {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.legend div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.credit {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background-color: var(--color-ghost-button);
  padding: 10px;
  border-radius: 10px;
}

.beating-heart {
  animation: beat 1s infinite;
}

@keyframes beat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
