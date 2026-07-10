#!/usr/bin/env node

const axios = require('axios');
const readline = require('readline');
const os = require('os');
const { performance } = require('perf_hooks');

const GITHUB_OWNER = 'wilzuXyzChv';
const GITHUB_REPO = 'Db-Number';
const GITHUB_PATH = 'List.json';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = 'thub_pat_11BTGBZSQ0Vw7earSanYBo_ewzdU9yuvm7b0l4ckv7quwBAFtZ9K3ZYdPPUvEQUnMbG57V4H7G81xdQAZN';

const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}`;
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
const BASE_URL = 'https://kyuu2nd.dev/api/alight-motion';

const API_KEY = 'Buy dm api key telegram @Wilzy22'; 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, hide = false) {
  return new Promise(resolve => rl.question(question, resolve));
}

const merah = '\x1b[31m';
const hijau = '\x1b[32m';
const kuning = '\x1b[33m';
const reset = '\x1b[0m';

async function loadingBar(detik, pesan = 'Memuat data') {
  const lebar = 30;
  const start = Date.now();
  const durasi = detik * 1000;
  process.stdout.write(`${pesan} [${merah}${' '.repeat(lebar)}${reset}] 0%`);
  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const persen = Math.min(100, Math.floor((elapsed / durasi) * 100));
    const filled = Math.floor((persen / 100) * lebar);
    const empty = lebar - filled;
    process.stdout.cursorTo(0);
    process.stdout.write(`${pesan} [${merah}${'█'.repeat(filled)}${reset}${' '.repeat(empty)}${reset}] ${persen}%`);
  }, 100);
  await new Promise(resolve => setTimeout(resolve, durasi));
  clearInterval(interval);
  process.stdout.cursorTo(0);
  console.log(`${pesan} [${hijau}${'█'.repeat(lebar)}${reset}] 100% ✅`);
}

async function bacaData() {
  try {
    const res = await axios.get(RAW_URL, { timeout: 10000 });
    if (Array.isArray(res.data)) return res.data;
    console.warn(`${kuning}⚠️ Data bukan array, reset ke []`);
    return [];
  } catch (err) {
    if (err.response?.status === 404) {
      console.log(`${kuning}📄 File List.json belum ada, akan dibuat baru.`);
      return [];
    }
    console.error(`${merah}❌ Gagal baca data: ${err.message}`);
    return [];
  }
}

async function tulisData(data) {
  if (!Array.isArray(data)) data = [];
  let sha = null;
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    sha = res.data.sha;
  } catch (err) {
    if (err.response?.status !== 404) throw err;
  }
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  const payload = {
    message: 'Update user database',
    content: content,
    branch: GITHUB_BRANCH
  };
  if (sha) payload.sha = sha;
  await axios.put(API_URL, payload, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
}

function tambahHari(tanggal, hari) {
  const result = new Date(tanggal);
  result.setDate(result.getDate() + hari);
  return result.toISOString();
}

function sisaHari(expired_at) {
  if (!expired_at) return 0;
  const now = new Date();
  const expired = new Date(expired_at);
  const diff = expired - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

async function login() {
  console.clear();
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃         LOGIN AKSES TOOLS                 ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
  const username = await ask('Username: ');
  const password = await ask('Password: ', true);

  let users = await bacaData();
  if (!Array.isArray(users) || users.length === 0) {
    console.log(`${merah}❌ Database kosong. Hubungi owner.${reset}`);
    await ask('Tekan Enter...');
    return null;
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    console.log(`${merah}❌ Username atau password salah!${reset}`);
    await ask('\nTekan Enter untuk mengulang...');
    return null;
  }

  if (user.role === 'owner') {
    console.log(`${hijau}✅ Login berhasil sebagai OWNER (unlimited)${reset}`);
    await ask('\nTekan Enter...');
    return user;
  }

  if (!user.expired_at) {
    console.log(`${merah}❌ Akun tidak memiliki tanggal expired. Hubungi owner.${reset}`);
    await ask('\nTekan Enter...');
    return null;
  }
  const now = new Date();
  const expired = new Date(user.expired_at);
  if (now > expired) {
    console.log(`${merah}════════════════════════════════════════════════════${reset}`);
    console.log(`${merah}[ x ] TOOLS EXPIRED SEGARA BELI AKSES${reset}`);
    console.log(`${merah}EXPIRED${reset}`);
    console.log(`${merah}█▀ █░█ █▀▄ ▄▀▄ █ █▀▀▄ █▀▄${reset}`);
    console.log(`${merah}█▀ ▄▀▄ █▄█ █▀█ █ █▐█▀ █░█${reset}`);
    console.log(`${merah}▀▀ ▀░▀ ▀░░ ▀░▀ ▀ ▀░▀▀ ▀▀░${reset}`);
    console.log(`${merah}════════════════════════════════════════════════════${reset}`);
    await ask('\nTekan Enter untuk keluar...');
    process.exit(0);
  }

  console.log(`${hijau}✅ Login berhasil! Selamat datang, ${username}${reset}`);
  console.log(`${kuning}📅 Sisa masa aktif: ${sisaHari(user.expired_at)} hari${reset}`);
  await ask('\nTekan Enter...');
  return user;
}

async function getPublicIP() {
  try {
    const res = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
    return res.data.ip;
  } catch { return 'Tidak terdeteksi'; }
}
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const iface of Object.values(ifaces))
    for (const alias of iface)
      if (alias.family === 'IPv4' && !alias.internal) return alias.address;
  return 'Tidak ada';
}
async function getPing() {
  const start = performance.now();
  try {
    await axios.get(BASE_URL, { timeout: 5000 });
    return `${(performance.now() - start).toFixed(0)} ms`;
  } catch { return 'Timeout'; }
}
async function getNetworkSpeed() {
  try {
    const start = performance.now();
    const res = await axios.get('https://api.ipify.org', { responseType: 'arraybuffer', timeout: 10000 });
    const mbps = (res.data.length * 8) / (((performance.now() - start) / 1000) * 1024 * 1024);
    return mbps > 0.01 ? `${mbps.toFixed(2)} Mbps` : 'Gagal';
  } catch { return 'Gagal ukur'; }
}
function getDeviceInfo() {
  return `${os.type()} ${os.release()} ${os.arch()}\n  CPU: ${os.cpus()[0]?.model || 'Unknown'} (${os.cpus().length} core)\n  RAM: ${(os.totalmem() / (1024**3)).toFixed(1)} GB`;
}
async function getRegion() {
  try {
    const res = await axios.get('http://ip-api.com/json/', { timeout: 5000 });
    if (res.data?.status === 'success') return `${res.data.city}, ${res.data.regionName}, ${res.data.country}`;
  } catch {}
  return 'Tidak diketahui';
}
async function showDashboard() {
  console.clear();
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃       Dashboard Info ©Copyright By wilzu ┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await loadingBar(1, '📡 Mengukur ping'); const ping = await getPing();
  await loadingBar(1, '⚡ Kecepatan'); const speed = await getNetworkSpeed();
  await loadingBar(0.5, '💻 Device info'); const deviceInfo = getDeviceInfo();
  await loadingBar(0.5, '🌍 Region'); const region = await getRegion();
  const publicIP = await getPublicIP();
  const localIP = getLocalIP();
  console.log(`[ / ] IP publik        : ${publicIP}`);
  console.log(`[ / ] IP lokal         : ${localIP}`);
  console.log(`[ / ] ping             : ${ping}`);
  console.log(`[ / ] kecepatan jaringan : ${speed}`);
  const devLines = deviceInfo.split('\n');
  console.log(`[ / ] device info       : ${devLines[0]}`);
  console.log(`       ${devLines[1]}`);
  console.log(`       ${devLines[2]}`);
  console.log(`[ / ] region            : ${region}`);
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

async function sendVerificationEmail(email) {
  try {
    console.log(`\n📧 Mengirim ke ${email} ...`);
    const response = await axios.get(`${BASE_URL}/am-send`, {
      params: { email, apikey: API_KEY },
      timeout: 30000
    });
    if (response.data?.status === true) console.log('✅ Email terkirim! Cek inbox/spam.');
    else console.log('❌ Gagal:', response.data?.result || 'Unknown error');
  } catch (error) { handleError(error); }
}

async function verifyAccount(email, link) {
  try {
    console.log(`\n🔐 Verifikasi ${email} ...`);
    const response = await axios.get(`${BASE_URL}/am-verif`, {
      params: { email, link, apikey: API_KEY },
      timeout: 30000
    });
    if (response.data?.status === true) console.log('✅ Verifikasi berhasil! Akun aktif.');
    else console.log('❌ Verifikasi gagal:', response.data?.result || 'Unknown error');
  } catch (error) { handleError(error); }
}

function handleError(error) {
  if (error.response) {
    console.log(`\n❌ Error ${error.response.status}: ${error.response.data?.result || error.response.statusText}`);
    if (error.response.status === 403) console.log('\n⚠️ IP tidak terdaftar, daftarkan ke @kyuu2nd');
  } else if (error.request) console.log('❌ Tidak ada respon server.');
  else console.log(`❌ ${error.message}`);
}

// Dinosaurus
const baseDino = `
          ⢠⣤⣤⣤⣤⣤     
          ⣿⣏⣹⣿⣿⣿⡇    
          ⣿⣿⣿⣏⣉⡉⠁    
   ⢰⣆  ⢀⣠⣷⣿⣿⣏⣉⠉⠁     
   ⢸⣿⣦⣼⣿⣿⣿⣿⣿⡏⠛       
   ⠈⠻⢿⣿⣿⣿⣿⣿⡿⠁        
