<script setup lang="ts">
import { ref } from "vue";
import { request } from "jsfast";

const msg = ref("Click the button to send a request");

const send = () => {
  msg.value = "Sending request...";
  request.get("https://catfact.ninja/fact").then((data) => {
    msg.value = data.fact;
  });
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="send">Send Request</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Fastjs and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
