import { defineStore } from 'pinia'

export const useSpaceStore = defineStore('space', {
  state: () => ({ activeCategory: '全部', savedResources: [] }),
  actions: {
    selectCategory(category) {
      this.activeCategory = category
    },
    toggleSaved(title) {
      this.savedResources = this.savedResources.includes(title)
        ? this.savedResources.filter((item) => item !== title)
        : [...this.savedResources, title]
    }
  }
})
