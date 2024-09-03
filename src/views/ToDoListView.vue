<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTextStore } from '../stores/counter'
import { storeToRefs } from 'pinia'
import { userSingOut, userCheckOut } from '../api/user'
import { getTodoList, deleteTodo, todoAdd, updateStatus, editTodo } from '../api/todo'
import { useToast } from 'primevue/usetoast'
import { cookieDel } from '@/api/cookie'
import type { TodoListProps } from '../type'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'

const textStore = useTextStore()
const { nickname } = storeToRefs(textStore)
const { secondaryText } = textStore

const loading = ref<boolean>(false)
const router = useRouter()
const toast = useToast()
const inputText = ref<string>('')
const todoList = ref<TodoListProps[]>([])
const active = ref<number>(0)
const editTodoClick = ref<TodoListProps>({
  content: '',
  createTime: 0,
  id: '',
  status: false
})

const showMessage = (
  key: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
  message: string,
  data: string
) => {
  toast.add({
    severity: key,
    summary: message,
    detail: data,
    life: 3000
  })
}

const singOutButton = async () => {
  try {
    const { data } = await userSingOut()
    if (data) {
      showMessage('success', '登出結果', `${data.message}`)
      cookieDel()
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    showMessage('error', '登出結果', `${(error as any).response.data.message}`)
  }
}

const changeActive = async (index: number) => {
  loading.value = true
  active.value = index
  const { data } = await getTodoList()
  todoList.value = await data.data.filter((item: TodoListProps) => {
    if (!index) return item
    if (index === 1) return !item.status
    if (index === 2) return item.status
  })
  loading.value = false
}

const finishList = computed(() => todoList.value.filter((item) => !item.status))
const waitList = computed(() => todoList.value.filter((item) => item.status))

const todoSet = async (parameters: string, key: any) => {
  loading.value = true
  try {
    if (parameters === 'add') {
      if (!key) return (loading.value = false)
      const { data } = await todoAdd(key)
      showMessage('success', '新增完成', `${data.newTodo.content}`)
      inputText.value = ''
    }
    if (parameters === 'delete') {
      const { data } = await deleteTodo(key.id)
      showMessage('success', data.message, key.content)
    }
    if (parameters === 'edit') {
      const { data } = await editTodo(key)
      editTodoClick.value = { content: '', createTime: 0, id: '', status: false }
      showMessage('success', data.message, key.content)
    }
    if (parameters === 'status') {
      await updateStatus(key.id)
      showMessage('success', '狀態更新', `${key.content}`)
    }

    const { data } = await getTodoList()
    todoList.value = await data.data.filter((item: TodoListProps) => {
      if (!active.value) return item
      if (active.value === 1) return !item.status
      if (active.value === 2) return item.status
    })
    loading.value = false
  } catch (error) {
    showMessage(
      'error',
      parameters === 'add'
        ? '新增失敗'
        : parameters === 'edit'
          ? '編輯失敗'
          : parameters === 'status'
            ? '更新失敗'
            : '狀態失敗',
      key.content
    )
    if ((error as any)?.status === 400) {
      secondaryText('授權')
      router.push('/404')
    }
    console.error(error)
  }
}

onMounted(async () => {
  try {
    const { data } = await userCheckOut()
    nickname.value = data.nickname
  } catch (error) {
    console.error(error)
    if ((error as any).status === 400) {
      secondaryText('授權')
      router.push('/404')
    }
  }
})
onMounted(async () => {
  try {
    const { data } = await getTodoList()
    todoList.value = data.data
  } catch (error) {
    console.error(error)
    if ((error as any).status === 400) {
      secondaryText('授權')
      router.push('/404')
    }
  }
})
</script>

<template>
  <div id="todoList" class="bg-half">
    <nav>
      <h1>ONLINE TODO LIST</h1>
      <ul>
        <li class="todo_sm">
          <span> {{ nickname }} 的代辦</span>
        </li>
        <li><a @click.prevent="singOutButton">登出</a></li>
      </ul>
    </nav>
    <div class="loading" v-if="loading">
      <ProgressSpinner />
    </div>
    <div class="container todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input v-model="inputText" type="text" placeholder="請輸入待辦事項" />
          <a @click.prevent="todoSet('add', inputText)">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <h5 v-if="!todoList.length && !active" class="mb-3 mt-5" :style="{ textAlign: 'center' }">
          目前尚無代辦事項
        </h5>
        <div v-if="todoList.length >= 1 || active" class="todoList_list">
          <ul class="todoList_tab">
            <li><a :class="!active ? 'active' : ''" @click="changeActive(0)">全部</a></li>
            <li><a :class="active === 1 ? 'active' : ''" @click="changeActive(1)">待完成</a></li>
            <li><a :class="active === 2 ? 'active' : ''" @click="changeActive(2)">已完成</a></li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="todo in todoList" :key="todo.id" class="item">
                <span class="item-name">
                  <Checkbox
                    v-if="editTodoClick.id !== todo.id"
                    v-model="todo.status"
                    :binary="true"
                    @click="todoSet('status', todo)"
                  />
                  <span
                    v-if="editTodoClick.id !== todo.id"
                    :style="{ textDecoration: todo.status ? 'line-through' : 'none' }"
                    >{{ todo.content }}</span
                  >
                  <InputText v-if="editTodoClick.id === todo.id" v-model="editTodoClick.content" />
                </span>
                <span>
                  <Button
                    v-if="editTodoClick.id !== todo.id"
                    icon="pi pi-pen-to-square"
                    severity="secondary"
                    rounded
                    @click="editTodoClick = todo"
                  />
                  <Button
                    v-if="editTodoClick.id !== todo.id"
                    icon="pi pi-times"
                    severity="danger"
                    text
                    rounded
                    @click="todoSet('delete', todo)"
                  />
                  <Button
                    v-if="editTodoClick.id === todo.id"
                    label="確定"
                    severity="success"
                    rounded
                    @click="todoSet('edit', editTodoClick)"
                  />
                  <Button
                    v-if="editTodoClick.id === todo.id"
                    label="取消"
                    severity="secondary"
                    rounded
                    @click="editTodoClick = { content: '', createTime: 0, id: '', status: false }"
                  />
                </span>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p v-if="!active">{{ finishList.length }}&emsp;個待完成項目</p>
              <p v-if="active === 1">{{ finishList.length }}&emsp;個待完成項目</p>
              <p v-if="active === 2">{{ waitList.length }}&emsp;個已完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.todoList {
  margin-bottom: 30px;
}
.item {
  justify-content: space-between;
  .item-name {
    display: flex;
    align-items: center;
    > span {
      margin-left: 20px;
    }
  }
}
.todoListPage {
  margin-top: 20px !important;
}

.todoList_tab {
  a {
    cursor: pointer;
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
