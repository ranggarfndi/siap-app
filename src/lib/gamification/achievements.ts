import type { AchievementDefinition } from '@/types'

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-submission',
    name: 'Setoran Pertama',
    description: 'Melakukan setoran hafalan untuk pertama kali',
    icon: '🎖️',
    xpReward: 20,
  },
  {
    id: 'sapta-marga-100',
    name: 'Sapta Marga Sempurna',
    description: 'Mendapatkan skor 100 pada Sapta Marga',
    icon: '🛡️',
    xpReward: 50,
  },
  {
    id: 'sumpah-prajurit-100',
    name: 'Sumpah Prajurit Sempurna',
    description: 'Mendapatkan skor 100 pada Sumpah Prajurit',
    icon: '📜',
    xpReward: 50,
  },
  {
    id: '8-wajib-tni-100',
    name: '8 Wajib TNI Sempurna',
    description: 'Mendapatkan skor 100 pada 8 Wajib TNI',
    icon: '✅',
    xpReward: 50,
  },
  {
    id: 'all-material-100',
    name: 'Prajurit Teladan',
    description: 'Mendapatkan skor 100 pada semua materi',
    icon: '⭐',
    xpReward: 150,
  },
  {
    id: 'streak-7',
    name: '7 Hari Konsisten',
    description: 'Berlatih selama 7 hari berturut-turut',
    icon: '🔥',
    xpReward: 70,
  },
  {
    id: 'streak-30',
    name: '30 Hari Pejuang',
    description: 'Berlatih selama 30 hari berturut-turut',
    icon: '💪',
    xpReward: 300,
  },
  {
    id: 'submissions-10',
    name: '10 Setoran',
    description: 'Menyelesaikan 10 setoran hafalan',
    icon: '📋',
    xpReward: 30,
  },
  {
    id: 'submissions-30',
    name: '30 Setoran',
    description: 'Menyelesaikan 30 setoran hafalan',
    icon: '📊',
    xpReward: 80,
  },
  {
    id: 'submissions-100',
    name: '100 Setoran',
    description: 'Menyelesaikan 100 setoran hafalan',
    icon: '🏆',
    xpReward: 200,
  },
  {
    id: 'perfect-score',
    name: 'Skor Sempurna',
    description: 'Mendapatkan skor 100 untuk pertama kali',
    icon: '💯',
    xpReward: 100,
  },
  {
    id: 'voice-submission',
    name: 'Suara Prajurit',
    description: 'Melakukan setoran pertama via suara',
    icon: '🎤',
    xpReward: 25,
  },
]

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id)
}
