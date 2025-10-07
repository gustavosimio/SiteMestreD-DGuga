// Funções Gerais>>>>>>>>>>>
// Navegação por abas
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.sidebar nav ul li.active').classList.remove('active');
    tab.classList.add('active');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});


//Adicionar fichas
function add_ficha()
{
    openModal({
      title: 'Adicionar Ficha de Personagem',
      fields: [
        { name: 'Nome', label: 'Nome do personagem', required: true },
        { name: 'Classe', label: 'Classe' },
        { name: 'Nível', label: 'Nível' },
        { name: 'HP', label: 'Pontos de Vida', type: 'number' },
        { name: 'Detalhes', label: 'Anotações/Histórico', type: 'textarea' }
      ],
      onSave: (ficha) => {
        addFichaCard(ficha);
        salvarFichas();
      }
    });
}

// Gerenciamento de NPCs
function add_npc()
{
  const npc = {
    nome: prompt("Nome do NPC:"),
    tipo: prompt("Tipo (ex: vilão, comerciante, etc.):"),
    detalhes: prompt("Notas/Descrição:")
  };
  if(npc.nome) {
    addNpcCard(npc);
    salvarNpcs();
  }
}

// missoes e quest ratazana
function add_missao()
{
  const titulo = prompt("Título da missão:");
  const descricao = prompt("Descrição/objetivo:");
  const status = prompt("Status (ativa/concluída/falhada):");
  if(titulo) {
    addMissaoCard({titulo, descricao, status});
    salvarMissoes();
  }
}

//iniciativa
function add_iniciativa()
{
  const nome = prompt('Nome do participante:');
  const valor = parseInt(prompt('Valor da iniciativa:'));
  if(nome && !isNaN(valor)) {
    iniciativa.push({nome, valor});
    salvarIniciativa();
    renderIniciativa();
  }
}

//Rolar dados
function rolar_dado()
{
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
}

function add_vida()
{
  if(e.target && e.target.id === "adicionar-vida") {
    const nome = prompt('Nome do personagem:');
    const hp = parseInt(prompt('HP atual:'));
    if(nome && !isNaN(hp)) {
      vidaPersonagens.push({nome, hp, condicoes: ''});
      salvarVida();
      renderVida();
    }
  }
}

// músicas Sigma
function adicionar_musica()
{
  const link = document.getElementById('link-musica').value.trim();
  if(link) {
    addMusicaEmbed(link);
    salvarMusicas();
    document.getElementById('link-musica').value = '';
  }
}

//Gerar nome
function gerar_nome()
{
  const nome = nomes[Math.floor(Math.random()*nomes.length)];
  document.getElementById('nome-gerado').innerText = nome;
}