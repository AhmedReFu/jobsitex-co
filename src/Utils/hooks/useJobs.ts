import { IPA_BASE } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { Truck } from '../../home/Users/Components/HomeScreen/types'

const ACTIVE_STATUSES = new Set(['PENDING', 'BROADCAST', 'BOOKED', 'ON_WAY', 'ARRIVED', 'LOADED', 'IN_TRANSIT'])

const STATUS_TEXT: Record<string, string> = {
  PENDING: 'Pending',
  BROADCAST: 'Finding Driver',
  BOOKED: 'Driver Booked',
  ON_WAY: 'Driver On Way',
  ARRIVED: 'Driver Arrived',
  LOADED: 'Loaded',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

type ApiJob = {
  id: string
  status: string
  pickupAddress: string
  dropoffAddress: string
  estimatedFare: number | null
  distanceKm: number | null
  truckType: { name: string } | null
  createdAt: string
}

const mapToTruck = (job: ApiJob): Truck => ({
  id: job.id,
  name: job.truckType?.name ?? 'Truck Job',
  description: `${job.pickupAddress} → ${job.dropoffAddress}`,
  capacity: '',
  rating: 0,
  distance: job.distanceKm != null ? `${job.distanceKm.toFixed(1)} km` : '—',
  icon: 'truck-outline',
  date: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  statusText: STATUS_TEXT[job.status] ?? job.status,
  pickupAddress: job.pickupAddress,
  dropoffAddress: job.dropoffAddress,
  iconBg: ACTIVE_STATUSES.has(job.status) ? '#E9F7EA' : '#F3F4F6',
  status: ACTIVE_STATUSES.has(job.status) ? 'active' : 'completed',
  iconColor: ACTIVE_STATUSES.has(job.status) ? '#43B047' : '#9CA3AF',
})

export const useJobs = () => {
  const [activeJobs, setActiveJobs] = useState<Truck[]>([])
  const [recentJobs, setRecentJobs] = useState<Truck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { signOut: logout } = useAuth()

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = await AsyncStorage.getItem('vToken')
      const response = await axios.get(`${IPA_BASE}/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      })

      const jobs: ApiJob[] = response.data?.data ?? []
      setActiveJobs(jobs.filter((j) => ACTIVE_STATUSES.has(j.status)).map(mapToTruck))
      setRecentJobs(jobs.filter((j) => j.status === 'DELIVERED').map(mapToTruck))
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to load jobs. Please try again.')
      if ((err as any)?.response?.status === 401) {
        await logout()
      }
      setActiveJobs([])
      setRecentJobs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return { activeJobs, recentJobs, isLoading, error, refetch: fetchJobs }
}
