<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useTextStore } from '../stores/counter'
import type { LoginProps, LoginFlagProps } from '../type'
import { userLogin } from '../api/user'
import { useToast } from 'primevue/usetoast'
import { cookieSet, cookieDel } from '@/api/cookie'

const router = useRouter()

const toast = useToast()

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

const inputFlag = ref<LoginFlagProps>({
  user: false,
  password: false
})

const textStore = useTextStore()
const { setNickname } = textStore
const inputLogin = ref<LoginProps>({
  loginUser: '',
  loginPassword: ''
})

const onChange = (key: string) => {
  key === 'user' ? (inputFlag.value.user = true) : (inputFlag.value.password = true)
}

const loginFun = async () => {
  try {
    const { data } = await userLogin({
      email: inputLogin.value.loginUser,
      password: inputLogin.value.loginPassword
    })
    if (data) {
      cookieSet({ token: data.token, exp: data.exp * 1000 })
      setNickname(data.nickname)
      showMessage(
        'success',
        '登入成功',
        `信箱：${inputLogin.value.loginUser},
      名稱：${data.nickname}`
      )
      inputLogin.value = {
        loginUser: '',
        loginPassword: ''
      }
      router.push('/todoList')
    }
  } catch (error) {
    console.error(error)
    const message = (error as any).response.data.message
    showMessage('error', '登入失敗', message)
  }
}

onMounted(() => {
  textStore.resetText()
  cookieDel()
  inputLogin.value = {
    loginUser: '',
    loginPassword: ''
  }
})
</script>

<template>
  <div id="loginPage" class="bg-yellow">
    <div class="container loginPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="inputLogin.loginUser"
            @input="onChange('user')"
          />
          <span v-if="inputFlag.user && !inputLogin.loginUser">帳號不可留空</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            v-model="inputLogin.loginPassword"
            @input="onChange('password')"
          />
          <span v-if="inputFlag.password && !inputLogin.loginPassword">密碼不可留空</span>
          <button
            class="formControls_btnSubmit"
            type="submit"
            :disabled="
              (inputFlag.password && !inputLogin.loginPassword) ||
              (inputFlag.user && !inputLogin.loginUser) ||
              !(inputFlag.password && inputFlag.user)
            "
            @click.prevent="loginFun"
          >
            登入
          </button>
          <RouterLink class="formControls_btnLink" to="/signUp">註冊帳號</RouterLink>
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
