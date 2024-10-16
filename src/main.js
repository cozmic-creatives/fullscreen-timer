import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./assets/main.css";

// Import the CountdownTimer component
import CountdownTimer from "./components/CountdownTimer.vue";

const app = createApp(App);

// Register the CountdownTimer component globally
app.component("CountdownTimer", CountdownTimer);

app.mount("#app");
