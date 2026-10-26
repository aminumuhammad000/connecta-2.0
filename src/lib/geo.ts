/**
 * Geographic and Geolocation Utilities for Connecta
 * Calculates distances, formats proximity, and generates Google Maps navigation links.
 */

export interface Coordinates {
  lat: number
  lng: number
}

// Major Nigerian City Centroids
export const NIGERIAN_CITY_COORDINATES: Record<string, Coordinates> = {
  Kano: { lat: 12.0022, lng: 8.592 },
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0765, lng: 7.3986 },
  Kaduna: { lat: 10.5105, lng: 7.4165 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
}

/**
 * Calculates the great-circle distance between two GPS coordinates using the Haversine formula.
 * @returns Distance in kilometers, rounded to 1 decimal place.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0

  const R = 6371 // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10
}

/**
 * Formats a distance in kilometers into a human-friendly string (e.g., "750 m" or "3.4 km").
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000)
    return `${meters} m`
  }
  return `${distanceKm.toFixed(1)} km`
}

/**
 * Returns a link to open turn-by-turn directions in Google Maps.
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number, label?: string): string {
  const dest = label ? encodeURIComponent(`${label}, ${lat},${lng}`) : `${lat},${lng}`
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

/**
 * Returns a link to view a location or workshop on Google Maps.
 */
export function getGoogleMapsViewUrl(lat: number, lng: number, label?: string): string {
  const query = label ? encodeURIComponent(`${label} (${lat},${lng})`) : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

/**
 * Generates deterministic coordinates around a city center with small realistic jitter.
 */
export function getCityCoordinatesWithJitter(city: string, seed: string): Coordinates {
  const base = NIGERIAN_CITY_COORDINATES[city] || NIGERIAN_CITY_COORDINATES['Kano']
  
  // Simple hash for deterministic offset
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }

  // Generate ~1km - 4km dispersion around city center
  const offsetLat = ((hash % 100) / 1000) * 0.4
  const offsetLng = (((hash >> 3) % 100) / 1000) * 0.4

  return {
    lat: Math.round((base.lat + offsetLat) * 10000) / 10000,
    lng: Math.round((base.lng + offsetLng) * 10000) / 10000,
  }
}
