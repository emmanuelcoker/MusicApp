import { defineStore } from "pinia";

export default defineStore("modals", {
  state: () => ({
    isOpen: false,
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? "hidden" : "";
    },
  },
});
