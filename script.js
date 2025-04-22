// Fonctionnalité existante
let clicks = 0;
function incrementClicks() {
  clicks++;
  document.getElementById('click-count').innerText = clicks;
  updateCarbonFootprint(10); // Chaque clic = 10g de CO2
}

// Nouvelle fonctionnalité : Suivi de l'empreinte carbone
let carbonFootprint = 0;
function updateCarbonFootprint(value) {
  carbonFootprint += value;
  const carbonElement = document.getElementById('carbon-value');
  if (carbonElement) {
    carbonElement.innerText = carbonFootprint;
  }
  
  // Mise à jour de la barre de progression
  const progressBar = document.getElementById('carbon-progress');
  if (progressBar) {
    // Max à 1000g pour remplir la barre
    const percentage = Math.min((carbonFootprint / 1000) * 100, 100);
    progressBar.style.width = percentage + '%';
  }
}

// Mini-jeu Éco-Défenseur IA
const game = {
  isActive: false,
  score: 0,
  timeLeft: 30,
  timer: null,
  goodItemsClicked: 0,
  badItemsClicked: 0,
  
  start() {
    // Réinitialisation
    this.isActive = true;
    this.score = 0;
    this.timeLeft = 30;
    this.goodItemsClicked = 0;
    this.badItemsClicked = 0;
    
    // Mise à jour de l'interface
    document.getElementById('game-score').innerText = this.score;
    document.getElementById('game-timer').innerText = this.timeLeft;
    document.getElementById('game-results').style.display = 'none';
    
    // Vider la zone de jeu
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    
    // Démarrer le timer
    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('game-timer').innerText = this.timeLeft;
      
      if (this.timeLeft <= 0) {
        this.end();
      }
    }, 1000);
    
    // Générer des éléments
    this.generateItems();
  },
  
  generateItems() {
    if (!this.isActive) return;
    
    const gameArea = document.getElementById('game-area');
    const isGood = Math.random() > 0.4; // 60% de chance d'être une bonne requête
    
    const item = document.createElement('div');
    item.className = `game-item ${isGood ? 'good-item' : 'bad-item'}`;
    item.innerText = isGood ? '✓' : '✗';
    
    // Position aléatoire
    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;
    const posX = Math.floor(Math.random() * maxX);
    const posY = Math.floor(Math.random() * maxY);
    
    item.style.left = posX + 'px';
    item.style.top = posY + 'px';
    
    // Ajouter l'événement de clic
    item.addEventListener('click', () => {
      if (!this.isActive) return;
      
      if (isGood) {
        this.score += 10;
        this.goodItemsClicked++;
      } else {
        this.score = Math.max(0, this.score - 5);
        this.badItemsClicked++;
      }
      
      document.getElementById('game-score').innerText = this.score;
      gameArea.removeChild(item);
    });
    
    gameArea.appendChild(item);
    
    // Animation de disparition
    setTimeout(() => {
      if (gameArea.contains(item)) {
        gameArea.removeChild(item);
      }
    }, 2000);
    
    // Générer un autre élément après un délai aléatoire
    const nextDelay = 500 + Math.random() * 1000;
    if (this.isActive) {
      setTimeout(() => this.generateItems(), nextDelay);
    }
  },
  
  end() {
    this.isActive = false;
    clearInterval(this.timer);
    
    // Nettoyer la zone de jeu
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    
    // Calculer le CO2 économisé (chaque bonne requête = 20g économisés)
    const savedCO2 = this.goodItemsClicked * 20 - this.badItemsClicked * 10;
    document.getElementById('saved-carbon').innerText = Math.max(0, savedCO2);
    
    // Afficher les résultats
    document.getElementById('game-results').style.display = 'block';
    
    // Ajouter un bouton pour recommencer
    const restartButton = document.createElement('button');
    restartButton.id = 'start-game';
    restartButton.innerText = 'Recommencer';
    restartButton.addEventListener('click', () => this.start());
    gameArea.appendChild(restartButton);
    
    // Mise à jour du compteur global
    const globalSaved = document.getElementById('global-saved');
    const currentValue = parseInt(globalSaved.innerText);
    globalSaved.innerText = currentValue + Math.max(0, savedCO2);
  }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le compteur de carbone
  updateCarbonFootprint(0);
  
  // Configurer le jeu
  const startButton = document.getElementById('start-game');
  if (startButton) {
    startButton.addEventListener('click', () => game.start());
  }
  
  const restartButton = document.getElementById('restart-game');
  if (restartButton) {
    restartButton.addEventListener('click', () => game.start());
  }
});
