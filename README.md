# SIAP — Sistem Interaktif Asah Prajurit

> **"Latih. Hafalkan. Tepatkan."**

SIAP (*Sistem Interaktif Asah Prajurit*) adalah platform web modern dan interaktif yang dirancang untuk membantu prajurit TNI dan calon prajurit mempelajari, melatih, serta menyetorkan hafalan materi doktrin keprajuritan:

1. **SAPTA MARGA** (7 Butir)
2. **SUMPAH PRAJURIT** (5 Butir)
3. **8 WAJIB TNI** (8 Butir)

---

## ✨ Fitur Utama

- **🚀 Tanpa Login / Register**: Akses instan langsung ke dashboard tanpa hambatan akun.
- **📚 3 Mode Pembelajaran Interaktif**:
  - **Mode Belajar**: Tampilan terstruktur per butir dengan kontrol tampil/sembunyi teks dan indikator progres.
  - **Mode Flashcard**: Interaksi kartu bolak-balik 3D dengan evaluasi mandiri (*Belum Hafal*, *Hampir Hafal*, *Sudah Hafal*).
  - **Mode Kata Tersembunyi**: Latihan mengisi kata rumpang dengan 3 tingkat kesulitan (*Mudah - 20%*, *Sedang - 40%*, *Sulit - 65%*).
- **✍️ Setoran Hafalan via Ketikan**: Dilengkapi toggle *Mode Hafalan Murni* (mencegah paste) dan penghitung karakter.
- **🎙️ Setoran Hafalan via Suara**: Perekaman dan transkripsi suara Bahasa Indonesia langsung di browser secara **100% GRATIS** menggunakan Web Speech API (`id-ID`) tanpa memerlukan server backend atau API key berbayar.
- **🧠 Scoring Engine Deterministik**: Perhitungan akurasi berbasis *Longest Common Subsequence (LCS)* & Sequence Alignment.
- **🎨 WordDiff Interaktif**: Visualisasi kata per kata dengan kode warna militer:
  - 🟢 **Hijau**: Benar
  - 🟡 **Kuning**: Kurang Tepat
  - 🔴 **Merah**: Terlewat
  - ⚪ **Abu-abu**: Kata Tambahan
- **💾 Penyimpanan Lokal (IndexedDB & Dexie.js)**: Riwayat setoran, tren nilai, progres materi, dan streak tersimpan aman di perangkat pengguna.
- **🏆 Gamifikasi Disiplin**: Sistem XP, Level (*Pemula* s.d. *Unggul*), Target Harian, dan 12 Badge Pencapaian.
- **📦 Backup & Portabilitas**: Fitur *Export/Import JSON* berstandar Zod schema dan opsi Reset Data.
- **📱 Desain Modern Responsif**: Antarmuka bertema *Modern Military Command Interface* dengan palet warna taktis (#07110C, #7BBE45, #C9A33D), sidebar desktop, dan bottom navigation untuk mobile/smartphone.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Military Custom Theme |
| **Animation** | CSS Keyframes & Web Animations |
| **Icons** | Lucide React |
| **Local Storage** | IndexedDB via Dexie.js |
| **Speech-to-Text** | Web Speech API (Browser Built-in, Free) |
| **Charts** | Recharts |
| **Validation** | Zod v4 |

---

## 🚀 Cara Menjalankan Project

### 1. Masuk ke Direktori Project
```bash
cd d:/laragon/www/siap/siap-app
```

### 2. Install Dependencies (jika belum)
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 4. Build untuk Production
```bash
npm run build
npm run start
```

---

## 📂 Struktur Project

```text
siap-app/
├── public/
│   └── siap-logo.svg              # Logo vektor SIAP
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout dengan font dan meta
│   │   ├── globals.css            # Desain sistem & palet warna militer
│   │   ├── page.tsx               # Dashboard utama
│   │   ├── latihan/
│   │   │   ├── page.tsx           # Pilihan materi latihan
│   │   │   └── [material]/        # Halaman latihan (Belajar/Flashcard/Rumpang)
│   │   ├── setor/
│   │   │   ├── page.tsx           # Pilihan materi setor
│   │   │   └── [material]/        # Halaman setor ketikan & suara
│   │   ├── hasil/
│   │   │   └── page.tsx           # Halaman evaluasi skor & WordDiff
│   │   ├── riwayat/
│   │   │   └── page.tsx           # Log riwayat seluruh setoran
│   │   ├── progress/
│   │   │   └── page.tsx           # Grafik tren & statistik akurasi
│   │   ├── pencapaian/
│   │   │   └── page.tsx           # Level & badge prestasi
│   │   └── pengaturan/
│   │       └── page.tsx           # Target harian, backup & reset
│   ├── components/
│   │   ├── dashboard/             # Hero, MaterialCards, DailyTarget, Streak
│   │   ├── layout/                # Sidebar desktop & Bottom nav mobile
│   │   ├── memorization/          # StudyMode, Flashcard, HiddenWords, Textarea
│   │   ├── scoring/               # WordDiff & breakdown hasil
│   │   ├── settings/              # Komponen import JSON
│   │   ├── ui/                    # ProgressRing & ScoreCircle
│   │   └── voice/                 # Waveform & VoiceRecorder
│   ├── constants/                 # Konstanta aplikasi & device ID
│   ├── data/
│   │   └── materials/             # Teks kanonikal terverifikasi TNI
│   ├── hooks/
│   │   └── useSpeechRecognition.ts# Hook pengenalan suara Web Speech API
│   ├── lib/
│   │   ├── db/                    # Inisialisasi database Dexie
│   │   ├── gamification/          # Sistem XP, Level, Achievement
│   │   ├── scoring/               # LCS alignment & formula penilaian
│   │   └── storage/               # Layer CRUD IndexedDB
│   └── types/
│       └── index.ts               # Seluruh tipe data TypeScript
```

---

## 🔒 Catatan Privasi & Keamanan

- **Tidak ada pengumpulan data pribadi**: Aplikasi tidak meminta nama, email, NRP, unit, atau lokasi.
- **Audio Sementara**: Suara rekaman diproses secara real-time melalui browser speech recognition dan **tidak pernah disimpan** dalam bentuk file audio di mana pun.
- **Penyimpanan Lokal**: Semua riwayat latihan tersimpan secara eksklusif di IndexedDB browser perangkat Anda.
