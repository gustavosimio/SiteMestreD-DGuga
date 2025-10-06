// Navegação por abas
const tabs = document.querySelectorAll('.sidebar nav ul li');
const sections = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.sidebar nav ul li.active').classList.remove('active');
    tab.classList.add('active');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Fichas de Personagem
const fichasList = document.getElementById('fichas-list');
document.getElementById('add-ficha').onclick = () => {
  const ficha = {
    nome: prompt("Nome do personagem:"),
    classe: prompt("Classe:"),
    nivel: prompt("Nível:"),
    hp: prompt("Pontos de Vida:"),
    detalhes: prompt("Anotações/Histórico:")
  };
  if(ficha.nome) {
    addFichaCard(ficha);
    salvarFichas();
  }
};
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
}
function carregarFichas() {
  const arr = JSON.parse(localStorage.getItem('fichas')) || [];
  arr.forEach(addFichaCard);
}
carregarFichas();

// Gerenciamento de NPCs
const npcsList = document.getElementById('npcs-list');
document.getElementById('add-npc').onclick = () => {
  const npc = {
    nome: prompt("Nome do NPC:"),
    tipo: prompt("Tipo (ex: vilão, comerciante, etc.):"),
    detalhes: prompt("Notas/Descrição:")
  };
  if(npc.nome) {
    addNpcCard(npc);
    salvarNpcs();
  }
};
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
}
function carregarNpcs() {
  const arr = JSON.parse(localStorage.getItem('npcs')) || [];
  arr.forEach(addNpcCard);
}
carregarNpcs();

// Registro de ordem de iniciativa
const iniciativaContainer = document.getElementById('iniciativa-container');
let iniciativa = JSON.parse(localStorage.getItem('iniciativa')) || [];
function renderIniciativa() {
  iniciativaContainer.innerHTML = '';
  if (iniciativa.length === 0) return;
  const table = document.createElement('table');
  table.style.width = '100%';
  table.innerHTML = `<tr>
    <th>Nome</th><th>Iniciativa</th><th>Remover</th></tr>`;
  iniciativa.sort((a,b) => b.valor - a.valor);
  iniciativa.forEach((item, idx) => {
    const row = table.insertRow();
    row.innerHTML = `<td>${item.nome}</td>
      <td>${item.valor}</td>
      <td><button class="remove" data-idx="${idx}">&times;</button></td>`;
  });
  iniciativaContainer.appendChild(table);
  table.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => {
      iniciativa.splice(btn.dataset.idx,1);
      salvarIniciativa();
      renderIniciativa();
    };
  });
}
document.getElementById('add-iniciativa').onclick = () => {
  const nome = prompt('Nome do participante:');
  const valor = parseInt(prompt('Valor da iniciativa:'));
  if(nome && !isNaN(valor)) {
    iniciativa.push({nome, valor});
    salvarIniciativa();
    renderIniciativa();
  }
};
function salvarIniciativa() {
  localStorage.setItem('iniciativa', JSON.stringify(iniciativa));
}
renderIniciativa();

// Controle de Pontos de Vida e Condições
const vidaContainer = document.getElementById('vida-container');
let vidaPersonagens = JSON.parse(localStorage.getItem('vidaPersonagens')) || [];
function renderVida() {
  vidaContainer.innerHTML = '';
  vidaPersonagens.forEach((p, idx) => {
    const div = document.createElement('div');
    div.className = 'ficha-card';
    div.innerHTML = `<b>${p.nome}</b> <br>
      <span>HP: <input type="number" value="${p.hp}" min="0" style="width:60px;" data-idx="${idx}"></span><br>
      <span>Condições: <input type="text" value="${p.condicoes || ''}" data-idx="${idx}" placeholder="Ex: Envenenado"></span>
      <button class="remove" data-idx="${idx}">&times;</button>`;
    div.querySelector('.remove').onclick = () => {
      vidaPersonagens.splice(idx,1);
      salvarVida();
      renderVida();
    };
    div.querySelectorAll('input[type="number"]').forEach(inp => {
      inp.onchange = () => {
        vidaPersonagens[idx].hp = parseInt(inp.value);
        salvarVida();
      };
    });
    div.querySelectorAll('input[type="text"]').forEach(inp => {
      inp.onchange = () => {
        vidaPersonagens[idx].condicoes = inp.value;
        salvarVida();
      };
    });
    vidaContainer.appendChild(div);
  });
}
vidaContainer.onclick = null;
document.getElementById('vida-container').onclick = null;
document.getElementById('vida-container').ondblclick = null;

