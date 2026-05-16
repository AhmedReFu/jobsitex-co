// useLocationSearch.ts - Fixed Timeout type
import { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { IPA_BASE } from '@env'

export interface SearchSuggestion {
  address: string
  lat: number
  lng: number
}

export const useLocationSearch = () => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchLocations = useCallback(async (query: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Don't search if query is too short
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    // Debounce search to avoid too many API calls
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await axios.get(
          `${IPA_BASE}/driver/suggestions`,
          {
            params: { address: query },
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 10000
          }
        )

        if (response.data?.success && response.data?.data) {
          const mappedSuggestions = response.data.data.map((item: any) => ({
            address: item.address,
            lat: item.lat,
            lng: item.lng
          }))
          setSuggestions(mappedSuggestions)
        } else {
          setSuggestions([])
          if (response.data?.message) {
            setError(response.data.message)
          }
        }
      } catch (err: any) {
        console.error('Error searching locations:', err)
        
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please check your internet connection.')
        } else if (err.response?.status === 404) {
          setError('Location service not available')
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.')
        } else {
          setError(err.response?.data?.message || 'Failed to search locations')
        }
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  return {
    suggestions,
    isLoading,
    error,
    searchLocations,
    clearSuggestions
  }
}