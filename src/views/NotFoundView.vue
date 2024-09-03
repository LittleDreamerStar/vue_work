<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTextStore } from '../stores/counter'
import { storeToRefs } from 'pinia'

const textStore = useTextStore()
const { mainText } = storeToRefs(textStore)

const router = useRouter()

const sec = ref(3)
const interval = ref<number | null>(null)

onMounted(() => {
  interval.value = setInterval(() => {
    if (sec.value > 0) sec.value -= 1
  }, 1000)
  setTimeout(() => {
    clearInterval(interval.value as number)
    router.push('/')
  }, 3000)
})

onUnmounted(() => {
  clearInterval(interval.value!)
})
</script>

<template>
  <div id="notFound" class="bg-half">
    <nav>
      <div class="container todoListPage vhContainer">
        <div class="todoList_Content center">
          <div class="todoList_list">
            <div class="todoList_items errMessage">
              <p>404</p>
              <p>
                你的<span :style="{ color: 'red' }">{{ mainText }}</span
                >已經被怪盜基德偷走了
              </p>
              <p>轉跳中..........{{ sec }}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
.center {
  display: grid;
  place-items: center;
  height: 100vh;
  width: auto !important;

  > div {
    width: 100%;
  }
}

.errMessage {
  margin: 0 auto;
  font-size: 40px;
  font-family: monospace;
  p {
    margin: 40px 0px;
  }
}
</style>
