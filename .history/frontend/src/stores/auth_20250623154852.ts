import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'customer'
  address?: string
}

interface LoginResponse {
  access_token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const setAuth = (response: LoginResponse) => {
    user.value = response.user
    token.value = response.access_token
    isAuthenticated.value = true
    localStorage.setItem('token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
  }

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      const response = await axios.post<LoginResponse>(
        `/backend/auth/${isAdmin ? 'admin' : 'customer'}/login`,
        { email, password }
      )
      setAuth(response.data)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    clearAuth()
  }

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initAuth,
    updateUser
  }
}) 