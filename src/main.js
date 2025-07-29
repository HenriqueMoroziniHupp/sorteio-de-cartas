import './style.css'

// Variáveis para controlar o jogo
let roundCount = 0;
let drawnCards = [];

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
];

// Array com os caminhos das imagens das cartas secretas
const secretCardImages = [
  '/SecretCard1.png',
  '/SecretCard2.png',
  '/SecretCard3.png',
]

// Função para sortear uma carta aleatória
function drawRandomCard() {
  // Verificar se é a rodada especial (rodada 9)
  if (roundCount === 9) {
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

// Função para atualizar a interface com a carta sorteada
function updateCardDisplay(cardPath) {
  const cardContainer = document.querySelector('.card-container');
  const cardImage = document.querySelector('.card-image');
  const resetButton = document.getElementById('reset-button');
  
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
    
    // Mostrar o botão de reset quando a primeira carta for sorteada com animação
    resetButton.style.position = 'static';
    setTimeout(() => {
      resetButton.classList.remove('hidden');
    }, 10);
  }
  
  // Atualize o texto do botão
  const drawButton = document.getElementById('draw-button');
  drawButton.textContent = 'Sortear nova carta';
}

// Função para iniciar o sorteio
function drawCard() {
  // Incrementar o contador de rodadas antes de sortear
  roundCount++;
  
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
  // Incluir as cartas secretas no cálculo (+1 para a rodada especial)
  const totalCards = cardImages.length + 1;
  // Considerar se já passou pela rodada secreta (rodada 9)
  const secretCardUsed = roundCount >= 9 ? 1 : 0;
  const remainingCards = totalCards - drawnCards.length - secretCardUsed;
  
  roundCounter.textContent = `Rodada: ${roundCount} | Cartas restantes: ${remainingCards}`;
  
  // Verificar se é a rodada de fogo (rodada 5)
  if (roundCount === 5) {
    // Substituir o título principal pelo título da rodada de fogo
    mainTitle.innerHTML = '🔥 Rodada de Fogo 🔥';
    mainTitle.classList.add('fire-round');
  } else if (roundCount === 9) {
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
  const mainTitle = document.querySelector('h1');
  
  // Restaurar o título original
  mainTitle.innerHTML = 'Sorteio de Cartas';
  mainTitle.classList.remove('fire-round', 'secret-round');
  
  if (cardImage) {
    cardImage.style.opacity = '0';
    
    setTimeout(() => {
      cardContainer.removeChild(cardImage);
    }, 300);
    
    // Esconder o botão de reset com animação suave
    resetButton.classList.add('hidden');
    setTimeout(() => {
      resetButton.style.position = 'absolute';
    }, 300);
  }
  
  // Resetar o texto do botão de sorteio e garantir que esteja visível
  const drawButton = document.getElementById('draw-button');
  drawButton.textContent = 'Sortear';
  drawButton.classList.remove('hidden');
  
  // Resetar o contador de rodadas e limpar cartas sorteadas
  roundCount = 0;
  drawnCards = [];
  updateRoundCounter();
}

// Inicialização da aplicação
document.querySelector('#app').innerHTML = `
  <h1>Sorteio de Cartas</h1>
  <p id="round-counter">Rodada: 0 | Cartas restantes: ${cardImages.length + 1}</p>
  <div class="card-container"></div>
  <div class="buttons-container">
    <button id="draw-button">Sortear</button>
    <button id="reset-button" class="hidden">Resetar</button>
  </div>
`;

// Adicionar eventos de clique aos botões
document.getElementById('draw-button').addEventListener('click', drawCard);
document.getElementById('reset-button').addEventListener('click', resetApp);
