/* ============================================================
   SPOTIFY ENGINE — INTERACTIVE DECONSTRUCTION
   All step logic, data, and interactive mechanics
   ============================================================ */

// ═══════════════════════════════════════════════════════════
// GLOBAL STATE & DATA
// ═══════════════════════════════════════════════════════════

const TOTAL_STEPS = 10;
let currentStep = 1;
let visitedSteps = new Set([1]);

// Song catalog with audio features and tags
const CATALOG = [
  { id: 1, name: "Midnight Rain", artist: "Taylor Swift", genre: "Pop", tempo: 0.55, energy: 0.45, valence: 0.30, dance: 0.60, acoustic: 0.25, tags: ["melancholic", "pop", "introspective", "rain"] },
  { id: 2, name: "Blinding Lights", artist: "The Weeknd", genre: "Synthpop", tempo: 0.75, energy: 0.80, valence: 0.75, dance: 0.85, acoustic: 0.05, tags: ["retro", "synth", "driving", "night", "energetic"] },
  { id: 3, name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", tempo: 0.55, energy: 0.70, valence: 0.45, dance: 0.30, acoustic: 0.30, tags: ["classic", "epic", "opera", "rock", "legendary"] },
  { id: 4, name: "Naina Da Kya Kasoor", artist: "Arijit Singh", genre: "Bollywood", tempo: 0.40, energy: 0.30, valence: 0.20, dance: 0.25, acoustic: 0.70, tags: ["sad", "bollywood", "melancholic", "soulful", "hindi"] },
  { id: 5, name: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip-Hop", tempo: 0.70, energy: 0.90, valence: 0.55, dance: 0.90, acoustic: 0.02, tags: ["aggressive", "hip-hop", "workout", "intense", "rap"] },
  { id: 6, name: "Weightless", artist: "Marconi Union", genre: "Ambient", tempo: 0.25, energy: 0.10, valence: 0.35, dance: 0.05, acoustic: 0.80, tags: ["calm", "ambient", "sleep", "meditation", "focus"] },
  { id: 7, name: "Agar Tum Saath Ho", artist: "AR Rahman", genre: "Bollywood", tempo: 0.45, energy: 0.40, valence: 0.25, dance: 0.30, acoustic: 0.60, tags: ["sad", "bollywood", "soulful", "hindi", "emotional"] },
  { id: 8, name: "Lose Yourself", artist: "Eminem", genre: "Hip-Hop", tempo: 0.72, energy: 0.92, valence: 0.50, dance: 0.75, acoustic: 0.03, tags: ["motivational", "rap", "intense", "workout", "aggressive"] },
  { id: 9, name: "Clair de Lune", artist: "Debussy", genre: "Classical", tempo: 0.30, energy: 0.15, valence: 0.55, dance: 0.08, acoustic: 0.95, tags: ["classical", "piano", "calm", "elegant", "night"] },
  { id: 10, name: "Levitating", artist: "Dua Lipa", genre: "Disco-Pop", tempo: 0.78, energy: 0.75, valence: 0.85, dance: 0.92, acoustic: 0.04, tags: ["disco", "dance", "fun", "party", "upbeat"] },
  { id: 11, name: "Kun Faya Kun", artist: "AR Rahman", genre: "Sufi", tempo: 0.35, energy: 0.35, valence: 0.60, dance: 0.20, acoustic: 0.75, tags: ["sufi", "spiritual", "peaceful", "devotional", "hindi"] },
  { id: 12, name: "Starboy", artist: "The Weeknd", genre: "Synthpop", tempo: 0.73, energy: 0.65, valence: 0.55, dance: 0.70, acoustic: 0.08, tags: ["synth", "dark", "night", "electronic", "cool"] },
  { id: 13, name: "Someone Like You", artist: "Adele", genre: "Pop", tempo: 0.45, energy: 0.35, valence: 0.15, dance: 0.30, acoustic: 0.70, tags: ["sad", "piano", "heartbreak", "emotional", "rain"] },
  { id: 14, name: "Uptown Funk", artist: "Bruno Mars", genre: "Funk", tempo: 0.80, energy: 0.88, valence: 0.95, dance: 0.95, acoustic: 0.03, tags: ["fun", "party", "dance", "energetic", "groovy"] },
  { id: 15, name: "Tum Hi Ho", artist: "Arijit Singh", genre: "Bollywood", tempo: 0.50, energy: 0.45, valence: 0.30, dance: 0.35, acoustic: 0.65, tags: ["romantic", "bollywood", "hindi", "emotional", "soulful"] },
];

// Simulated users for collaborative filtering
const USERS = ["You", "User_A", "User_B", "User_C", "User_D"];
const SONGS_SHORT = CATALOG.slice(0, 8).map(s => s.name.split(' ').slice(0, 2).join(' '));

// User-Item matrix (initial state)
let userItemMatrix = [
  [4, 0, 3, 5, 0, 0, 4, 0],
  [0, 5, 0, 4, 3, 0, 0, 2],
  [3, 0, 4, 0, 0, 5, 3, 0],
  [0, 4, 0, 0, 5, 0, 0, 4],
  [5, 0, 0, 3, 0, 4, 0, 0],
];

// ═══════════════════════════════════════════════════════════
// STEP NAVIGATION
// ═══════════════════════════════════════════════════════════

function goToStep(n) {
  if (n < 1 || n > TOTAL_STEPS) return;
  currentStep = n;
  visitedSteps.add(n);

  // Show/hide steps
  document.querySelectorAll('.step-container').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.step) === n);
  });

  // Update progress
  document.getElementById('progress-fill').style.width = ((n / TOTAL_STEPS) * 100) + '%';
  document.getElementById('step-indicator').textContent = `STEP ${n} / ${TOTAL_STEPS}`;

  // Update buttons
  document.getElementById('btn-prev').disabled = n === 1;
  document.getElementById('btn-next').textContent = n === TOTAL_STEPS ? 'Finish ✓' : 'Next →';

  // Update dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 === n);
    dot.classList.toggle('visited', visitedSteps.has(i + 1) && i + 1 !== n);
  });

  // Scroll to top
  document.getElementById('main-content').scrollTop = 0;

  // Initialize step-specific content
  initStep(n);
}

