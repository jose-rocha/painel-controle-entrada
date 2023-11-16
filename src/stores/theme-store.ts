import { defineStore } from 'pinia';

interface theStoreInterface {
  theme: boolean,
}

export const useThemeStore = defineStore('theme', {
  state: () :theStoreInterface => ({
    theme: false,
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  // actions: {
  //   increment() {
  //     this.counter += 1;
  //   },
  // },
  persist: true,
});
