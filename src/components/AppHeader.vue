<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white"
              >About</router-link
            >
          </li>

          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>

          <template v-else>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut"
                >LogOut</a
              >
              <router-link class="px-2 text-white" :to="{ name: 'manage' }"
                >Manage</router-link
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapStores, mapWritableState } from "pinia";
import useModalsStore from "@/stores/modals";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalsStore),
    ...mapActions(useUserStore, ["signOut"]),
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
    // ...mapWritableState(useModalsStore, ["isOPen"]) can be accessed as this.isOpen prop
  },
  methods: {
    toggleAuthModal() {
      this.modalsStore.isOpen = !this.modalsStore.isOpen;
      console.log(this.modalsStore.isOpen);
    },

    async logOut() {
      await this.signOut();
      //redirect the user away from an auth required page
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>

<style></style>
