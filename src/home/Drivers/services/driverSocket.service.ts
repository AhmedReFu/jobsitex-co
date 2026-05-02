import io, { Socket } from 'socket.io-client'
import { SOCKET_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface JobNewData {
  jobId: string
  truckType: string
  pickupAddress: string
  dropoffAddress: string
  distanceKm: number
  estimatedFare: number
}

export interface JobDirectOfferData {
  jobId: string
  pickupAddress: string
  dropoffAddress: string
  estimatedFare: number
  timeoutSeconds: number
}

export interface LocationPayload {
  lat: number
  lng: number
  heading?: number
  speed?: number
}

class DriverSocketService {
  private socket: Socket | null = null
  private isConnected = false

  async connect(): Promise<Socket> {
    if (this.socket && this.isConnected) return this.socket

    const token = await AsyncStorage.getItem('vToken')

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      this.isConnected = true
    })
    this.socket.on('disconnect', () => {
      this.isConnected = false
    })
    this.socket.on('connect_error', (err) => {
      console.error('Driver socket error:', err.message)
    })

    return this.socket
  }

  subscribeJobs(radius = 20): Promise<{ event: string; data: { radius: number } }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('Socket not connected'))
      this.socket.emit('driver:subscribe-jobs', { radius }, (ack: any) => resolve(ack))
    })
  }

  unsubscribeJobs(): Promise<{ event: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('Socket not connected'))
      this.socket.emit('driver:unsubscribe-jobs', (ack: any) => resolve(ack))
    })
  }

  sendLocation(payload: LocationPayload) {
    if (!this.isConnected) return
    this.socket?.emit('driver:location', payload)
  }

  onJobNew(callback: (data: JobNewData) => void) {
    this.socket?.on('job:new', callback)
  }

  offJobNew(callback: (data: JobNewData) => void) {
    this.socket?.off('job:new', callback)
  }

  onJobDirectOffer(callback: (data: JobDirectOfferData) => void) {
    this.socket?.on('job:direct-offer', callback)
  }

  offJobDirectOffer(callback: (data: JobDirectOfferData) => void) {
    this.socket?.off('job:direct-offer', callback)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const driverSocketService = new DriverSocketService()
