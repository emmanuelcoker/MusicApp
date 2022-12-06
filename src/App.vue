<template>
  <app-header></app-header>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player></app-player>
  <app-auth></app-auth>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppAuth from "./components/AppAuth.vue";
import AppPlayer from "@/components/AppPlayer.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s linear;
}
</style>
