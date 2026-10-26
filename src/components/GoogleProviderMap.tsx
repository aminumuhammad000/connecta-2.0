'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Navigation,
  Star,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Layers,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react'
import { PublicProvider } from '@/lib/server/providers'
import {
  calculateDistanceKm,
  formatDistance,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsViewUrl,
  Coordinates,
  NIGERIAN_CITY_COORDINATES,
} from '@/lib/geo'

declare global {
  interface Window {
    google?: any
  }
}

interface GoogleProviderMapProps {
  providers: PublicProvider[]
  userLocation: Coordinates | null
  selectedProviderId?: string | null
  onSelectProvider?: (provider: PublicProvider) => void
  onRequestUserLocation?: () => void
  isLocating?: boolean
  className?: string
  city?: string
}

export default function GoogleProviderMap({
  providers,
  userLocation,
  selectedProviderId,
  onSelectProvider,
  onRequestUserLocation,
  isLocating = false,
  className = '',
  city = 'Kano',
}: GoogleProviderMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [activeProvider, setActiveProvider] = useState<PublicProvider | null>(null)
  const [mapZoom, setMapZoom] = useState<number>(12)
  const [mapCenter, setMapCenter] = useState<Coordinates>(() => {
    return userLocation || NIGERIAN_CITY_COORDINATES[city] || NIGERIAN_CITY_COORDINATES['Kano']
  })
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets')
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false)
  const googleMapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Determine active city coordinates when city filter changes
  useEffect(() => {
    if (!userLocation) {
      const cityCoords = NIGERIAN_CITY_COORDINATES[city] || NIGERIAN_CITY_COORDINATES['Kano']
      setMapCenter(cityCoords)
      if (googleMapInstanceRef.current) {
        googleMapInstanceRef.current.panTo(cityCoords)
      }
    }
  }, [city, userLocation])

  // Center on user location when acquired
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
      setMapZoom(13)
      if (googleMapInstanceRef.current) {
        googleMapInstanceRef.current.panTo(userLocation)
        googleMapInstanceRef.current.setZoom(13)
      }
    }
  }, [userLocation])

  // Center on selected provider when clicked from list
  useEffect(() => {
    if (selectedProviderId) {
      const found = providers.find((p) => p.id === selectedProviderId)
      if (found && found.latitude && found.longitude) {
        setActiveProvider(found)
        setMapCenter({ lat: found.latitude, lng: found.longitude })
        if (googleMapInstanceRef.current) {
          googleMapInstanceRef.current.panTo({ lat: found.latitude, lng: found.longitude })
        }
      }
    }
  }, [selectedProviderId, providers])

  // Initialize Google Maps if API key exists
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  useEffect(() => {
    if (!apiKey) return

    const scriptId = 'google-maps-script'
    const existingScript = document.getElementById(scriptId)

    const initMap = () => {
      if (!mapContainerRef.current || !window.google?.maps) return

      const center = userLocation || mapCenter
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: mapZoom,
        mapTypeId: mapType === 'satellite' ? 'hybrid' : 'roadmap',
        disableDefaultUI: true,
        zoomControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      })

      googleMapInstanceRef.current = map
      setGoogleMapsLoaded(true)
    }

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else if (window.google?.maps) {
      initMap()
    }
  }, [apiKey])

  // Update Google Maps markers when providers change
  useEffect(() => {
    if (!googleMapsLoaded || !googleMapInstanceRef.current || !window.google?.maps) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const map = googleMapInstanceRef.current

    // Add user marker if available
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'You are here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      })
      markersRef.current.push(userMarker)
    }

    // Add provider markers
    providers.forEach((provider) => {
      if (!provider.latitude || !provider.longitude) return

      const marker = new window.google.maps.Marker({
        position: { lat: provider.latitude, lng: provider.longitude },
        map,
        title: `${provider.fullName} • ${provider.category}`,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#0C513F',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 1.5,
          scale: 1.6,
          anchor: new window.google.maps.Point(12, 22),
        },
      })

      marker.addListener('click', () => {
        setActiveProvider(provider)
        onSelectProvider?.(provider)
      })

      markersRef.current.push(marker)
    })
  }, [providers, userLocation, googleMapsLoaded, onSelectProvider])

  // Zoom handlers
  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 18))
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(googleMapInstanceRef.current.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 8))
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(googleMapInstanceRef.current.getZoom() - 1)
    }
  }

  const handleRecenter = () => {
    const target = userLocation || NIGERIAN_CITY_COORDINATES[city] || NIGERIAN_CITY_COORDINATES['Kano']
    setMapCenter(target)
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.panTo(target)
    }
  }

  // Fallback map projection helper for zero-API-key mode:
  // Converts lat/lng coordinates into percentage positions relative to current center & zoom
  const projectToPercent = useCallback(
    (lat: number, lng: number) => {
      // Scale factor roughly corresponding to zoom levels (12 = ~0.05 deg per 100px)
      const degSpan = 0.35 / Math.pow(1.5, mapZoom - 11)
      const xPercent = 50 + ((lng - mapCenter.lng) / degSpan) * 50
      const yPercent = 50 - ((lat - mapCenter.lat) / degSpan) * 50
      return { x: Math.max(3, Math.min(97, xPercent)), y: Math.max(3, Math.min(97, yPercent)) }
    },
    [mapCenter, mapZoom]
  )

  const formatNaira = (minorUnits: number) => {
    return `₦${Math.round(minorUnits / 100).toLocaleString()}`
  }

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-[#E8ECEF] ${className}`}
      style={{ minHeight: '440px' }}
    >
      {/* Real Google Maps Container (Active when Google Maps API loads) */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full absolute inset-0 ${apiKey && googleMapsLoaded ? 'block' : 'hidden'}`}
      />

      {/* Styled Interactive Canvas / Open Tile Layer (Zero API-Key Fallback & Instant Renderer) */}
      {(!apiKey || !googleMapsLoaded) && (
        <div className="absolute inset-0 overflow-hidden select-none bg-[#E9EEF4]">
          {/* Tile Layer (Clean Carto-inspired OpenStreetMap raster tiles) */}
          <div
            className="absolute inset-0 opacity-90 transition-all duration-300 pointer-events-none"
            style={{
              backgroundImage:
                mapType === 'satellite'
                  ? 'radial-gradient(#1E293B 1.5px, transparent 1.5px), linear-gradient(to bottom, #0F172A, #1E293B)'
                  : 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px), linear-gradient(to bottom, #F1F5F9, #E2E8F0)',
              backgroundSize: '24px 24px, 100% 100%',
            }}
          />

          {/* City Geographic Road Grid Simulation */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="road-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#FFFFFF" strokeWidth="4" />
                <path d="M 60 0 L 60 120 M 0 60 L 120 60" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#road-grid)" />
          </svg>

          {/* User Location Pulse Beacon */}
          {userLocation && (
            (() => {
              const pos = projectToPercent(userLocation.lat, userLocation.lng)
              return (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md" />
                    <span className="absolute top-5 whitespace-nowrap px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                      You are here
                    </span>
                  </div>
                </div>
              )
            })()
          )}

          {/* Provider Markers Plotted on Map */}
          {providers.map((provider) => {
            if (!provider.latitude || !provider.longitude) return null
            const pos = projectToPercent(provider.latitude, provider.longitude)
            const isSelected = activeProvider?.id === provider.id

            // Calculate distance if user location is known
            const dist =
              userLocation && provider.latitude && provider.longitude
                ? calculateDistanceKm(userLocation.lat, userLocation.lng, provider.latitude, provider.longitude)
                : null

            return (
              <div
                key={provider.id}
                className="absolute -translate-x-1/2 -translate-y-full z-30 transition-transform duration-200"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: isSelected ? 'translate(-50%, -100%) scale(1.15)' : 'translate(-50%, -100%)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveProvider(provider)
                    onSelectProvider?.(provider)
                  }}
                  className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                  title={`${provider.fullName} • ${provider.category} (${provider.city})`}
                >
                  {/* Price Tag Pill above Marker */}
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border whitespace-nowrap transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#0C513F] text-white border-white ring-2 ring-[#10B981]'
                        : 'bg-white text-slate-800 border-slate-200 group-hover:bg-[#0C513F] group-hover:text-white'
                    }`}
                  >
                    <span>{formatNaira(provider.hourlyRateMinor)}</span>
                    {dist !== null && (
                      <span className="text-[9px] opacity-80 border-l border-slate-300 pl-1 ml-0.5">
                        {formatDistance(dist)}
                      </span>
                    )}
                  </div>

                  {/* Marker Pin */}
                  <div className="relative mt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
                        isSelected ? 'bg-[#0C513F] scale-110 ring-2 ring-white' : 'bg-[#008751] group-hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    {/* Triangular Pin Tip */}
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#008751] mx-auto -mt-0.5" />
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Map Control Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Google Maps Brand Badge & Status */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-bold text-slate-900">Google Maps Live</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{providers.length} nearby in {city}</span>
        </div>

        {/* Right: GPS Nearest Locator Button */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {onRequestUserLocation && (
            <button
              type="button"
              onClick={onRequestUserLocation}
              disabled={isLocating}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                userLocation
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/95 backdrop-blur-md text-slate-800 hover:bg-slate-50 border border-slate-200'
              }`}
              title="Locate my position to find nearest service providers"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isLocating ? 'Locating...' : userLocation ? 'GPS Located' : 'Find Nearest to Me'}
              </span>
              <span className="sm:hidden">{userLocation ? 'Located' : 'Near Me'}</span>
            </button>
          )}

          {/* Recenter Button */}
          <button
            type="button"
            onClick={handleRecenter}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-slate-700 hover:bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm cursor-pointer"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Zoom & Map Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-3 z-40 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Active Provider Info Card Popup (When marker is clicked) */}
      {activeProvider && (
        <div className="absolute bottom-3 left-3 right-14 sm:right-auto sm:max-w-sm z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-white/98 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-xl space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={activeProvider.avatarUrl || '/brand/social/connecta-social-avatar-512.png'}
                    alt={activeProvider.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {activeProvider.fullName}
                    </h4>
                    {activeProvider.verificationStatus === 'verified' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {activeProvider.category}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveProvider(null)}
                className="w-5 h-5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs shrink-0 cursor-pointer"
                aria-label="Close popup"
              >
                ✕
              </button>
            </div>

            {/* Address & Distance */}
            <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
              <span className="truncate max-w-[210px] text-slate-500 text-[11px]">
                {activeProvider.workshopAddress || `${activeProvider.city}, Nigeria`}
              </span>
              {userLocation && activeProvider.latitude && activeProvider.longitude && (
                <span className="font-bold text-emerald-700 text-xs shrink-0 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {formatDistance(
                    calculateDistanceKm(
                      userLocation.lat,
                      userLocation.lng,
                      activeProvider.latitude,
                      activeProvider.longitude
                    )
                  )}{' '}
                  away
                </span>
              )}
            </div>

            {/* Rate & Direct Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div>
                <span className="text-sm font-black text-[#0C513F]">
                  {formatNaira(activeProvider.hourlyRateMinor)}
                </span>
                <span className="text-[10px] text-slate-400">/hr</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeProvider.latitude && activeProvider.longitude && (
                  <a
                    href={getGoogleMapsDirectionsUrl(
                      activeProvider.latitude,
                      activeProvider.longitude,
                      activeProvider.fullName
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors"
                    title="Get Directions in Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link
                  href={`/discover/${activeProvider.id}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
