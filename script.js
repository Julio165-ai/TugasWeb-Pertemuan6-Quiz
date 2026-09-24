'use strict';

const CATEGORIES = {
  js:  { label: 'JavaScript', desc: 'Variabel, tipe data, array, fungsi' },
  dom: { label: 'DOM & Browser', desc: 'Elemen, event, penyimpanan, keamanan' },
  all: { label: 'Acak', desc: 'Campuran semua kategori' }
};

const QUESTIONS = [
  { cat: 'js', q: 'Keyword mana yang mendeklarasikan variabel yang tidak bisa di-assign ulang?', options: ['var', 'let', 'const', 'static'], answer: 2 },
  { cat: 'js', q: 'Apa hasil dari typeof null?', options: ['"null"', '"object"', '"undefined"', '"number"'], answer: 1 },
  { cat: 'js', q: 'Method array mana yang mengembalikan array baru hasil transformasi tiap elemen?', options: ['forEach', 'push', 'map', 'find'], answer: 2 },
  { cat: 'js', q: 'Apa hasil dari "5" === 5?', options: ['true', 'false', 'undefined', 'Error'], answer: 1 },
  { cat: 'js', q: 'Pada arrow function, nilai this diambil dari mana?', options: ['Dari scope luar (lexical)', 'Selalu window', 'Dari pemanggil fungsi', 'Selalu undefined'], answer: 0 },
  { cat: 'js', q: 'Fungsi apa yang mengubah string JSON menjadi objek JavaScript?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.object()', 'Object.from()'], answer: 1 },
  { cat: 'dom', q: 'Properti mana yang aman dari XSS untuk menyisipkan teks dari user?', options: ['innerHTML', 'outerHTML', 'textContent', 'insertAdjacentHTML'], answer: 2 },
  { cat: 'dom', q: 'Event delegation memanfaatkan mekanisme apa?', options: ['Event bubbling', 'Event capturing saja', 'Garbage collection', 'Hoisting'], answer: 0 },
  { cat: 'dom', q: 'Penyimpanan browser mana yang datanya tetap ada setelah tab ditutup?', options: ['Variabel global', 'sessionStorage', 'localStorage', 'Cache DOM'], answer: 2 },
  { cat: 'dom', q: 'Method untuk membuat elemen HTML baru lewat JavaScript adalah...', options: ['document.newElement()', 'document.createElement()', 'document.append()', 'document.makeNode()'], answer: 1 },
  { cat: 'dom', q: 'Cara menambahkan class CSS ke sebuah elemen?', options: ['el.class.push("a")', 'el.addClass("a")', 'el.classList.add("a")', 'el.style.class = "a"'], answer: 2 },
  { cat: 'dom', q: 'Properti mana pada event yang menunjuk elemen yang benar-benar diklik?', options: ['event.target', 'event.source', 'event.owner', 'event.node'], answer: 0 }
];

const TOTAL_QUESTIONS = 5;
const TIME_PER_QUESTION = 15;
const STORAGE_KEY = 'quizHighScore';
const THEME_KEY = 'quizTheme';


const $ = (sel) => document.querySelector(sel);
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


const memory = {};
const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return memory[key] ?? null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { memory[key] = value; }
  }
};

const loadBest = () => {
  try { return JSON.parse(store.get(STORAGE_KEY)); } catch { return null; }
};


const state = {
  category: 'all',
  questions: [],
  index: 0,
  correct: 0,
  answered: false,
  timeLeft: TIME_PER_QUESTION,
  timerId: null
};


const views = { start: $('#view-start'), quiz: $('#view-quiz'), result: $('#view-result') };

function showView(name) {
  Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
  views[name].classList.remove('enter');
  void views[name].offsetWidth; // restart animasi
  views[name].classList.add('enter');
}


function renderStart() {
  const cats = $('#cats');
  cats.replaceChildren();
  Object.entries(CATEGORIES).forEach(([key, info]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat';
    btn.dataset.action = 'start';
    btn.dataset.category = key;
    const title = document.createElement('strong');
    title.textContent = info.label;
    const desc = document.createElement('span');
    desc.textContent = info.desc;
    btn.append(title, desc);
    cats.append(btn);
  });

  const best = loadBest();
  $('#bestScore').textContent = best
    ? `Skor tertinggi: ${best.score}/100 (${best.correct}/${best.total} benar, ${best.label})`
    : 'Belum ada skor tertinggi. Selesaikan satu ronde untuk mencatatnya.';
  showView('start');
}

