'use client'

import { useEffect, useRef } from 'react'

interface MapViewProps {
  center: { lat: number; lng: number }
  marker?: { lat: number; lng: number }
  zoom?: number
}

export function MapView({ center, marker, zoom = 15 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      disableDefaultUI: true,
      zoomControl: true,
    })

    new window.google.maps.Marker({
      position: center,
      map,
      icon: marker ? undefined : {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#fff',
      },
    })

    if (marker) {
      new window.google.maps.Marker({
        position: marker,
        map,
      })
    }
  }, [center, marker, zoom])

  return <div ref={mapRef} className="w-full h-64 rounded-lg bg-gray-100" />
}
