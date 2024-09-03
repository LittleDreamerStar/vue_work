import axios from 'axios'
import type { TodoListProps } from '../type'

const apiUrl = 'https://todolist-api.hexschool.io'

export const getTodoList = async () => await axios.get(`${apiUrl}/todos`)

export const deleteTodo = async (id: string) => await axios.delete(`${apiUrl}/todos/${id}`)

export const todoAdd = async (data: string) =>
  await axios.post(`${apiUrl}/todos`, { content: data })

export const editTodo = async (data: TodoListProps) =>
  await axios.put(`${apiUrl}/todos/${data.id}`, { content: data.content })

export const updateStatus = async (id: string) =>
  await axios.patch(`${apiUrl}/todos/${id}/toggle`, {})
