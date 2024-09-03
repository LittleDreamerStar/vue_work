import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTextStore = defineStore('textStore', () => {
  const mainText = ref('網頁')
  const nickname = ref('')
  const secondaryText = (key: string) => {
    mainText.value = key
  }

  const setNickname = (name: string) => {
    nickname.value = name
  }
  const resetText = () => {
    mainText.value = '網頁'
    nickname.value = ''
  }

  return { mainText, nickname, secondaryText, resetText, setNickname }
})
