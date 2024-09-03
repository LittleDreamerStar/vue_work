export interface LoginProps {
  loginUser: string
  loginPassword: string
}

export interface LoginFlagProps {
  user: boolean
  password: boolean
}

export interface RegisterProps {
  email: string
  nickname: string
  password: string
  checked: string
}

export interface TodoListProps {
  content: string
  createTime: number
  id: string
  status: boolean
}
