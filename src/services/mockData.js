/**
 * CODEFORGE Mock & Seed Data
 * Provides default data structures, initial curriculum, tutorials,
 * and offline/local storage persistence engine.
 */

export const INITIAL_COURSES = [
  {
    id: 'c_html_01',
    title: 'HTML Fundamentals',
    description: 'Pelajari fondasi utama pembuatan halaman web modern dari elemen struktural hingga formulir interaktif.',
    difficulty: 'Beginner',
    duration: '3 Jam',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    lessons: [
      {
        id: 'l_html_01',
        title: 'Introduction to HTML',
        content: `### Apa itu HTML?
HTML (**HyperText Markup Language**) adalah batu bata penyusun dari setiap halaman di World Wide Web. HTML menentukan struktur dan makna dari konten website.

#### Karakteristik Utama HTML:
- **Bukan bahasa pemrograman**, melainkan bahasa markup yang menggunakan tag.
- Ditafsirkan secara langsung oleh browser web (Chrome, Firefox, Safari).
- Menentukan hierarki elemen seperti paragraf, judul, link, dan gambar.

\`\`\`html
<!DOCTYPE html>
<html lang="id">
  <head>
    <title>Halaman Pertama Saya</title>
  </head>
  <body>
    <h1>Halo, Dunia!</h1>
    <p>Selamat datang di platform belajar CODEFORGE.</p>
  </body>
</html>
\`\`\``,
        order_number: 1
      },
      {
        id: 'l_html_02',
        title: 'HTML Structure & Metadata',
        content: `### Anatomi Dokumen HTML5
Setiap dokumen HTML5 yang valid memiliki elemen-elemen fundamental:

1. **\`<!DOCTYPE html>\`**: Deklarasi dokumen agar browser merender dalam standar modern.
2. **\`<html lang="id">\`**: Root elemen pembungkus seluruh konten.
3. **\`<head>\`**: Tempat metadata, judul tab (\`<title>\`), tautan CSS (\`<link>\`), dan charset encoding (\`<meta charset="UTF-8">\`).
4. **\`<body>\`**: Seluruh konten yang tampak secara visual oleh pengguna di browser.`,
        order_number: 2
      },
      {
        id: 'l_html_03',
        title: 'Heading and Paragraph',
        content: `### Mengorganisir Konten Teks
Heading dan paragraf adalah elemen terpenting untuk SEO dan kenyamanan membaca pengguna.

- **Tag Heading**: \`<h1>\` hingga \`<h6>\`. Gunakan hanya **satu** \`<h1>\` per halaman sebagai judul utama artikel atau landing page.
- **Tag Paragraf**: \`<p>\` digunakan untuk membungkus blok teks atau kalimat penjelasan.

\`\`\`html
<h1>Panduan Belajar Web Development</h1>
<h2>Langkah Awal</h2>
<p>Mulailah dengan memahami sintaks markup dasar dan hirarki tag.</p>
\`\`\``,
        order_number: 3
      },
      {
        id: 'l_html_04',
        title: 'Links and Images',
        content: `### Menghubungkan Halaman & Media Visual
Website menjadi interaktif melalui hyperlink dan media visual:

- **Anchor Link**: Menggunakan tag \`<a href="...">\`. Atribut \`target="_blank"\` membuka tautan di tab baru.
- **Image**: Menggunakan tag void \`<img src="..." alt="...">\`. Atribut \`alt\` sangat penting untuk screen-reader dan aksesibilitas.

\`\`\`html
<!-- Link eksternal -->
<a href="https://codeforge.dev" target="_blank" rel="noopener">Kunjungi CODEFORGE</a>

<!-- Gambar responsif -->
<img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600" alt="Laptop dengan kode programming" width="600" />
\`\`\``,
        order_number: 4
      },
      {
        id: 'l_html_05',
        title: 'HTML Forms & Inputs',
        content: `### Formulir Interaktif untuk Menerima Input
Formulir digunakan untuk registrasi, login, pencarian, dan feedback pengguna.

\`\`\`html
<form action="/submit" method="POST">
  <div>
    <label for="fullname">Nama Lengkap:</label>
    <input type="text" id="fullname" name="fullname" required placeholder="Masukkan nama..." />
  </div>
  <div>
    <label for="email">Alamat Email:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <label for="message">Pesan:</label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>
  <button type="submit">Kirim Sekarang</button>
</form>
\`\`\``,
        order_number: 5
      }
    ],
    challenges: [
      {
        id: 'ch_html_01',
        lesson_id: 'l_html_03',
        title: 'Membuat Halaman Profil Sederhana',
        description: 'Buat struktur HTML profil pribadi yang terdiri dari judul nama dan dua paragraf biografi singkat.',
        instructions: '1. Buat elemen <h1> berisi nama Anda.\n2. Buat elemen <p> pertama berisi profesi/minat coding.\n3. Buat elemen <p> kedua berisi tujuan belajar di CODEFORGE.',
        expected_result: '<h1>Nama Anda</h1>\n<p>Saya seorang Web Developer pemula...</p>\n<p>Tujuan saya belajar adalah menguasai AI tools...</p>',
        difficulty: 'Easy',
        starter_code: '<!-- Tulis jawaban HTML Anda di sini -->\n<h1>Budi Santoso</h1>\n'
      },
      {
        id: 'ch_html_02',
        lesson_id: 'l_html_04',
        title: 'Membuat Halaman Artikel',
        description: 'Susun sebuah artikel dengan heading level 1, sub-heading level 2, sebuah elemen gambar berserta deskripsi alt, dan sebuah tautan referensi.',
        instructions: 'Gunakan tag <h1>, <h2>, <p>, <img src="..." alt="...">, dan <a href="...">.',
        expected_result: '<h1>Judul Artikel</h1>\n<h2>Subjudul</h2>\n<p>Isi artikel...</p>\n<img src="https://via.placeholder.com/150" alt="Thumbnail" />\n<a href="https://example.com">Baca Selengkapnya</a>',
        difficulty: 'Medium',
        starter_code: '<h1>Evolusi Kecerdasan Buatan</h1>\n<h2>Dari Perceptron ke LLM</h2>\n'
      },
      {
        id: 'ch_html_03',
        lesson_id: 'l_html_05',
        title: 'Membuat Form Pendaftaran',
        description: 'Bangun formulir pendaftaran akun lengkap dengan input Nama, Email, Password, serta tombol Submit.',
        instructions: '1. Gunakan tag pembungkus <form>.\n2. Sertakan label dan input untuk name, email, dan password.\n3. Tambahkan <button type="submit">Daftar Akun</button>.',
        expected_result: '<form>\n  <label>Nama:</label><input type="text" required />\n  <label>Email:</label><input type="email" required />\n  <label>Password:</label><input type="password" required />\n  <button type="submit">Daftar</button>\n</form>',
        difficulty: 'Medium',
        starter_code: '<form>\n  <!-- Tambahkan elemen input di sini -->\n</form>'
      }
    ]
  },
  {
    id: 'c_css_02',
    title: 'CSS Fundamentals',
    description: 'Kuasai tata letak visual, styling, flexbox, dan grid untuk membuat antarmuka web modern yang responsif.',
    difficulty: 'Beginner',
    duration: '4 Jam',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    lessons: [
      {
        id: 'l_css_01',
        title: 'Introduction to CSS',
        content: `### Apa itu CSS?
CSS (**Cascading Style Sheets**) bertugas mempercantik tampilan visual dari kerangka HTML.

Cara menyisipkan CSS:
1. **External CSS**: File \`.css\` terpisah dihubungkan via tag \`<link rel="stylesheet" href="style.css">\`.
2. **Internal CSS**: Di dalam tag \`<style>\` di dalam \`<head>\`.
3. **Inline CSS**: Langsung pada elemen menggunakan atribut \`style="..."\`.`,
        order_number: 1
      },
      {
        id: 'l_css_02',
        title: 'Selectors & Specificity',
        content: `### Menargetkan Elemen HTML
- **Element Selector**: \`h1 { color: #123D2A; }\`
- **Class Selector**: \`.btn { padding: 10px 16px; border-radius: 6px; }\`
- **ID Selector**: \`#header { background: #0B251B; }\`
- **Pseudo-classes**: \`a:hover\`, \`button:active\`, \`li:first-child\``,
        order_number: 2
      },
      {
        id: 'l_css_03',
        title: 'Colors and Typography',
        content: `### Warna dan Tipografi Profesional
- Format warna: HEX (\`#67B58A\`), RGB (\`rgb(18, 61, 42)\`), HSL (\`hsl(150, 54%, 20%)\`).
- Properti teks: \`font-family\`, \`font-size\`, \`font-weight\`, \`line-height\`, \`letter-spacing\`.`,
        order_number: 3
      },
      {
        id: 'l_css_04',
        title: 'Flexbox Layout',
        content: `### Tata Letak Fleksibel 1 Dimensi
Flexbox mempermudah penyusunan elemen baik secara horizontal maupun vertikal:
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between; /* spasi antara logo dan navigasi */
  align-items: center; /* sejajar secara vertikal */
  padding: 1rem 2rem;
}
\`\`\``,
        order_number: 4
      },
      {
        id: 'l_css_05',
        title: 'CSS Grid',
        content: `### Tata Letak 2 Dimensi (Baris & Kolom)
CSS Grid sangat ideal untuk tata letak halaman komprehensif:
\`\`\`css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
\`\`\``,
        order_number: 5
      }
    ],
    challenges: [
      {
        id: 'ch_css_01',
        lesson_id: 'l_css_03',
        title: 'Membuat Kartu Profil',
        description: 'Tuliskan aturan CSS untuk class .profile-card agar memiliki background putih, padding 24px, border radius 12px, dan bayangan halus (box-shadow).',
        instructions: 'Definisikan class .profile-card dengan properti:\n- background-color: #ffffff;\n- padding: 24px;\n- border-radius: 12px;\n- box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
        expected_result: '.profile-card {\n  background-color: #ffffff;\n  padding: 24px;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}',
        difficulty: 'Easy',
        starter_code: '.profile-card {\n  /* Tulis properti styling di sini */\n}'
      },
      {
        id: 'ch_css_02',
        lesson_id: 'l_css_04',
        title: 'Membuat Navigation Bar dengan Flexbox',
        description: 'Atur kelas .navbar dengan display flex sehingga item di dalamnya terdistribusi secara rapi di ujung kiri dan kanan, serta terpusat secara vertikal.',
        instructions: 'Gunakan properti display: flex, justify-content: space-between, dan align-items: center.',
        expected_result: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}',
        difficulty: 'Medium',
        starter_code: '.navbar {\n  /* Terapkan Flexbox di sini */\n}'
      },
      {
        id: 'ch_css_03',
        lesson_id: 'l_css_05',
        title: 'Membuat Layout Landing Page dengan CSS Grid',
        description: 'Buat kelas .grid-container yang memiliki layout 3 kolom sama lebar dengan jarak antar kolom (gap) sebesar 24px.',
        instructions: 'Gunakan display: grid, grid-template-columns: repeat(3, 1fr), dan gap: 24px.',
        expected_result: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}',
        difficulty: 'Hard',
        starter_code: '.grid-container {\n  /* Terapkan CSS Grid di sini */\n}'
      }
    ]
  },
  {
    id: 'c_js_03',
    title: 'JavaScript Fundamentals',
    description: 'Pelajari logika pemrograman modern, manipulasi data, fungsi, kondisi percabangan, perulangan, dan array.',
    difficulty: 'Intermediate',
    duration: '5 Jam',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    lessons: [
      {
        id: 'l_js_01',
        title: 'Variables & Data Types',
        content: `### Deklarasi Variabel Modern
Gunakan \`const\` untuk variabel yang nilainya konstan dan \`let\` jika nilainya dapat berubah. Hindari penggunaan \`var\`.

Tipe Data Primitif:
- **String**: \`"CODEFORGE"\`
- **Number**: \`42\` atau \`3.14\`
- **Boolean**: \`true\` atau \`false\`
- **Undefined**: Belum diinisialisasi
- **Null**: Nilai kosong yang disengaja`,
        order_number: 1
      },
      {
        id: 'l_js_02',
        title: 'Functions & Arrow Functions',
        content: `### Fungsi Bersih dan Reusable
\`\`\`javascript
// Tradisional
function tambah(a, b) {
  return a + b;
}

// Modern Arrow Function
const kali = (a, b) => a * b;
\`\`\``,
        order_number: 2
      },
      {
        id: 'l_js_03',
        title: 'Conditions & Control Flow',
        content: `### Logika Pengambilan Keputusan
\`\`\`javascript
const score = 85;

if (score >= 80) {
  console.log("Kinerja Luar Biasa!");
} else if (score >= 60) {
  console.log("Lulus dengan Baik");
} else {
  console.log("Perlu Evaluasi");
}
\`\`\``,
        order_number: 3
      },
      {
        id: 'l_js_04',
        title: 'Loops & Iteration',
        content: `### Melakukan Perulangan pada Data
\`\`\`javascript
const tools = ['Code Generator', 'Bug Finder', 'Code Optimizer'];

// for...of
for (const tool of tools) {
  console.log('Tool aktif:', tool);
}

// Array forEach
tools.forEach((tool, index) => {
  console.log(\`\${index + 1}. \${tool}\`);
});
\`\`\``,
        order_number: 4
      },
      {
        id: 'l_js_05',
        title: 'Arrays & Object Manipulation',
        content: `### Method Modern Array: map, filter, reduce
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Dobel nilai
const doubled = numbers.map(n => n * 2);

// Filter genap
const evens = numbers.filter(n => n % 2 === 0);

// Total jumlah
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
\`\`\``,
        order_number: 5
      }
    ],
    challenges: [
      {
        id: 'ch_js_01',
        lesson_id: 'l_js_02',
        title: 'Membuat Kalkulator Sederhana',
        description: 'Tulis sebuah fungsi calculate(a, b, operator) yang menerima dua angka dan satu string operator ("+", "-", "*", "/") lalu mengembalikan hasil perhitungannya.',
        instructions: '1. Buat fungsi calculate(a, b, operator).\n2. Gunakan percabangan if/switch untuk memeriksa operator.\n3. Kembalikan angka hasil kalkulasi.',
        expected_result: 'function calculate(a, b, op) {\n  if (op === "+") return a + b;\n  if (op === "-") return a - b;\n  if (op === "*") return a * b;\n  if (op === "/") return a / b;\n}',
        difficulty: 'Easy',
        starter_code: 'function calculate(a, b, operator) {\n  // Tulis logika kalkulasi Anda di sini\n}'
      },
      {
        id: 'ch_js_02',
        lesson_id: 'l_js_03',
        title: 'Membuat Sistem Nilai',
        description: 'Buat fungsi getGrade(score) yang mengembalikan huruf mutu: "A" jika score >= 85, "B" jika score >= 70, "C" jika score >= 55, dan "D" jika di bawah 55.',
        instructions: 'Kembalikan string "A", "B", "C", atau "D" sesuai nilai score yang diberikan.',
        expected_result: 'function getGrade(score) {\n  if (score >= 85) return "A";\n  if (score >= 70) return "B";\n  if (score >= 55) return "C";\n  return "D";\n}',
        difficulty: 'Easy',
        starter_code: 'function getGrade(score) {\n  // Tulis percabangan penilaian\n}'
      },
      {
        id: 'ch_js_03',
        lesson_id: 'l_js_05',
        title: 'Membuat Todo List Sederhana',
        description: 'Buat sebuah class atau objek TodoManager yang memiliki array todos, method addTodo(task), removeTodo(index), dan getPendingCount().',
        instructions: 'Implementasikan fungsi manajemen array todo dengan manipulasi array JavaScript.',
        expected_result: 'class TodoManager {\n  constructor() { this.todos = []; }\n  addTodo(task) { this.todos.push(task); }\n  removeTodo(index) { this.todos.splice(index, 1); }\n  getPendingCount() { return this.todos.length; }\n}',
        difficulty: 'Medium',
        starter_code: 'class TodoManager {\n  constructor() {\n    this.todos = [];\n  }\n  // Lengkapi method addTodo, removeTodo, getPendingCount\n}'
      }
    ]
  }
];

