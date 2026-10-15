import { useState, useCallback } from "react"
import { authService } from "../services/authService"

export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée par ce navigateur.")
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        setPosition({ latitude, longitude })
        try {
          const res = await authService.geolocate({ latitude, longitude })
          setAddress(res.data.address)
        } catch {}
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { position, address, loading, error, getCurrentPosition }
}
