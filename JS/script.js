//CONSTANTES
const fichasList = document.getElementById('fichas-list');
const tabs = document.querySelectorAll('.sidebar nav ul li');
const sections = document.querySelectorAll('.tab');

const npcsList = document.getElementById('npcs-list');

const vidaContainer = document.getElementById('vida-container');

const iniciativaContainer = document.getElementById('iniciativa-container');

//Rolar dados Rola
const rolarBtn = document.getElementById('rolar-dado');
const resDado = document.getElementById('resultado-dado');
const histDados = document.getElementById('historico-dados');

//Notas mestre
const notas = document.getElementById('notas-mestre');

//Missões e quests
const musicasEmbedDiv = document.getElementById('musicas-embed');
const missoesList = document.getElementById('missoes-list');

const statElements = {
  fichas: document.querySelector('[data-stat="fichas"] .stat-value'),
  npcs: document.querySelector('[data-stat="npcs"] .stat-value'),
  iniciativa: document.querySelector('[data-stat="iniciativa"] .stat-value'),
  vida: document.querySelector('[data-stat="vida"] .stat-value'),
  missoes: document.querySelector('[data-stat="missoes"] .stat-value')
};

const emptyMessages = {
  fichas: document.getElementById('fichas-empty'),
  npcs: document.getElementById('npcs-empty'),
  missoes: document.getElementById('missoes-empty')
};

const sessionTimerEl = document.getElementById('session-timer');
const timerStartBtn = document.getElementById('timer-start');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResetBtn = document.getElementById('timer-reset');

let iniciativa = JSON.parse(localStorage.getItem('iniciativa')) || [];
let vidaPersonagens = JSON.parse(localStorage.getItem('vidaPersonagens')) || [];
let historicoDados = JSON.parse(localStorage.getItem('historicoDados')) || [];
let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
let elapsedSeconds = Number(localStorage.getItem('tempoSessao')) || 0;
let timerInterval = null;
let timerStartReference = null;

function atualizarEmptyStates() {
  if (emptyMessages.fichas) {
    emptyMessages.fichas.style.display = fichasList.children.length ? 'none' : 'block';
  }
  if (emptyMessages.npcs) {
    emptyMessages.npcs.style.display = npcsList.children.length ? 'none' : 'block';
  }
  if (emptyMessages.missoes) {
    emptyMessages.missoes.style.display = missoesList.children.length ? 'none' : 'block';
  }
}

function atualizarResumo() {
  if (statElements.fichas) {
    statElements.fichas.textContent = fichasList.querySelectorAll('.ficha-card').length;
  }
  if (statElements.npcs) {
    statElements.npcs.textContent = npcsList.querySelectorAll('.npc-card').length;
  }
  if (statElements.iniciativa) {
    statElements.iniciativa.textContent = Array.isArray(iniciativa) ? iniciativa.length : 0;
  }
  if (statElements.vida) {
    statElements.vida.textContent = Array.isArray(vidaPersonagens) ? vidaPersonagens.length : 0;
  }
  if (statElements.missoes) {
    statElements.missoes.textContent = missoesList.querySelectorAll('.missao-card').length;
  }
}

function atualizarTimerDisplay() {
  if (!sessionTimerEl) {
    return;
  }
  const horas = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
  const minutos = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
  const segundos = String(elapsedSeconds % 60).padStart(2, '0');
  sessionTimerEl.textContent = `${horas}:${minutos}:${segundos}`;
}

function atualizarControlesTimer() {
  if (!timerStartBtn || !timerPauseBtn || !timerResetBtn) {
    return;
  }
  timerStartBtn.disabled = Boolean(timerInterval);
  timerPauseBtn.disabled = !timerInterval;
  timerResetBtn.disabled = !elapsedSeconds && !timerInterval;
}

function iniciarTimer(storedStart = null) {
  if (timerInterval || !sessionTimerEl) {
    return;
  }
  if (storedStart !== null && !Number.isNaN(storedStart)) {
    timerStartReference = storedStart;
  } else {
    timerStartReference = Date.now() - (elapsedSeconds * 1000);
  }
  const atualizar = () => {
    elapsedSeconds = Math.max(0, Math.floor((Date.now() - timerStartReference) / 1000));
    atualizarTimerDisplay();
    localStorage.setItem('tempoSessao', elapsedSeconds);
  };
  atualizar();
  timerInterval = setInterval(atualizar, 1000);
  localStorage.setItem('timerStatus', 'running');
  localStorage.setItem('timerStart', String(timerStartReference));
  atualizarControlesTimer();
}

function pausarTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerStartReference = null;
  localStorage.setItem('tempoSessao', elapsedSeconds);
  localStorage.setItem('timerStatus', 'paused');
  localStorage.removeItem('timerStart');
  atualizarControlesTimer();
}

function resetarTimer() {
  pausarTimer();
  elapsedSeconds = 0;
  atualizarTimerDisplay();
  localStorage.removeItem('tempoSessao');
  localStorage.removeItem('timerStatus');
  atualizarControlesTimer();
}

//Nomes Aleatórios
const nomes = [
  "Elowen", "Tharivol", "Merla", "Korrin", "Barundar", "Lia", "Bryn", "Seraphine", "Grim", "Talon", "Syllin", "Durnan", "Yagra", "Fenthwick", "Jasper", "Nim", "Tika", "Raistlin", "Havard", "Anwyn", "Finn", "Isolde", "Leoric"
];

//Ficha buxa >>>>>>>>>>>>>>>>>>>>>>>>>>>
function addFichaCard(ficha) {
  const div = document.createElement('div');
  div.className = 'ficha-card';
  div.innerHTML = `<button class="remove" title="Remover">&times;</button>
    <b>${ficha.nome}</b> <br>
    <span>Classe: ${ficha.classe || '-'}</span> <br>
    <span>Nível: ${ficha.nivel || '-'}</span> <br>
    <span>HP: ${ficha.hp || '-'}</span> <br>
    <small>${ficha.detalhes || ''}</small>`;
  div.querySelector('.remove').onclick = () => {
    div.remove();
    salvarFichas();
  };
  fichasList.appendChild(div);
  atualizarEmptyStates();
}

function salvarFichas() {
  const fichas = [];
  fichasList.querySelectorAll('.ficha-card').forEach(card => {
    fichas.push({
      nome: card.querySelector('b').innerText,
      classe: card.querySelectorAll('span')[0].innerText.replace('Classe: ',''),
      nivel: card.querySelectorAll('span')[1].innerText.replace('Nível: ',''),
      hp: card.querySelectorAll('span')[2].innerText.replace('HP: ',''),
      detalhes: card.querySelector('small').innerText
    });
  });
  localStorage.setItem('fichas', JSON.stringify(fichas));
  atualizarResumo();
  atualizarEmptyStates();
}
function carregarFichas() {
  const arr = JSON.parse(localStorage.getItem('fichas')) || [];
  arr.forEach(addFichaCard);
  atualizarResumo();
  atualizarEmptyStates();
}
carregarFichas();

//NPCs Pikas pilas >>>>>>>>>>>>>>>>>>>>>>>>>>>>
function addNpcCard(npc) {
  const div = document.createElement('div');
  div.className = 'npc-card';
  div.innerHTML = `<button class="remove" title="Remover">&times;</button>
    <b>${npc.nome}</b><br>
    <span>Tipo: ${npc.tipo || '-'}</span><br>
    <small>${npc.detalhes || ''}</small>`;
  div.querySelector('.remove').onclick = () => {
    div.remove();
    salvarNpcs();
  };
  npcsList.appendChild(div);
  atualizarEmptyStates();
}
function salvarNpcs() {
  const npcs = [];
  npcsList.querySelectorAll('.npc-card').forEach(card => {
    npcs.push({
      nome: card.querySelector('b').innerText,
      tipo: card.querySelector('span').innerText.replace('Tipo: ',''),
      detalhes: card.querySelector('small').innerText
    });
  });
  localStorage.setItem('npcs', JSON.stringify(npcs));
  atualizarResumo();
  atualizarEmptyStates();
}
function carregarNpcs() {
  const arr = JSON.parse(localStorage.getItem('npcs')) || [];
  arr.forEach(addNpcCard);
  atualizarResumo();
  atualizarEmptyStates();
}
carregarNpcs();

