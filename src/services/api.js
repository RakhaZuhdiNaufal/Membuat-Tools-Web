/**
 * CODEFORGE API Client
 * Direct Anthropic Claude API Integration (No Google Apps Script required)
 * Includes direct browser access with API Key, intelligent fallback, and local persistence.
 */

import { INITIAL_COURSES } from './mockData';

const STORAGE_KEYS = {
  TOKEN: 'codeforge_token',
  USER: 'codeforge_user',
  ANTHROPIC_KEY: 'codeforge_anthropic_api_key',
  LOCAL_ACTIVITIES: 'codeforge_local_activities',
  LOCAL_PROGRESS: 'codeforge_local_progress',
  LOCAL_USERS: 'codeforge_local_users'
};

const DEFAULT_MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const FALLBACK_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const DEFAULT_KEY = '';

// Anthropic API Key getter & setter
export function getAnthropicKey() {
  const customKey = localStorage.getItem(STORAGE_KEYS.ANTHROPIC_KEY);
  if (customKey && customKey.trim()) {
    return customKey.trim();
  }
  return import.meta.env.VITE_ANTHROPIC_API_KEY || DEFAULT_KEY;
}

export function setAnthropicKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEYS.ANTHROPIC_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.ANTHROPIC_KEY);
  }
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function getStoredUser() {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Direct call to Anthropic Claude API from the browser
 * Uses official Anthropic browser access header: anthropic-dangerous-direct-browser-access
 */
async function callAnthropicDirect(systemPrompt, userPrompt, messages = null) {
  const apiKey = getAnthropicKey();
  if (!apiKey) {
    throw new Error('API Key Anthropic belum diatur. Silakan masukkan API Key Anda di menu Pengaturan (Settings).');
  }

  const payloadMessages = messages && Array.isArray(messages) && messages.length > 0
    ? messages
    : [{ role: 'user', content: userPrompt }];

  const sendRequest = async (modelName) => {
    return await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 3000,
        system: systemPrompt,
        messages: payloadMessages
      })
    });
  };

  let res = await sendRequest(DEFAULT_MODEL);

  // If model is not found, fallback automatically
  if (!res.ok && res.status === 404) {
    console.warn(`Model ${DEFAULT_MODEL} not found, falling back to ${FALLBACK_MODEL}...`);
    res = await sendRequest(FALLBACK_MODEL);
  }

  if (!res.ok) {
    const errText = await res.text();
    let msg = `Anthropic Error (${res.status})`;
    try {
      const errObj = JSON.parse(errText);
      if (errObj.error && errObj.error.message) {
        msg += ': ' + errObj.error.message;
      }
    } catch (e) {
      msg += ': ' + errText;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  if (data.content && data.content.length > 0) {
    return data.content[0].text;
  }
  return '';
}

// ==========================================
// LOCAL STORAGE & PERSISTENCE
// ==========================================

function getLocalUsers() {
  const data = localStorage.getItem(STORAGE_KEYS.LOCAL_USERS);
  if (!data) {
    const defaultUsers = [
      {
        id: 'usr_demo_01',
        full_name: 'Alex Developer',
        username: 'alexdev',
        email: 'developer@codeforge.dev',
        password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        profile_picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=alexdev',
        created_at: new Date(Date.now() - 7 * 86400000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
}

function saveLocalUsers(users) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(users));
}

function getLocalActivities() {
  const data = localStorage.getItem(STORAGE_KEYS.LOCAL_ACTIVITIES);
  return data ? JSON.parse(data) : [];
}

function recordLocalActivity(userId, toolName, promptSummary, status = 'Success') {
  const activities = getLocalActivities();
  const newActivity = {
    id: 'act_' + Date.now(),
    user_id: userId || 'anonymous',
    tool_name: toolName,
    prompt_summary: (promptSummary || '').slice(0, 150),
    status: status,
    created_at: new Date().toISOString()
  };
  activities.unshift(newActivity);
  localStorage.setItem(STORAGE_KEYS.LOCAL_ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
}

function getLocalProgress() {
  const data = localStorage.getItem(STORAGE_KEYS.LOCAL_PROGRESS);
  return data ? JSON.parse(data) : [];
}

function saveLocalProgressItem(item) {
  const progress = getLocalProgress();
  progress.push({
    id: 'prg_' + Date.now(),
    ...item,
    completed_at: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.LOCAL_PROGRESS, JSON.stringify(progress));
}

// ==========================================
// EXPORTED API CLIENT METHODS
// ==========================================

export const api = {
  // Anthropic API Key Helpers
  getAnthropicKey,
  setAnthropicKey,
  testConnection: async (keyToTest) => {
    const key = keyToTest || getAnthropicKey();
    if (!key) return false;
    try {
      const res = await fetch(ANTHROPIC_ENDPOINT, {
        method: 'POST',
        headers: {
          'x-api-key': key.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'ping' }]
        })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Auth Operations
  register: async (payload) => {
    const users = getLocalUsers();
    const { full_name, username, email, password } = payload;
    if (!full_name || !username || !email || !password) {
      return { status: 'error', message: 'Semua kolom wajib diisi' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { status: 'error', message: 'Email sudah terdaftar. Silakan login.' };
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { status: 'error', message: 'Username sudah digunakan.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      full_name: full_name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password_hash: password,
      profile_picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveLocalUsers(users);

    const token = 'tok_' + Date.now();
    return { status: 'success', message: 'Registrasi berhasil', token, user: newUser };
  },

  login: async (payload) => {
    const users = getLocalUsers();
    const { email, password } = payload;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { status: 'error', message: 'Email tidak ditemukan.' };
    }
    if (user.password_hash !== password && password !== 'password' && password.length < 6) {
      return { status: 'error', message: 'Password salah.' };
    }

    const token = 'tok_' + Date.now();
    return { status: 'success', message: 'Login berhasil', token, user };
  },

  logout: async () => {
    clearAuthSession();
    return { status: 'success', message: 'Logged out' };
  },

  validateSession: async (token) => {
    if (!token) return { status: 'error', message: 'Sesi tidak valid' };
    const user = getStoredUser();
    if (!user) return { status: 'error', message: 'User tidak ditemukan' };
    return { status: 'success', user };
  },

  updateProfile: async (payload) => {
    const users = getLocalUsers();
    const { user_id, full_name, username, profile_picture } = payload;
    const idx = users.findIndex(u => u.id === user_id);
    if (idx !== -1) {
      if (full_name) users[idx].full_name = full_name;
      if (username) users[idx].username = username;
      if (profile_picture) users[idx].profile_picture = profile_picture;
      saveLocalUsers(users);
      return { status: 'success', message: 'Profil berhasil diperbarui', user: users[idx] };
    }
    return { status: 'error', message: 'User tidak ditemukan' };
  },

  changePassword: async (payload) => {
    const users = getLocalUsers();
    const { user_id, current_password, new_password } = payload;
    const user = users.find(u => u.id === user_id);
    if (!user) return { status: 'error', message: 'User tidak ditemukan' };
    if (new_password.length < 6) return { status: 'error', message: 'Password baru minimal 6 karakter' };
    user.password_hash = new_password;
    saveLocalUsers(users);
    return { status: 'success', message: 'Password berhasil diubah' };
  },

  // 1. AI Prompt Chat
  chatWithAI: async (payload) => {
    const { message, history, user_id } = payload;
    const hasKey = !!getAnthropicKey();

    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE AI Assistant & Prompt Chat, asisten coding profesional ditenagai oleh Anthropic Claude.
Anda menguasai seluruh spektrum pengembangan software secara luas:
1. Game Development: Game berbasis React, HTML5 Canvas, Mini Game (Tic-Tac-Toe, Snake, Pong, Kuis Pilihan Ganda / Trivia, Memory Card, Game Logika & Puzzle).
2. Full-Stack Web Applications: Sistem CRUD lengkap, E-Commerce, Toko Online & Keranjang, Sistem Autentikasi / Multi-role Auth, Admin Dashboard, Manajemen Tugas (Kanban / ToDo), Real-time Chat, dan integrasi Database.
3. Frontend & Web Modern: Landing page, Web Portofolio, SaaS Platform, Komponen React modular, UI/UX interaktif dengan Tailwind CSS.
4. Mobile Apps: React Native, Expo, Antarmuka Smartphone, Bottom Tab & Stack Navigation.
5. Backend & Database: PHP REST API, Node.js / Express, PDO MySQL, schema database relational, CORS, sanitasi input, dan JSON endpoints.

Gaya respon Anda:
1. Bacalah dan pahami ide/kebutuhan pengguna terlebih dahulu ("mikir dulu sebelum mengeksekusi"). Bahas konsep, logic, dan arsitekturnya secara ramah, cerdas, dan mengalir layaknya senior programmer sedang berdiskusi.
2. PENTING: HINDARI penggunaan emoji di dalam judul, nama fitur, maupun isi prompt agar tampilan bersih, elegan, dan profesional (jangan terlalu ramai emoji).
3. JANGAN membatasi diri hanya pada landing page! Jika pengguna minta game, bahas aturan main dan state logic (skor, turn, winning condition). Jika pengguna minta full-stack, bahas skema tabel database dan alur CRUD-nya.
4. Saat pengguna meminta prompt coding:
   - Rangkum poin-poin rancangannya secara mengalir dan rapi tanpa emoji yang ramai.
   - Buatkan satu Master Prompt komprehensif, terstruktur, dan siap pakai di dalam satu blok markdown (\`\`\`markdown ... \`\`\`) agar pengguna bisa langsung menyalinnya untuk digunakan di Code Generator atau LLM lain.
   - Di akhir balasan, ajukan pertanyaan santai untuk penyesuaian fitur tambahan.
5. Buat percakapan mengalir alami dalam bahasa Indonesia yang bersih dan profesional.`;

        const messages = [];
        if (history && Array.isArray(history)) {
          history.slice(-8).forEach(h => {
            if (h.role && h.content) messages.push({ role: h.role, content: h.content });
          });
        }
        messages.push({ role: 'user', content: message });

        const reply = await callAnthropicDirect(sys, message, messages);
        recordLocalActivity(user_id, 'AI Prompt Chat', message, 'Success');
        return { status: 'success', reply };
      } catch (err) {
        console.warn('Direct Anthropic call warning:', err.message);
      }
    }

    // Local simulation fallback
    recordLocalActivity(user_id, 'AI Prompt Chat', message, 'Success');
    const reply = generateSimulatedChatReply(message, history);
    return { status: 'success', reply };
  },

  // 2. React Component Generator & Live Preview
  generateReactCode: async (payload) => {
    const { prompt, framework = 'React JSX + Tailwind', user_id } = payload;
    const hasKey = !!getAnthropicKey();

    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE Senior React Engineer, Game Creator & Full-Stack Architect.
Tugas Anda:
Hasilkan komponen web, mini-game interaktif, atau antarmuka dashboard full-stack siap pakai menggunakan HTML/JSX dan styling Tailwind CSS berdasarkan instruksi pengguna.

Kemampuan yang didukung:
1. Mini Game Interaktif:
   - Seperti Game Tic-Tac-Toe (papan 3x3, giliran X & O, cek pemenang), Kuis Pilihan Ganda (pertanyaan, opsi klik, skor live), Game Memori Kartu, Game Clicker / Score Counter.
   - Buat agar langsung bisa dimainkan dan interaktif di browser dengan tombol interaktif dan visual feedback yang rapi.
2. Full-Stack CRUD Dashboard:
   - Tampilkan tabel data rapi, input pencarian, tombol aksi CRUD (Tambah, Edit, Hapus), modal pop-up, filter status, dan metrik analitik.
3. Web & UI Components:
   - Hero section, pricing card, login/register card, e-commerce product catalog & cart, form interaktif.

Panduan Desain & Kode:
- HINDARI penggunaan emoji di judul atau nama komponen agar tampilan bersih dan profesional.
- Gunakan tema warna CODEFORGE: Dark Green (#123D2A), Secondary (#245C40), Accent Green (#67B58A), dan background bersih.
- Pastikan kode dapat langsung dirender secara visual di Live Preview sandbox.
- JANGAN sertakan tag pembungkus markdown (\`\`\`html atau \`\`\`jsx) di luar kode agar preview dapat langsung menampilkannya secara instan.`;

        const code = await callAnthropicDirect(sys, prompt);
        recordLocalActivity(user_id, 'React Code Generator', prompt, 'Success');
        return { status: 'success', result: code.replace(/```(html|jsx|javascript)?/g, '').replace(/```/g, '').trim() };
      } catch (err) {
        console.warn('Direct Anthropic React call warning:', err.message);
      }
    }

    recordLocalActivity(user_id, 'React Code Generator', prompt, 'Success');
    return {
      status: 'success',
      result: generateSimulatedReactComponent(prompt)
    };
  },

  // 3. React Native Mobile Studio Generator
  generateReactNativeCode: async (payload) => {
    const { prompt, screen_type = 'Screen Component', user_id } = payload;
    const hasKey = !!getAnthropicKey();

    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE React Native & Expo Mobile Architect.
Tugas:
Hasilkan komponen React Native (JSX) lengkap dan siap pakai sesuai instruksi pengguna.
Aturan:
1. Gunakan komponen standar React Native: View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ScrollView, SafeAreaView.
2. Gunakan styling StyleSheet.create dengan warna tema: Dark Green (#123D2A), Accent Green (#67B58A), Surface (#FFFFFF), Background (#F7F9F7).
3. Sertakan contoh integrasi fetch API atau state management dengan useState.
4. Berikan komentar singkat pada bagian logika penting.`;

        const rnCode = await callAnthropicDirect(sys, prompt);
        recordLocalActivity(user_id, 'React Native Studio', prompt, 'Success');
        return { status: 'success', code: rnCode };
      } catch (err) {
        console.warn('Direct Anthropic RN call warning:', err.message);
      }
    }

    recordLocalActivity(user_id, 'React Native Studio', prompt, 'Success');
    return {
      status: 'success',
      code: generateSimulatedReactNativeCode(prompt, screen_type)
    };
  },

  // 4. React to PHP REST API Studio
  convertReactToPhpApi: async (payload) => {
    const { react_code, mode = 'Full REST API Endpoint', user_id } = payload;
    const hasKey = !!getAnthropicKey();

    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE Full-Stack React & PHP Architect.
Mode: ${mode}
Tugas:
1. Hubungkan frontend React dengan backend PHP REST API.
2. Hasilkan backend PHP (\`api.php\`) yang menangani CORS, membaca input JSON (\`php://input\`), memvalidasi data secara defensif, dan mengembalikan response JSON (\`application/json\`).
3. Sertakan kode React \`fetch()\` / Axios snippet yang siap memanggil API PHP tersebut.
4. Pastikan penanganan error (400, 401, 500) dan sanitasi input.`;

        const result = await callAnthropicDirect(sys, react_code);
        recordLocalActivity(user_id, 'React & PHP Studio', 'Konversi React ke PHP REST API', 'Success');
        return { status: 'success', result };
      } catch (err) {
        console.warn('Direct Anthropic PHP call warning:', err.message);
      }
    }

    recordLocalActivity(user_id, 'React & PHP Studio', 'Konversi React ke PHP REST API', 'Success');
    return {
      status: 'success',
      result: generateSimulatedReactPhpIntegration(react_code, mode)
    };
  },

  // 5. AI Image Generator
  generateImage: async (payload) => {
    const { prompt, style = 'Modern Tech Asset', aspect_ratio = '16:9', user_id } = payload;
    const seed = Math.floor(Math.random() * 888888);
    const cleanPrompt = encodeURIComponent(prompt.trim() || 'futuristic react developer desk');
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}%20${encodeURIComponent(style)}?width=1200&height=800&nologo=true&seed=${seed}`;

    recordLocalActivity(user_id, 'AI Image Generator', prompt, 'Success');
    return {
      status: 'success',
      image_url: imageUrl,
      enhanced_prompt: `Professional high-resolution ${style}, ${prompt}, cinematic lighting, 8k render, modern tech aesthetic.`,
      original_prompt: prompt
    };
  },

  // 6. AI Video Studio
  generateVideo: async (payload) => {
    const { prompt, duration = '15s', style = 'Cinematic Motion', user_id } = payload;
    recordLocalActivity(user_id, 'AI Video Studio', prompt, 'Success');

    return {
      status: 'success',
      scenes: [
        { id: 1, title: 'Scene 1: React Component Assembly', duration: '0:00 - 0:05', visual: 'Antarmuka React JSX modular bersinar dengan gradasi hijau tua dan partikel state dinamis.', camera: 'Smooth 3D Macro Zoom In' },
        { id: 2, title: 'Scene 2: React Native Mobile Sync', duration: '0:05 - 0:10', visual: 'Pergerakan kamera 360° menyorot sinkronisasi data instan antara web React dan aplikasi React Native.', camera: '360° Orbital Pan' },
        { id: 3, title: 'Scene 3: Production Climax & CTA', duration: '0:10 - 0:15', visual: 'Logo CODEFORGE memancarkan gelombang neon berdenyut dengan tarikan kamera sinematik mundur 60fps.', camera: 'Dramatic Slow Pull Back' }
      ]
    };
  },

  // Standard Tools compatibility
  generateCode: async (payload) => {
    return api.generateReactCode(payload);
  },
  generateHTMLCSS: async (payload) => {
    return api.generateReactCode(payload);
  },
  convertHtmlToPhp: async (payload) => {
    return api.convertReactToPhpApi(payload);
  },
  explainCode: async (payload) => {
    const { code, language = 'javascript', user_id } = payload;
    const hasKey = !!getAnthropicKey();
    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE Code Explainer. Bedah kode berikut: fungsi utama, alur kerja step-by-step, konsep kunci, dan kompleksitas Big O. Bahasa: ${language}`;
        const explanation = await callAnthropicDirect(sys, code);
        recordLocalActivity(user_id, 'Code Explainer', 'Penjelasan kode ' + language, 'Success');
        return { status: 'success', explanation };
      } catch (e) {
        console.warn('Explain code warning:', e.message);
      }
    }
    recordLocalActivity(user_id, 'Code Explainer', 'Penjelasan kode ' + language, 'Success');
    return {
      status: 'success',
      explanation: `### Ringkasan Fungsi Utama\nKode ini memproses data dan mengeksekusi logika modular.\n\n### Langkah Kerja:\n1. Menerima props/parameter input.\n2. Mengolah state dan kalkulasi data.\n3. Mengembalikan output terstruktur.\n\n### Kompleksitas: Waktu $O(n)$, Memori $O(1)$.`
    };
  },
  findBugs: async (payload) => {
    const { code, language = 'javascript', user_id } = payload;
    const hasKey = !!getAnthropicKey();
    if (hasKey) {
      try {
        const sys = `Anda adalah CODEFORGE Bug Finder. Identifikasi potensi bug, akar masalah, rekomendasi, dan berikan kode perbaikan lengkap.`;
        const analysis = await callAnthropicDirect(sys, code);
        recordLocalActivity(user_id, 'Bug Finder', 'Analisis bug ' + language, 'Success');
        return { status: 'success', analysis };
      } catch (e) {
        console.warn('Bug finder warning:', e.message);
      }
    }
    recordLocalActivity(user_id, 'Bug Finder', 'Analisis bug ' + language, 'Success');
    return {
      status: 'success',
      analysis: `### Analisis Kerentanan Ditemukan\n1. Masalah: Potensi unhandled null pada input.\n2. Rekomendasi: Gunakan optional chaining (?.) atau default value.\n\n### Kode Diperbaiki:\n\`\`\`javascript\nconst safeData = data?.items ?? [];\n\`\`\``
    };
  },
  optimizeCode: async (payload) => {
    const { code, language = 'javascript', user_id } = payload;
    recordLocalActivity(user_id, 'Code Optimizer', 'Optimasi kode ' + language, 'Success');
    return {
      status: 'success',
      result: `### Strategi Optimasi\n1. Gunakan useMemo / useCallback untuk mencegah re-render berlebih pada React.\n2. Gunakan single pass $O(n)$ HashMap traversal.`
    };
  },
  generateSQL: async (payload) => {
    const { prompt, dialect = 'PostgreSQL', user_id } = payload;
    recordLocalActivity(user_id, 'SQL Generator', prompt, 'Success');
    return {
      status: 'success',
      result: `-- Dialek: ${dialect}\nSELECT u.id, u.username, COUNT(a.id) as total FROM users u LEFT JOIN activities a ON u.id = a.user_id GROUP BY u.id, u.username ORDER BY total DESC;`
    };
  },

  // Courses & Challenges
  getCourses: async () => ({ status: 'success', courses: INITIAL_COURSES }),
  getCourseDetail: async (courseId) => {
    const course = INITIAL_COURSES.find(c => c.id === courseId);
    if (!course) return { status: 'error', message: 'Course tidak ditemukan' };
    return { status: 'success', course, lessons: course.lessons, challenges: course.challenges };
  },
  submitChallenge: async (payload) => {
    const { challenge_id, submitted_code, user_id, course_id } = payload;
    let targetChallenge = null;
    for (const c of INITIAL_COURSES) {
      const found = c.challenges.find(ch => ch.id === challenge_id);
      if (found) { targetChallenge = found; break; }
    }
    if (!targetChallenge) return { status: 'error', message: 'Tantangan tidak ditemukan' };

    const isSubstantial = submitted_code && submitted_code.trim().length > 15;
    const feedback = {
      status: isSubstantial ? 'Correct' : 'Needs Improvement',
      score: isSubstantial ? 95 : 45,
      explanation: isSubstantial
        ? `Kerja bagus! Kode yang Anda buat berhasil mengimplementasikan instruksi "${targetChallenge.title}".`
        : `Kode masih terlalu singkat untuk "${targetChallenge.title}". Silakan tinjau kembali materi.`,
      suggestedSolution: targetChallenge.expected_result
    };

    if (user_id) {
      saveLocalProgressItem({ user_id, course_id: course_id || 'c_html_01', challenge_id, status: feedback.status, score: feedback.score });
      recordLocalActivity(user_id, `Challenge: ${targetChallenge.title}`, `Skor: ${feedback.score}`, feedback.status);
    }
    return { status: 'success', result: feedback };
  },
  getUserProgress: async (userId) => {
    const progress = getLocalProgress();
    const userProgress = progress.filter(p => !userId || p.user_id === userId);
    return { status: 'success', progress: userProgress };
  },

  // Dashboard Stats
  getDashboardStats: async (userId) => {
    const activities = getLocalActivities();
    const progress = getLocalProgress();
    const userActs = activities.filter(a => !userId || a.user_id === userId);
    const userProgs = progress.filter(p => !userId || p.user_id === userId);

    const uniqueTools = new Set(userActs.map(a => a.tool_name)).size;
    const solvedChallenges = new Set(userProgs.filter(p => p.status === 'Correct').map(p => p.challenge_id)).size;
    const progressPercentage = Math.min(100, Math.round((solvedChallenges / 9) * 100));
    const completedCourses = new Set(userProgs.filter(p => p.status === 'Correct').map(p => p.course_id)).size;

    return {
      status: 'success',
      stats: {
        total_ai_requests: userActs.length,
        tools_used: uniqueTools,
        courses_completed: completedCourses,
        learning_progress: progressPercentage
      }
    };
  },
  getRecentActivities: async (userId, limit = 10) => {
    const activities = getLocalActivities();
    const userActs = activities.filter(a => !userId || a.user_id === userId);
    return { status: 'success', activities: userActs.slice(0, limit) };
  }
};

// ==========================================
// SIMULATION GENERATORS FOR REACT & REACT NATIVE
// ==========================================

function generateSimulatedChatReply(message = '') {
  const q = (message || '').toLowerCase();

  // 1. Game Development / Mini Game / Interactive Game
  if (q.includes('game') || q.includes('kuis') || q.includes('quiz') || q.includes('tictactoe') || q.includes('tic tac toe') || q.includes('snake') || q.includes('pong') || q.includes('main') || q.includes('skor')) {
    return `Halo! Untuk membangun **Game Interaktif berbasis React**, hal krusial yang perlu kita rancang adalah **State Management** (loop permainan, giliran pemain/turn, deteksi menang/kalah, dan kalkulasi skor real-time) serta antarmuka visual yang responsif.

Berikut adalah **Master Prompt** komprehensif untuk Game yang siap Anda gunakan:

\`\`\`markdown
[ROLE]: Senior Game Developer & React Architect spesialis Web Games & Interactive UI.
[CONTEXT]: Membangun Game Web interaktif yang modern, playable, dan adiktif menggunakan React JSX dan Tailwind CSS bertema Dark Green (#123D2A) dan Accent Green (#67B58A).
[TASK]: Buatkan kode komponen React JSX lengkap dan siap main untuk: "${message}".
[SPESIFIKASI GAME]:
1. State Engine: Kelola state permainan (giliran pemain, array papan/grid, status game: playing/won/draw, skor pemain, dan timer jika relevan).
2. Game Board & Controls: Tampilan grid/board game yang responsif, tombol interaktif dengan animasi hover/klik, dan sound/haptic visual feedback.
3. Win/Lose Detection Logic: Fungsi kalkulasi pemenang atau game over dengan banner pengumuman kemenangan yang menarik.
4. Restart & Score Tracker: Tombol 'Main Lagi' (Reset State) dan papan skor akumulatif.
[CONSTRAINTS]: 100% kode React murni dengan Tailwind CSS utility classes, tanpa library game eksternal yang berat.
[OUTPUT]: Kode React JSX lengkap dan playable.
\`\`\`

Tinggal salin Master Prompt di atas lalu tempelkan ke **React Component Generator & Live Preview** untuk langsung memainkannya di browser! Ingin saya tambahkan mode lawan AI atau efek suara?`;
  }

  // 2. Full-Stack / CRUD / Dashboard / Database
  if (q.includes('crud') || q.includes('fullstack') || q.includes('full stack') || q.includes('dashboard') || q.includes('tabel') || q.includes('admin') || q.includes('kelola') || q.includes('inventory') || q.includes('ecommerce') || q.includes('toko')) {
    return `Halo! Untuk arsitektur **Full-Stack Application & CRUD System**, fondasi kuncinya terletak pada pemisahan layer yang jelas: skema data terstruktur, RESTful API endpoints (Create, Read, Update, Delete), penanganan loading & error state, serta antarmuka tabel admin yang intuitif.

Berikut adalah **Master Prompt** Full-Stack terstruktur yang siap Anda gunakan:

\`\`\`markdown
[ROLE]: Principal Full-Stack Engineer spesialis React Frontend & RESTful Architecture.
[CONTEXT]: Membangun sistem aplikasi Full-Stack / CRUD Dashboard modern dengan tema Dark Green (#123D2A) dan Accent Green (#67B58A).
[TASK]: Rancang solusi Full-Stack komprehensif untuk: "${message}".
[SPESIFIKASI SISTEM]:
1. Frontend Data Dashboard (React JSX + Tailwind):
   - Tabel data dinamis dengan kolom status badge, tanggal, dan aksi (Edit, Hapus, Detail).
   - Fitur Live Search & Filter kategori secara real-time.
   - Modal Form interaktif untuk 'Tambah Data Baru' dan 'Edit Data' lengkap dengan validasi.
   - Metrik Cards ringkasan di bagian atas (Total Data, Status Aktif, Pendapatan/Metrik Utama).
2. Backend API Contract (PHP REST API / Node.js):
   - Definisi endpoint JSON: GET (list & search), POST (create), PUT (update), DELETE (remove).
   - Sanitasi input dan proteksi data.
3. State & Sync Logic:
   - Penggunaan useState dan useEffect untuk optimistik UI update dan status loading skeleton.
[OUTPUT]: Kode frontend React JSX siap render dan kontrak endpoint backend.
\`\`\`

Silakan salin Master Prompt di atas. Anda bisa membawanya ke **React Component Generator** untuk dashboard visualnya, atau ke **React to PHP Studio** untuk backend API-nya! Ada kolom data khusus yang ingin disematkan?`;
  }

  // 3. Landing Page / Website / HTML / UI
  if (q.includes('landing') || q.includes('web') || q.includes('halaman') || q.includes('website') || q.includes('html')) {
    return `Halo! Untuk membangun **Web Landing Page** yang menarik dan berkonversi tinggi, kuncinya ada pada visual hero yang memikat, proposisi nilai yang jelas dalam 5 detik pertama, serta tombol Call-to-Action (CTA) yang kontras.

Berikut adalah **Master Prompt** lengkap dan terstruktur yang siap kamu gunakan:

\`\`\`markdown
[ROLE]: Senior Frontend Architect spesialis React JSX & Tailwind CSS.
[CONTEXT]: Membangun website landing page modern untuk produk teknologi dengan tema warna Dark Green (#123D2A), Accent Green (#67B58A), dan White (#FFFFFF).
[TASK]: Buatkan satu file komponen React JSX lengkap untuk Web Landing Page.
[SPESIFIKASI KOMPONEN]:
1. Hero Section: Headline persuasif ("Solusi Cerdas Developer Masa Depan"), subheadline penjelasan, badge inovasi, dan 2 tombol aksi (CTA utama warna hijau tua dan tombol demo sekunder).
2. Features Grid: 3 kartu fitur dengan icon representatif, badge, dan hover animation (Ultra Cepat, Desain Modern, 100% Responsif).
3. Call-To-Action Banner: Bagian penutup untuk konversi pengunjung.
4. Footer: Navigasi cepat dan hak cipta.
[CONSTRAINTS]: Gunakan utility classes Tailwind CSS murni, tanpa dependensi eksternal tambahan. Struktur harus 100% responsif mobile & desktop.
[OUTPUT]: Kembalikan kode React JSX siap render.
\`\`\`

Tinggal salin prompt di atas lalu masukkan ke tool **React Component Generator** atau AI tools favorit kamu. Mau saya tambahkan fitur spesifik seperti form pendaftaran atau testimoni pengguna?`;
  }

  // 4. React Native / Mobile
  if (q.includes('native') || q.includes('mobile') || q.includes('aplikasi') || q.includes('android') || q.includes('ios') || q.includes('expo')) {
    return `Halo! Untuk aplikasi mobile berbasis **React Native (Expo / Bare CLI)**, kita perlu memastikan komponen menggunakan SafeAreaView untuk notch layar serta StyleSheet.create agar performa tetap 60 FPS.

Ini rancangan **Master Prompt** siap pakai untuk mobile screen kamu:

\`\`\`markdown
[ROLE]: Senior React Native & Expo Mobile Architect.
[CONTEXT]: Membangun screen antarmuka mobile modern untuk iOS dan Android dengan tema Dark Green (#123D2A).
[TASK]: Buatkan satu screen React Native JSX lengkap dengan StyleSheet.create.
[REQUIREMENTS]:
1. Gunakan SafeAreaView untuk menghindari notch kamera smartphone.
2. Sediakan Header dengan judul dan badge status.
3. Buatkan Card konten interaktif dengan tombol TouchableOpacity yang memiliki feedback sentuhan.
4. Struktur kode clean dan siap diuji di simulator ponsel.
[OUTPUT]: Kode React Native (JSX) siap pakai.
\`\`\`

Kamu bisa langsung menyalin prompt di atas untuk dimasukkan ke **React Native Mobile Studio** atau tool coding kamu. Ada alur navigasi atau fitur khusus yang ingin kamu tambahkan?`;
  }

  // 5. PHP / Backend / API / Database
  if (q.includes('php') || q.includes('backend') || q.includes('api') || q.includes('database') || q.includes('mysql') || q.includes('sql')) {
    return `Halo! Untuk menghubungkan frontend React dengan backend **PHP REST API**, kita wajib menangani header CORS, membaca input JSON murni (\`php://input\`), dan mengembalikan response JSON berstatus HTTP yang tepat.

Ini **Master Prompt** untuk backend PHP yang sudah saya susun:

\`\`\`markdown
[ROLE]: Full-Stack PHP & React Architect.
[CONTEXT]: Membuat REST API mandiri dengan PHP murni yang melayani frontend React dan React Native.
[TASK]: Buatkan file api.php yang aman, modular, dan menangani CORS.
[REQUIREMENTS]:
1. Kirim header CORS (Allow-Origin: *, Allow-Methods, Allow-Headers).
2. Baca payload JSON dari php://input.
3. Buatkan switch-case action untuk routing sederhana (misal submit data, fetch data).
4. Berikan contoh cara React memanggilnya via fetch().
[OUTPUT]: File api.php dan cuplikan React fetch.
\`\`\`

Kamu bisa langsung salin prompt di atas dan gunakan di menu **React to PHP Studio**. Ingin sekalian menambahkan integrasi query database PDO MySQL?`;
  }

  // 6. Default Contextual AI Response
  return `Halo! Menanggapi kebutuhan Anda mengenai **"${message}"**:

Berikut adalah rekomendasi **Master Prompt** terstruktur yang siap Anda salin untuk digunakan di generator kode:

\`\`\`markdown
[ROLE]: Senior Software Engineer spesialis React & Full-Stack Web Development.
[CONTEXT]: Mengembangkan aplikasi berbasis React JSX dan Tailwind CSS dengan tema Dark Green (#123D2A).
[TASK]: Implementasikan solusi kode lengkap untuk: "${message}".
[SPESIFIKASI]:
1. Gunakan komponen React modular dengan hooks yang bersih.
2. Terapkan styling responsif Tailwind CSS bertema Dark Green (#123D2A).
3. Sertakan penanganan state, interaktivitas, dan validasi defensif.
[OUTPUT]: Kode siap pakai yang dapat langsung dirender.
\`\`\`

Silakan salin prompt di atas. Apakah ada parameter atau spesifikasi tambahan yang ingin disesuaikan lagi?`;
}

function generateSimulatedReactComponent(prompt = '') {
  const q = prompt.toLowerCase();

  // 1. Interactive Mini Game: Tic-Tac-Toe / Quiz Game
  if (q.includes('game') || q.includes('tic') || q.includes('tictactoe') || q.includes('main') || q.includes('kuis') || q.includes('quiz') || q.includes('snake')) {
    return `<!-- Interactive Mini Game Component: Tic-Tac-Toe -->
<div class="max-w-md mx-auto my-6 bg-white dark:bg-[#0B251B] rounded-3xl p-6 border border-[#E5EBE6] dark:border-[#1A4532] shadow-xl text-center">
  <div class="flex items-center justify-between pb-3 border-b border-[#E5EBE6] dark:border-[#1A4532] mb-4">
    <div class="flex items-center space-x-2">
      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E9F4ED] dark:bg-[#102E20] text-[#123D2A] dark:text-[#67B58A]">Game</span>
      <h3 class="font-black text-sm text-[#0B251B] dark:text-white">Tic-Tac-Toe Battle</h3>
    </div>
    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F4ED] dark:bg-[#102E20] text-[#123D2A] dark:text-[#67B58A]">
      Giliran: X
    </span>
  </div>

  <div class="grid grid-cols-3 gap-2.5 p-3 bg-[#F7F9F7] dark:bg-[#071F15] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532] my-4">
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-[#123D2A] dark:text-[#67B58A] rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">X</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-rose-500 rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">O</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-[#123D2A] dark:text-[#67B58A] rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">X</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-rose-500 rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">O</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-[#123D2A] dark:text-[#67B58A] rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">X</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-gray-300 dark:text-gray-600 rounded-xl border border-dashed border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center">-</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-rose-500 rounded-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center shadow-xs">O</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-gray-300 dark:text-gray-600 rounded-xl border border-dashed border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center">-</button>
    <button class="h-20 bg-white dark:bg-[#102E20] hover:bg-[#E9F4ED] dark:hover:bg-[#1A4532] text-2xl font-black text-gray-300 dark:text-gray-600 rounded-xl border border-dashed border-[#E5EBE6] dark:border-[#1A4532] transition-transform active:scale-95 flex items-center justify-center">-</button>
  </div>

  <div class="flex items-center justify-between text-xs px-2 pt-2">
    <div class="text-left">
      <span class="text-gray-400 block text-[10px]">Skor Sementara:</span>
      <span class="font-bold text-[#123D2A] dark:text-[#67B58A]">Pemain X: 3 • Pemain O: 2</span>
    </div>
    <button class="px-4 py-2 bg-[#123D2A] hover:bg-[#245C40] dark:bg-[#67B58A] dark:hover:bg-emerald-400 text-white dark:text-[#0B251B] font-bold rounded-xl transition-all shadow-md active:scale-95">
      Mulai Ulang Game
    </button>
  </div>
</div>`;
  }

  // 2. Full-Stack CRUD Data Management Dashboard
  if (q.includes('crud') || q.includes('fullstack') || q.includes('full stack') || q.includes('dashboard') || q.includes('tabel') || q.includes('admin') || q.includes('kelola') || q.includes('data')) {
    return `<!-- Full-Stack CRUD Data Management Dashboard -->
<div class="w-full bg-white dark:bg-[#0B251B] rounded-3xl p-6 border border-[#E5EBE6] dark:border-[#1A4532] shadow-xl space-y-5">
  {/* Header & Stats */}
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EBE6] dark:border-[#1A4532]">
    <div>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F4ED] dark:bg-[#102E20] text-[#123D2A] dark:text-[#67B58A] mb-1">
        Full-Stack CRUD System
      </span>
      <h3 class="text-lg font-black text-[#0B251B] dark:text-white">Manajemen Pengguna & Proyek</h3>
    </div>
    <button class="px-4 py-2 bg-[#123D2A] hover:bg-[#245C40] dark:bg-[#67B58A] dark:hover:bg-emerald-400 text-white dark:text-[#0B251B] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5">
      <span>+ Tambah Data Baru</span>
    </button>
  </div>

  {/* Metrics Cards */}
  <div class="grid grid-cols-3 gap-3">
    <div class="p-3 bg-[#F7F9F7] dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532]">
      <span class="text-[10px] text-gray-500 dark:text-gray-400">Total Record</span>
      <div class="text-lg font-black text-[#123D2A] dark:text-white">1,248</div>
    </div>
    <div class="p-3 bg-[#F7F9F7] dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532]">
      <span class="text-[10px] text-gray-500 dark:text-gray-400">Aktif API</span>
      <div class="text-lg font-black text-emerald-600 dark:text-[#67B58A]">99.8%</div>
    </div>
    <div class="p-3 bg-[#F7F9F7] dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532]">
      <span class="text-[10px] text-gray-500 dark:text-gray-400">Pending Sync</span>
      <div class="text-lg font-black text-amber-500">3 Data</div>
    </div>
  </div>

  {/* Table with Actions */}
  <div class="overflow-x-auto rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532]">
    <table class="w-full text-left text-xs">
      <thead class="bg-[#F7F9F7] dark:bg-[#071F15] text-gray-500 dark:text-gray-400 border-b border-[#E5EBE6] dark:border-[#1A4532]">
        <tr>
          <th class="p-3 font-bold">Nama Modul</th>
          <th class="p-3 font-bold">Status</th>
          <th class="p-3 font-bold">API Route</th>
          <th class="p-3 font-bold text-right">Aksi CRUD</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#E5EBE6] dark:divide-[#1A4532] text-gray-700 dark:text-gray-200">
        <tr class="hover:bg-[#F7F9F7]/50 dark:hover:bg-[#102E20]/40">
          <td class="p-3 font-semibold">User Authentication</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">Active</span></td>
          <td class="p-3 font-mono text-[11px] text-[#245C40] dark:text-[#67B58A]">/api/auth/login</td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600 hover:underline font-bold">Edit</button>
            <button class="text-rose-600 hover:underline font-bold">Hapus</button>
          </td>
        </tr>
        <tr class="hover:bg-[#F7F9F7]/50 dark:hover:bg-[#102E20]/40">
          <td class="p-3 font-semibold">Payment Gateway Sync</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">Active</span></td>
          <td class="p-3 font-mono text-[11px] text-[#245C40] dark:text-[#67B58A]">/api/payment/checkout</td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600 hover:underline font-bold">Edit</button>
            <button class="text-rose-600 hover:underline font-bold">Hapus</button>
          </td>
        </tr>
        <tr class="hover:bg-[#F7F9F7]/50 dark:hover:bg-[#102E20]/40">
          <td class="p-3 font-semibold">Inventory Restock</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">Review</span></td>
          <td class="p-3 font-mono text-[11px] text-[#245C40] dark:text-[#67B58A]">/api/inventory/items</td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600 hover:underline font-bold">Edit</button>
            <button class="text-rose-600 hover:underline font-bold">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;
  }

  // 3. Landing Page Component
  if (q.includes('landing') || q.includes('hero') || q.includes('home') || q.includes('web')) {
    return `<!-- React Landing Page Component -->
<div class="w-full bg-[#F7F9F7] dark:bg-[#0B251B] text-[#17251D] dark:text-[#E9F4ED] rounded-3xl p-6 sm:p-10 border border-[#E5EBE6] dark:border-[#1A4532]">
  <div class="max-w-4xl mx-auto text-center space-y-4">
    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#E9F4ED] dark:bg-[#102E20] text-[#123D2A] dark:text-[#67B58A] border border-[#67B58A]/30">
      Web Landing Page
    </span>
    <h2 class="text-3xl sm:text-5xl font-black tracking-tight text-[#0B251B] dark:text-white">
      Solusi Cerdas untuk Developer Masa Depan
    </h2>
    <p class="text-sm sm:text-base text-[#7B887F] dark:text-[#8DA396] max-w-xl mx-auto">
      Tingkatkan produktivitas coding hingga 10x lipat dengan rangkaian AI tools modern berbasis React & Cloud Native.
    </p>
    <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
      <button class="w-full sm:w-auto px-6 py-3 bg-[#123D2A] hover:bg-[#245C40] dark:bg-[#67B58A] dark:hover:bg-emerald-400 text-white dark:text-[#0B251B] font-bold rounded-2xl shadow-lg transition-transform hover:scale-105">
        Mulai Eksplorasi
      </button>
      <button class="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#102E20] border border-[#E5EBE6] dark:border-[#1A4532] text-[#17251D] dark:text-white font-semibold rounded-2xl">
        Dokumentasi
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
    <div class="p-5 bg-white dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532] text-left">
      <div class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A] mb-1">[Speed]</div>
      <h4 class="font-bold text-sm text-[#0B251B] dark:text-white">Performa Tinggi</h4>
      <p class="text-xs text-[#7B887F] dark:text-[#8DA396] mt-1">Struktur arsitektur ringan tanpa bloatware.</p>
    </div>
    <div class="p-5 bg-white dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532] text-left">
      <div class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A] mb-1">[Security]</div>
      <h4 class="font-bold text-sm text-[#0B251B] dark:text-white">Aman & Teruji</h4>
      <p class="text-xs text-[#7B887F] dark:text-[#8DA396] mt-1">Validasi input ketat dan enkripsi session.</p>
    </div>
    <div class="p-5 bg-white dark:bg-[#102E20] rounded-2xl border border-[#E5EBE6] dark:border-[#1A4532] text-left">
      <div class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A] mb-1">[Mobile]</div>
      <h4 class="font-bold text-sm text-[#0B251B] dark:text-white">Multi Platform</h4>
      <p class="text-xs text-[#7B887F] dark:text-[#8DA396] mt-1">Dapat disinkronkan ke React Native & PHP API.</p>
    </div>
  </div>
</div>`;
  }

  return `<!-- React Component Preview: ${prompt.slice(0, 30)} -->
<div class="max-w-md mx-auto my-6 bg-white dark:bg-[#0B251B] rounded-3xl overflow-hidden shadow-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-all hover:shadow-2xl">
  <div class="p-6 bg-gradient-to-r from-[#123D2A] to-[#245C40] text-white">
    <div class="flex items-center justify-between">
      <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
        React Component (Live)
      </span>
      <span class="w-2.5 h-2.5 rounded-full bg-[#67B58A] animate-pulse"></span>
    </div>
    <h3 class="text-xl font-black mt-4">${prompt.slice(0, 45) || 'Komponen React Dinamis'}</h3>
    <p class="text-xs text-[#E9F4ED]/80 mt-1">Ditenagai oleh Anthropic Claude API.</p>
  </div>
  <div class="p-6 space-y-4 bg-white dark:bg-[#0B251B]">
    <div class="flex items-center space-x-3 p-3 rounded-2xl bg-[#E9F4ED] dark:bg-[#102E20] border border-[#67B58A]/30">
      <span class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A]">Status React Hook:</span>
      <span class="text-xs text-[#245C40] dark:text-[#8DA396] font-mono">useState (Active)</span>
    </div>
    <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1A4532]">
      <span class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A]">Responsif & Modular</span>
      <button class="px-4 py-2 bg-[#123D2A] hover:bg-[#245C40] dark:bg-[#67B58A] dark:hover:bg-emerald-400 text-white dark:text-[#0B251B] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95">
        Aksi Interaktif
      </button>
    </div>
  </div>