function initStep(n) {
  switch (n) {
    case 2: renderUserItemMatrix(); break;
    case 3: updateMFCalculations(); renderPredictedMatrix(); renderEmbeddings(); break;
    case 4: initEmbeddingCanvas(); break;
    case 5: renderAudioSliders(); updateAudioMatches(); break;
    case 6: renderNLPTags(); updateNLPResults(''); break;
    case 7: updateFusion(); break;
    case 8: initSkipSimulator(); break;
    case 9: renderColdStartArtists(); break;
    case 10: break;
  }
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Create dots
  const dotsEl = document.getElementById('step-dots');
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('div');
    dot.className = 'step-dot' + (i === 1 ? ' active' : '');
    dot.addEventListener('click', () => goToStep(i));
    dotsEl.appendChild(dot);
  }

  // Nav buttons
  document.getElementById('btn-prev').addEventListener('click', () => goToStep(currentStep - 1));
  document.getElementById('btn-next').addEventListener('click', () => goToStep(currentStep + 1));

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToStep(currentStep + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToStep(currentStep - 1);
  });

  // Step 3: k-slider
  const kSlider = document.getElementById('k-slider');
  if (kSlider) {
    kSlider.addEventListener('input', () => {
      document.getElementById('k-value').textContent = kSlider.value;
      updateMFCalculations();
      renderEmbeddings();
      renderPredictedMatrix();
    });
  }

  // Step 7: fusion sliders
  ['w-collab', 'w-audio', 'w-nlp', 'w-diversity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateFusion);
  });

  // Step 6: NLP input
  const nlpInput = document.getElementById('nlp-input');
  if (nlpInput) nlpInput.addEventListener('input', () => updateNLPResults(nlpInput.value));

  // Step 10: A/B
  const abExplore = document.getElementById('ab-explore');
  const abWeeks = document.getElementById('ab-weeks');
  if (abExplore) abExplore.addEventListener('input', () => {
    document.getElementById('ab-explore-val').textContent = abExplore.value;
  });
  if (abWeeks) abWeeks.addEventListener('input', () => {
    document.getElementById('ab-weeks-val').textContent = abWeeks.value;
  });
  const abRun = document.getElementById('ab-run');
  if (abRun) abRun.addEventListener('click', runABTest);

  goToStep(1);
});


// ═══════════════════════════════════════════════════════════
// STEP 2: USER-ITEM MATRIX
// ═══════════════════════════════════════════════════════════

