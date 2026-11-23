# Tools Web – AI Coding Tools Platform

Tools Web adalah platform penyedia berbagai AI-powered coding tools yang dirancang untuk membantu programmer menulis, membedah, mengoptimalkan, dan men-debug kode secara instan, serta belajar melalui interactive courses dan coding challenges yang dievaluasi secara otomatis oleh Anthropic Claude AI.

---

## 🚀 Fitur Utama

1. **Authentication & Session Management**
   - Registrasi akun baru dan Login berbasis Session Token (tersimpan aman).
   - Password di-hash menggunakan algoritma SHA-256 + Salt (bukan plaintext).
   - Validasi email unik, proteksi rute dashboard, dan fitur Remember Me.
   - Quick 1-Click Login Akun Demo untuk mempermudah pengujian.

2. **Informative SaaS Dashboard**
   - Welcome banner personal dengan quick action.
   - 4 Kartu Metrik Utama: *Total AI Requests*, *Tools Used*, *Courses Completed*, dan *Learning Progress* terhubung langsung ke database.
   - Quick Access ke 4 AI tools terpopuler.
   - Riwayat aktivitas (*Recent Activities*) real-time.
   - Rekomendasi kursus interaktif.

3. **6 AI Coding Tools Terintegrasi (Anthropic Claude)**
   - **AI Code Generator**: Menghasilkan kode siap pakai dalam berbagai bahasa (JavaScript, Python, HTML, CSS, Java, C#, PHP, Dart, SQL) dan jenis project.
   - **Code Explainer**: Membedah logika kode, langkah kerja, konsep kunci, dan kompleksitas waktu/ruang (Big O).
   - **Bug Finder & Fixer**: Menganalisis potensi bug, penyebab error, rekomendasi pencegahan, dan menyediakan kode yang telah diperbaiki.
   - **Code Optimizer**: Menganalisis efisiensi komputasi, alokasi memori, serta strategi refactoring.
   - **SQL Generator**: Mengubah kebutuhan data dalam bahasa alami menjadi kueri SQL presisi untuk PostgreSQL, MySQL, SQLite, dan SQL Server.
   - **HTML/CSS Generator**: Merancang antarmuka web modern dengan opsi Tailwind CSS / Pure CSS dan fitur **Live Preview**.
   - Setiap tool dilengkapi syntax highlighting, tombol **Copy Code**, **Regenerate**, dan **Clear**.

4. **Tutorial & Knowledge Center**
   - 7 Kategori panduan step-by-step:
     1. Getting Started
     2. Cara Menggunakan AI Code Generator
     3. Cara Menggunakan Code Explainer
     4. Cara Debugging dengan AI
     5. Cara Mengoptimalkan Kode
     6. Tips Membuat Prompt yang Baik
     7. Memahami Hasil AI
   - Reader modal yang nyaman dengan estimasi waktu baca.

5. **Interactive Courses & Coding Challenges**
   - **HTML Fundamentals**: 5 modul materi + 3 tantangan coding.
   - **CSS Fundamentals**: 5 modul materi + 3 tantangan coding.
   - **JavaScript Fundamentals**: 5 modul materi + 3 tantangan coding.
   - Editor kode interaktif untuk mengerjakan tantangan.
   - Evaluasi instan oleh AI (Correct / Needs Improvement, Skor, Ulasan konstruktif, dan contoh Solusi).
   - Pencatatan progres siswa ke database Google Sheets (*Progress Sheet*).

6. **User Profile & Settings**
   - Edit nama lengkap, username, dan avatar dinamis.
   - Fitur ubah password dengan verifikasi password lama.
   - Pengaturan tema: **Light Mode** & **Dark Green Mode** (tersimpan di localStorage).
   - **Backend Connection Manager**: Uji koneksi Web App Google Apps Script langsung dari UI.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript JSX, Tailwind CSS, Lucide React, React Router (`HashRouter` untuk kompatibilitas penuh GitHub Pages).
- **Backend API**: Google Apps Script Web App (`apps-script/code.gs`).
- **Database**: Google Sheets (Tabel: `Users`, `Sessions`, `Activities`, `Courses`, `Lessons`, `Challenges`, `Progress`).
- **AI Provider**: Anthropic Claude API (`claude-3-5-sonnet-20241022`).
- **Deployment**: GitHub Pages (Frontend) & Google Apps Script (Backend).

---

## 🎨 Design System & Color Palette

- **Primary Green**: `#123D2A`
- **Dark Green**: `#0B251B`
- **Secondary Green**: `#245C40`
- **Accent Green**: `#67B58A`
- **Light Green**: `#E9F4ED`
- **White**: `#FFFFFF`
- **Background**: `#F7F9F7` (Dark Mode: `#07150F`)
- **Text Primary**: `#17251D` (Dark Mode: `#E9F4ED`)
- **Text Secondary**: `#7B887F` (Dark Mode: `#8DA396`)
- **Border**: `#E5EBE6` (Dark Mode: `#1A4532`)

---

## 📁 Struktur Project

```text
Tools-Web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CodeEditor.jsx       # Syntax viewer & editor dengan copy & regenerate
│   │   ├── LoadingState.jsx     # Spinner, Skeleton loaders, Empty & Error states
│   │   ├── Navbar.jsx           # Clean header, theme toggle, connection badge
│   │   ├── Sidebar.jsx          # Collapsible desktop & mobile drawer navigation
│   │   ├── StatCard.jsx         # Card metrik statistik
│   │   └── ToolCard.jsx         # Card preview tool
│   ├── context/
│   │   ├── AuthContext.jsx      # Autentikasi, session token, user state
│   │   └── ThemeContext.jsx     # Dark & Light mode switcher
│   ├── layouts/
│   │   └── DashboardLayout.jsx  # Layout utama dengan route guard
│   ├── pages/
│   │   ├── CourseDetail.jsx     # Materi modul & arena coding challenges
│   │   ├── Courses.jsx          # Daftar kursus interaktif
│   │   ├── Dashboard.jsx        # Ringkasan analitik, riwayat & quick access
│   │   ├── Login.jsx            # Autentikasi login
│   │   ├── Profile.jsx          # Edit profil & ubah password
│   │   ├── Register.jsx         # Pendaftaran akun baru
│   │   ├── Settings.jsx         # Tema, preferensi & Apps Script URL manager
│   │   ├── Tools.jsx            # 6 AI coding tools interaktif
│   │   └── Tutorials.jsx        # Pusat panduan developer
│   ├── services/
│   │   ├── api.js               # Client API ke Google Apps Script & fallback engine
│   │   └── mockData.js          # Kurikulum, tutorial, dan seed database
│   ├── App.jsx                  # HashRouter & rute aplikasi
│   ├── index.css                # Tailwind directives & custom styling
│   └── main.jsx                 # Entry point React
├── apps-script/
│   └── code.gs                  # Backend utama Google Apps Script
├── .github/workflows/
│   └── deploy.yml               # GitHub Actions CI/CD ke GitHub Pages
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Panduan Setup Backend (Google Apps Script & Google Sheets)

### Langkah 1: Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet, misalnya **`Tools Web Database`**.

### Langkah 2: Buka Apps Script Editor
1. Di dalam spreadsheet tersebut, klik menu **Extensions > Apps Script**.
2. Hapus kode bawaan di dalam editor.
3. Buka file [`apps-script/code.gs`](file:///c:/Users/Ani%20Winarti/Downloads/Project%20API/apps-script/code.gs) pada project ini, lalu salin seluruh kodenya dan tempelkan ke editor Apps Script.
4. Klik tombol **Save** (ikon disket) atau tekan `Ctrl + S`.

### Langkah 3: Konfigurasi Anthropic API Key
1. Di panel sebelah kiri Google Apps Script, klik **Project Settings** (ikon roda gigi).
2. Gulir ke bawah hingga bagian **Script Properties**, lalu klik **Add script property**.
3. Masukkan:
   - **Property**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api03-...` (API Key Anthropic Anda)
4. *(Opsional)* Anda juga dapat menambahkan property `ANTHROPIC_MODEL` jika ingin menggunakan model tertentu (default: `claude-3-5-sonnet-20241022`).
5. Klik **Save script properties**.

### Langkah 4: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy > New deployment**.
2. Klik ikon gerigi di sebelah *Select type*, pilih **Web app**.
3. Isi konfigurasi deployment:
   - **Description**: `Tools Web Production API v1`
   - **Execute as**: `Me (email anda)`
   - **Who has access**: `Anyone` *(Penting agar frontend GitHub Pages dapat mengakses API)*
4. Klik **Deploy**.
5. Berikan otorisasi izin akses akun Google jika diminta:
   - Klik *Review Permissions* -> Pilih Akun Anda -> Klik *Advanced* -> Klik *Go to (Untitled project) (unsafe)* -> Klik *Allow*.
6. Salin **Web app URL** yang muncul (format: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 💻 Menghubungkan Frontend ke Backend

Anda dapat menghubungkan frontend dengan salah satu dari dua cara berikut:

### Cara 1: Melalui Pengaturan Aplikasi (Tanpa Perlu Rebuild)
1. Buka website Tools Web di browser.
2. Masuk ke menu **Settings** (ikon gerigi).
3. Pada bagian **Google Apps Script & Database Integrasi**, tempelkan URL Web App Anda ke kolom yang tersedia.
4. Klik tombol **Simpan URL** lalu klik **Uji Koneksi**.

### Cara 2: Melalui File Environment (.env)
1. Buat file `.env` di root direktori project:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```
2. Jalankan build ulang: `npm run build`.

> **Catatan Mode Offline / Demo:**
> Jika URL Google Apps Script belum diisi, Tools Web secara otomatis mengaktifkan **Local Offline Engine**. Semua fitur (registrasi, login, 6 AI tools, courses, coding challenges, hingga profil) tetap berfungsi penuh dan persisten di browser untuk keperluan pengujian dan review!

---

## 🌐 Panduan Deployment ke GitHub Pages

### Opsi A: Menggunakan GitHub Actions (Otomatis & Direkomendasikan)
File workflow sudah disediakan di [`.github/workflows/deploy.yml`](file:///c:/Users/Ani%20Winarti/Downloads/Project%20API/.github/workflows/deploy.yml).

1. Buat repository baru di GitHub bernama `Membuat-Tools-Web`.
2. Push seluruh source code ke repository Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit Tools Web platform"
   git branch -M main
   git remote add origin https://github.com/RakhaZuhdiNaufal/Membuat-Tools-Web.git
   git push -u origin main
   ```
3. Di halaman GitHub repository Anda:
   - Buka **Settings > Pages**.
   - Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. Workflow akan otomatis mem-build dan mempublikasikan website ke:
   `https://RakhaZuhdiNaufal.github.io/Membuat-Tools-Web/`

### Opsi B: Build Manual
1. Jalankan build di lokal:
   ```bash
   npm run build
   ```
2. Folder `dist/` berisi static HTML/JS/CSS yang siap di-upload ke branch `gh-pages` atau hosting statis manapun (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

---

## 🧪 Akun Demo untuk Pengujian Cepat

Jika ingin langsung mencoba platform tanpa registrasi manual:
- **Email**: `developer@toolsweb.dev`
- **Password**: `password`
- Atau cukup klik tombol **"Gunakan Akun Demo (1-Click Login)"** di halaman Login.