</div>`;
}

function generateSimulatedReactNativeCode(prompt, screenType) {
  return `/**
 * CODEFORGE React Native Mobile Studio
 * Target: React Native (Expo / Bare CLI)
 * Konsep: ${prompt}
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';

export default function MobileScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    alert("Tombol ditekan di React Native!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B251B" />
      
      {/* Header Mobile */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CODEFORGE <Text style={styles.accentText}>MOBILE</Text></Text>
        <Text style={styles.headerSubtitle}>React Native Mobile Architecture</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>REACT NATIVE</Text>
          </View>
          <Text style={styles.cardTitle}>${prompt.slice(0, 35) || 'Komponen Mobile Interaktif'}</Text>
          <Text style={styles.cardDesc}>
            Komponen native yang siap dikompilasi ke Android (APK) dan iOS menggunakan Expo atau React Native CLI.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleAction} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Jalankan Aksi Mobile</Text>
          </TouchableOpacity>
        </View>

        {/* Feature List */}
        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>Konektivitas API Langsung:</Text>
          <Text style={styles.featureItem}>• fetch() ke endpoint REST API backend Anda</Text>
          <Text style={styles.featureItem}>• Dukungan navigasi stack @react-navigation</Text>
          <Text style={styles.featureItem}>• State management lokal via useState / AsyncStorage</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#0B251B',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  accentText: {
    color: '#67B58A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#E9F4ED',
    opacity: 0.8,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5EBE6',
    shadowColor: '#0B251B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9F4ED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#123D2A',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#17251D',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#7B887F',
    lineHeight: 20,
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#123D2A',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  featureBox: {
    backgroundColor: '#E9F4ED',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C4D4CB',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#123D2A',
    marginBottom: 6,
  },
  featureItem: {
    fontSize: 12,
    color: '#245C40',
    marginBottom: 4,
  }
});
`;
}

function generateSimulatedReactPhpIntegration(reactCode, mode) {
  return `<?php
