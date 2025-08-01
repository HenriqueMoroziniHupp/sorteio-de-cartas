import './style.css'

// Variáveis para controlar o jogo
let roundCount = 0;
let drawnCards = [];
let swapUsed = false;

// Variáveis do temporizador
let timerSeconds = 90; // 1 minuto e 30 segundos
let timerInterval = null;
let isTimerRunning = false;

// Array com os caminhos das imagens das cartas
const cardImages = [
  '/Card1.png',
  '/Card2.png',
  '/Card3.png',
  '/Card4.png',
  '/Card5.png',
  '/Card6.png',
  '/Card7.png',
  '/Card8.png',
  '/Card9.png',
  '/Card10.png',
  '/Card11.png',
  '/Card12.png',
  '/Card13.png',
  '/Card14.png',
  '/Card15.png',
  '/Card16.png',
  '/Card17.png',
  '/Card18.png',
  '/Card19.png',
  '/Card20.png',
  '/Card21.png',
  '/Card22.png',
  '/Card23.png',
  '/Card24.png',
  '/Card25.png',
  '/Card26.png',
];

// Array com os caminhos das imagens das cartas secretas
const secretCardImages = [
  '/SecretCard1.png',
  '/SecretCard2.png',
  '/SecretCard3.png',
  '/SecretCard4.png',
  '/SecretCard5.png',
  '/SecretCard6.png',
]

// Função para sortear uma carta aleatória
function drawRandomCard() {
  // Verificar se é a rodada especial (rodadas 9 e 25)
  if (roundCount === 9 || roundCount === 25) {
    // Sortear uma carta secreta aleatória
    const randomIndex = Math.floor(Math.random() * secretCardImages.length);
    const selectedCard = secretCardImages[randomIndex];
    return selectedCard;
  }
  
  // Filtrar apenas as cartas que ainda não foram sorteadas
  const availableCards = cardImages.filter(card => !drawnCards.includes(card));
  
  // Verificar se ainda há cartas disponíveis
  if (availableCards.length === 0) {
    alert('Todas as cartas já foram sorteadas! Use o botão Resetar para reiniciar o jogo.');
    return null; // Retorna null para indicar que não há mais cartas disponíveis
  }
  
  // Sortear uma carta aleatória entre as disponíveis
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const selectedCard = availableCards[randomIndex];
  
  // Adicionar a carta sorteada à lista de cartas já sorteadas
  drawnCards.push(selectedCard);
  
  return selectedCard;
}

// Função para trocar equação (sortear nova carta sem afetar cálculos)
function swapEquation() {
  // Verificar se a troca já foi usada
  if (swapUsed) {
    alert('A troca de equação só pode ser usada uma vez por jogo!');
    return;
  }
  
  // Verificar se há uma carta sendo exibida
  const cardImage = document.querySelector('.card-image');
  if (!cardImage) {
    alert('Primeiro você precisa sortear uma carta!');
    return;
  }
  
  // Filtrar apenas as cartas que ainda não foram sorteadas
  const availableCards = cardImages.filter(card => !drawnCards.includes(card));
  
  // Verificar se ainda há cartas disponíveis para trocar
  if (availableCards.length === 0) {
    alert('Não há cartas disponíveis para trocar!');
    return;
  }
  
  // Sortear uma carta aleatória entre as disponíveis (sem adicionar ao drawnCards)
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const selectedCard = availableCards[randomIndex];
  
  // Marcar que a troca foi usada
  swapUsed = true;
  
  // Remover o botão completamente do DOM
  const swapButton = document.getElementById('swap-button');

  swapButton.classList.add('hidden');
  setTimeout(() => {
    swapButton.remove();
  }, 300);
  
  // Atualizar apenas a exibição da carta
  updateCardDisplay(selectedCard);
  resetTimer();
}

