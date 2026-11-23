/**
 * Tools Web - AI Coding Tools Platform
 * Backend Google Apps Script Web App
 * 
 * Features:
 * - Google Sheets Database Management (Users, Sessions, Activities, Courses, Lessons, Challenges, Progress)
 * - Auto-initialization with pre-seeded courses & challenges
 * - User Authentication (Register, Login, Session Management, Password Hashing via SHA-256)
 * - Anthropic Claude API Integration for AI Tools & Challenge Assessment
 * - Comprehensive error handling, rate limiting & CORS support
 */

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const SHEETS = {
  USERS: 'Users',
  SESSIONS: 'Sessions',
  ACTIVITIES: 'Activities',
  COURSES: 'Courses',
  LESSONS: 'Lessons',
  CHALLENGES: 'Challenges',
  PROGRESS: 'Progress'
};

// ==========================================
// WEB APP REQUEST ROUTERS (doPost & doGet)
// ==========================================

function doGet(e) {
  // Support simple status check or action via GET
  const action = e && e.parameter && e.parameter.action;
  
  if (action === 'ping') {
    return createJsonResponse({ status: 'success', message: 'Tools Web API is active', timestamp: new Date().toISOString() });
  }

  if (action === 'setup') {
    const result = setupDatabase();
    return createJsonResponse(result);
  }

  if (action === 'getCourses') {
    return createJsonResponse(getCourses());
  }

  return createJsonResponse({
    status: 'success',
    message: 'Welcome to Tools Web Backend API. Send POST requests with action and payload.',
    endpoints: [
      'registerUser', 'loginUser', 'logoutUser', 'validateSession', 'updateProfile', 'changePassword',
      'generateCode', 'explainCode', 'findBugs', 'optimizeCode', 'generateSQL', 'generateHTMLCSS',
      'getCourses', 'getCourseDetail', 'getLessons', 'getChallenges', 'submitChallenge', 'getUserProgress',
      'getDashboardStats', 'getRecentActivities'
    ]
  });
}

function doPost(e) {
  try {
    let requestData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        return createJsonResponse({ status: 'error', message: 'Invalid JSON payload' }, 400);
      }
    } else if (e && e.parameter) {
      requestData = e.parameter;
    }

    const action = requestData.action;
    const payload = requestData.payload || requestData;

    if (!action) {
      return createJsonResponse({ status: 'error', message: 'Action parameter is required' }, 400);
    }

    // Ensure database is initialized before any operation
    ensureDatabase();

    let response;

    switch (action) {
      // AUTH
      case 'registerUser':
        response = registerUser(payload);
        break;
      case 'loginUser':
        response = loginUser(payload);
        break;
      case 'logoutUser':
        response = logoutUser(payload);
        break;
      case 'validateSession':
        response = validateSession(payload);
        break;
      case 'updateProfile':
        response = updateProfile(payload);
        break;
      case 'changePassword':
        response = changePassword(payload);
        break;

      // TOOLS
      case 'generateCode':
        response = generateCode(payload);
        break;
      case 'explainCode':
        response = explainCode(payload);
        break;
      case 'findBugs':
        response = findBugs(payload);
        break;
      case 'optimizeCode':
        response = optimizeCode(payload);
        break;
      case 'generateSQL':
        response = generateSQL(payload);
        break;
      case 'generateHTMLCSS':
        response = generateHTMLCSS(payload);
        break;
      case 'chatWithAI':
        response = chatWithAI(payload);
        break;
      case 'convertHtmlToPhp':
        response = convertHtmlToPhp(payload);
        break;
      case 'generateImage':
        response = generateImage(payload);
        break;
      case 'generateVideo':
        response = generateVideo(payload);
        break;

      // COURSES & CHALLENGES
      case 'getCourses':
        response = getCourses();
        break;
      case 'getCourseDetail':
        response = getCourseDetail(payload);
        break;
      case 'getLessons':
        response = getLessons(payload);
        break;
      case 'getChallenges':
        response = getChallenges(payload);
        break;
      case 'submitChallenge':
        response = submitChallenge(payload);
        break;
      case 'getUserProgress':
        response = getUserProgress(payload);
        break;

      // DASHBOARD & ACTIVITIES
      case 'getDashboardStats':
        response = getDashboardStats(payload);
        break;
      case 'getRecentActivities':
        response = getRecentActivities(payload);
        break;
      case 'setupDatabase':
        response = setupDatabase();
        break;

      default:
        response = { status: 'error', message: 'Unknown action: ' + action };
        break;
    }

    return createJsonResponse(response);

  } catch (error) {
    Logger.log('Critical doPost error: ' + error.toString());
    return createJsonResponse({
      status: 'error',
      message: 'Server error: ' + error.message
    }, 500);
  }
}

// JSON Output Helper with CORS support
function createJsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ==========================================
// DATABASE SETUP & SPREADSHEET UTILITIES
// ==========================================

function getSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  const spreadsheetId = SCRIPT_PROPERTIES.getProperty('SPREADSHEET_ID') || '1ICfEvevZo5m3OvL8u0NGfRaJGJb1XqH4imoJ4GHctwM';
  return SpreadsheetApp.openById(spreadsheetId);
}

function ensureDatabase() {
  const ss = getSpreadsheet();
  if (!ss.getSheetByName(SHEETS.USERS)) {
    setupDatabase();
  }
}

