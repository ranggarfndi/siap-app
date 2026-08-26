import type { Material } from '@/types'

const sumpahPrajurit: Material = {
  id: 'sumpah-prajurit',
  name: 'Sumpah Prajurit',
  shortName: 'Sumpah Prajurit',
  description: 'Lima sumpah yang diucapkan setiap prajurit TNI saat dilantik',
  itemCount: 5,
  color: '#C9A33D',
  icon: 'scroll',
  items: [
    {
      id: 'sp-1',
      number: 1,
      text: 'Setia kepada Negara Kesatuan Republik Indonesia yang berdasarkan Pancasila dan Undang-Undang Dasar 1945.',
    },
    {
      id: 'sp-2',
      number: 2,
      text: 'Tunduk kepada hukum dan memegang teguh disiplin keprajuritan.',
    },
    {
      id: 'sp-3',
      number: 3,
      text: 'Taat kepada atasan dengan tidak membantah perintah atau putusan.',
    },
    {
      id: 'sp-4',
      number: 4,
      text: 'Menjalankan segala kewajiban dengan penuh rasa tanggung jawab kepada Tentara dan Negara Republik Indonesia.',
    },
    {
      id: 'sp-5',
      number: 5,
      text: 'Memegang segala rahasia Tentara sekeras-kerasnya.',
    },
  ],
}

export default sumpahPrajurit
