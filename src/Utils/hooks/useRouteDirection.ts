// useRouteDirection.ts - Updated to return the route data
import { useState, useCallback } from 'react'
import axios from 'axios'
import polyline from '@mapbox/polyline'
import { LocationData, RouteData } from '../../home/Users/Components/SearchLocation/type'

export const useRouteDirection = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRoute = useCallback(async (
    origin: LocationData,
    destination: LocationData
  ): Promise<RouteData | null> => {
    if (!origin || !destination) return null

    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin: `${origin.latitude},${origin.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            key: 'AIzaSyCB3G-ob1C6JEUF_wotuQY1RMPKIbRkPIw'
          }
        }
      )

      if (response.data?.routes?.length > 0) {
        const route = response.data.routes[0]
        const encoded = route.overview_polyline.points
        const decoded = polyline.decode(encoded)
        const points = decoded.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng
        }))

        const newRouteData: RouteData = {
          points,
          distance: route.legs[0].distance.value / 1000,
          duration: route.legs[0].duration.value / 60,
          polyline: encoded
        }
        
        setRouteData(newRouteData)
        return newRouteData
      } else {
        setError('No route found between these locations')
        return null
      }
    } catch (err: any) {
      console.error('Error getting route:', err)
      setError(err.response?.data?.error_message || 'Failed to get route')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearRoute = useCallback(() => {
    setRouteData(null)
    setError(null)
  }, [])

  return {
    routeData,
    isLoading,
    error,
    getRoute,
    clearRoute
  }
}