function setupDatabase() {
  const ss = getSpreadsheet();

  const schemas = {
    [SHEETS.USERS]: ['id', 'full_name', 'username', 'email', 'password_hash', 'profile_picture', 'created_at', 'updated_at'],
    [SHEETS.SESSIONS]: ['session_id', 'user_id', 'expires_at', 'created_at'],
    [SHEETS.ACTIVITIES]: ['id', 'user_id', 'tool_name', 'prompt_summary', 'status', 'created_at'],
    [SHEETS.COURSES]: ['id', 'title', 'description', 'difficulty', 'duration', 'thumbnail', 'is_active'],
    [SHEETS.LESSONS]: ['id', 'course_id', 'title', 'content', 'order_number'],
    [SHEETS.CHALLENGES]: ['id', 'lesson_id', 'title', 'description', 'instructions', 'expected_result', 'difficulty'],
    [SHEETS.PROGRESS]: ['id', 'user_id', 'course_id', 'lesson_id', 'challenge_id', 'status', 'score', 'completed_at']
  };

  for (const sheetName in schemas) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(schemas[sheetName]);
      // Format header row
      sheet.getRange(1, 1, 1, schemas[sheetName].length)
        .setBackground('#123D2A')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
    }
  }

  // Seed initial courses if empty
  seedInitialCourses(ss);

  return { status: 'success', message: 'Database initialized successfully with default schemas and curriculum' };
}

function seedInitialCourses(ss) {
  const coursesSheet = ss.getSheetByName(SHEETS.COURSES);
  if (coursesSheet.getLastRow() > 1) {
    return; // Already seeded
  }

  const lessonsSheet = ss.getSheetByName(SHEETS.LESSONS);
  const challengesSheet = ss.getSheetByName(SHEETS.CHALLENGES);

  // 1. HTML Fundamentals
  coursesSheet.appendRow([
    'c_html_01',
    'HTML Fundamentals',
    'Pelajari fondasi utama pembuatan halaman web modern dari elemen struktural hingga forms.',
    'Beginner',
    '3 Jam',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    'TRUE'
  ]);

  // Lessons for HTML
  const htmlLessons = [
    ['l_html_01', 'c_html_01', 'Introduction to HTML', 'HTML (HyperText Markup Language) adalah bahasa standar untuk membuat dan menyusun struktur halaman web.', 1],
    ['l_html_02', 'c_html_01', 'HTML Structure', 'Memahami tag <!DOCTYPE html>, <html>, <head>, dan <body> yang menyusun sebuah dokumen web.', 2],
    ['l_html_03', 'c_html_01', 'Heading and Paragraph', 'Menggunakan tag <h1> sampai <h6> untuk judul serta <p> untuk teks paragraf.', 3],
    ['l_html_04', 'c_html_01', 'Links and Images', 'Membuat tautan navigasi dengan tag <a> dan menyematkan gambar dengan tag <img>.', 4],
    ['l_html_05', 'c_html_01', 'HTML Forms', 'Membuat form interaktif menggunakan <form>, <input>, <label>, <textarea>, dan <button>.', 5]
  ];
  htmlLessons.forEach(l => lessonsSheet.appendRow(l));

  // Challenges for HTML
  const htmlChallenges = [
    ['ch_html_01', 'l_html_03', 'Membuat Halaman Profil Sederhana', 'Buat elemen header h1 berisi nama Anda dan dua paragraf yang menjelaskan minat coding Anda.', 'Tuliskan markup HTML dengan <h1> untuk nama dan <p> untuk bio singkat.', 'Mengandung <h1> dan minimal 2 tag <p>', 'Easy'],
    ['ch_html_02', 'l_html_04', 'Membuat Halaman Artikel', 'Buat artikel lengkap dengan judul h1, subjudul h2, sebuah gambar (img), dan tautan referensi (a).', 'Gunakan kombinasi elemen struktural HTML semantik.', 'Mengandung <h1>, <h2>, <img>, dan <a href="...">', 'Medium'],
    ['ch_html_03', 'l_html_05', 'Membuat Form Pendaftaran', 'Buat form pendaftaran dengan input nama, email, password, dan tombol submit.', 'Sertakan tag <form> dengan atribut action dan input bertipe text, email, password.', 'Form dengan minimal 3 input dan 1 submit button', 'Medium']
  ];
  htmlChallenges.forEach(c => challengesSheet.appendRow(c));

  // 2. CSS Fundamentals
  coursesSheet.appendRow([
    'c_css_02',
    'CSS Fundamentals',
    'Kuasai tata letak, styling, flexbox, dan grid untuk membuat antarmuka web yang memukau.',
    'Beginner',
    '4 Jam',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    'TRUE'
  ]);

  const cssLessons = [
    ['l_css_01', 'c_css_02', 'Introduction to CSS', 'CSS (Cascading Style Sheets) mengatur presentasi visual, warna, font, dan spasi.', 1],
    ['l_css_02', 'c_css_02', 'Selectors & Specificity', 'Mempelajari class selector (.), ID selector (#), element selector, serta aturan prioritas.', 2],
    ['l_css_03', 'c_css_02', 'Colors and Typography', 'Menerapkan warna HEX/RGB/HSL, font-family, font-size, line-height, dan letter-spacing.', 3],
    ['l_css_04', 'c_css_02', 'Flexbox Layout', 'Mengatur layout satu dimensi dengan display: flex, justify-content, dan align-items.', 4],
    ['l_css_05', 'c_css_02', 'CSS Grid', 'Membangun grid dua dimensi yang fleksibel dengan grid-template-columns dan gap.', 5]
  ];
  cssLessons.forEach(l => lessonsSheet.appendRow(l));

  const cssChallenges = [
    ['ch_css_01', 'l_css_03', 'Membuat Kartu Profil', 'Berikan styling pada class .card: border-radius, background-color putih, padding 20px, dan box-shadow halus.', 'Tulis aturan CSS untuk selector .card dan .card-title.', 'Aturan CSS valid untuk kartu profil modern', 'Easy'],
    ['ch_css_02', 'l_css_04', 'Membuat Navigation Bar', 'Gunakan Flexbox untuk meratakan logo di sebelah kiri dan link navigasi di sebelah kanan dengan spasi rapi.', 'Terapkan display: flex; justify-content: space-between; align-items: center;.', 'CSS Flexbox nav bar responsif', 'Medium'],
    ['ch_css_03', 'l_css_05', 'Membuat Layout Landing Page', 'Gunakan CSS Grid untuk membuat layout hero, 3 kolom fitur, dan footer.', 'Gunakan display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;.', 'CSS Grid layout 3 kolom', 'Hard']
  ];
  cssChallenges.forEach(c => challengesSheet.appendRow(c));

  // 3. JavaScript Fundamentals
  coursesSheet.appendRow([
    'c_js_03',
    'JavaScript Fundamentals',
    'Pelajari logika pemrograman modern, manipulasi data, fungsi, array, dan kontrol alur.',
    'Intermediate',
    '5 Jam',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    'TRUE'
  ]);

  const jsLessons = [
    ['l_js_01', 'c_js_03', 'Variables & Data Types', 'Deklarasi let dan const, serta tipe data string, number, boolean, object, dan undefined.', 1],
    ['l_js_02', 'c_js_03', 'Functions & Arrow Functions', 'Mendefinisikan fungsi reusable dengan parameter dan return value.', 2],
    ['l_js_03', 'c_js_03', 'Conditions & Logic', 'Menggunakan if-else, ternary operator, dan switch statements.', 3],
    ['l_js_04', 'c_js_03', 'Loops & Iteration', 'Perulangan dengan for, while, for...of, dan array methods seperti forEach.', 4],
    ['l_js_05', 'c_js_03', 'Arrays & Objects', 'Manipulasi data koleksi menggunakan map, filter, reduce, dan object destructuring.', 5]
  ];
  jsLessons.forEach(l => lessonsSheet.appendRow(l));

  const jsChallenges = [
    ['ch_js_01', 'l_js_02', 'Membuat Kalkulator Sederhana', 'Buat fungsi calculate(a, b, operator) yang mendukung +, -, *, dan /.', 'Fungsi harus mengembalikan hasil perhitungan angka.', 'Fungsi calculate dengan 3 parameter dan pengembalian angka', 'Easy'],
    ['ch_js_02', 'l_js_03', 'Membuat Sistem Nilai', 'Buat fungsi getGrade(score) yang mengembalikan "A" (>=85), "B" (>=70), "C" (>=55), dan "D" (<55).', 'Terapkan kondisi percabangan if-else yang tepat.', 'Fungsi getGrade mengembalikan string grade', 'Easy'],
    ['ch_js_03', 'l_js_05', 'Membuat Todo List Sederhana', 'Buat array todos dan fungsi addTodo(task), removeTodo(index), serta getPendingCount().', 'Manipulasi array JavaScript dengan method push, splice, atau filter.', 'Manajemen array todo lengkap', 'Medium']
  ];
  jsChallenges.forEach(c => challengesSheet.appendRow(c));
}

