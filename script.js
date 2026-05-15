// ===== FORÇAR SCROLL AO TOPO NO CARREGAMENTO =====
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ===== LOADING SCREEN =====
(function iniciarLoading() {
  const screen = document.getElementById('loadingScreen');
  const barra  = document.getElementById('loadingBarra');
  const texto  = document.getElementById('loadingTexto');
  if (!screen) return;

  const fases = [
    { pct: 20,  msg: 'Carregando recursos...' },
    { pct: 45,  msg: 'Inicializando mundo...' },
    { pct: 70,  msg: 'Detectando infectados...' },
    { pct: 90,  msg: 'Preparando jornada...' },
    { pct: 100, msg: 'Bem-vindo à zona de quarentena.' },
  ];

  let fase = 0;
  function avancar() {
    if (fase >= fases.length) return;
    const { pct, msg } = fases[fase++];
    barra.style.width = pct + '%';
    texto.textContent = msg;
    if (fase < fases.length) setTimeout(avancar, 380 + Math.random() * 220);
    else setTimeout(() => {
      screen.classList.add('saindo');
      setTimeout(() => screen.remove(), 900);
    }, 600);
  }

  setTimeout(avancar, 200);
})();

// ===== CURSOR MIRA =====
(function iniciarCursor() {
  const mira  = document.getElementById('cursorMira');
  const ponto = document.getElementById('cursorPonto');
  if (!mira || !ponto || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    mira.style.left  = e.clientX + 'px';
    mira.style.top   = e.clientY + 'px';
    ponto.style.left = e.clientX + 'px';
    ponto.style.top  = e.clientY + 'px';
  }, { passive: true });

  document.addEventListener('mousedown', () => mira.classList.add('clique'));
  document.addEventListener('mouseup',   () => mira.classList.remove('clique'));

  document.querySelectorAll('a, button, [role="button"], .mapa-ponto, .galeria-item, .quiz-opcao, .carrossel-btn, .dot').forEach(el => {
    el.addEventListener('mouseenter', () => mira.classList.add('hover'));
    el.addEventListener('mouseleave', () => mira.classList.remove('hover'));
  });
})();

// ===== MODO SÉPIA =====
(function iniciarTema() {
  const btn = document.getElementById('btnTema');
  if (!btn) return;

  const CHAVE = 'tlou_tema';
  const salvo = localStorage.getItem(CHAVE);

  function aplicarTema(sepia) {
    document.body.classList.toggle('sepia', sepia);
    btn.innerHTML = sepia
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
    btn.setAttribute('aria-label', sepia ? 'Modo escuro' : 'Modo sépia');
    localStorage.setItem(CHAVE, sepia ? 'sepia' : 'escuro');
  }

  if (salvo === 'sepia') aplicarTema(true);

  btn.addEventListener('click', () => {
    aplicarTema(!document.body.classList.contains('sepia'));
  });
})();

