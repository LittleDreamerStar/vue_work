<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isEqual } from 'lodash-es'
import type { RegisterProps } from '../type'
import { userSing } from '../api/user'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const router = useRouter()

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
const signData = ref<RegisterProps>({
  email: '',
  nickname: '',
  password: '',
  checked: ''
})

const signApiButton = async () => {
  try {
    const { data } = await userSing(signData.value)
    if (data) {
      showMessage(
        'success',
        '註冊成功',
        `信箱：${signData.value.email},
    名稱：${signData.value.nickname},
    UID：${data.uid}`
      )
      signData.value = {
        email: '',
        nickname: '',
        password: '',
        checked: ''
      }
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    showMessage('error', '註冊失敗', (error as any).response.data.message)
  }
}

const checkedPwd = computed(() => isEqual(signData.value.password, signData.value.checked))
const checkedUser = computed(
  () =>
    !signData.value.email ||
    !signData.value.nickname ||
    !signData.value.password ||
    !signData.value.checked
)

onMounted(() => {
  signData.value = {
    email: '',
    nickname: '',
    password: '',
    checked: ''
  }
})
</script>

<template>
  <div id="signUp" class="bg-yellow">
    <div class="container signUpPage vhContainer">
      <div class="side">
        <img
          class="logoImg"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
          alt=""
        />
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signData.email"
          />
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signData.nickname"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signData.password"
          />
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請再次輸入密碼"
            required
            v-model="signData.checked"
          />
          <span v-if="!checkedPwd">兩次密碼不一致</span>
          <button
            class="formControls_btnSubmit"
            type="button"
            @click.prevent="signApiButton"
            :disabled="checkedUser || !checkedPwd"
          >
            註冊帳號
          </button>
          <RouterLink class="formControls_btnLink" to="/">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.formControls {
  button {
    &:disabled {
      opacity: 30%;
      cursor: not-allowed;
    }
  }
}
</style>