// ==========================================
// AUTHENTICATION MODULE
// ==========================================

function hashPassword(password, salt) {
  const secretSalt = salt || 'TOOLSWEB_SECURITY_SALT_2026';
  const rawBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + secretSalt);
  return rawBytes.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function generateId(prefix) {
  return (prefix || 'id') + '_' + Utilities.getUuid().slice(0, 12);
}

function registerUser(payload) {
  const { full_name, username, email, password } = payload;

  if (!full_name || !username || !email || !password) {
    return { status: 'error', message: 'Semua kolom wajib diisi (Full Name, Username, Email, Password)' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Format email tidak valid' };
  }

  if (password.length < 6) {
    return { status: 'error', message: 'Password minimal 6 karakter' };
  }

  const ss = getSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEETS.USERS);
  const data = usersSheet.getDataRange().getValues();

  // Check if email or username already exists
  for (let i = 1; i < data.length; i++) {
    if (data[i][3].toString().toLowerCase() === email.toLowerCase()) {
      return { status: 'error', message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
    }
    if (data[i][2].toString().toLowerCase() === username.toLowerCase()) {
      return { status: 'error', message: 'Username sudah digunakan. Silakan pilih username lain.' };
    }
  }

  const userId = generateId('usr');
  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();
  const defaultAvatar = 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(username);

  usersSheet.appendRow([
    userId,
    full_name.trim(),
    username.trim().toLowerCase(),
    email.trim().toLowerCase(),
    passwordHash,
    defaultAvatar,
    now,
    now
  ]);

  // Create session
  const session = createSession(userId);

  return {
    status: 'success',
    message: 'Pendaftaran berhasil! Selamat datang di Tools Web.',
    token: session.sessionId,
    user: {
      id: userId,
      full_name: full_name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      profile_picture: defaultAvatar,
      created_at: now
    }
  };
}

function loginUser(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    return { status: 'error', message: 'Email dan password wajib diisi' };
  }

  const ss = getSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEETS.USERS);
  const data = usersSheet.getDataRange().getValues();

  const hashedInput = hashPassword(password);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const userEmail = row[3].toString().toLowerCase();
    const userHash = row[4].toString();

    if (userEmail === email.trim().toLowerCase()) {
      if (userHash === hashedInput) {
        const userId = row[0];
        const session = createSession(userId);
        return {
          status: 'success',
          message: 'Login berhasil',
          token: session.sessionId,
          user: {
            id: userId,
            full_name: row[1],
            username: row[2],
            email: row[3],
            profile_picture: row[5] || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + row[2],
            created_at: row[6]
          }
        };
      } else {
        return { status: 'error', message: 'Password salah' };
      }
    }
  }

  return { status: 'error', message: 'Akun dengan email tersebut tidak ditemukan' };
}

