import saptaMarga from './sapta-marga'
import sumpahPrajurit from './sumpah-prajurit'
import delapanWajibTni from './delapan-wajib-tni'
import type { Material, MaterialId } from '@/types'

export const materials: Material[] = [saptaMarga, sumpahPrajurit, delapanWajibTni]

export const getMaterialById = (id: MaterialId): Material | undefined =>
  materials.find((m) => m.id === id)

export const getMaterialLabel = (id: MaterialId): string => {
  const m = getMaterialById(id)
  return m?.name ?? id
}

export const MATERIAL_ROUTE_MAP: Record<string, MaterialId> = {
  'sapta-marga': 'sapta-marga',
  'sumpah-prajurit': 'sumpah-prajurit',
  '8-wajib-tni': '8-wajib-tni',
}

export { saptaMarga, sumpahPrajurit, delapanWajibTni }

export default materials
