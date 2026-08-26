import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { getMaterialById, MATERIAL_ROUTE_MAP } from '@/data/materials'
import LatihanMaterialClient from './LatihanMaterialClient'

interface PageProps {
  params: Promise<{ material: string }>
}

export default async function LatihanMaterialPage({ params }: PageProps) {
  const { material: slug } = await params
  const materialId = MATERIAL_ROUTE_MAP[slug]
  const material = materialId ? getMaterialById(materialId) : undefined

  if (!material) return notFound()

  return (
    <AppLayout>
      <LatihanMaterialClient material={material} />
    </AppLayout>
  )
}