⠶⠶⠶⠶⠶⠈⢻⣿⢿⢿⣿⠁⠶⠶⠶⠶⠶⠶⠶⠶⠶
⣤⣤⠛⠃⢠⡄⢸⣯  ⣧⡄⠰⠶ ⢠⣤ ⠛  
TOOLS PREMIUM WILZU AKSES [ / ]
╰━━( developer wilzu code ) 
   ╰━━━━( Type Node Js) 
     ╰━━━━( Premium Fitur ) 
`;
function shiftDino(offset) { return baseDino.split('\n').map(l => ' '.repeat(offset) + l).join('\n'); }
const dinoFrames = [shiftDino(0), shiftDino(6), shiftDino(12), shiftDino(6), shiftDino(0)];
let dinoFrameIndex = 0;

// ========== SUB-MENU ALIGHT MOTION (untuk owner) ==========
async function subMenuAM() {
  while (true) {
    console.clear();
    console.log(`${hijau}🌟 FITUR ALIGHT MOTION (Owner) 🌟${reset}`);
    console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[ • ] 1. Kirim email verifikasi');
    console.log('[ • ] 2. Verifikasi akun (dengan link)');
    console.log('[ • ] 3. Kembali');
    console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const sub = await ask('Pilih [1-3]: ');
    if (sub === '3') break;
    if (sub === '1') {
      const email = await ask('\nEmail target: ');
      if (email && email.includes('@')) await sendVerificationEmail(email);
      else console.log('❌ Email tidak valid');
      await ask('\nTekan Enter...');
    } else if (sub === '2') {
      const vEmail = await ask('\nEmail yang didaftarkan: ');
      if (!vEmail.includes('@')) console.log('❌ Email tidak valid');
      else {
        console.log('\n📎 Paste link verifikasi:');
        const link = await ask('Link: ');
        if (link && link.startsWith('http')) await verifyAccount(vEmail, link);
        else console.log('❌ Link tidak valid');
      }
      await ask('\nTekan Enter...');
    } else {
      console.log('❌ Pilihan salah');
      await ask('\nTekan Enter...');
    }
  }
}


async function ownerMenu() {
  while (true) {
    console.clear();
    console.log('╔══╗───╔╦═╗╔╦═╦╦╦╦═╗──');
    console.log('╚╗╔╬═╦═╣║═╣║║║║╠╣╠═╠╦╗');
    console.log('─║║║╬║╬║╠═║║║║║║║║═╣║║');
    console.log('─╚╝╚═╩═╩╩═╝╚═╩═╩╩╩═╩═╝');
    console.log(`${hijau}MENU OWNER (UNLIMITED)${reset}`);
    console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[ O ] 1. Tambah User Baru');
    console.log('[ O ] 2. Hapus User');
    console.log('[ O ] 3. Lihat Semua User & Sisa Hari');
    console.log('[ O ] 4. Reset Password User');
    console.log('[ O ] 5. Extend Masa Aktif User');
    console.log('[ O ] 6. Fitur Alight Motion (Kirim/Verifikasi)');
    console.log('[ O ] 7. Logout');
    console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(dinoFrames[dinoFrameIndex % dinoFrames.length]);
    dinoFrameIndex++;
    const pilih = await ask('\nPilih menu [1-7]: ');
    if (pilih === '7') break;

    let users = await bacaData();
    if (!Array.isArray(users)) users = [];

    if (pilih === '1') {
      const username = await ask('Username baru: ');
      if (users.find(u => u.username === username)) {
        console.log(`${merah}Username sudah ada!${reset}`);
        await ask('Tekan Enter...'); continue;
      }
      const password = await ask('Password (kosong auto generate): ') || Math.random().toString(36).slice(2, 8);
      console.log(`${kuning}Pilih masa expired:${reset}`);
      console.log('1. 7 hari\n2. 1 bulan\n3. 2 bulan\n4. 5 bulan\n5. 8 bulan\n6. 1 tahun');
      const expPilih = await ask('Pilihan [1-6]: ');
      const hariMap = {1:7,2:30,3:60,4:150,5:240,6:365};
      const hari = hariMap[expPilih] || 7;
      const expired_at = tambahHari(new Date(), hari);
      users.push({
        username, password, role: 'user',
        created_at: new Date().toISOString(),
        expired_at
      });
      await tulisData(users);
      console.log(`${hijau}✅ User ${username} ditambahkan! Password: ${password}, Expired: ${new Date(expired_at).toLocaleDateString()}${reset}`);
      await ask('Tekan Enter...');
    }
    else if (pilih === '2') {
      const userList = users.filter(u => u.role !== 'owner');
      if (!userList.length) { console.log('Tidak ada user biasa.'); await ask('Tekan Enter...'); continue; }
      userList.forEach((u, i) => console.log(`${i+1}. ${u.username} (exp: ${new Date(u.expired_at).toLocaleDateString()})`));
      const idx = await ask('Nomor user yang dihapus: ');
      const target = userList[parseInt(idx)-1];
      if (!target) { console.log('Nomor salah'); await ask('Tekan Enter...'); continue; }
      users = users.filter(u => u.username !== target.username);
      await tulisData(users);
      console.log(`${hijau}User ${target.username} dihapus.${reset}`);
      await ask('Tekan Enter...');
    }
    else if (pilih === '3') {
      console.clear();
      console.log('📋 DAFTAR SEMUA USER:\n');
      for (const u of users) {
        const sisa = u.role === 'owner' ? 'UNLIMITED' : `${sisaHari(u.expired_at)} hari`;
        const expiredDate = u.role === 'owner' ? 'Unlimited' : new Date(u.expired_at).toLocaleString();
        console.log(`${u.role === 'owner' ? '👑' : '👤'} ${u.username} | Expired: ${expiredDate} | Sisa: ${sisa}`);
      }
      await ask('\nTekan Enter...');
    }
    else if (pilih === '4') {
      const userList = users.filter(u => u.role !== 'owner');
      if (!userList.length) { console.log('Tidak ada user.'); await ask('Tekan Enter...'); continue; }
      userList.forEach((u, i) => console.log(`${i+1}. ${u.username}`));
      const idx = await ask('Nomor user yang akan direset password: ');
      const target = userList[parseInt(idx)-1];
      if (!target) { console.log('Nomor salah'); continue; }
      const newPass = await ask('Password baru (kosong auto generate): ') || Math.random().toString(36).slice(2, 8);
      target.password = newPass;
      await tulisData(users);
      console.log(`${hijau}Password user ${target.username} direset menjadi: ${newPass}${reset}`);
      await ask('Tekan Enter...');
    }
    else if (pilih === '5') {
      const userList = users.filter(u => u.role !== 'owner');
      if (!userList.length) { console.log('Tidak ada user.'); await ask('Tekan Enter...'); continue; }
      userList.forEach((u, i) => console.log(`${i+1}. ${u.username} (exp: ${new Date(u.expired_at).toLocaleDateString()})`));
      const idx = await ask('Nomor user yang akan diperpanjang: ');
      const target = userList[parseInt(idx)-1];
      if (!target) { console.log('Nomor salah'); continue; }
      console.log(`${kuning}Pilih tambahan waktu:${reset}`);
      console.log('1. +7 hari\n2. +1 bulan\n3. +2 bulan\n4. +5 bulan\n5. +8 bulan\n6. +1 tahun');
      const expPilih = await ask('Pilihan [1-6]: ');
      const hariMap = {1:7,2:30,3:60,4:150,5:240,6:365};
      const hari = hariMap[expPilih] || 7;
      const newExp = tambahHari(new Date(target.expired_at), hari);
      target.expired_at = newExp;
      await tulisData(users);
      console.log(`${hijau}Masa aktif ${target.username} diperpanjang hingga ${new Date(newExp).toLocaleDateString()}${reset}`);
      await ask('Tekan Enter...');
    }
    else if (pilih === '6') {
      await subMenuAM();
    }
  }
}

async function userMenu(username) {
  while (true) {
    console.clear();
    console.log('╔══╗───╔╦═╗╔╦═╦╦╦╦═╗──');
    console.log('╚╗╔╬═╦═╣║═╣║║║║╠╣╠═╠╦╗');
    console.log('─║║║╬║╬║╠═║║║║║║║║═╣║║');
    console.log('─╚╝╚═╩═╩╩═╝╚═╩═╩╩╩═╩═╝');
    console.log(`${hijau}👤 USER: ${username}${reset}`);
    console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[ • ] 1. Kirim email verifikasi');
    console.log('[ • ] 2. Verifikasi akun (dengan link)');
    console.log('[ • ] 3. Cek IP & Dashboard');
    console.log('[ • ] 4. Credit');
    console.log('[ • ] 5. Logout');
    console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(dinoFrames[dinoFrameIndex % dinoFrames.length]);
    dinoFrameIndex++;
    const choice = await ask('\nPilih menu [1-5]: ');
    if (choice === '5') break;
    switch (choice) {
      case '1':
        const email = await ask('\nEmail target: ');
        if (email && email.includes('@')) await sendVerificationEmail(email);
        else console.log('❌ Email tidak valid');
        break;
      case '2':
        const vEmail = await ask('\nEmail yang didaftarkan: ');
        if (!vEmail.includes('@')) { console.log('❌ Email tidak valid'); break; }
        console.log('\n📎 Paste link verifikasi:');
        const link = await ask('Link: ');
        if (link && link.startsWith('http')) await verifyAccount(vEmail, link);
        else console.log('❌ Link tidak valid');
        break;
      case '3': await showDashboard(); break;
      case '4':
        console.clear();
        console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
        console.log('┃  Credit : @wilzu (modifikasi)            ┃');
        console.log('┃  API    : Lisensi Premium                ┃');
        console.log('┃  Lisensi: Lase Premium                   ┃');
        console.log('┃  Instagram : willy_double_elnya          ┃');
        console.log('┃  WhatsApp : +6285863131467               ┃');
        console.log('┃  Telegram :  @xxzeu                      ┃');
        console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
        break;
      default: console.log('❌ Pilihan salah');
    }
    console.log('\nTekan Enter untuk kembali ke menu...');
    await ask('');
  }
}

async function animasiWelcome() {
  console.clear();
  const text = " WELCOME TO ALIGHT MOTION TOOLS ";
  const border = "═".repeat(text.length);
  console.log(`┏${border}┓`);
  console.log(`┃${text}┃`);
  console.log(`┗${border}┛`);
  console.log("\nMemuat sistem...");
  await loadingBar(15, '𓃻 Loading tools');
  console.log('𐂃 Tools siap!');
  await new Promise(r => setTimeout(r, 500));
}

(async () => {
  try {
    require.resolve('axios');
  } catch {
    console.log('❌ Modul axios belum terinstall. Jalankan: npm install axios');
    process.exit(1);
  }
  let users = await bacaData();
  if (!Array.isArray(users) || users.length === 0) {
    console.log(`${kuning}⚠️  Database kosong. Membuat akun owner default...${reset}`);
    const ownerDefault = {
      username: 'wilzu',
      password: '**************',
      role: 'owner',
      created_at: new Date().toISOString(),
      expired_at: new Date('2099-12-31').toISOString()
    };
    await tulisData([ownerDefault]);
    console.log(`${hijau}✅ Akun owner dibuat: username = admin, password = admin123${reset}`);
    await ask('Tekan Enter untuk login...');
  }
  await animasiWelcome();
  await showDashboard();
  console.log('\nTekan Enter untuk login...');
  await ask('');
  while (true) {
    const user = await login();
    
