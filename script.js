// Fonctionnalité existante
let clicks = 0;
function incrementClicks() {
  clicks++;
  document.getElementById('click-count').innerText = clicks;
  updateCarbonFootprint(10); 
}

let carbonFootprint = 0;
function updateCarbonFootprint(value) {
  carbonFootprint += value;
  const carbonElement = document.getElementById('carbon-value');
  if (carbonElement) {
    carbonElement.innerText = carbonFootprint;
  }

  const progressBar = document.getElementById('carbon-progress');
  if (progressBar) {
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

// Calculateur d'empreinte numérique
function updateCalculator() {
  // Récupération des valeurs
  const emailCount = parseInt(document.getElementById('email-usage').value);
  const streamingHours = parseFloat(document.getElementById('streaming-usage').value);
  const gamingHours = parseFloat(document.getElementById('gaming-usage').value);
  const aiRequests = parseInt(document.getElementById('ai-usage').value);
  const cloudStorage = parseInt(document.getElementById('cloud-usage').value);

  // Mise à jour des affichages de valeurs
  document.getElementById('email-value').innerText = emailCount;
  document.getElementById('streaming-value').innerText = streamingHours;
  document.getElementById('gaming-value').innerText = gamingHours;
  document.getElementById('ai-value').innerText = aiRequests;
  document.getElementById('cloud-value').innerText = cloudStorage;

  // Calcul des empreintes par catégorie (en g CO2)
  const emailFootprint = emailCount * 4; // ~4g CO2 par email
  const streamingFootprint = streamingHours * 150; // ~150g CO2 par heure (moyenne qualité)
  const gamingFootprint = gamingHours * 120; // ~120g CO2 par heure de jeu en ligne
  const aiFootprint = aiRequests * 10; // ~10g CO2 par requête IA
  const cloudFootprint = cloudStorage * 0.015; // ~0.015g CO2 par Go par jour

  // Calcul pour les appareils
  let deviceFootprint = 0;
  if (document.getElementById('device-smartphone').checked) deviceFootprint += 30;
  if (document.getElementById('device-laptop').checked) deviceFootprint += 40;
  if (document.getElementById('device-tablet').checked) deviceFootprint += 25;
  if (document.getElementById('device-desktop').checked) deviceFootprint += 55;
  if (document.getElementById('device-smartwatch').checked) deviceFootprint += 10;

  // Calcul total quotidien
  const dailyFootprint = emailFootprint + streamingFootprint + gamingFootprint + aiFootprint + cloudFootprint + deviceFootprint;

  // Calcul annuel (en kg)
  const yearlyFootprint = (dailyFootprint * 365) / 1000;

  // Equivalent en km voiture (moyenne 130g CO2/km)
  const equivalentKm = Math.round((yearlyFootprint * 1000) / 130);

  // Affichage des résultats
  document.getElementById('daily-footprint').innerText = Math.round(dailyFootprint);
  document.getElementById('yearly-footprint').innerText = yearlyFootprint.toFixed(1);
  document.getElementById('equivalent').innerText = equivalentKm;

  // Conseil personnalisé
  let tip = '';
  const highestImpact = Math.max(emailFootprint, streamingFootprint, gamingFootprint, aiFootprint, cloudFootprint);

  if (highestImpact === streamingFootprint && streamingHours > 1) {
    tip = 'Réduire ton streaming de 30 minutes par jour économiserait ' + Math.round(0.5 * 150 * 365 / 1000) + ' kg de CO₂ par an.';
  } else if (highestImpact === gamingFootprint && gamingHours > 1) {
    tip = 'Réduire ton temps de jeu de 30 minutes par jour économiserait ' + Math.round(0.5 * 120 * 365 / 1000) + ' kg de CO₂ par an.';
  } else if (highestImpact === emailFootprint && emailCount > 10) {
    tip = 'Nettoie ta boîte mail et réduis tes envois pour économiser jusqu\'à ' + Math.round(emailCount * 0.2 * 4 * 365 / 1000) + ' kg de CO₂ par an.';
  } else if (highestImpact === aiFootprint && aiRequests > 5) {
    tip = 'Réduire tes requêtes IA de moitié économiserait ' + Math.round((aiRequests / 2) * 10 * 365 / 1000) + ' kg de CO₂ par an.';
  } else if (cloudStorage > 100) {
    tip = 'Nettoyer tes fichiers cloud pourrait réduire ton empreinte de stockage de ' + Math.round(cloudStorage * 0.2 * 0.015 * 365 / 1000) + ' kg par an.';
  } else {
    tip = 'Continue tes efforts! Tu peux encore réduire ton impact en limitant le temps d\'écran et en privilégiant le WiFi au réseau mobile.';
  }

  document.getElementById('personalized-tip').innerText = tip;
}

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

  // Initialiser le calculateur
  if (document.getElementById('email-usage')) {
    updateCalculator();
  }
});
