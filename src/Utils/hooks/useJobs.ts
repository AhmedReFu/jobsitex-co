import { useState, useEffect } from 'react'
import axios from 'axios'
import { IPA_BASE } from '@env'
import { Truck } from '../../home/Users/Components/HomeScreen/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../Auth/AuthContext'

export const useJobs = () => {
    const [activeJobs, setActiveJobs] = useState<Truck[]>([])
    const [recentJobs, setRecentJobs] = useState<Truck[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const {signOut: logout} = useAuth()

    const fetchJobs = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await axios.get(`${IPA_BASE}${process.env.ACTIVE_JOBS_USER}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('vToken')}`
                },
            })

            setActiveJobs(response.data.data.accepted || [])
            setRecentJobs(response.data.data.completed || [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setError('Failed to load jobs. Please try again.')
            if((error as any).response.status === 401) {
                await logout();
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

    return {
        activeJobs,
        recentJobs,
        isLoading,
        error,
        refetch: fetchJobs
    }
}