export const INITIAL_TUTORIALS = [
  {
    id: 'tut-01',
    category: 'Getting Started',
    title: 'Memulai Perjalanan Coding Anda Bersama CODEFORGE',
    duration: '4 menit baca',
    description: 'Panduan komprehensif memahami antarmuka, navigasi tools, dan cara kerja ekosistem CODEFORGE.',
    content: `### Selamat Datang di CODEFORGE!
CODEFORGE dirancang khusus untuk memadukan kecerdasan buatan terdepan (Anthropic Claude) dengan kurikulum pemrograman praktis.

#### 3 Langkah Cepat Memulai:
1. **Jelajahi Dashboard**: Lihat statistik penggunaan AI, riwayat aktivitas terbaru, dan progres kursus Anda.
2. **Gunakan AI Coding Tools**: Kunjungi menu **Tools** untuk menghasilkan kode, menjelaskan kode rumit, mencari bug, atau mengoptimalkan algoritma.
3. **Ikuti Interactive Courses**: Asah keterampilan langsung dengan menyelesaikan coding challenges yang dinilai secara otomatis oleh AI.`
  },
  {
    id: 'tut-02',
    category: 'Cara Menggunakan AI Code Generator',
    title: 'Panduan Praktis Menghasilkan Kode Bersih dan Siap Produksi',
    duration: '5 menit baca',
    description: 'Pelajari cara memilih bahasa pemrograman, menentukan jenis proyek, dan merumuskan instruksi yang akurat.',
    content: `### Memaksimalkan AI Code Generator
Code Generator di CODEFORGE bukan hanya sekadar pelengkap kode; ia dapat menyusun fungsi utuh, skema antarmuka, hingga arsitektur modular.

#### Langkah-Langkah:
1. Pilih **Bahasa Pemrograman** (JavaScript, Python, HTML/CSS, SQL, Java, C#, PHP, Dart).
2. Tentukan **Jenis Project** (Frontend Component, Backend API, Data Processing, dsb).
3. Tuliskan deskripsi spesifik mengenai input, proses, dan output yang diinginkan.
4. Klik **Generate Code** dan salin kode menggunakan tombol **Copy Code**.`
  },
  {
    id: 'tut-03',
    category: 'Cara Menggunakan Code Explainer',
    title: 'Membedah Kode Kompleks Menjadi Penjelasan Terstruktur',
    duration: '4 menit baca',
    description: 'Cara mengubah kode warisan (legacy code) atau algoritma rumit menjadi penjelasan logis yang mudah dipahami.',
    content: `### Mengapa Menggunakan Code Explainer?
Ketika membaca repositori open-source atau kode rekan tim yang minim dokumentasi, Code Explainer menguraikan alur kerja kode lapis demi lapis.

Output yang diberikan mencakup:
- **Ringkasan Fungsi Utama**
- **Analisis Baris per Baris**
- **Konsep Kunci & Logika**
- **Analisis Kompleksitas Big O**`
  },
  {
    id: 'tut-04',
    category: 'Cara Debugging dengan AI',
    title: 'Teknik Menemukan dan Memperbaiki Bug Menggunakan Bug Finder',
    duration: '6 menit baca',
    description: 'Solusi cepat mendeteksi syntax error, memory leak, race condition, dan logic flaws dalam hitungan detik.',
    content: `### Rahasia Debugging Cepat
Tempelkan potongan kode Anda beserta pesan error (jika ada). AI Bug Finder akan:
1. Mengidentifikasi letak error secara presisi.
2. Menjelaskan akar masalah (root cause).
3. Memberikan rekomendasi pencegahan jangka panjang.
4. Menyediakan kode perbaikan yang siap pakai.`
  },
  {
    id: 'tut-05',
    category: 'Cara Mengoptimalkan Kode',
    title: 'Meningkatkan Kecepatan dan Efisiensi Memori dengan Code Optimizer',
    duration: '5 menit baca',
    description: 'Ubah algoritma O(n²) menjadi O(n log n) atau O(n) dengan rekomendasi refactoring cerdas.',
    content: `### Optimalisasi Berbasis Best Practices
Tool Code Optimizer menganalisis redundansi loop, alokasi memori berlebih, dan query bottleneck. Anda akan mendapatkan perbandingan sebelum dan sesudah optimasi lengkap dengan penjelasan alasannya.`
  },
  {
    id: 'tut-06',
    category: 'Tips Membuat Prompt yang Baik',
    title: 'Seni Prompt Engineering untuk Developer',
    duration: '7 menit baca',
    description: 'Panduan menulis instruksi yang presisi untuk mendapatkan kode berkualitas tinggi dari LLM.',
    content: `### Kaidah Emas Prompting:
- **Jelaskan Konteks**: Sebutkan framework, versi library, dan lingkungan eksekusi.
- **Berikan Contoh Input & Output**: Tunjukkan format data JSON atau tipe data yang diharapkan.
- **Tentukan Batasan**: Sebutkan larangan tertentu (misal: "tanpa library eksternal", "gunakan functional programming").`
  },
  {
    id: 'tut-07',
    category: 'Memahami Hasil AI',
    title: 'Cara Mengevaluasi dan Memverifikasi Output AI Sebelum Digunakan',
    duration: '5 menit baca',
    description: 'Kiat kritis dalam mereview kode AI: uji keamanan, edge-cases, dan integrasi pengujian unit.',
    content: `### Verifikasi & Keamanan
Meskipun model Claude 3.5 Sonnet sangat akurat, selalu jalankan pengujian unit (unit tests), pastikan sanitasi input untuk mencegah injeksi SQL/XSS, dan sesuaikan dengan konvensi kode tim Anda.`
  }
];