// Registro de ordem de iniciativa>>>>>>>>>>>>>>>>>>>>>>>>
function renderIniciativa() {
  iniciativaContainer.innerHTML = '';
  if (iniciativa.length === 0) {
    iniciativaContainer.innerHTML = '<p class="empty-state">Nenhum participante registrado ainda.</p>';
    atualizarResumo();
    return;
  }
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Nome</th><th>Iniciativa</th><th>Remover</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  iniciativa.sort((a,b) => b.valor - a.valor);
  iniciativa.forEach((item, idx) => {
    const row = tbody.insertRow();
    row.innerHTML = `<td>${item.nome}</td>
      <td>${item.valor}</td>
      <td><button class="remove" data-idx="${idx}">&times;</button></td>`;
  });
  table.appendChild(tbody);
  iniciativaContainer.appendChild(table);
  table.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => {
      iniciativa.splice(btn.dataset.idx,1);
      salvarIniciativa();
      renderIniciativa();
    };
  });
  atualizarResumo();
}

function salvarIniciativa() {
  localStorage.setItem('iniciativa', JSON.stringify(iniciativa));
  atualizarResumo();
}
renderIniciativa();


// Controle de Pontos de Vida e Condições>>>>>>>>>>>>>>>>>>>>>>>>
function renderVida() {
  vidaContainer.innerHTML = '';

  const actions = document.createElement('div');
  actions.className = 'vida-actions';

  const addButton = document.createElement('button');
  addButton.id = 'adicionar-vida';
  addButton.textContent = 'Adicionar Personagem';
  addButton.onclick = () => {
    const nome = prompt('Nome do personagem:');
    if (!nome) {
      return;
    }
    const hpInput = prompt('HP atual:');
    const hp = parseInt(hpInput, 10);
    if (Number.isNaN(hp)) {
      alert('Informe um valor de HP válido.');
      return;
    }
    vidaPersonagens.push({ nome, hp, condicoes: '' });
    salvarVida();
    renderVida();
  };

  actions.appendChild(addButton);
  vidaContainer.appendChild(actions);

  if (vidaPersonagens.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum personagem monitorado. Clique em "Adicionar Personagem".';
    vidaContainer.appendChild(empty);
    atualizarResumo();
    return;
  }

  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'vida-grid';

  vidaPersonagens.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'ficha-card';
    card.innerHTML = `<b>${p.nome}</b> <br>
      <span>HP: <input type="number" value="${p.hp}" min="0" style="width:80px;"></span><br>
      <span>Condições: <input type="text" value="${p.condicoes || ''}" placeholder="Ex: Envenenado"></span>`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remover';
    removeBtn.onclick = () => {
      vidaPersonagens.splice(idx, 1);
      salvarVida();
      renderVida();
    };
    card.appendChild(removeBtn);

    const hpInput = card.querySelector('input[type="number"]');
    hpInput.addEventListener('change', (event) => {
      const value = parseInt(event.target.value, 10);
      vidaPersonagens[idx].hp = Number.isNaN(value) ? 0 : value;
      salvarVida();
    });

    const condInput = card.querySelector('input[type="text"]');
    condInput.addEventListener('change', (event) => {
      vidaPersonagens[idx].condicoes = event.target.value;
      salvarVida();
    });

    cardsWrapper.appendChild(card);
  });

  vidaContainer.appendChild(cardsWrapper);
  atualizarResumo();
}
renderVida();

function salvarVida() {
  localStorage.setItem('vidaPersonagens', JSON.stringify(vidaPersonagens));
  atualizarResumo();
}
// Rolador de Dados rola>>>>>>>>>>>>>>>>>>>>>
function renderHistoricoDados() {
  histDados.innerHTML = historicoDados.slice(-10).reverse().map(e=>e).join('<br>');
}
renderHistoricoDados();


//Bloco de notas >>>>>>>>>>>>>>>>>
notas.value = localStorage.getItem('notasMestre') || '';
notas.oninput = () => {
  localStorage.setItem('notasMestre', notas.value);
};


