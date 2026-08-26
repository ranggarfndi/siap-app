import { notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { getMaterialById, MATERIAL_ROUTE_MAP } from '@/data/materials'
import SetorMaterialClient from './SetorMaterialClient'

interface PageProps {
  params: Promise<{ material: string }>
}

export default async function SetorMaterialPage({ params }: PageProps) {
  const { material: slug } = await params
  const materialId = MATERIAL_ROUTE_MAP[slug]
  const material = materialId ? getMaterialById(materialId) : undefined

  if (!material) return notFound()

  return (
    <AppLayout>
      <SetorMaterialClient material={material} />
    </AppLayout>
  )
}