export const AVAILABLE_TOOLS = [
  {
    id: 'chat-prompt',
    name: 'AI Prompt Chat',
    description: 'Ruang interaktif bercakap langsung dengan Anthropic Claude untuk brainstorming ide Game, sistem Full-Stack CRUD, Web App, Mobile, dan merumuskan prompt optimal.',
    category: 'AI Assistant & Prompt',
    icon: 'MessageSquareCode',
    color: '#123D2A',
    badge: 'Anthropic Claude API',
    route: '/tools/chat-prompt',
    featured: true
  },
  {
    id: 'code-preview',
    name: 'React Component & Live Preview',
    description: 'Hasilkan mini-game interaktif, dashboard CRUD full-stack, atau komponen web React (JSX) modern dengan Tailwind CSS dan Live Preview instan.',
    category: 'React & Frontend',
    icon: 'Code2',
    color: '#67B58A',
    badge: 'Live React Sandbox',
    route: '/tools/code-preview',
    featured: true
  },
  {
    id: 'react-native',
    name: 'React Native Mobile Studio',
    description: 'Rancang kode screen & komponen native (Expo / Bare CLI) dengan styling StyleSheet dan Mobile Phone Mockup Simulator.',
    category: 'React Native & Mobile',
    icon: 'Smartphone',
    color: '#0B251B',
    badge: 'Mobile React Native',
    route: '/tools/react-native',
    featured: true
  },
  {
    id: 'php-studio',
    name: 'React to PHP REST API Studio',
    description: 'Integrasikan frontend React dengan backend PHP REST API (api.php), pemrosesan JSON payload, sanitasi, dan database.',
    category: 'Full-Stack & Backend',
    icon: 'FileCode2',
    color: '#245C40',
    badge: 'PHP REST API',
    route: '/tools/php-studio',
    featured: true
  },
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Buat aset visual, banner website, ilustrasi konsep, logo developer, dan ikon UI dalam sekejap dengan AI generative.',
    category: 'Media Creation',
    icon: 'Image',
    color: '#8B5CF6',
    badge: 'Visual Assets',
    route: '/tools/image-generator',
    featured: true
  },
  {
    id: 'video-generator',
    name: 'AI Video Studio',
    description: 'Rancang video motion, storyboard adegan, prompt video sinematik untuk Sora/Runway, dan animasi preview visual.',
    category: 'Media Creation',
    icon: 'Video',
    color: '#EC4899',
    badge: 'Motion & Storyboard',
    route: '/tools/video-generator',
    featured: true
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Pahami logika dan algoritma di balik kode yang rumit dengan penjelasan terstruktur dan analisis kompleksitas Big O.',
    category: 'Understanding',
    icon: 'BookOpen',
    color: '#245C40',
    badge: 'Code Analysis',
    route: '/tools?tool=code-explainer',
    featured: false
  },
  {
    id: 'bug-finder',
    name: 'Bug Finder & Fixer',
    description: 'Deteksi kesalahan logika, potensi crash, dan dapatkan rekomendasi perbaikan instan serta kode yang sudah dibersihkan.',
    category: 'Debugging',
    icon: 'Bug',
    color: '#E53E3E',
    badge: 'Auto Debugger',
    route: '/tools?tool=bug-finder',
    featured: false
  },
  {
    id: 'code-optimizer',
    name: 'Code Optimizer',
    description: 'Tingkatkan efisiensi komputasi, alokasi memori, dan keterbacaan kode Anda dengan strategi optimasi mutakhir.',
    category: 'Optimization',
    icon: 'Zap',
    color: '#F59E0B',
    badge: 'Performance Boost',
    route: '/tools?tool=code-optimizer',
    featured: false
  },
  {
    id: 'sql-generator',
    name: 'SQL Generator',
    description: 'Ubah kebutuhan data alami menjadi kueri SQL presisi untuk PostgreSQL, MySQL, SQLite, dan SQL Server.',
    category: 'Database',
    icon: 'Database',
    color: '#3B82F6',
    badge: 'Query Builder',
    route: '/tools?tool=sql-generator',
    featured: false
  }
];