vidaContainer.innerHTML = `<button id="adicionar-vida">Adicionar Personagem</button>`;
vidaContainer.querySelector('#adicionar-vida').onclick = () => {
  const nome = prompt('Nome do personagem:');
  const hp = parseInt(prompt('HP atual:'));
  if(nome && !isNaN(hp)) {
    vidaPersonagens.push({nome, hp, condicoes: ''});
    salvarVida();
    renderVida();
  }
};
function salvarVida() {
  localStorage.setItem('vidaPersonagens', JSON.stringify(vidaPersonagens));
}
renderVida();
vidaContainer.onclick = e => {
  if(e.target && e.target.id === "adicionar-vida") {
    const nome = prompt('Nome do personagem:');
    const hp = parseInt(prompt('HP atual:'));
    if(nome && !isNaN(hp)) {
      vidaPersonagens.push({nome, hp, condicoes: ''});
      salvarVida();
      renderVida();
    }
  }
};

// Rolador de Dados
const rolarBtn = document.getElementById('rolar-dado');
const resDado = document.getElementById('resultado-dado');
const histDados = document.getElementById('historico-dados');
let historicoDados = JSON.parse(localStorage.getItem('historicoDados')) || [];
function renderHistoricoDados() {
  histDados.innerHTML = historicoDados.slice(-10).reverse().map(e=>e).join('<br>');
}
rolarBtn.onclick = () => {
  const qtd = parseInt(document.getElementById('quantidade-dado').value);
  const tipo = parseInt(document.getElementById('tipo-dado').value);
  const mod = parseInt(document.getElementById('modificador').value);
  let rolls = [];
  for(let i=0;i<qtd;i++) rolls.push(Math.floor(Math.random()*tipo)+1);
  const total = rolls.reduce((a,b)=>a+b,0) + mod;
  let texto = `${qtd}d${tipo}${mod>=0?'+':''}${mod}: (${rolls.join(', ')}) = <b>${total}</b>`;
  resDado.innerHTML = texto;
  historicoDados.push(texto);
  if(historicoDados.length>25) historicoDados = historicoDados.slice(-25);
  localStorage.setItem('historicoDados', JSON.stringify(historicoDados));
  renderHistoricoDados();
};
renderHistoricoDados();

// Gerador de Nomes Aleatórios
const nomes = [
  "Elowen", "Tharivol", "Merla", "Korrin", "Barundar", "Lia", "Bryn", "Seraphine", "Grim", "Talon", "Syllin", "Durnan", "Yagra", "Fenthwick", "Jasper", "Nim", "Tika", "Raistlin", "Havard", "Anwyn", "Finn", "Isolde", "Leoric"
];
document.getElementById('gerar-nome').onclick = () => {
  const nome = nomes[Math.floor(Math.random()*nomes.length)];
  document.getElementById('nome-gerado').innerText = nome;
};

// Bloco de Notas do Mestre
const notas = document.getElementById('notas-mestre');
notas.value = localStorage.getItem('notasMestre') || '';
notas.oninput = () => {
  localStorage.setItem('notasMestre', notas.value);
};

// músicas controlador
document.getElementById('adicionar-musica').onclick = () => {
  const link = document.getElementById('link-musica').value.trim();
  if(link) {
    addMusicaEmbed(link);
    salvarMusicas();
    document.getElementById('link-musica').value = '';
  }
};
const musicasEmbedDiv = document.getElementById('musicas-embed');
let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
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

// missoes e quest
const missoesList = document.getElementById('missoes-list');
document.getElementById('add-missao').onclick = () => {
  const titulo = prompt("Título da missão:");
  const descricao = prompt("Descrição/objetivo:");
  const status = prompt("Status (ativa/concluída/falhada):");
  if(titulo) {
    addMissaoCard({titulo, descricao, status});
    salvarMissoes();
  }
};
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
}
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
}
function carregarMissoes() {
  const arr = JSON.parse(localStorage.getItem('missoes')) || [];
  arr.forEach(addMissaoCard);
}
carregarMissoes();