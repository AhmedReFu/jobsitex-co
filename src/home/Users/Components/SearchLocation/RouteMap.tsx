import React, { useRef, useEffect, useState } from 'react'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { View, TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LocationData, RouteData } from './type'

interface RouteMapProps {
  pickup: LocationData | null
  dropoff: LocationData | null
  routeData: RouteData | null
  onPickupChange?: (location: LocationData) => void
  onDropoffChange?: (location: LocationData) => void
  onMapPress?: (event: any) => void
  isLoading?: boolean
}

export const RouteMap: React.FC<RouteMapProps> = ({
  pickup,
  dropoff,
  routeData,
  onPickupChange,
  onDropoffChange,
  onMapPress,
  isLoading = false
}) => {
  const mapRef = useRef<MapView>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Fit map to show both markers when both are present
  useEffect(() => {
    if (pickup && dropoff && isMapReady) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [
            { latitude: pickup.latitude, longitude: pickup.longitude },
            { latitude: dropoff.latitude, longitude: dropoff.longitude }
          ],
          {
            edgePadding: { top: 80, right: 50, bottom: 300, left: 50 },
            animated: true
          }
        )
      }, 100)
    } else if (pickup && isMapReady) {
      mapRef.current?.animateToRegion(
        {
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      )
    }
  }, [pickup, dropoff, isMapReady])

  const handleMapReady = () => {
    setIsMapReady(true)
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      className='h-full w-full'
      style={{ flex: 1 }}
      onMapReady={handleMapReady}
      onPress={onMapPress}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      showsTraffic={false}
    >
      {/* Pickup Marker - Draggable */}
      {pickup && (
        <Marker
          coordinate={{
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          }}
          title="Pickup Location"
          description={pickup.address}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate
            if (onPickupChange) {
              onPickupChange({
                ...pickup,
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              })
            }
          }}
        >
          <View className='items-center'>
            <MaterialCommunityIcons name='map-marker' size={34} color='#22DD22' />
            <View className='bg-green-500 px-2 py-1 rounded-full mt-1'>
              <Text className='text-white text-xs font-bold'>YOU</Text>
            </View>
          </View>
        </Marker>
      )}

      {/* Dropoff Marker - Draggable */}
      {dropoff && (
        <Marker
          coordinate={{
            latitude: dropoff.latitude,
            longitude: dropoff.longitude,
          }}
          title="Drop-off Location"
          description={dropoff.address}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate
            if (onDropoffChange) {
              onDropoffChange({
                ...dropoff,
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              })
            }
          }}
        >
          <View className='items-center '>
            <MaterialCommunityIcons name='map-marker-check' size={34} color='#F13B4E'  />
            <View className='bg-red-500 px-2 py-1 rounded-full mt-1'>
              <Text className='text-white text-xs font-bold'>DROP</Text>
            </View>
          </View>
        </Marker>
      )}

      {/* Route Polyline */}
      {routeData && routeData.points && routeData.points.length > 0 && (
        <Polyline
          coordinates={routeData.points}
          strokeColor="#4CAF50"
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
          zIndex={1}
        />
      )}

      {/* Direction Arrow */}
      {routeData && routeData.points.length > 0 && (
        <Marker
          coordinate={routeData.points[Math.floor(routeData.points.length / 2)]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View className='rotate-45'>
            <MaterialCommunityIcons name='arrow-right' size={24} color='#4CAF50' />
          </View>
        </Marker>
      )}
    </MapView>
  )
}