// ===== ESPOROS MELHORADOS =====
(function gerarEsporos() {
  const container = document.getElementById('esporos');
  if (!container) return;

  const total = window.innerWidth < 768 ? 18 : 36;
  const frag  = document.createDocumentFragment();
  const cores = ['#c8a45a', '#e6c477', '#a07830', '#d4b06a'];

  for (let i = 0; i < total; i++) {
    const esporo  = document.createElement('span');
    esporo.className = 'esporo';
    const tamanho = 1.5 + Math.random() * 3.5;
    const cor     = cores[Math.floor(Math.random() * cores.length)];
    const dur     = 14 + Math.random() * 22;
    const delay   = -(Math.random() * dur);
    const drift   = (Math.random() - 0.5) * 120;
    const op      = 0.3 + Math.random() * 0.55;

    esporo.style.cssText = `
      width:${tamanho}px;
      height:${tamanho}px;
      left:${Math.random() * 100}vw;
      background:${cor};
      box-shadow:0 0 ${tamanho * 2}px ${cor};
      --dur:${dur}s;
      --delay:${delay}s;
      --drift:${drift}px;
      --op:${op};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    frag.appendChild(esporo);
  }
  container.appendChild(frag);

  // Reação ao mouse — esporos próximos se afastam levemente
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
})();

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const menuNav = document.getElementById('menuNav');

function fecharMenu() {
  menuNav.classList.remove('aberto');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}

menuToggle.addEventListener('click', () => {
  const aberto = menuNav.classList.toggle('aberto');
  menuToggle.setAttribute('aria-expanded', String(aberto));
  menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('#menuNav a').forEach(link => {
  link.addEventListener('click', fecharMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenu();
});

// ===== FALLBACK DE IMAGENS (substitui onerror inline) =====
document.querySelectorAll('.personagem-foto, .sec-foto, .infectado-foto').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('foto-placeholder')) {
      placeholder.hidden = false;
      placeholder.style.display = 'flex';
    }
  }, { once: true });
});

// ===== SCROLL SUAVE CUSTOMIZADO =====
function scrollSuave(destinoY, duracao = 1200) {
  const inicioY = window.scrollY;
  const distancia = destinoY - inicioY;
  if (Math.abs(distancia) < 2) return;
  const inicioTempo = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animar(agora) {
    const decorrido = agora - inicioTempo;
    const progresso = Math.min(decorrido / duracao, 1);
    window.scrollTo(0, inicioY + distancia * easeInOutCubic(progresso));
    if (progresso < 1) requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href === '#') {
      scrollSuave(0);
      return;
    }
    const destino = document.querySelector(href);
    if (destino) {
      const offsetTopo = 70;
      const posicao = destino.getBoundingClientRect().top + window.scrollY - offsetTopo;
      scrollSuave(posicao);
    }
  });
});

// ===== BOTÃO VOLTAR AO TOPO =====
const btnTopo = document.getElementById('btnTopo');

window.addEventListener('scroll', () => {
  btnTopo.classList.toggle('visivel', window.scrollY > 400);
}, { passive: true });

btnTopo.addEventListener('click', () => {
  scrollSuave(0);
});

// ===== TABS — SOBRE OS JOGOS =====
document.querySelectorAll('.jogo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const jogo = tab.dataset.jogo;

    document.querySelectorAll('.jogo-tab').forEach(t => t.classList.remove('ativo'));
    document.querySelectorAll('.jogo-conteudo').forEach(c => c.classList.remove('ativo'));

    tab.classList.add('ativo');
    document.getElementById('jogo-' + jogo).classList.add('ativo');
  });
});

// ===== CARROSSEL GENÉRICO =====
function montarCarrossel(trackId, cardSelector, dotsId, prevId, nextId) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const cards = track.querySelectorAll(cardSelector);
  const total = cards.length;
  const dotsContainer = document.getElementById(dotsId);
  const viewport = track.parentElement;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot' + (i === 0 ? ' ativo' : '');
      d.dataset.idx = i;
      d.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dotsContainer.appendChild(d);
    }
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  let current = 0;
  let timerWillChange = null;

  function ir(idx) {
    current = (idx + total) % total;
    track.classList.add('animando');
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('ativo', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    clearTimeout(timerWillChange);
    timerWillChange = setTimeout(() => track.classList.remove('animando'), 500);
  }

  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);
  btnPrev.addEventListener('click', () => ir(current - 1));
  btnNext.addEventListener('click', () => ir(current + 1));
  btnPrev.setAttribute('aria-label', 'Anterior');
  btnNext.setAttribute('aria-label', 'Próximo');

  dots.forEach(dot => dot.addEventListener('click', () => ir(Number(dot.dataset.idx))));

  // Suporte a teclado quando o viewport está focado
  viewport.setAttribute('tabindex', '0');
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-roledescription', 'carrossel');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(current + 1); }
  });

  // Suporte a swipe touch
  let touchInicioX = 0;
  let touchAtualX = 0;
  let arrastando = false;

  viewport.addEventListener('touchstart', (e) => {
    touchInicioX = e.touches[0].clientX;
    touchAtualX = touchInicioX;
    arrastando = true;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!arrastando) return;
    touchAtualX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!arrastando) return;
    const diff = touchAtualX - touchInicioX;
    const limite = 50;
    if (diff > limite) ir(current - 1);
    else if (diff < -limite) ir(current + 1);
    arrastando = false;
  });
}

montarCarrossel('infectadoTrack', '.infectado-card', 'infectadoDots', 'infectadoPrev', 'infectadoNext');
montarCarrossel('personagemTrack', '.personagem-card', 'personagemDots', 'personagemPrev', 'personagemNext');

// ===== SEÇÃO ATIVA NA NAV =====
const navLinks = document.querySelectorAll('#menuNav a[href^="#"]');
const secoes = document.querySelectorAll('section[id]');

const observadorNav = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    const id = entrada.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('ativo', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });

secoes.forEach(s => observadorNav.observe(s));

// ===== MENU LATERAL =====
const navMaisBtn = document.getElementById('navMaisBtn');
const navLateral = document.getElementById('navLateral');
const navLateralFechar = document.getElementById('navLateralFechar');
const navLateralOverlay = document.getElementById('navLateralOverlay');

function abrirLateral() {
  navLateral.classList.add('aberto');
  navLateralOverlay.classList.add('ativo');
  navMaisBtn.setAttribute('aria-expanded', 'true');
  navLateral.setAttribute('aria-hidden', 'false');
}

function fecharLateral() {
  navLateral.classList.remove('aberto');
  navLateralOverlay.classList.remove('ativo');
  navMaisBtn.setAttribute('aria-expanded', 'false');
  navLateral.setAttribute('aria-hidden', 'true');
}

navMaisBtn?.addEventListener('click', () => {
  navLateral.classList.contains('aberto') ? fecharLateral() : abrirLateral();
});

navLateralFechar?.addEventListener('click', fecharLateral);
navLateralOverlay?.addEventListener('click', fecharLateral);

document.querySelectorAll('.nav-lateral-link').forEach(link => {
  link.addEventListener('click', fecharLateral);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharLateral();
});

// ===== MAPA INTERATIVO =====
const dadosMapa = {
  boston: {
    jogo: 'Part I — Boston, Massachusetts',
    nome: 'Boston',
    desc: 'Zona de Quarentena controlada pela FEDRA. Joel e Tess trabalham como contrabandistas aqui. É onde recebem Ellie e a missão que vai mudar tudo.'
  },
  bills: {
    jogo: 'Part I — Lincoln, Massachusetts',
    nome: "Bill's Town",
    desc: 'Um sobrevivente paranoico chamado Bill armadilhou uma cidade inteira. Joel chama um favor antigo para conseguir um carro e continuar a jornada.'
  },
  pittsburgh: {
    jogo: 'Part I — Pittsburgh, Pennsylvania',
    nome: 'Pittsburgh',
    desc: 'Caçadores dominam a cidade — sobreviventes que matam outros para roubar suprimentos. Joel e Ellie conhecem os irmãos Henry e Sam aqui.'
  },
  jackson: {
    jogo: 'Part I & II — Jackson, Wyoming',
    nome: 'Jackson',
    desc: 'Tommy, irmão de Joel, construiu uma comunidade funcional com hidroelétrica. Um dos únicos lugares organizados do país — e ponto de partida do Part II.'
  },
  saltlake: {
    jogo: 'Part I — Salt Lake City, Utah',
    nome: 'Salt Lake City',
    desc: 'Quartel-general dos Vaga-lumes. É aqui que a jornada do Part I termina — e onde Joel toma a decisão mais controversa de toda a franquia.'
  },
  eastbrook: {
    jogo: 'Part II — Estação Eastbrook, Wyoming',
    nome: 'Eastbrook',
    desc: 'Estação de esqui em meio à nevasca. O evento que acontece aqui é o estopim de tudo — o ponto de virada que lança Ellie na jornada de vingança.'
  },
  seattle: {
    jogo: 'Part II — Seattle, Washington',
    nome: 'Seattle',
    desc: 'Cidade em guerra civil entre WLF e Seraphitas. Ellie e Abby (em perspectivas diferentes) passam dias aqui em combate brutal e descobertas dolorosas.'
  },
  ilha: {
    jogo: 'Part II — Ilha dos Seraphitas',
    nome: 'Ilha Seraphita',
    desc: 'Lar do culto religioso que rejeita tecnologia. Abby chega aqui com Lev e Yara em uma das partes mais inesperadas e tocantes do Part II.'
  },
  santabarbara: {
    jogo: 'Part II — Santa Bárbara, Califórnia',
    nome: 'Santa Bárbara',
    desc: 'Destino final de ambas as protagonistas. O confronto aqui é um dos mais impactantes da história dos games — e deixa o jogador para refletir por dias.'
  }
};

const tooltip = document.getElementById('mapaTooltip');
const tooltipJogo = document.getElementById('mapaTooltipJogo');
const tooltipNome = document.getElementById('mapaTooltipNome');
const tooltipDesc = document.getElementById('mapaTooltipDesc');

if (tooltip) {
  document.querySelectorAll('.mapa-ponto').forEach(ponto => {
    function mostrarTooltip() {
      const cidade = ponto.dataset.cidade;
      const dados = dadosMapa[cidade];
      if (!dados) return;
      tooltipJogo.textContent = dados.jogo;
      tooltipNome.textContent = dados.nome;
      tooltipDesc.textContent = dados.desc;
      tooltip.hidden = false;
    }

    ponto.addEventListener('click', mostrarTooltip);
    ponto.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mostrarTooltip(); }
    });
  });

  document.querySelector('.mapa-wrap')?.addEventListener('click', (e) => {
    if (!e.target.closest('.mapa-ponto') && !e.target.closest('.mapa-tooltip')) {
      tooltip.hidden = true;
    }
  });
}

// ===== GALERIA DE FÃS =====
const GALERIA_KEY = 'tlou_galeria_v1';
let galeriaFotos = [];
let lightboxIdx = 0;

function galeriaCarregar() {
  try {
    const dados = localStorage.getItem(GALERIA_KEY);
    galeriaFotos = dados ? JSON.parse(dados) : [];
  } catch { galeriaFotos = []; }
}

function galeriaSalvar() {
  try { localStorage.setItem(GALERIA_KEY, JSON.stringify(galeriaFotos)); } catch {}
}

function galeriaRenderizar() {
  const grid = document.getElementById('galeriaGrid');
  const vazia = document.getElementById('galeriaVazia');
  if (!grid) return;

  grid.innerHTML = '';

  if (galeriaFotos.length === 0) {
    vazia && (vazia.style.display = 'flex');
    return;
  }

  vazia && (vazia.style.display = 'none');

  galeriaFotos.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'galeria-item';
    item.innerHTML = `
      <img src="${src}" alt="Foto de fã ${idx + 1}" loading="lazy">
      <div class="galeria-item-overlay"><i class="fa-solid fa-expand"></i></div>
    `;
    item.addEventListener('click', () => lightboxAbrir(idx));
    grid.appendChild(item);
  });
}

function galeriaAdicionarFotos(files) {
  const promises = Array.from(files).map(file => new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve();
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  }));

  Promise.all(promises).then(results => {
    results.forEach(src => { if (src) galeriaFotos.push(src); });
    galeriaSalvar();
    galeriaRenderizar();
  });
}

function lightboxAbrir(idx) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lightboxIdx = idx;
  lightboxAtualizar();
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}

function lightboxFecharFn() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.hidden = true;
  document.body.style.overflow = '';
}

function lightboxAtualizar() {
  const img = document.getElementById('lightboxImg');
  const contador = document.getElementById('lightboxContador');
  if (img) img.src = galeriaFotos[lightboxIdx];
  if (contador) contador.textContent = `${lightboxIdx + 1} / ${galeriaFotos.length}`;
}

const galeriaUploadArea = document.getElementById('galeriaUpload');
const galeriaInput = document.getElementById('galeriaInput');
const btnGaleriaUpload = document.getElementById('btnGaleriaUpload');

if (galeriaUploadArea) {
  galeriaCarregar();
  galeriaRenderizar();

  btnGaleriaUpload?.addEventListener('click', (e) => {
    e.stopPropagation();
    galeriaInput.click();
  });

  galeriaUploadArea.addEventListener('click', () => galeriaInput.click());

  galeriaInput?.addEventListener('change', (e) => {
    galeriaAdicionarFotos(e.target.files);
    galeriaInput.value = '';
  });

  galeriaUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    galeriaUploadArea.classList.add('drag-over');
  });

  galeriaUploadArea.addEventListener('dragleave', () => {
    galeriaUploadArea.classList.remove('drag-over');
  });

  galeriaUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    galeriaUploadArea.classList.remove('drag-over');
    galeriaAdicionarFotos(e.dataTransfer.files);
  });

  document.getElementById('lightboxFechar')?.addEventListener('click', lightboxFecharFn);

  document.getElementById('lightboxPrev')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx - 1 + galeriaFotos.length) % galeriaFotos.length;
    lightboxAtualizar();
  });

  document.getElementById('lightboxNext')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx + 1) % galeriaFotos.length;
    lightboxAtualizar();
  });

  document.getElementById('lightboxRemover')?.addEventListener('click', () => {
    galeriaFotos.splice(lightboxIdx, 1);
    galeriaSalvar();
    galeriaRenderizar();
    if (galeriaFotos.length === 0) { lightboxFecharFn(); return; }
    lightboxIdx = Math.min(lightboxIdx, galeriaFotos.length - 1);
    lightboxAtualizar();
  });

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || lb.hidden) return;
    if (e.key === 'Escape') lightboxFecharFn();
    if (e.key === 'ArrowLeft') { lightboxIdx = (lightboxIdx - 1 + galeriaFotos.length) % galeriaFotos.length; lightboxAtualizar(); }
    if (e.key === 'ArrowRight') { lightboxIdx = (lightboxIdx + 1) % galeriaFotos.length; lightboxAtualizar(); }
  });
}

// ===== QUIZ =====
const quizResultados = {
  joel: {
    nome: 'Joel Miller',
    papel: 'Sobrevivente · Contrabandista',
    icone: '🪓',
    desc: 'Você é movido por lealdade profunda e silenciosa. Pragmático, calculista, e disposto a cruzar qualquer linha para proteger quem ama. Carrega mais dor do que mostra — e por isso é mais perigoso do que parece.'
  },
  ellie: {
    nome: 'Ellie Williams',
    papel: 'Imune · Sobrevivente',
    icone: '🏹',
    desc: 'Resiliente, improvisadora e incapaz de desistir. Você lida com o mundo com humor como escudo e coragem como armadura. Guarda cicatrizes que os outros não veem — mas sempre encontra um jeito de seguir em frente.'
  },
  abby: {
    nome: 'Abby Anderson',
    papel: 'Soldado · WLF',
    icone: '⚔️',
    desc: 'Determinado, físico e movido por propósito. Você transforma dor em ação e não recua de suas convicções. Difícil de entender à primeira vista, mas quem te conhece de verdade enxerga a lealdade inabalável por trás da força.'
  },
  tommy: {
    nome: 'Tommy Miller',
    papel: 'Ex-Vaga-lume · Jackson',
    icone: '🛡️',
    desc: 'Otimista e protetor. Você acredita que vale a pena construir algo — uma comunidade, uma família, um futuro. Mais esperançoso que a maioria, mas igualmente capaz de agir quando o que ama é ameaçado.'
  },
  dina: {
    nome: 'Dina',
    papel: 'Aliada · Jackson',
    icone: '🌿',
    desc: 'Inteligente, leal e com um senso de humor que mantém as pessoas ao redor equilibradas. Você é a âncora emocional do grupo — e frequentemente a voz mais sensata na sala. Mas não confunda leveza com fraqueza.'
  }
};

const quizRespostas = {};
let quizPerguntaAtual = 0;
const totalPerguntas = document.querySelectorAll('.quiz-pergunta').length;

function quizAtualizarProgresso() {
  const fill = document.getElementById('quizProgressoFill');
  const texto = document.getElementById('quizProgressoTexto');
  const pct = ((quizPerguntaAtual) / totalPerguntas) * 100;
  if (fill) fill.style.width = pct + '%';
  if (texto) texto.textContent = `Pergunta ${quizPerguntaAtual + 1} de ${totalPerguntas}`;
}

function quizMostrarResultado() {
  const contagem = {};
  Object.values(quizRespostas).forEach(v => { contagem[v] = (contagem[v] || 0) + 1; });
  const resultado = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
  const dados = quizResultados[resultado];

  document.getElementById('quizPerguntas').style.display = 'none';
  document.querySelector('.quiz-progresso-wrap').style.display = 'none';

  const resultadoEl = document.getElementById('quizResultado');
  document.getElementById('resultadoIcone').textContent = dados.icone;
  document.getElementById('resultadoNome').textContent = dados.nome;
  document.getElementById('resultadoPapel').textContent = dados.papel;
  document.getElementById('resultadoDesc').textContent = dados.desc;
  resultadoEl.hidden = false;

  const fill = document.getElementById('quizProgressoFill');
  if (fill) fill.style.width = '100%';
}

document.querySelectorAll('.quiz-opcao').forEach(opcao => {
  opcao.addEventListener('click', () => {
    quizRespostas[quizPerguntaAtual] = opcao.dataset.valor;

    document.querySelector(`.quiz-pergunta[data-pergunta="${quizPerguntaAtual}"]`)?.classList.remove('ativa');
    quizPerguntaAtual++;

    if (quizPerguntaAtual >= totalPerguntas) {
      quizMostrarResultado();
    } else {
      document.querySelector(`.quiz-pergunta[data-pergunta="${quizPerguntaAtual}"]`)?.classList.add('ativa');
      quizAtualizarProgresso();
    }
  });
});

document.getElementById('btnQuizReiniciar')?.addEventListener('click', () => {
  quizPerguntaAtual = 0;
  Object.keys(quizRespostas).forEach(k => delete quizRespostas[k]);

  document.querySelectorAll('.quiz-pergunta').forEach((p, i) => {
    p.classList.toggle('ativa', i === 0);
  });

  document.getElementById('quizPerguntas').style.display = '';
  document.querySelector('.quiz-progresso-wrap').style.display = '';
  document.getElementById('quizResultado').hidden = true;
  quizAtualizarProgresso();
});

quizAtualizarProgresso();

// ===== ANIMAÇÃO AO ENTRAR NA TELA =====
const elementosAnimados = document.querySelectorAll(
  '.personagem-card, .infectado-card, .timeline-item, .curiosidade-card, .serie-item, .sec-card, .numero-card, .faccao-card, .trilha-compositor, .trilha-faixas, .trilha-citacao, .secao > .secao-inner > h2, .secao > .secao-inner > .secao-pre, .secao > .secao-inner > .secao-sub'
);

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.style.opacity = '1';
      entrada.target.style.transform = 'translateY(0)';
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

elementosAnimados.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)';
  observador.observe(el);
});