function renderUserItemMatrix() {
  const table = document.getElementById('userItemMatrix');
  if (!table) return;

  let html = '<thead><tr><th></th>';
  SONGS_SHORT.forEach(s => { html += `<th class="col-header">${s}</th>`; });
  html += '</tr></thead><tbody>';

  userItemMatrix.forEach((row, ui) => {
    html += `<tr><th class="row-header">${USERS[ui]}</th>`;
    row.forEach((val, si) => {
      const cls = `val-${val}`;
      html += `<td class="${cls}" data-u="${ui}" data-s="${si}" onclick="toggleMatrixCell(${ui},${si})">${val === 0 ? '—' : val.toFixed(1)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
  updateMatrixStats();
}

function toggleMatrixCell(u, s) {
  // Cycle: 0 → 1 → 2 → 3 → 4 → 5 → 0
  userItemMatrix[u][s] = (userItemMatrix[u][s] + 1) % 6;
  renderUserItemMatrix();
}

function updateMatrixStats() {
  let filled = 0, total = 0;
  userItemMatrix.forEach(row => row.forEach(v => { total++; if (v > 0) filled++; }));
  document.getElementById('mat-filled').textContent = filled;
  document.getElementById('mat-sparsity').textContent = (((total - filled) / total) * 100).toFixed(0) + '%';
}


// ═══════════════════════════════════════════════════════════
// STEP 3: MATRIX FACTORIZATION
// ═══════════════════════════════════════════════════════════

function updateMFCalculations() {
  const k = parseInt(document.getElementById('k-slider')?.value || 32);
  const users = 600_000_000;
  const items = 100_000_000;
  const fullSize = users * items;
  const mfSize = (users * k) + (items * k);

  document.getElementById('mf-params').textContent = formatBigNumber(mfSize);
  document.getElementById('mf-compression').textContent = (fullSize / mfSize).toExponential(1) + '×';

  // Simulated accuracy curve (log-like growth)
  const accuracy = Math.min(0.98, 0.5 + 0.4 * (1 - Math.exp(-k / 60)));
  document.getElementById('mf-accuracy').textContent = (accuracy * 100).toFixed(1) + '%';

  const trainHours = (k / 32 * 4).toFixed(1);
  document.getElementById('mf-traintime').textContent = trainHours + 'h';
}

function renderEmbeddings() {
  const k = Math.min(parseInt(document.getElementById('k-slider')?.value || 32), 6); // Show max 6 dims
  const showK = Math.min(k, 6);

  // Generate pseudo-random embeddings
  const userEmb = USERS.map((u, i) => {
    const emb = [];
    for (let d = 0; d < showK; d++) emb.push(((Math.sin((i + 1) * (d + 1) * 1.7) + 1) / 2).toFixed(2));
    return emb;
  });
  const itemEmb = SONGS_SHORT.map((s, i) => {
    const emb = [];
    for (let d = 0; d < showK; d++) emb.push(((Math.cos((i + 1) * (d + 1) * 2.3) + 1) / 2).toFixed(2));
    return emb;
  });

  // Render user embeddings
  let uhtml = '<table class="i-matrix"><thead><tr><th></th>';
  for (let d = 0; d < showK; d++) uhtml += `<th class="col-header">d${d + 1}</th>`;
  uhtml += '</tr></thead><tbody>';
  USERS.forEach((u, i) => {
    uhtml += `<tr><th class="row-header">${u}</th>`;
    userEmb[i].forEach(v => {
      const intensity = Math.floor(parseFloat(v) * 5);
      uhtml += `<td class="val-${Math.min(intensity, 5)}">${v}</td>`;
    });
    uhtml += '</tr>';
  });
  uhtml += '</tbody></table>';
  document.getElementById('user-embeddings').innerHTML = uhtml;

  // Render item embeddings
  let ihtml = '<table class="i-matrix"><thead><tr><th></th>';
  for (let d = 0; d < showK; d++) ihtml += `<th class="col-header">d${d + 1}</th>`;
  ihtml += '</tr></thead><tbody>';
  SONGS_SHORT.forEach((s, i) => {
    ihtml += `<tr><th class="row-header">${s}</th>`;
    itemEmb[i].forEach(v => {
      const intensity = Math.floor(parseFloat(v) * 5);
      ihtml += `<td class="val-${Math.min(intensity, 5)}">${v}</td>`;
    });
    ihtml += '</tr>';
  });
  ihtml += '</tbody></table>';
  document.getElementById('item-embeddings').innerHTML = ihtml;

  window._userEmb = userEmb;
  window._itemEmb = itemEmb;
}

function renderPredictedMatrix() {
  const table = document.getElementById('predictedMatrix');
  if (!table || !window._userEmb) return;

  let html = '<thead><tr><th></th>';
  SONGS_SHORT.forEach(s => { html += `<th class="col-header">${s}</th>`; });
  html += '</tr></thead><tbody>';

  USERS.forEach((u, ui) => {
    html += `<tr style="cursor:pointer" onclick="showMFRecs(${ui})"><th class="row-header">${u}</th>`;
    SONGS_SHORT.forEach((s, si) => {
      const observed = userItemMatrix[ui][si];
      if (observed > 0) {
        html += `<td class="val-${observed}">${observed.toFixed(1)}</td>`;
      } else {
        // Dot product prediction
        let score = 0;
        const uEmb = window._userEmb[ui];
        const iEmb = window._itemEmb[si];
        for (let d = 0; d < uEmb.length; d++) score += parseFloat(uEmb[d]) * parseFloat(iEmb[d]);
        score = Math.min(5, Math.max(0, score * 3)); // Scale
        html += `<td class="predicted">${score.toFixed(1)}</td>`;
      }
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
}

function showMFRecs(userIdx) {
  const container = document.getElementById('mf-recommendations');
  if (!container || !window._userEmb) return;

  const scores = [];
  SONGS_SHORT.forEach((s, si) => {
    if (userItemMatrix[userIdx][si] === 0) {
      let score = 0;
      const uEmb = window._userEmb[userIdx];
      const iEmb = window._itemEmb[si];
      for (let d = 0; d < uEmb.length; d++) score += parseFloat(uEmb[d]) * parseFloat(iEmb[d]);
      scores.push({ name: CATALOG[si].name, artist: CATALOG[si].artist, score: score * 3 });
    }
  });

  scores.sort((a, b) => b.score - a.score);

  let html = `<div style="font-family:var(--mono);font-size:12px;color:var(--green);margin-bottom:8px;">TOP RECOMMENDATIONS FOR ${USERS[userIdx]}</div><div class="song-list">`;
  scores.forEach((s, i) => {
    const cls = s.score > 3 ? 'high' : s.score > 1.5 ? 'mid' : 'low';
    html += `<div class="song-item"><div class="song-rank">${i + 1}</div><div class="song-name">${s.name}<span>${s.artist}</span></div><div class="song-score ${cls}">${s.score.toFixed(2)}</div></div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════
// STEP 4: EMBEDDING SPACE (2D CANVAS)
// ═══════════════════════════════════════════════════════════

let embedState = { userX: 350, userY: 210, dragging: false };

function initEmbeddingCanvas() {
  const canvas = document.getElementById('embedCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 700;
  canvas.height = 420;

  // Generate song positions (semi-random, clustered by genre)
  const songPositions = CATALOG.map((s, i) => ({
    x: 60 + s.dance * (canvas.width - 120) + (Math.sin(i * 3.7) * 40),
    y: 40 + (1 - s.energy) * (canvas.height - 80) + (Math.cos(i * 2.1) * 30),
    song: s
  }));
  window._songPos = songPositions;

  // Mouse events for dragging user dot
  canvas.addEventListener('mousedown', e => {
    const { offsetX: mx, offsetY: my } = e;
    if (Math.hypot(mx - embedState.userX, my - embedState.userY) < 20) {
      embedState.dragging = true;
    }
  });
  canvas.addEventListener('mousemove', e => {
    if (embedState.dragging) {
      embedState.userX = e.offsetX;
      embedState.userY = e.offsetY;
      drawEmbeddingSpace(canvas, ctx, songPositions);
    }
  });
  canvas.addEventListener('mouseup', () => { embedState.dragging = false; });
  canvas.addEventListener('mouseleave', () => { embedState.dragging = false; });

  drawEmbeddingSpace(canvas, ctx, songPositions);
}

function drawEmbeddingSpace(canvas, ctx, positions) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Axis labels
  ctx.fillStyle = '#444';
  ctx.font = '10px JetBrains Mono';
  ctx.fillText('← Low Danceability    High Danceability →', canvas.width / 2 - 120, canvas.height - 8);
  ctx.save();
  ctx.translate(12, canvas.height / 2 + 60);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('← Low Energy    High Energy →', 0, 0);
  ctx.restore();

  // Compute distances
  const distances = positions.map(p => ({
    ...p,
    dist: Math.hypot(p.x - embedState.userX, p.y - embedState.userY)
  }));
  distances.sort((a, b) => a.dist - b.dist);
  const nearest5 = distances.slice(0, 5);
  const nearestSet = new Set(nearest5.map(n => n.song.id));

  // Lines to nearest
  nearest5.forEach(n => {
    ctx.beginPath();
    ctx.moveTo(embedState.userX, embedState.userY);
    ctx.lineTo(n.x, n.y);
    ctx.strokeStyle = 'rgba(29,185,84,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Song dots
  const genreColors = {
    'Pop': '#e74c3c', 'Synthpop': '#9b59b6', 'Rock': '#e67e22', 'Bollywood': '#f39c12',
    'Hip-Hop': '#3498db', 'Ambient': '#1abc9c', 'Classical': '#ecf0f1', 'Disco-Pop': '#e91e63',
    'Sufi': '#f1c40f', 'Funk': '#ff6f00'
  };

  positions.forEach(p => {
    const isNear = nearestSet.has(p.song.id);
    const radius = isNear ? 8 : 5;
    const color = genreColors[p.song.genre] || '#888';

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (isNear) {
      ctx.strokeStyle = '#1DB954';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = isNear ? '#ddd' : '#666';
    ctx.font = `${isNear ? 11 : 9}px Sora`;
    ctx.fillText(p.song.name.split(' ').slice(0, 2).join(' '), p.x + radius + 4, p.y + 3);
  });

  // User dot (glow + circle)
  ctx.beginPath();
  ctx.arc(embedState.userX, embedState.userY, 18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(29,185,84,0.1)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(embedState.userX, embedState.userY, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#1DB954';
  ctx.fill();
  ctx.strokeStyle = '#1ed760';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 9px JetBrains Mono';
  ctx.fillText('YOU', embedState.userX - 11, embedState.userY + 3);

  // Update nearest list
  const nearEl = document.getElementById('embed-nearest');
  if (nearEl) {
    let html = '<div class="song-list">';
    nearest5.forEach((n, i) => {
      html += `<div class="song-item"><div class="song-rank">${i + 1}</div><div class="song-name">${n.song.name}<span>${n.song.artist} · ${n.song.genre}</span></div><div class="song-score high">${(100 - n.dist / 3).toFixed(0)}%</div></div>`;
    });
    html += '</div>';
    nearEl.innerHTML = html;
  }
}


// ═══════════════════════════════════════════════════════════
// STEP 5: AUDIO ANALYSIS
// ═══════════════════════════════════════════════════════════

const AUDIO_FEATURES = ['tempo', 'energy', 'valence', 'dance', 'acoustic'];
let audioTarget = { tempo: 0.6, energy: 0.5, valence: 0.5, dance: 0.5, acoustic: 0.5 };

function renderAudioSliders() {
  const container = document.getElementById('audio-sliders');
  if (!container) return;

  const labels = { tempo: 'Tempo', energy: 'Energy', valence: 'Valence (Happy↔Sad)', dance: 'Danceability', acoustic: 'Acousticness' };
  let html = '';
  AUDIO_FEATURES.forEach(f => {
    html += `<div class="slider-group">
      <div class="slider-label"><span class="slider-name">${labels[f]}</span><span class="slider-value" id="af-${f}-val">${audioTarget[f].toFixed(2)}</span></div>
      <input type="range" id="af-${f}" min="0" max="100" value="${audioTarget[f] * 100}" oninput="updateAudioTarget('${f}', this.value)">
    </div>`;
  });
  container.innerHTML = html;

  // Render catalog view
  renderAudioCatalog();
}

function updateAudioTarget(feature, val) {
  audioTarget[feature] = val / 100;
  document.getElementById(`af-${feature}-val`).textContent = (val / 100).toFixed(2);
  updateAudioMatches();
}

function updateAudioMatches() {
  const container = document.getElementById('audio-matches');
  if (!container) return;

  // Compute distance
  const scored = CATALOG.map(s => {
    let dist = 0;
    AUDIO_FEATURES.forEach(f => { dist += Math.pow(s[f] - audioTarget[f], 2); });
    return { ...s, dist: Math.sqrt(dist), similarity: Math.max(0, 1 - Math.sqrt(dist)) };
  });
  scored.sort((a, b) => a.dist - b.dist);

  let html = '';
  scored.slice(0, 8).forEach((s, i) => {
    const cls = s.similarity > 0.75 ? 'high' : s.similarity > 0.5 ? 'mid' : 'low';
    html += `<div class="song-item"><div class="song-rank">${i + 1}</div><div class="song-name">${s.name}<span>${s.artist} · ${s.genre}</span></div><div class="song-score ${cls}">${(s.similarity * 100).toFixed(0)}%</div></div>`;
  });
  container.innerHTML = html;
}

function renderAudioCatalog() {
  const container = document.getElementById('audio-catalog');
  if (!container) return;

  const colors = { tempo: 'green', energy: 'amber', valence: 'blue', dance: 'purple', acoustic: 'red' };
  let html = '';
  CATALOG.slice(0, 10).forEach(s => {
    html += `<div style="margin-bottom:16px;"><div style="font-family:var(--mono);font-size:12px;color:var(--text);margin-bottom:6px;">${s.name} <span style="color:var(--text-muted)">— ${s.artist}</span></div>`;
    AUDIO_FEATURES.forEach(f => {
      html += `<div class="feature-bar"><span class="feature-label">${f}</span><div class="feature-track"><div class="feature-fill ${colors[f]}" style="width:${s[f] * 100}%"></div></div><span class="feature-val">${s[f].toFixed(2)}</span></div>`;
    });
    html += '</div>';
  });
  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════
// STEP 6: NLP
// ═══════════════════════════════════════════════════════════

const NLP_TAGS = ['chill', 'workout', 'sad', 'party', 'focus', 'romantic', 'aggressive', 'night drive', 'rainy day', 'spiritual'];

function renderNLPTags() {
  const container = document.getElementById('nlp-tags');
  if (!container) return;
  container.innerHTML = NLP_TAGS.map(t =>
    `<button class="toggle-btn" onclick="this.classList.toggle('active');nlpTagClick()">${t}</button>`
  ).join('');
}

function nlpTagClick() {
  const active = Array.from(document.querySelectorAll('#nlp-tags .toggle-btn.active')).map(b => b.textContent);
  document.getElementById('nlp-input').value = active.join(', ');
  updateNLPResults(active.join(' '));
}

function updateNLPResults(query) {
  const container = document.getElementById('nlp-results');
  if (!container) return;

  if (!query.trim()) {
    container.innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--text-muted);padding:20px;text-align:center;">Select tags or type a description to find matching songs</div>';
    return;
  }

  const words = query.toLowerCase().split(/[\s,]+/).filter(w => w.length > 1);

  // Score songs by tag overlap
  const scored = CATALOG.map(s => {
    let matches = 0;
    words.forEach(w => {
      s.tags.forEach(t => {
        if (t.includes(w) || w.includes(t)) matches++;
      });
    });
    // Bonus for genre match
    words.forEach(w => { if (s.genre.toLowerCase().includes(w)) matches += 0.5; });
    return { ...s, score: matches, pct: Math.min(100, matches * 25) };
  });
  scored.sort((a, b) => b.score - a.score);

  let html = '';
  scored.filter(s => s.score > 0).forEach((s, i) => {
    const cls = s.pct > 70 ? 'high' : s.pct > 40 ? 'mid' : 'low';
    html += `<div class="song-item"><div class="song-rank">${i + 1}</div><div class="song-name">${s.name}<span>${s.artist} · Tags: ${s.tags.join(', ')}</span></div><div class="song-score ${cls}">${s.pct}%</div></div>`;
  });
  if (!html) html = '<div style="font-family:var(--mono);font-size:12px;color:var(--text-muted);padding:20px;text-align:center;">No strong matches — try different descriptors</div>';
  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════
// STEP 7: FUSION LAYER
// ═══════════════════════════════════════════════════════════

function updateFusion() {
  const wC = parseInt(document.getElementById('w-collab')?.value || 50);
  const wA = parseInt(document.getElementById('w-audio')?.value || 30);
  const wN = parseInt(document.getElementById('w-nlp')?.value || 20);
  const diversity = parseInt(document.getElementById('w-diversity')?.value || 70);

  const total = wC + wA + wN;
  const nC = total > 0 ? wC / total : 0.33;
  const nA = total > 0 ? wA / total : 0.33;
  const nN = total > 0 ? wN / total : 0.34;

  document.getElementById('w-collab-val').textContent = nC.toFixed(2);
  document.getElementById('w-audio-val').textContent = nA.toFixed(2);
  document.getElementById('w-nlp-val').textContent = nN.toFixed(2);
  document.getElementById('w-total').textContent = (nC + nA + nN).toFixed(2);
  document.getElementById('w-diversity-val').textContent = (diversity / 100).toFixed(2);

  // Fake fusion scores
  const scored = CATALOG.map(s => {
    const collabScore = (Math.sin(s.id * 1.3) + 1) / 2;
    const audioScore = 1 - Math.sqrt(
      Math.pow(s.tempo - 0.6, 2) + Math.pow(s.energy - 0.6, 2) + Math.pow(s.valence - 0.5, 2)
    );
    const nlpScore = s.tags.includes('energetic') || s.tags.includes('pop') || s.tags.includes('dance') ? 0.8 : 0.3;

    const rawScore = nC * collabScore + nA * audioScore + nN * nlpScore;
    return { ...s, collabScore, audioScore, nlpScore, rawScore };
  });

  // Apply MMR diversity re-ranking
  const diversityLambda = diversity / 100;
  const selected = [];
  const remaining = [...scored];

  while (selected.length < 10 && remaining.length > 0) {
    let bestIdx = 0;
    let bestMMR = -Infinity;

    remaining.forEach((s, i) => {
      let maxSim = 0;
      selected.forEach(sel => {
        const sim = 1 - Math.sqrt(
          Math.pow(s.tempo - sel.tempo, 2) + Math.pow(s.energy - sel.energy, 2)
        );
        maxSim = Math.max(maxSim, sim);
      });
      const mmr = diversityLambda * s.rawScore - (1 - diversityLambda) * maxSim;
      if (mmr > bestMMR) { bestMMR = mmr; bestIdx = i; }
    });

    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }

  // Render
  const container = document.getElementById('fusion-results');
  if (!container) return;
  let html = '';
  selected.forEach((s, i) => {
    const cls = s.rawScore > 0.6 ? 'high' : s.rawScore > 0.4 ? 'mid' : 'low';
    html += `<div class="song-item">
      <div class="song-rank">${i + 1}</div>
      <div class="song-name">${s.name}<span>${s.artist} · C:${s.collabScore.toFixed(2)} A:${s.audioScore.toFixed(2)} N:${s.nlpScore.toFixed(2)}</span></div>
      <div class="song-score ${cls}">${(s.rawScore * 100).toFixed(0)}</div>
    </div>`;
  });
  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════
// STEP 8: SKIP SIMULATOR
// ═══════════════════════════════════════════════════════════

let simState = {
  queue: [],
  current: 0,
  playing: false,
  elapsed: 0,
  duration: 210,
  interval: null,
  played: 0,
  skipped: 0,
  saved: 0,
  tasteProfile: { tempo: 0, energy: 0, valence: 0, dance: 0, acoustic: 0, count: 0 },
};

function initSkipSimulator() {
  // Shuffle catalog for queue
  simState.queue = [...CATALOG].sort(() => Math.random() - 0.5);
  simState.current = 0;
  simState.playing = false;
  simState.elapsed = 0;
  simState.played = 0;
  simState.skipped = 0;
  simState.saved = 0;
  simState.tasteProfile = { tempo: 0, energy: 0, valence: 0, dance: 0, acoustic: 0, count: 0 };
  clearInterval(simState.interval);

  loadSimSong();
  renderTasteProfile();
  updateSimStats();
  document.getElementById('sim-log').innerHTML = '<div><span class="ev-time">00:00</span> <span class="ev-type">[SYSTEM]</span> Session initialized. Queue loaded.</div>';

  document.getElementById('sim-play').onclick = toggleSimPlay;
  document.getElementById('sim-skip').onclick = simSkip;
  document.getElementById('sim-save').onclick = simSave;
}

function loadSimSong() {
  const song = simState.queue[simState.current % simState.queue.length];
  simState.elapsed = 0;
  simState.duration = 150 + Math.floor(Math.random() * 120); // 2:30 to 4:30
  document.getElementById('sim-song-title').textContent = song.name;
  document.getElementById('sim-song-artist').textContent = song.artist + ' · ' + song.genre;
  document.getElementById('sim-playback').style.width = '0%';
  document.getElementById('sim-time').textContent = '0:00';
  document.getElementById('sim-duration').textContent = formatTime(simState.duration);
}

function toggleSimPlay() {
  simState.playing = !simState.playing;
  document.getElementById('sim-play').textContent = simState.playing ? '⏸' : '▶';
  document.getElementById('sim-play').classList.toggle('active', simState.playing);

  if (simState.playing) {
    simState.interval = setInterval(() => {
      simState.elapsed += 1;
      const pct = (simState.elapsed / simState.duration) * 100;
      document.getElementById('sim-playback').style.width = pct + '%';
      document.getElementById('sim-time').textContent = formatTime(simState.elapsed);

      if (simState.elapsed >= simState.duration) {
        // Full play!
        simFullPlay();
      }
    }, 100); // 10x speed for demo
  } else {
    clearInterval(simState.interval);
  }
}

function simFullPlay() {
  clearInterval(simState.interval);
  simState.playing = false;
  document.getElementById('sim-play').textContent = '▶';
  document.getElementById('sim-play').classList.remove('active');

  simState.played++;
  const song = simState.queue[simState.current % simState.queue.length];
  addSimEvent('FULL_PLAY', song, '+3.5');
  updateTasteProfile(song, 3.5);
  simState.current++;
  loadSimSong();
  updateSimStats();
}

function simSkip() {
  clearInterval(simState.interval);
  simState.playing = false;
  document.getElementById('sim-play').textContent = '▶';
  document.getElementById('sim-play').classList.remove('active');

  simState.skipped++;
  const song = simState.queue[simState.current % simState.queue.length];
  const before30 = simState.elapsed < 30;
  const weight = before30 ? -4.0 : -1.5;
  addSimEvent(before30 ? 'SKIP_EARLY' : 'SKIP_LATE', song, weight.toFixed(1));
  updateTasteProfile(song, weight);
  simState.current++;
  loadSimSong();
  updateSimStats();
}

function simSave() {
  simState.saved++;
  const song = simState.queue[simState.current % simState.queue.length];
  addSimEvent('SAVE', song, '+5.0');
  updateTasteProfile(song, 5.0);
  updateSimStats();
}

function addSimEvent(type, song, weight) {
  const log = document.getElementById('sim-log');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const cls = type.includes('SKIP') ? 'ev-skip' : type === 'SAVE' ? 'ev-save' : 'ev-type';
  const entry = document.createElement('div');
  entry.innerHTML = `<span class="ev-time">${time}</span> <span class="${cls}">[${type}]</span> ${song.name} — ${song.artist} (weight: ${weight})`;
  log.prepend(entry);
}

function updateTasteProfile(song, weight) {
  const tp = simState.tasteProfile;
  const abw = Math.abs(weight);
  const sign = weight > 0 ? 1 : -1;
  AUDIO_FEATURES.forEach(f => {
    tp[f] = ((tp[f] * tp.count) + (song[f] * weight)) / (tp.count + abw);
  });
  tp.count += abw;
  renderTasteProfile();
}

function renderTasteProfile() {
  const container = document.getElementById('sim-taste-profile');
  if (!container) return;
  const tp = simState.tasteProfile;
  const colors = { tempo: 'green', energy: 'amber', valence: 'blue', dance: 'purple', acoustic: 'red' };
  let html = '';
  AUDIO_FEATURES.forEach(f => {
    const val = tp.count > 0 ? Math.max(0, Math.min(1, tp[f])) : 0;
    html += `<div class="feature-bar"><span class="feature-label">${f}</span><div class="feature-track"><div class="feature-fill ${colors[f]}" style="width:${val * 100}%"></div></div><span class="feature-val">${val.toFixed(2)}</span></div>`;
  });
  container.innerHTML = html;
}

function updateSimStats() {
  document.getElementById('sim-played').textContent = simState.played;
  document.getElementById('sim-skipped').textContent = simState.skipped;
  document.getElementById('sim-saved').textContent = simState.saved;
  const total = simState.played + simState.skipped;
  document.getElementById('sim-skip-rate').textContent = total > 0 ? (simState.skipped / total * 100).toFixed(0) + '%' : '0%';
}


// ═══════════════════════════════════════════════════════════
// STEP 9: COLD START
// ═══════════════════════════════════════════════════════════

const ARTISTS = [...new Set(CATALOG.map(s => s.artist))];
let selectedArtists = new Set();

function renderColdStartArtists() {
  const container = document.getElementById('coldstart-artists');
  if (!container) return;
  container.innerHTML = ARTISTS.map(a =>
    `<button class="toggle-btn" onclick="toggleColdStartArtist('${a}', this)">${a}</button>`
  ).join('');
  selectedArtists.clear();
  document.getElementById('coldstart-profile').innerHTML = '<div style="font-family:var(--mono);font-size:12px;color:var(--text-muted);padding:16px;text-align:center;">Select 3+ artists to bootstrap your taste profile</div>';
  document.getElementById('coldstart-recs').innerHTML = '';
}

function toggleColdStartArtist(artist, btn) {
  btn.classList.toggle('active');
  if (selectedArtists.has(artist)) selectedArtists.delete(artist);
  else selectedArtists.add(artist);

  if (selectedArtists.size >= 1) {
    // Build profile from selected artists' songs
    const songs = CATALOG.filter(s => selectedArtists.has(s.artist));
    const profile = { tempo: 0, energy: 0, valence: 0, dance: 0, acoustic: 0 };
    songs.forEach(s => {
      AUDIO_FEATURES.forEach(f => { profile[f] += s[f]; });
    });
    AUDIO_FEATURES.forEach(f => { profile[f] /= songs.length; });

    // Render profile
    const colors = { tempo: 'green', energy: 'amber', valence: 'blue', dance: 'purple', acoustic: 'red' };
    let phtml = '';
    AUDIO_FEATURES.forEach(f => {
      phtml += `<div class="feature-bar"><span class="feature-label">${f}</span><div class="feature-track"><div class="feature-fill ${colors[f]}" style="width:${profile[f] * 100}%"></div></div><span class="feature-val">${profile[f].toFixed(2)}</span></div>`;
    });
    document.getElementById('coldstart-profile').innerHTML = phtml;

    // Recommend songs NOT by selected artists
    const others = CATALOG.filter(s => !selectedArtists.has(s.artist));
    const scored = others.map(s => {
      let dist = 0;
      AUDIO_FEATURES.forEach(f => { dist += Math.pow(s[f] - profile[f], 2); });
      return { ...s, similarity: 1 - Math.sqrt(dist) };
    });
    scored.sort((a, b) => b.similarity - a.similarity);

    let rhtml = '';
    scored.slice(0, 8).forEach((s, i) => {
      const cls = s.similarity > 0.8 ? 'high' : s.similarity > 0.6 ? 'mid' : 'low';
      rhtml += `<div class="song-item"><div class="song-rank">${i + 1}</div><div class="song-name">${s.name}<span>${s.artist} · ${s.genre}</span></div><div class="song-score ${cls}">${(s.similarity * 100).toFixed(0)}%</div></div>`;
    });
    document.getElementById('coldstart-recs').innerHTML = rhtml;
  }
}


// ═══════════════════════════════════════════════════════════
// STEP 10: A/B TESTING
// ═══════════════════════════════════════════════════════════

function runABTest() {
  const exploreRate = parseInt(document.getElementById('ab-explore').value);
  const weeks = parseInt(document.getElementById('ab-weeks').value);

  // Control group (baseline)
  const ctrlSession = 32 + Math.random() * 4;
  const ctrlSkip = 22 + Math.random() * 3;
  const ctrlRetention = 68 + Math.random() * 4;
  const ctrlSaves = 4.2 + Math.random() * 1;

  // Treatment: more exploration = slightly lower short-term engagement, higher long-term
  const sessionDelta = -exploreRate * 0.15 + (weeks > 4 ? exploreRate * 0.05 : 0);
  const skipDelta = exploreRate * 0.12;
  const retentionDelta = exploreRate * 0.08 * Math.min(weeks / 4, 2);
  const savesDelta = exploreRate * 0.06 * Math.min(weeks / 3, 2.5);

  const treatSession = ctrlSession + sessionDelta;
  const treatSkip = ctrlSkip + skipDelta;
  const treatRetention = ctrlRetention + retentionDelta;
  const treatSaves = ctrlSaves + savesDelta;

  // Animate reveal
  const animate = (id, val, suffix = '') => {
    const el = document.getElementById(id);
    let current = 0;
    const step = val / 30;
    const intv = setInterval(() => {
      current += step;
      if (current >= val) { current = val; clearInterval(intv); }
      el.textContent = current.toFixed(1) + suffix;
    }, 30);
  };

  animate('ab-ctrl-session', ctrlSession, ' min');
  animate('ab-ctrl-skip', ctrlSkip, '%');
  animate('ab-ctrl-retention', ctrlRetention, '%');
  animate('ab-ctrl-saves', ctrlSaves, '');

  animate('ab-treat-session', treatSession, ' min');
  animate('ab-treat-skip', treatSkip, '%');
  animate('ab-treat-retention', treatRetention, '%');
  animate('ab-treat-saves', treatSaves, '');

  // Verdict
  setTimeout(() => {
    const verdict = document.getElementById('ab-verdict');
    verdict.style.display = 'block';

    const sessionWorse = treatSession < ctrlSession;
    const retentionBetter = treatRetention > ctrlRetention;
    const savesBetter = treatSaves > ctrlSaves;

    let html = '<div class="callout info">';
    if (retentionBetter && savesBetter) {
      html += `<strong style="color:var(--green);">✓ SHIP TREATMENT.</strong><br>`;
      html += `Short-term session length ${sessionWorse ? 'dipped by ' + Math.abs(treatSession - ctrlSession).toFixed(1) + ' min' : 'held steady'}, `;
      html += `but 30-day retention improved by <strong>${(treatRetention - ctrlRetention).toFixed(1)}%</strong> and saves/week increased by <strong>${(treatSaves - ctrlSaves).toFixed(1)}</strong>.<br>`;
      html += `<br>This is the classic exploration tradeoff: <strong>short-term engagement dips, but users discover music they love and stay longer.</strong>`;
    } else {
      html += `<strong style="color:var(--amber);">⚠ INCONCLUSIVE.</strong> Run for more weeks to see long-term effects.`;
    }
    html += '</div>';
    document.getElementById('ab-verdict-text').innerHTML = html;
  }, 1200);
}


// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

function formatBigNumber(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