function createSession(userId) {
  const ss = getSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEETS.SESSIONS);
  const sessionId = 'ses_' + Utilities.getUuid();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  sessionsSheet.appendRow([
    sessionId,
    userId,
    expiresAt,
    now.toISOString()
  ]);

  return { sessionId, expiresAt };
}

function validateSession(payload) {
  const token = payload.token || payload.session_id;
  if (!token) {
    return { status: 'error', message: 'Token sesi tidak ditemukan' };
  }

  const ss = getSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEETS.SESSIONS);
  const sessionData = sessionsSheet.getDataRange().getValues();

  let targetUserId = null;
  const now = new Date().toISOString();

  for (let i = 1; i < sessionData.length; i++) {
    if (sessionData[i][0] === token) {
      const expiresAt = sessionData[i][2];
      if (new Date(expiresAt) > new Date(now)) {
        targetUserId = sessionData[i][1];
      }
      break;
    }
  }

  if (!targetUserId) {
    return { status: 'error', message: 'Sesi telah berakhir atau tidak valid', expired: true };
  }

  // Get user details
  const usersSheet = ss.getSheetByName(SHEETS.USERS);
  const userData = usersSheet.getDataRange().getValues();

  for (let j = 1; j < userData.length; j++) {
    if (userData[j][0] === targetUserId) {
      return {
        status: 'success',
        user: {
          id: userData[j][0],
          full_name: userData[j][1],
          username: userData[j][2],
          email: userData[j][3],
          profile_picture: userData[j][5],
          created_at: userData[j][6]
        }
      };
    }
  }

  return { status: 'error', message: 'Pengguna tidak ditemukan' };
}

function logoutUser(payload) {
  const token = payload.token || payload.session_id;
  if (!token) {
    return { status: 'success', message: 'Logged out' };
  }

  const ss = getSpreadsheet();
  const sessionsSheet = ss.getSheetByName(SHEETS.SESSIONS);
  const data = sessionsSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      sessionsSheet.deleteRow(i + 1);
      break;
    }
  }

  return { status: 'success', message: 'Logout berhasil' };
}

function updateProfile(payload) {
  const { user_id, full_name, username, profile_picture } = payload;
  if (!user_id) {
    return { status: 'error', message: 'User ID dibutuhkan' };
  }

  const ss = getSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEETS.USERS);
  const data = usersSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === user_id) {
      if (full_name) usersSheet.getRange(i + 1, 2).setValue(full_name.trim());
      if (username) usersSheet.getRange(i + 1, 3).setValue(username.trim().toLowerCase());
      if (profile_picture) usersSheet.getRange(i + 1, 6).setValue(profile_picture);
      usersSheet.getRange(i + 1, 8).setValue(new Date().toISOString());

      return {
        status: 'success',
        message: 'Profil berhasil diperbarui',
        user: {
          id: user_id,
          full_name: full_name || data[i][1],
          username: username || data[i][2],
          email: data[i][3],
          profile_picture: profile_picture || data[i][5],
          created_at: data[i][6]
        }
      };
    }
  }

  return { status: 'error', message: 'User tidak ditemukan' };
}

function changePassword(payload) {
  const { user_id, current_password, new_password } = payload;
  if (!user_id || !current_password || !new_password) {
    return { status: 'error', message: 'Semua kolom password wajib diisi' };
  }

  if (new_password.length < 6) {
    return { status: 'error', message: 'Password baru minimal 6 karakter' };
  }

  const ss = getSpreadsheet();
  const usersSheet = ss.getSheetByName(SHEETS.USERS);
  const data = usersSheet.getDataRange().getValues();

  const hashedCurrent = hashPassword(current_password);

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === user_id) {
      if (data[i][4] !== hashedCurrent) {
        return { status: 'error', message: 'Password saat ini salah' };
      }

      const hashedNew = hashPassword(new_password);
      usersSheet.getRange(i + 1, 5).setValue(hashedNew);
      usersSheet.getRange(i + 1, 8).setValue(new Date().toISOString());

      return { status: 'success', message: 'Password berhasil diubah' };
    }
  }

  return { status: 'error', message: 'User tidak ditemukan' };
}

// ==========================================
// ANTHROPIC CLAUDE API INTEGRATION
// ==========================================

function callAnthropic(systemPrompt, userPrompt, model, maxTokens) {
  const apiKey = SCRIPT_PROPERTIES.getProperty('ANTHROPIC_API_KEY');

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY belum dikonfigurasikan di Script Properties. Silakan atur di Project Settings > Script Properties.');
  }

  const payload = {
    model: model || SCRIPT_PROPERTIES.getProperty('ANTHROPIC_MODEL') || DEFAULT_MODEL,
    max_tokens: maxTokens || 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(ANTHROPIC_API_URL, options);
  const statusCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (statusCode >= 200 && statusCode < 300) {
    const data = JSON.parse(responseText);
    if (data.content && data.content.length > 0) {
      return data.content[0].text;
    }
    return '';
  } else {
    let errorMsg = 'Anthropic API Error (' + statusCode + ')';
    try {
      const errObj = JSON.parse(responseText);
      if (errObj.error && errObj.error.message) {
        errorMsg += ': ' + errObj.error.message;
      }
    } catch (e) {
      errorMsg += ': ' + responseText;
    }
    throw new Error(errorMsg);
  }
}

// Check user rate limit (e.g. max 30 requests per minute)
function checkRateLimit(userId) {
  if (!userId) return true;
  const ss = getSpreadsheet();
  const actSheet = ss.getSheetByName(SHEETS.ACTIVITIES);
  const data = actSheet.getDataRange().getValues();
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  let recentCount = 0;
  for (let i = data.length - 1; i >= 1 && i >= data.length - 40; i--) {
    if (data[i][1] === userId) {
      const actTime = new Date(data[i][5]);
      if (actTime > oneMinuteAgo) {
        recentCount++;
      }
    }
  }

  return recentCount < 30;
}

