import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from './auth'

interface Notification {
  type: string
  message: string
  order?: {
    id: number
    customerId: number
    totalAmount: number
    customer: {
      firstName: string
      lastName: string
    }
  }
  timestamp: Date
}

export const useNotificationStore = defineStore('notifications', () => {
  const socket = ref<Socket | null>(null)
  const notifications = ref<Notification[]>([])
  const isConnected = ref(false)
  const authStore = useAuthStore()

  const connect = () => {
    if (socket.value?.connected) return

    const getWsUrl = () => {
      if (import.meta.env.PROD) {
        return 'wss://' + window.location.host
      } else {
        return 'ws://localhost:3100'
      }
    }

    socket.value = io(getWsUrl(), {
      transports: ['websocket', 'polling'],
      path: '/socket.io',
    })

    socket.value.on('connect', () => {
      console.log('Connected to WebSocket server')
      isConnected.value = true
      
      // Eğer admin ise admin room'a katıl
      if (authStore.user?.role === 'admin') {
        socket.value?.emit('joinAdminRoom')
      }
    })

    socket.value.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      isConnected.value = false
    })

    socket.value.on('newOrder', (notification: Notification) => {
      console.log('New order notification received:', notification)
      notifications.value.unshift(notification)
      
      // Zil sesi çal
      playNotificationSound()
      
      // 5 saniye sonra notification'ı kaldır
      setTimeout(() => {
        const index = notifications.value.findIndex(n => n === notification)
        if (index > -1) {
          notifications.value.splice(index, 1)
        }
      }, 5000)
    })

    socket.value.on('notification', (notification: Notification) => {
      console.log('General notification received:', notification)
      notifications.value.unshift(notification)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const playNotificationSound = () => {
    try {
      // Zil sesi için AudioContext kullan
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const removeNotification = (notification: Notification) => {
    const index = notifications.value.findIndex(n => n === notification)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    socket,
    notifications,
    isConnected,
    connect,
    disconnect,
    clearNotifications,
    removeNotification,
    playNotificationSound,
  }
}) 