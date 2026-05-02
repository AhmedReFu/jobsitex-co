// src/services/socket.service.ts
import io, { Socket } from 'socket.io-client'
import { IPA_BASE } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface RideAcceptData {
  bookingId: string
  driverId: string
  driverName: string
  driverPhone: string
  driverRating: number
  vehicleType: string
  vehicleNumber: string
  driverImage?: string
  eta: number
  pickupLocation: {
    lat: number
    lng: number
    address: string
  }
  dropoffLocation: {
    lat: number
    lng: number
    address: string
  }
}

export interface RideCancelData {
  bookingId: string
  reason: string
  cancelledBy: 'driver' | 'user' | 'system'
}

export interface DriverLocationData {
  driverId: string
  bookingId: string
  latitude: number
  longitude: number
  timestamp: string
}

type RideStatus = 'searching' | 'driver_assigned' | 'driver_arrived' | 'ride_started' | 'ride_completed' | 'cancelled'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  async connect(): Promise<Socket> {
    if (this.socket && this.isConnected) {
      return this.socket
    }

    const token = await AsyncStorage.getItem('vToken')
    
    this.socket = io(IPA_BASE, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${token}`
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    })

    this.setupEventListeners()
    return this.socket
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket connected')
      this.isConnected = true
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached')
      }
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  // Join a booking room to receive updates
  joinBookingRoom(bookingId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot join room')
      return
    }
    this.socket.emit('join-booking', { bookingId })
    console.log('Joined booking room:', bookingId)
  }

  // Leave a booking room
  leaveBookingRoom(bookingId: string) {
    if (!this.socket || !this.isConnected) return
    this.socket.emit('leave-booking', { bookingId })
    console.log('Left booking room:', bookingId)
  }

  // Listen for ride acceptance
  onRideAccepted(callback: (data: RideAcceptData) => void) {
    if (!this.socket) return
    this.socket.on('ride-accepted', callback)
  }

  // Listen for ride cancellation
  onRideCancelled(callback: (data: RideCancelData) => void) {
    if (!this.socket) return
    this.socket.on('ride-cancelled', callback)
  }

  // Listen for driver location updates
  onDriverLocationUpdate(callback: (data: DriverLocationData) => void) {
    if (!this.socket) return
    this.socket.on('driver-location-update', callback)
  }

  // Listen for ride status updates
  onRideStatusUpdate(callback: (data: { bookingId: string; status: RideStatus; message?: string }) => void) {
    if (!this.socket) return
    this.socket.on('ride-status-update', callback)
  }

  // Cancel the ride search
  cancelRideSearch(bookingId: string) {
    if (!this.socket || !this.isConnected) return
    this.socket.emit('cancel-ride-search', { bookingId })
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Check if connected
  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const socketService = new SocketService()