/* 
function startQuiz(category) {
  const pool = category === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.cat === category);
  state.category = category;
  state.questions = shuffle(pool).slice(0, TOTAL_QUESTIONS).map((item) => {
    // acak urutan pilihan, lalu cari posisi jawaban benar yang baru
    const correctText = item.options[item.answer];
    const options = shuffle(item.options);
    return { q: item.q, options, answer: options.indexOf(correctText) };
  });
  state.index = 0;
  state.correct = 0;
  showView('quiz');
  renderQuestion();
}

function renderQuestion() {
  const item = state.questions[state.index];
  state.answered = false;

  $('#counter').textContent = `Soal ${state.index + 1} dari ${state.questions.length}`;
  $('#progress').style.width = `${(state.index / state.questions.length) * 100}%`;
  $('#question').textContent = item.q;
  $('#feedback').textContent = '';
  $('#feedback').className = 'feedback';
  $('#nextBtn').hidden = true;

  const list = $('#options');
  list.replaceChildren();
  item.options.forEach((text, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.dataset.action = 'answer';
    btn.dataset.index = String(i);
    btn.textContent = text;
    li.append(btn);
    list.append(li);
  });

  const box = $('#questionBox');
  box.classList.remove('enter');
  void box.offsetWidth;
  box.classList.add('enter');

  startTimer();
}

function startTimer() {
  stopTimer();
  state.timeLeft = TIME_PER_QUESTION;
  const bar = $('#timeBar');
  bar.style.transition = 'none';
  bar.style.width = '100%';
  void bar.offsetWidth;
  bar.style.transition = '';
  updateTimerLabel();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerLabel();
    if (state.timeLeft <= 0) handleAnswer(-1); // waktu habis
  }, 1000);
  requestAnimationFrame(() => { bar.style.width = '0%'; });
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function updateTimerLabel() {
  const t = $('#timer');
  t.textContent = `${Math.max(state.timeLeft, 0)} detik`;
  t.classList.toggle('low', state.timeLeft <= 5);
}

function handleAnswer(chosen) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  // bekukan bar waktu di posisi saat ini
  const bar = $('#timeBar');
  bar.style.width = getComputedStyle(bar).width;

  const item = state.questions[state.index];
  const isCorrect = chosen === item.answer;
  if (isCorrect) state.correct += 1;

  document.querySelectorAll('#options .option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.answer) btn.classList.add('correct');
    else if (i === chosen) btn.classList.add('wrong');
  });

  const fb = $('#feedback');
  if (chosen === -1) { fb.textContent = 'Waktu habis. Jawaban benar ditandai hijau.'; fb.classList.add('bad'); }
  else if (isCorrect) { fb.textContent = 'Benar!'; fb.classList.add('ok'); }
  else { fb.textContent = 'Salah. Jawaban benar ditandai hijau.'; fb.classList.add('bad'); }

  const isLast = state.index === state.questions.length - 1;
  const next = $('#nextBtn');
  next.textContent = isLast ? 'Lihat hasil' : 'Soal berikutnya';
  next.hidden = false;
  next.focus();
}

function nextStep() {
  if (!state.answered) return;
  if (state.index < state.questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    showResult();
  }
}


function showResult() {
  stopTimer();
  const total = state.questions.length;
  const score = Math.round((state.correct / total) * 100);
  const best = loadBest();
  const isRecord = !best || score > best.score;

  if (isRecord) {
    store.set(STORAGE_KEY, JSON.stringify({
      score, correct: state.correct, total, label: CATEGORIES[state.category].label
    }));
  }

  let label = 'Coba lagi, kamu pasti bisa.';
  if (score >= 80) label = 'Kerja bagus!';
  else if (score >= 60) label = 'Lumayan, tinggal sedikit lagi.';

  $('#resultLabel').textContent = label;
  $('#finalScore').textContent = String(score);
  $('#resultDetail').textContent = `${state.correct} dari ${total} soal dijawab benar (${CATEGORIES[state.category].label}).`;
  $('#recordBadge').hidden = !isRecord;
  showView('result');
}


function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#themeBtn').textContent = theme === 'dark' ? 'Mode terang' : 'Mode gelap';
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  store.set(THEME_KEY, next);
}


$('#app').addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  switch (target.dataset.action) {
    case 'start':   startQuiz(target.dataset.category); break;
    case 'answer':  handleAnswer(Number(target.dataset.index)); break;
    case 'next':    nextStep(); break;
    case 'restart': startQuiz(state.category); break;
    case 'home':    renderStart(); break;
    case 'theme':   toggleTheme(); break;
  }
});

applyTheme(store.get(THEME_KEY) === 'dark' ? 'dark' : 'light');
renderStart();