// Função para atualizar a interface com a carta sorteada
function updateCardDisplay(cardPath) {
  const cardContainer = document.querySelector('.card-container');
  const cardImage = document.querySelector('.card-image');
  const resetButton = document.getElementById('reset-button');
  const swapButton = document.getElementById('swap-button');
  
  // Se já existe uma imagem, atualize-a com uma animação
  if (cardImage) {
    cardImage.style.opacity = '0';
    
    setTimeout(() => {
      cardImage.src = cardPath;
      cardImage.style.opacity = '1';
    }, 300);
  } else {
    // Se não existe, crie uma nova imagem
    const newCardImage = document.createElement('img');
    newCardImage.src = cardPath;
    newCardImage.alt = 'Carta sorteada';
    newCardImage.className = 'card-image';
    newCardImage.style.opacity = '0';
    
    cardContainer.appendChild(newCardImage);
    
    setTimeout(() => {
      newCardImage.style.opacity = '1';
    }, 10);
    
    // Mostrar os botões quando a primeira carta for sorteada com animação
    resetButton.style.position = 'static';
    setTimeout(() => {
      resetButton.classList.remove('hidden');
    }, 10);
    
    // Mostrar o botão de troca apenas se não faltar apenas uma rodada
    const availableCards = cardImages.filter(card => !drawnCards.includes(card));
    const totalCardsRemaining = availableCards.length + (roundCount < 9 ? 1 : 0); // +1 para carta secreta se ainda não passou da rodada 9
    
    if (totalCardsRemaining > 1 && !swapUsed) {
      swapButton.style.position = 'static';
      setTimeout(() => {
        swapButton.classList.remove('hidden');
      }, 10);
    }
  }
  
  // Verificar se deve remover o botão quando restar apenas uma carta
  if (cardImage) {
    const availableCards = cardImages.filter(card => !drawnCards.includes(card));
    const totalCardsRemaining = availableCards.length + (roundCount < 9 ? 1 : 0);
    
    if (totalCardsRemaining <= 1 && swapButton && !swapButton.classList.contains('hidden')) {
      // Adicionar animação de fade-out antes de remover
      swapButton.style.opacity = '0';
      swapButton.style.transform = 'scale(0.8)';
      swapButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        swapButton.remove();
      }, 300);
    }
  }
  
  // Atualize o texto do botão
  const drawButton = document.getElementById('draw-button');
  drawButton.textContent = 'Sortear nova carta';
}

// Função para iniciar o sorteio
function drawCard() {
  // Incrementar o contador de rodadas antes de sortear
  roundCount++;
  
  // Resetar e iniciar o temporizador automaticamente
  resetTimer();
  
  // Sortear uma carta aleatória
  const cardPath = drawRandomCard();

  // Atualizar o título da rodada após de sortear
  updateRoundCounter();
  
  // Verificar se uma carta foi sorteada
  if (cardPath) {
    updateCardDisplay(cardPath);
  } else {
    // Se não houver mais cartas disponíveis, decrementar o contador
    roundCount--;
    updateRoundCounter();
  }
}

// Função para atualizar o contador de rodadas e cartas restantes
function updateRoundCounter() {
  const roundCounter = document.getElementById('round-counter');
  const drawButton = document.getElementById('draw-button');
  const mainTitle = document.querySelector('h1');
  // Incluir as cartas secretas no cálculo (+2 para as duas rodadas especiais)
  const totalCards = cardImages.length + 2;
  // Considerar quantas rodadas secretas já foram usadas (rodadas 9 e 25)
  let secretCardsUsed = 0;
  if (roundCount >= 9) secretCardsUsed++;
  if (roundCount >= 25) secretCardsUsed++;
  const remainingCards = totalCards - drawnCards.length - secretCardsUsed;
  
  roundCounter.textContent = `Rodada: ${roundCount} | Cartas restantes: ${remainingCards}`;
  
  // Verificar se é a rodada de fogo (rodadas 5 e 15)
  if (roundCount === 5 || roundCount === 15) {
    // Substituir o título principal pelo título da rodada de fogo
    mainTitle.innerHTML = '🔥 Rodada de Fogo 🔥';
    mainTitle.classList.add('fire-round');
  } else if (roundCount === 9 || roundCount === 25) {
    // Substituir o título principal pelo título da rodada secreta
    mainTitle.innerHTML = '🎭 Desafio Secreto 🎭';
    mainTitle.classList.add('secret-round');
  } else {
    // Restaurar o título original se não for rodada especial
    mainTitle.innerHTML = 'Sorteio de Cartas';
    mainTitle.classList.remove('fire-round', 'secret-round');
  }
  
  // Verificar se ainda há cartas disponíveis
  if (remainingCards === 0) {
    // Ocultar o botão de sorteio quando não houver mais cartas
    drawButton.classList.add('hidden');
  } else {
    // Garantir que o botão de sorteio esteja visível se houver cartas disponíveis
    drawButton.classList.remove('hidden');
  }
}