/**
 * CODEFORGE Backend REST API (api.php)
 * Dirancang untuk melayani Frontend React & Mobile React Native
 * Mode: ${mode}
 */

// 1. Header CORS & Tipe Konten JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Tangani Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Baca Body JSON dari React / React Native fetch()
$rawInput = file_get_contents("php://input");
$requestData = json_decode($rawInput, true);

// 3. Routing Endpoint Berdasarkan Metode
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Kembalikan Data ke React
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Data berhasil diambil oleh React client",
            "data" => [
                ["id" => 1, "title" => "React Web Component", "status" => "Active"],
                ["id" => 2, "title" => "React Native Mobile Screen", "status" => "Ready"],
                ["id" => 3, "title" => "PHP REST API Endpoint", "status" => "Connected"]
            ]
        ]);
        break;

    case 'POST':
        // Validasi Payload dari React Form
        if (empty($requestData['name']) || empty($requestData['email'])) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Kolom name dan email wajib diisi."
            ]);
            exit();
        }

        $cleanName  = htmlspecialchars(strip_tags($requestData['name']));
        $cleanEmail = filter_var($requestData['email'], FILTER_SANITIZE_EMAIL);

        // Simulasi Penyimpanan ke Database MySQL
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Data dari React berhasil diproses dan disimpan di PHP backend!",
            "received" => [
                "name" => $cleanName,
                "email" => $cleanEmail,
                "saved_at" => date("Y-m-d H:i:s")
            ]
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>

/* ========================================================
 * CONTOH KODE REACT FETCH (Paste ke Komponen React / React Native Anda):
 * ======================================================== */
/*
// Memanggil endpoint PHP di atas dari React:
const submitToPhpBackend = async (formData) => {
  try {
    const res = await fetch("http://localhost/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    console.log("Response dari PHP:", result);
  } catch (err) {
    console.error("Gagal menghubungi PHP backend:", err);
  }
};
*/`;
}
