export const APP_NAME = 'SIAP'
export const APP_FULL_NAME = 'Sistem Interaktif Asah Prajurit'
export const APP_TAGLINE = 'Latih. Hafalkan. Tepatkan.'
export const DB_NAME = 'siap_local_db'
export const DEVICE_ID_KEY = 'siap_device_id'
export const XP_KEY = 'siap_xp'

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, id)
  return id
}