// Função para resetar o aplicativo
function resetApp() {
  const cardContainer = document.querySelector('.card-container');
  const cardImage = document.querySelector('.card-image');
  const resetButton = document.getElementById('reset-button');
  let swapButton = document.getElementById('swap-button');
  const mainTitle = document.querySelector('h1');
  
  // Recriar o botão swap se ele foi removido do DOM
  if (!swapButton) {
    const buttonsContainer = document.querySelector('.buttons-container');
    swapButton = document.createElement('button');
    swapButton.id = 'swap-button';
    swapButton.className = 'hidden';
    swapButton.textContent = '🔁 Troca Equação';
    swapButton.addEventListener('click', swapEquation);
    
    // Inserir o botão entre o botão de sortear e o de resetar
    buttonsContainer.insertBefore(swapButton, resetButton);
  }
  
  // Restaurar o título original
  mainTitle.innerHTML = 'Sorteio de Cartas';
  mainTitle.classList.remove('fire-round', 'secret-round');
  
  if (cardImage) {
    cardImage.style.opacity = '0';
    
    setTimeout(() => {
      cardContainer.removeChild(cardImage);
    }, 300);
    
    // Esconder os botões com animação suave
    resetButton.classList.add('hidden');
    swapButton.classList.add('hidden');
    setTimeout(() => {
      resetButton.style.position = 'absolute';
      swapButton.style.position = 'absolute';
    }, 300);
  }
  
  // Resetar o texto do botão de sorteio e garantir que esteja visível
  const drawButton = document.getElementById('draw-button');
  drawButton.textContent = 'Sortear';
  drawButton.classList.remove('hidden');
  
  // Resetar o contador de rodadas e limpar cartas sorteadas
  roundCount = 0;
  drawnCards = [];
  swapUsed = false;
  
  updateRoundCounter();
  resetTimer();
}

// Funções do temporizador
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  timerDisplay.textContent = formatTime(timerSeconds);
  
  // Adicionar classe de alerta quando restam 30 segundos ou menos
  if (timerSeconds <= 30) {
    timerDisplay.classList.add('timer-warning');
  } else {
    timerDisplay.classList.remove('timer-warning');
  }
  
  // Adicionar classe crítica quando restam 10 segundos ou menos
  if (timerSeconds <= 10) {
    timerDisplay.classList.add('timer-critical');
  } else {
    timerDisplay.classList.remove('timer-critical');
  }
}

function startTimer() {
  if (!isTimerRunning && timerSeconds > 0) {
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      
      if (timerSeconds <= 0) {
        stopTimer();
        alert('⏰ Tempo esgotado!');
      }
    }, 1000);
  }
}

function pauseTimer() {
  if (isTimerRunning) {
    isTimerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 90;
  updateTimerDisplay();
}

function stopTimer() {
  pauseTimer();
}

// Inicialização da aplicação
document.querySelector('#app').innerHTML = `
  <div class="timer-container">
    <div class="timer-display" id="timer-display">01:30</div>
    <div class="timer-controls">
      <button id="timer-start">▶️</button>
      <button id="timer-pause">⏸️</button>
      <button id="timer-reset">🔄</button>
    </div>
  </div>
  <h1>Sorteio de Cartas</h1>
  <p id="round-counter">Rodada: 0 | Cartas restantes: ${cardImages.length + 2}</p>
  <div class="card-container"></div>
  <div class="buttons-container">
    <button id="draw-button">Sortear</button>
    <button id="swap-button" class="hidden">🔁 Troca Equação</button>
    <button id="reset-button" class="hidden">Resetar</button>
  </div>
`;

// Adicionar eventos de clique aos botões
document.getElementById('draw-button').addEventListener('click', drawCard);
document.getElementById('swap-button').addEventListener('click', swapEquation);
document.getElementById('reset-button').addEventListener('click', resetApp);

// Event listeners do temporizador
document.getElementById('timer-start').addEventListener('click', startTimer);
document.getElementById('timer-pause').addEventListener('click', pauseTimer);
document.getElementById('timer-reset').addEventListener('click', resetTimer);

// Inicializar o display do temporizador
updateTimerDisplay();
