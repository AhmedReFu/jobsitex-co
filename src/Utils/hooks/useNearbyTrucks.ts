import { useState, useCallback } from 'react'
import axios from 'axios'
import { IPA_BASE } from '@env'
import { LocationCoords } from '../../home/Users/Components/HomeScreen/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../Auth/AuthContext'

export interface Truck {
    id: string
    name: string
    description: string
    capacity: string
    distance: string
    distanceInMeters?: number
    icon: string
    iconBg: string
    iconColor: string
    isBooked?: boolean
    driverId?: string
    rating?: number
}

interface NearbyDriverResponse {
    success: boolean
    message: string
    data: Array<{
        _id: string
        fullName: string
        phoneNumber: string
        email: string
        distance: number
        rating?: number
        location: {
            type: string
            coordinates: [number, number]
        }
        driver: {
            images: Array<{
                id: string
                url: string
                _id: string
            }>
            status: string
            vehicleType: 'Truck' | 'Van' | 'Trailer' | 'Flatbed' | 'Refrigerated' | 'Tanker' | 'Container' | 'Other'
            vehicleCapacity: string
            hourRate: number
            isApproved: boolean
        }
    }>
}

export const useNearbyTrucks = () => {
    const [trucks, setTrucks] = useState<Truck[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [radius, setRadius] = useState(10000)

    const {signOut} = useAuth()

    const getIconDetails = (vehicleType: string) => {
        const type = vehicleType?.toLowerCase() || ''
        
        // Map vehicle types to appropriate icons and colors
        switch (type) {
            case 'truck':
                return { 
                    icon: 'truck', 
                    bg: '#E8F5E9', 
                    color: '#4CAF50' 
                }
            case 'van':
                return { 
                    icon: 'truck-delivery', 
                    bg: '#E3F2FD', 
                    color: '#2196F3' 
                }
            case 'trailer':
                return { 
                    icon: 'truck-trailer', 
                    bg: '#FFEBEE', 
                    color: '#FF5252' 
                }
            case 'flatbed':
                return { 
                    icon: 'truck-flatbed', 
                    bg: '#FFF3E0', 
                    color: '#FF9800' 
                }
            case 'refrigerated':
                return { 
                    icon: 'snowflake', 
                    bg: '#E0F7FA', 
                    color: '#00BCD4' 
                }
            case 'tanker':
                return { 
                    icon: 'water', 
                    bg: '#E8EAF6', 
                    color: '#3F51B5' 
                }
            case 'container':
                return { 
                    icon: 'truck-cargo-container', 
                    bg: '#F3E5F5', 
                    color: '#9C27B0' 
                }
            default:
                return { 
                    icon: 'truck', 
                    bg: '#F5F5F5', 
                    color: '#757575' 
                }
        }
    }

    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${Math.round(meters)} m`
        } else {
            return `${(meters / 1000).toFixed(1)} km`
        }
    }

    const mapDriverToTruck = (item: any, distanceInMeters: number): Truck => {
        const driver = item.driver
        const vehicleType = driver?.vehicleType || 'Truck'
        const iconDetails = getIconDetails(vehicleType)

        // Create description based on vehicle type
        let description = ''
        switch (vehicleType?.toLowerCase()) {
            case 'refrigerated':
                description = 'Temperature-controlled transport for perishable goods'
                break
            case 'flatbed':
                description = 'Open bed for oversized or heavy items'
                break
            case 'tanker':
                description = 'Liquid transport for fuel, water, or chemicals'
                break
            case 'container':
                description = 'Standard shipping container transport'
                break
            case 'van':
                description = 'Enclosed van for smaller deliveries'
                break
            case 'trailer':
                description = 'Heavy-duty trailer for large loads'
                break
            default:
                description = `${vehicleType} available for delivery`
        }

        return {
            id: item._id,
            name: driver?.vehicleType || 'Truck',
            description: description,
            capacity: driver?.vehicleCapacity || 'Various capacities',
            distance: formatDistance(distanceInMeters),
            distanceInMeters: distanceInMeters,
            icon: iconDetails.icon,
            iconBg: iconDetails.bg,
            iconColor: iconDetails.color,
            isBooked: driver?.status !== 'active',
            driverId: item._id,
            rating: item.rating || 4.5,
        }
    }

    const fetchNearbyTrucks = useCallback(async (
        locationCoords: LocationCoords | null,
        showLoading = true
    ) => {
        if (!locationCoords) {
            setError('Location not available. Please enable location services.')
            setIsLoading(false)
            setIsRefreshing(false)
            return
        }

        try {
            if (showLoading) {
                setIsLoading(true)
            }
            setError(null)

            const token = await AsyncStorage.getItem('vToken')
            
            console.log('Request payload:', {
                lat: locationCoords.latitude,
                lng: locationCoords.longitude,
                radius: radius,
            })

            const response = await axios.get<NearbyDriverResponse>(
                `${IPA_BASE}/jobs/nearby-drivers`,
                {
                    params: {
                        lat: locationCoords.latitude,
                        lng: locationCoords.longitude,
                        radiusKm: radius / 1000,
                    },
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                    timeout: 15000,
                }
            )

            console.log('Nearby drivers response:', response.data)

            if (response.data?.success && response.data?.data) {
                // Filter only active drivers and map to trucks
                const mappedTrucks = response.data.data
                    .filter(item => item.driver?.status === 'active')
                    .map((item) => {
                        const distanceInMeters = item.distance || 0
                        return mapDriverToTruck(item, distanceInMeters)
                    })

                // Sort by distance (closest first)
                mappedTrucks.sort((a, b) => (a.distanceInMeters || 0) - (b.distanceInMeters || 0))
                setTrucks(mappedTrucks)

                if (mappedTrucks.length === 0) {
                    setError('No active trucks found in your area.')
                } else {
                    setError(null)
                }
            } else {
                setError(response.data?.message || 'Failed to load nearby trucks. Please try again.')
                setTrucks([])
            }
        } catch (err: any) {
            console.error('Error fetching nearby trucks:', err.response?.data || err.message)

            if (err?.response?.status === 401) {
                await signOut()
            }

            if (err.code === 'ECONNABORTED') {
                setError('Request timeout. Please check your internet connection.')
            } else if (err.response?.status === 404) {
                setError('No nearby trucks found.')
            } else if (err.response?.status === 401) {
                setError('Authentication failed. Please login again.')
            } else {
                setError(err.response?.data?.message || 'Failed to load nearby trucks. Please try again.')
            }

            setTrucks([])
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [radius])

    const changeRadius = useCallback((newRadius: number, locationCoords: LocationCoords | null) => {
        setRadius(newRadius)
        fetchNearbyTrucks(locationCoords, true)
    }, [fetchNearbyTrucks])

    const refresh = useCallback((locationCoords: LocationCoords | null) => {
        setIsRefreshing(true)
        fetchNearbyTrucks(locationCoords, false)
    }, [fetchNearbyTrucks])

    return {
        trucks,
        isLoading,
        isRefreshing,
        error,
        radius,
        changeRadius,
        refresh,
        fetchNearbyTrucks,
    }
}