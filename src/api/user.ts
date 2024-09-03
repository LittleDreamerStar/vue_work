import axios from 'axios'
import type { LoginProps, RegisterProps } from '../type'

const apiUrl = 'https://todolist-api.hexschool.io'

export const userLogin = async ({
  email,
  password
}: {
  email: LoginProps['loginUser']
  password: LoginProps['loginPassword']
}) => await axios.post(`${apiUrl}/users/sign_in`, { email, password })

export const userSing = async (data: Omit<RegisterProps, 'checked'>) =>
  await axios.post(`${apiUrl}/users/sign_up`, { ...data })

export const userSingOut = async () => await axios.post(`${apiUrl}/users/sign_out`, {})
export const userCheckOut = async () => await axios.get(`${apiUrl}/users/checkout`)