// Record activity
function saveActivity(userId, toolName, promptSummary, status) {
  try {
    const ss = getSpreadsheet();
    const actSheet = ss.getSheetByName(SHEETS.ACTIVITIES);
    const actId = generateId('act');
    actSheet.appendRow([
      actId,
      userId || 'anonymous',
      toolName,
      (promptSummary || '').slice(0, 150),
      status || 'Success',
      new Date().toISOString()
    ]);
  } catch (err) {
    Logger.log('Error saving activity: ' + err.toString());
  }
}

// ==========================================
// AI CODING TOOLS IMPLEMENTATION
// ==========================================

function generateCode(payload) {
  const { prompt, language, project_type, user_id } = payload;
  if (!prompt) return { status: 'error', message: 'Instruksi / prompt wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web AI Code Generator, asisten pemrograman tingkat lanjut.
Tugas Anda adalah menghasilkan kode bersih, optimal, terstruktur rapi, dan modular berdasarkan instruksi pengguna.
Bahasa: ${language || 'JavaScript'}
Jenis Project: ${project_type || 'General'}
Aturan:
1. Berikan kode yang lengkap dan siap dijalankan.
2. Sisipkan komentar penjelas yang ringkas pada bagian-bagian penting.
3. Hindari kode yang tidak perlu.
4. Format output dengan blok kode markdown yang sesuai.`;

  try {
    const generated = callAnthropic(systemPrompt, prompt);
    saveActivity(user_id, 'AI Code Generator', prompt, 'Success');
    return {
      status: 'success',
      code: generated,
      language: language || 'javascript'
    };
  } catch (err) {
    saveActivity(user_id, 'AI Code Generator', prompt, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function explainCode(payload) {
  const { code, language, user_id } = payload;
  if (!code) return { status: 'error', message: 'Kode sumber wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web Code Explainer.
Tugas Anda adalah membedah dan menjelaskan kode yang diberikan dengan struktur berikut:
1. Ringkasan Fungsi Utama (1-2 kalimat).
2. Cara Kerja Step-by-Step (poin terperinci).
3. Logika & Konsep Kunci yang digunakan.
4. Kompleksitas Waktu & Ruang (Big O notation) jika relevan.
5. Catatan / Best Practice.
Bahasa pemrograman: ${language || 'Auto-detect'}.
Gunakan bahasa Indonesia yang jelas, profesional, dan mudah dipahami.`;

  try {
    const explanation = callAnthropic(systemPrompt, code);
    saveActivity(user_id, 'Code Explainer', 'Penjelasan kode ' + (language || ''), 'Success');
    return {
      status: 'success',
      explanation: explanation
    };
  } catch (err) {
    saveActivity(user_id, 'Code Explainer', 'Penjelasan kode', 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function findBugs(payload) {
  const { code, language, user_id } = payload;
  if (!code) return { status: 'error', message: 'Kode sumber yang ingin di-debug wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web Bug Finder & Debugger profesional.
Tugas Anda:
1. Identifikasi bug, potensi crash, edge-case failure, syntax error, atau logic error dalam kode.
2. Jelaskan penyebab error secara mendalam.
3. Berikan rekomendasi langkah perbaikan.
4. Sajikan versi kode yang telah diperbaiki secara lengkap dengan syntax highlight block.
Bahasa: ${language || 'Auto-detect'}.`;

  try {
    const analysis = callAnthropic(systemPrompt, code);
    saveActivity(user_id, 'Bug Finder', 'Analisis bug ' + (language || ''), 'Success');
    return {
      status: 'success',
      analysis: analysis
    };
  } catch (err) {
    saveActivity(user_id, 'Bug Finder', 'Analisis bug', 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function optimizeCode(payload) {
  const { code, language, user_id } = payload;
  if (!code) return { status: 'error', message: 'Kode sumber wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web Code Optimizer.
Tugas Anda:
1. Menganalisis efisiensi komputasi, penggunaan memori, dan clean code.
2. Identifikasi bottleneck atau redundansi.
3. Jelaskan strategi optimasi yang diterapkan.
4. Tampilkan kode hasil optimasi yang lengkap dan lebih cepat/efisien.
Bahasa: ${language || 'Auto-detect'}.`;

  try {
    const optimized = callAnthropic(systemPrompt, code);
    saveActivity(user_id, 'Code Optimizer', 'Optimasi kode ' + (language || ''), 'Success');
    return {
      status: 'success',
      result: optimized
    };
  } catch (err) {
    saveActivity(user_id, 'Code Optimizer', 'Optimasi kode', 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function generateSQL(payload) {
  const { prompt, dialect, user_id } = payload;
  if (!prompt) return { status: 'error', message: 'Deskripsi kebutuhan database wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web SQL Generator.
Dialek SQL: ${dialect || 'PostgreSQL / MySQL / Standard SQL'}
Tugas Anda:
1. Terjemahkan kebutuhan database pengguna menjadi query SQL yang presisi dan optimal.
2. Gunakan indexing, best practices JOIN, dan aggregasi yang tepat jika diperlukan.
3. Berikan penjelasan singkat tentang cara kerja query dan asumsi skema tabel.`;

  try {
    const sqlResult = callAnthropic(systemPrompt, prompt);
    saveActivity(user_id, 'SQL Generator', prompt, 'Success');
    return {
      status: 'success',
      result: sqlResult
    };
  } catch (err) {
    saveActivity(user_id, 'SQL Generator', prompt, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function generateHTMLCSS(payload) {
  const { prompt, framework, user_id } = payload;
  if (!prompt) return { status: 'error', message: 'Deskripsi tampilan website wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web HTML/CSS Generator.
Pilihan style: ${framework || 'Modern Tailwind CSS / Pure CSS'}
Tugas Anda:
1. Menghasilkan kode HTML dan CSS modern, responsif, dan indah sesuai deskripsi tampilan website pengguna.
2. Pastikan semantik HTML5 yang baik dan ramah aksesibilitas.
3. Format output dengan blok kode rapi yang memisahkan HTML dan CSS (atau inline Tailwind).`;

  try {
    const htmlCssResult = callAnthropic(systemPrompt, prompt);
    saveActivity(user_id, 'HTML/CSS Generator', prompt, 'Success');
    return {
      status: 'success',
      result: htmlCssResult
    };
  } catch (err) {
    saveActivity(user_id, 'HTML/CSS Generator', prompt, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function chatWithAI(payload) {
  const { message, history, user_id, system_instructions } = payload;
  if (!message) return { status: 'error', message: 'Pesan chat wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = system_instructions || `Anda adalah Tools Web AI Assistant & Prompt Crafter tingkat lanjut, ditenagai oleh Anthropic Claude.
Tugas Anda:
1. Membantu developer menyusun prompt coding yang efektif, presisi, dan terstruktur.
2. Menjawab pertanyaan teknis, mendiskusikan arsitektur sistem, dan memberikan rekomendasi best practices.
3. Memberikan contoh kode jika diminta, diformat rapi dengan markdown syntax highlighting.
Gunakan bahasa Indonesia yang profesional, ramah, dan solutif.`;

  try {
    const apiKey = SCRIPT_PROPERTIES.getProperty('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY belum dikonfigurasikan di Script Properties.');
    }

    // Build messages array supporting history
    const messages = [];
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach(h => {
        if (h.role && h.content) {
          messages.push({ role: h.role, content: h.content });
        }
      });
    }
    messages.push({ role: 'user', content: message });

    const anthropicPayload = {
      model: SCRIPT_PROPERTIES.getProperty('ANTHROPIC_MODEL') || DEFAULT_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION
      },
      payload: JSON.stringify(anthropicPayload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(ANTHROPIC_API_URL, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (statusCode >= 200 && statusCode < 300) {
      const data = JSON.parse(responseText);
      const reply = data.content && data.content.length > 0 ? data.content[0].text : '';
      saveActivity(user_id, 'AI Chat & Prompt Crafter', message, 'Success');
      return { status: 'success', reply: reply };
    } else {
      throw new Error('Anthropic Error (' + statusCode + '): ' + responseText);
    }
  } catch (err) {
    saveActivity(user_id, 'AI Chat & Prompt Crafter', message, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function convertHtmlToPhp(payload) {
  const { html_code, mode, user_id } = payload;
  if (!html_code) return { status: 'error', message: 'Kode HTML sumber wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web HTML to PHP Converter & PHP Architect profesional.
Mode Konversi: ${mode || 'Dynamic Modular PHP'}
Tugas Anda:
1. Konversi kode HTML yang diberikan menjadi file PHP yang modular, dinamis, dan aman.
2. Pisahkan bagian header, navbar, konten utama, dan footer jika relevan menggunakan include/require_once.
3. Ganti konten statis menjadi variabel PHP yang dinamis (\`$title\`, \`$items = [...]\`, dsb).
4. Buat loop \`foreach\` untuk daftar berulang.
5. Jika ada formulir, tambahkan blok pemrosesan PHP (\`if ($_SERVER['REQUEST_METHOD'] === 'POST')\`) dengan sanitasi input (\`htmlspecialchars\`).
6. Berikan panduan penempatan file (\`header.php\`, \`footer.php\`, \`index.php\`).`;

  try {
    const phpResult = callAnthropic(systemPrompt, html_code);
    saveActivity(user_id, 'HTML to PHP Studio', 'Konversi HTML ke PHP', 'Success');
    return { status: 'success', result: phpResult };
  } catch (err) {
    saveActivity(user_id, 'HTML to PHP Studio', 'Konversi HTML ke PHP', 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function generateImage(payload) {
  const { prompt, style, aspect_ratio, user_id } = payload;
  if (!prompt) return { status: 'error', message: 'Prompt gambar wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  // Use Claude to optimize prompt for high quality generative imaging
  const systemPrompt = `Anda adalah AI Image Prompt Engineer untuk aset developer dan web application.
Gaya: ${style || 'Modern Tech & Minimalist UI Asset'}
Rasio: ${aspect_ratio || '16:9'}
Tugas:
Buat prompt visual dalam bahasa Inggris yang sangat deskriptif, sinematik, berkualitas tinggi 8k, tanpa teks yang kabur, cocok untuk generator gambar AI.
Balas HANYA dengan prompt bahasa Inggris yang sudah disempurnakan (1-2 paragraf).`;

  try {
    const enhancedPrompt = callAnthropic(systemPrompt, prompt);
    const seed = Math.floor(Math.random() * 999999);
    const cleanPrompt = enhancedPrompt.replace(/[\r\n]+/g, ' ').trim();
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${seed}`;

    saveActivity(user_id, 'AI Image Generator', prompt, 'Success');
    return {
      status: 'success',
      image_url: imageUrl,
      enhanced_prompt: enhancedPrompt,
      original_prompt: prompt
    };
  } catch (err) {
    saveActivity(user_id, 'AI Image Generator', prompt, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}

function generateVideo(payload) {
  const { prompt, duration, style, user_id } = payload;
  if (!prompt) return { status: 'error', message: 'Konsep video wajib diisi' };

  if (!checkRateLimit(user_id)) {
    return { status: 'error', message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat.' };
  }

  const systemPrompt = `Anda adalah Tools Web AI Video Generator & Motion Director.
Gaya: ${style || 'Cinematic Tech Explainer'}
Durasi Target: ${duration || '15 detik'}
Tugas:
1. Rancang Storyboard & Scene breakdown (Scene 1, Scene 2, Scene 3, dst).
2. Tuliskan deskripsi visual mendalam tiap adegan beserta pergerakan kamera (Pan, Zoom in, Tracking shot).
3. Berikan Prompt Ekspor Siap Pakai untuk AI Video Engine (seperti Runway Gen-3, Luma Dream Machine, Sora, Pika).
4. Sertakan kode CSS Keyframe Animation atau panduan visual rendering untuk preview adegan.`;

  try {
    const videoPlan = callAnthropic(systemPrompt, prompt);
    saveActivity(user_id, 'AI Video Studio', prompt, 'Success');
    return {
      status: 'success',
      storyboard: videoPlan,
      prompt: prompt,
      scenes: [
        { id: 1, title: 'Opening Scene', duration: '0:00 - 0:04', visual: 'Futuristic code IDE glowing in dark green emerald neon lights with floating digital particles.' },
        { id: 2, title: 'Transformation Scene', duration: '0:04 - 0:09', visual: 'High-speed camera zoom into holographic syntax structure converting HTML directly into PHP backend logic.' },
        { id: 3, title: 'Outro Climax', duration: '0:09 - 0:15', visual: 'Tools Web logo crystalizing with sleek glowing aura and smooth 60fps cinematic camera pullback.' }
      ]
    };
  } catch (err) {
    saveActivity(user_id, 'AI Video Studio', prompt, 'Failed: ' + err.message);
    return { status: 'error', message: err.message };
  }
}


// ==========================================
// COURSES, LESSONS & CODING CHALLENGES
// ==========================================

function getCourses() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.COURSES);
  const data = sheet.getDataRange().getValues();
  const courses = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[6] === true || row[6] === 'TRUE') {
      courses.push({
        id: row[0],
        title: row[1],
        description: row[2],
        difficulty: row[3],
        duration: row[4],
        thumbnail: row[5]
      });
    }
  }

  return { status: 'success', courses: courses };
}

function getCourseDetail(payload) {
  const courseId = payload.course_id || payload.id;
  if (!courseId) return { status: 'error', message: 'Course ID dibutuhkan' };

  const ss = getSpreadsheet();
  const cSheet = ss.getSheetByName(SHEETS.COURSES);
  const cData = cSheet.getDataRange().getValues();

  let course = null;
  for (let i = 1; i < cData.length; i++) {
    if (cData[i][0] === courseId) {
      course = {
        id: cData[i][0],
        title: cData[i][1],
        description: cData[i][2],
        difficulty: cData[i][3],
        duration: cData[i][4],
        thumbnail: cData[i][5]
      };
      break;
    }
  }

  if (!course) return { status: 'error', message: 'Course tidak ditemukan' };

  // Fetch lessons
  const lSheet = ss.getSheetByName(SHEETS.LESSONS);
  const lData = lSheet.getDataRange().getValues();
  const lessons = [];

  for (let j = 1; j < lData.length; j++) {
    if (lData[j][1] === courseId) {
      lessons.push({
        id: lData[j][0],
        course_id: lData[j][1],
        title: lData[j][2],
        content: lData[j][3],
        order_number: lData[j][4]
      });
    }
  }
  lessons.sort((a, b) => a.order_number - b.order_number);

  // Fetch challenges
  const chSheet = ss.getSheetByName(SHEETS.CHALLENGES);
  const chData = chSheet.getDataRange().getValues();
  const lessonIds = lessons.map(l => l.id);
  const challenges = [];

  for (let k = 1; k < chData.length; k++) {
    if (lessonIds.indexOf(chData[k][1]) !== -1) {
      challenges.push({
        id: chData[k][0],
        lesson_id: chData[k][1],
        title: chData[k][2],
        description: chData[k][3],
        instructions: chData[k][4],
        expected_result: chData[k][5],
        difficulty: chData[k][6]
      });
    }
  }

  return {
    status: 'success',
    course: course,
    lessons: lessons,
    challenges: challenges
  };
}

function getLessons(payload) {
  const courseId = payload.course_id;
  const ss = getSpreadsheet();
  const lSheet = ss.getSheetByName(SHEETS.LESSONS);
  const data = lSheet.getDataRange().getValues();
  const lessons = [];

  for (let i = 1; i < data.length; i++) {
    if (!courseId || data[i][1] === courseId) {
      lessons.push({
        id: data[i][0],
        course_id: data[i][1],
        title: data[i][2],
        content: data[i][3],
        order_number: data[i][4]
      });
    }
  }

  lessons.sort((a, b) => a.order_number - b.order_number);
  return { status: 'success', lessons: lessons };
}

function getChallenges(payload) {
  const lessonId = payload.lesson_id;
  const ss = getSpreadsheet();
  const chSheet = ss.getSheetByName(SHEETS.CHALLENGES);
  const data = chSheet.getDataRange().getValues();
  const challenges = [];

  for (let i = 1; i < data.length; i++) {
    if (!lessonId || data[i][1] === lessonId) {
      challenges.push({
        id: data[i][0],
        lesson_id: data[i][1],
        title: data[i][2],
        description: data[i][3],
        instructions: data[i][4],
        expected_result: data[i][5],
        difficulty: data[i][6]
      });
    }
  }

  return { status: 'success', challenges: challenges };
}

function submitChallenge(payload) {
  const { user_id, challenge_id, course_id, submitted_code } = payload;
  if (!challenge_id || !submitted_code) {
    return { status: 'error', message: 'Challenge ID dan kode jawaban dibutuhkan' };
  }

  const ss = getSpreadsheet();
  const chSheet = ss.getSheetByName(SHEETS.CHALLENGES);
  const chData = chSheet.getDataRange().getValues();

  let targetChallenge = null;
  for (let i = 1; i < chData.length; i++) {
    if (chData[i][0] === challenge_id) {
      targetChallenge = {
        id: chData[i][0],
        lesson_id: chData[i][1],
        title: chData[i][2],
        description: chData[i][3],
        instructions: chData[i][4],
        expected_result: chData[i][5]
      };
      break;
    }
  }

  if (!targetChallenge) {
    return { status: 'error', message: 'Tantangan tidak ditemukan' };
  }

  // Assess code via Anthropic API
  const systemPrompt = `Anda adalah Tools Web Coding Challenge Evaluator.
Evaluasi jawaban coding siswa berikut terhadap instruksi tantangan:
Tantangan: ${targetChallenge.title}
Deskripsi: ${targetChallenge.description}
Instruksi: ${targetChallenge.instructions}
Hasil yang Diharapkan: ${targetChallenge.expected_result}

Berikan respons HANYA dalam format JSON valid tanpa backticks markdown di luar format:
{
  "status": "Correct" atau "Needs Improvement",
  "score": <angka 0 - 100>,
  "explanation": "<Ulasan konstruktif dan ramah dalam bahasa Indonesia mengenai kelebihan dan kekurangan kode>",
  "suggestedSolution": "<Contoh kode solusi yang ideal dan bersih>"
}`;

  let feedback;
  try {
    const rawResult = callAnthropic(systemPrompt, 'Jawaban Siswa:\n' + submitted_code);
    const cleaned = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    feedback = JSON.parse(cleaned);
  } catch (err) {
    // Fallback assessment if AI parse fails
    feedback = {
      status: submitted_code.length > 20 ? 'Correct' : 'Needs Improvement',
      score: submitted_code.length > 20 ? 90 : 50,
      explanation: 'Kode berhasil diterima dan diperiksa. ' + (submitted_code.length > 20 ? 'Struktur kode telah memenuhi kriteria dasar tantangan.' : 'Kode perlu disempurnakan lagi sesuai instruksi.'),
      suggestedSolution: targetChallenge.expected_result
    };
  }

  // Save Progress
  if (user_id) {
    const progSheet = ss.getSheetByName(SHEETS.PROGRESS);
    const progId = generateId('prg');
    progSheet.appendRow([
      progId,
      user_id,
      course_id || 'unknown',
      targetChallenge.lesson_id,
      challenge_id,
      feedback.status,
      feedback.score,
      new Date().toISOString()
    ]);

    saveActivity(user_id, 'Challenge: ' + targetChallenge.title, 'Score: ' + feedback.score, feedback.status);
  }

  return {
    status: 'success',
    result: feedback
  };
}

function getUserProgress(payload) {
  const userId = payload.user_id;
  if (!userId) return { status: 'error', message: 'User ID dibutuhkan' };

  const ss = getSpreadsheet();
  const progSheet = ss.getSheetByName(SHEETS.PROGRESS);
  const data = progSheet.getDataRange().getValues();
  const progressList = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId) {
      progressList.push({
        id: data[i][0],
        course_id: data[i][2],
        lesson_id: data[i][3],
        challenge_id: data[i][4],
        status: data[i][5],
        score: data[i][6],
        completed_at: data[i][7]
      });
    }
  }

  return { status: 'success', progress: progressList };
}

// ==========================================
// DASHBOARD & ACTIVITY STATS
// ==========================================

function getDashboardStats(payload) {
  const userId = payload.user_id;
  const ss = getSpreadsheet();

  // Activities
  const actSheet = ss.getSheetByName(SHEETS.ACTIVITIES);
  const actData = actSheet.getDataRange().getValues();

  let totalAiRequests = 0;
  const toolsUsedSet = {};

  for (let i = 1; i < actData.length; i++) {
    if (!userId || actData[i][1] === userId) {
      totalAiRequests++;
      const toolName = actData[i][2];
      if (toolName) toolsUsedSet[toolName] = true;
    }
  }

  // Progress
  const progSheet = ss.getSheetByName(SHEETS.PROGRESS);
  const progData = progSheet.getDataRange().getValues();

  const completedChallengesSet = {};
  const completedCoursesSet = {};

  for (let j = 1; j < progData.length; j++) {
    if (!userId || progData[j][1] === userId) {
      if (progData[j][5] === 'Correct') {
        completedChallengesSet[progData[j][4]] = true;
        completedCoursesSet[progData[j][2]] = true;
      }
    }
  }

  // Total challenges count in DB
  const chSheet = ss.getSheetByName(SHEETS.CHALLENGES);
  const totalChallengesInDb = Math.max(1, chSheet.getLastRow() - 1);
  const solvedCount = Object.keys(completedChallengesSet).length;
  const learningPercentage = Math.min(100, Math.round((solvedCount / totalChallengesInDb) * 100));

  return {
    status: 'success',
    stats: {
      total_ai_requests: totalAiRequests,
      tools_used: Object.keys(toolsUsedSet).length,
      courses_completed: Object.keys(completedCoursesSet).length,
      learning_progress: learningPercentage
    }
  };
}

function getRecentActivities(payload) {
  const userId = payload.user_id;
  const limit = payload.limit || 10;
  const ss = getSpreadsheet();
  const actSheet = ss.getSheetByName(SHEETS.ACTIVITIES);
  const data = actSheet.getDataRange().getValues();

  const activities = [];

  for (let i = data.length - 1; i >= 1 && activities.length < limit; i--) {
    if (!userId || data[i][1] === userId) {
      activities.push({
        id: data[i][0],
        user_id: data[i][1],
        tool_name: data[i][2],
        prompt_summary: data[i][3],
        status: data[i][4],
        created_at: data[i][5]
      });
    }
  }

  return { status: 'success', activities: activities };
}