//Musicas >>>>>>>>>>>>>>>>>>>>
function addMusicaEmbed(url) {
  let embedCode = '';
  if(url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if(url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if(url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    if(videoId) {
      embedCode = `<iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    }
  } else if(url.includes('spotify.com/track/')) {
    let trackId = url.split('track/')[1].split('?')[0];
    embedCode = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" width="100%" height="80" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  } else if(url.includes('spotify.com/playlist/')) {
    let playlistId = url.split('playlist/')[1].split('?')[0];
    embedCode = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" width="100%" height="80" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  }
  if(embedCode) {
    musicas.push(url);
    renderMusicas();
  } else {
    alert('Link inválido ou não suportado.');
  }
}

function renderMusicas() {
  musicasEmbedDiv.innerHTML = '';
  musicas.forEach((url, idx) => {
    let embedCode = '';
    if(url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if(url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if(url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      if(videoId) {
        embedCode = `<iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
      }
    } else if(url.includes('spotify.com/track/')) {
      let trackId = url.split('track/')[1].split('?')[0];
      embedCode = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" width="100%" height="80" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    } else if(url.includes('spotify.com/playlist/')) {
      let playlistId = url.split('playlist/')[1].split('?')[0];
      embedCode = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" width="100%" height="80" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    }
    const div = document.createElement('div');
    div.innerHTML = embedCode + `<button class="remove" title="Remover" data-idx="${idx}">&times;</button>`;
    div.querySelector('.remove').onclick = () => {
      musicas.splice(idx,1);
      salvarMusicas();
      renderMusicas();
    };
    musicasEmbedDiv.appendChild(div);
  });
}
function salvarMusicas() {
  localStorage.setItem('musicas', JSON.stringify(musicas));
}
renderMusicas();


//Missões>>>>>>>>>>>>>>>>>>>
function salvarMissoes() {
  const missoes = [];
  missoesList.querySelectorAll('.missao-card').forEach(card => {
    missoes.push({
      titulo: card.querySelector('b').innerText,
      status: card.querySelector('span').innerText.replace('Status: ',''),
      descricao: card.querySelector('small').innerText
    });
  });
  localStorage.setItem('missoes', JSON.stringify(missoes));
  atualizarResumo();
  atualizarEmptyStates();
}
function carregarMissoes() {
  const arr = JSON.parse(localStorage.getItem('missoes')) || [];
  arr.forEach(addMissaoCard);
  atualizarResumo();
  atualizarEmptyStates();
}
carregarMissoes();

if (timerStartBtn) {
  timerStartBtn.addEventListener('click', () => iniciarTimer());
}
if (timerPauseBtn) {
  timerPauseBtn.addEventListener('click', () => pausarTimer());
}
if (timerResetBtn) {
  timerResetBtn.addEventListener('click', () => resetarTimer());
}

atualizarTimerDisplay();
const storedTimerStatus = localStorage.getItem('timerStatus');
const storedTimerStart = parseInt(localStorage.getItem('timerStart'), 10);
if (storedTimerStatus === 'running' && !Number.isNaN(storedTimerStart)) {
  iniciarTimer(storedTimerStart);
} else {
  atualizarControlesTimer();
}

atualizarEmptyStates();
atualizarResumo();

function addMissaoCard(missao) {
  const div = document.createElement('div');
  div.className = 'missao-card';
  div.innerHTML = `<button class="remove" title="Remover">&times;</button>
    <b>${missao.titulo}</b><br>
    <span>Status: ${missao.status || 'ativa'}</span><br>
    <small>${missao.descricao || ''}</small>`;
  div.querySelector('.remove').onclick = () => {
    div.remove();
    salvarMissoes();
  };
  missoesList.appendChild(div);
  atualizarEmptyStates();
}

/*
function saveOnCard({title, fields})
{
  const modalBg = document.getElementById('modal-bg');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('modal-form');
  modalTitle.textContent = title;
  modalForm.innerHTML = '';

  fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;
    const input = field.type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
    input.type = field.type || 'text';
    input.name = field.name;
    input.required = field.required || false;
    if (field.type !== 'textarea') input.value = field.value || '';
    else input.textContent = field.value || '';
    modalForm.appendChild(label);
    modalForm.appendChild(input);
  });
}
*/
//Modal>>>>
/*
fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;
    const input = field.type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
    input.type = field.type || 'text';
    input.name = field.name;
    input.required = field.required || false;
    if (field.type !== 'textarea') input.value = field.value || '';
    else input.textContent = field.value || '';
    modalForm.appendChild(label);
    modalForm.appendChild(input);
  });

  */