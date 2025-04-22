let carbonFootprint = 0;

// Fonction pour mettre à jour l'empreinte carbone
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

// Jeu de tri des prompts
const promptGame = {
  prompts: [],
  currentPromptIndex: 0,
  score: 0,

  async init() {
    try {
      // Charger les prompts depuis le fichier JSON
      const response = await fetch('data/prompts.json');
      const data = await response.json();
      this.prompts = data.prompts;

      // Mélanger les prompts
      this.shufflePrompts();

      // Mettre à jour l'affichage du total
      document.getElementById('prompt-total').innerText = this.prompts.length;
      document.getElementById('final-total').innerText = this.prompts.length;

      // Initialiser les événements
      document.getElementById('prompt-useful').addEventListener('click', () => this.evaluateAnswer('utile'));
      document.getElementById('prompt-useless').addEventListener('click', () => this.evaluateAnswer('inutile'));
      document.getElementById('next-prompt').addEventListener('click', () => this.showNextPrompt());
      document.getElementById('restart-prompt-game').addEventListener('click', () => this.restart());

      // Afficher le premier prompt
      this.showCurrentPrompt();
    } catch (error) {
      console.error('Erreur lors du chargement des prompts:', error);
      document.getElementById('current-prompt').innerText = 'Erreur lors du chargement des prompts. Vérifie que le fichier JSON est accessible.';
    }
  },

  shufflePrompts() {
    // Algorithme de Fisher-Yates pour mélanger les prompts
    for (let i = this.prompts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.prompts[i], this.prompts[j]] = [this.prompts[j], this.prompts[i]];
    }
  },

  showCurrentPrompt() {
    if (this.currentPromptIndex < this.prompts.length) {
      const prompt = this.prompts[this.currentPromptIndex];
      document.getElementById('current-prompt').innerText = `"${prompt.text}"`;
      document.getElementById('prompt-result').style.display = 'none';

      // Mettre à jour la barre de progression
      const progressPercentage = (this.currentPromptIndex / this.prompts.length) * 100;
      document.getElementById('prompt-progress').style.width = `${progressPercentage}%`;
    } else {
      this.endGame();
    }
  },

  evaluateAnswer(answer) {
    const currentPrompt = this.prompts[this.currentPromptIndex];
    const isCorrect = answer === currentPrompt.category;

    // Afficher le résultat
    const resultElement = document.getElementById('result-correct');
    if (isCorrect) {
      resultElement.innerText = "✅ Correct!";
      resultElement.className = "result-message correct";
      this.score++;
    } else {
      resultElement.innerText = "❌ Incorrect!";
      resultElement.className = "result-message incorrect";
    }

    // Afficher l'explication
    document.getElementById('result-explanation').innerText = currentPrompt.explanation;

    // Mettre à jour le score
    document.getElementById('prompt-score').innerText = this.score;

    // Afficher le résultat
    document.getElementById('prompt-result').style.display = 'block';
  },

  showNextPrompt() {
    this.currentPromptIndex++;
    this.showCurrentPrompt();
  },

  endGame() {
    // Mettre à jour les scores finaux
    document.getElementById('final-score').innerText = this.score;

    // Générer un message basé sur le score
    const percentage = (this.score / this.prompts.length) * 100;
    let gif = "";
    let message = '';

    if (percentage >= 90) {
      gif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjJldzJlOGNhamt3Y3puaDE5am5pM3MybjlqangwNXIxNHI2eXE5NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/111ebonMs90YLu/giphy.gif";
      message = "Excellent! Tu as parfaitement compris comment utiliser l'IA de manière responsable!";
    } else if (percentage >= 70) {
      gif = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDN4cXJ4OGJnYnAyb3Q5ZXVob3o2NmR3cjNhYjVkOGQyYjJzY296YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d3mlE7uhX8KFgEmY/giphy.gif";
      message = "Très bien! Tu as une bonne compréhension de l'impact des requêtes IA.";
    } else if (percentage >= 50) {
      gif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjFiNnVwem1yY2U2dm4wY2huZWoxdHJpc3V4ZmR3bTB3YXNlaGtpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pHy10lSVfnAZeWLHta/giphy.gif";
      message = "Pas mal! Avec un peu plus de pratique, tu deviendras un expert de l'IA éco-responsable.";
    } else {
      gif = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXlwd3NlMnF0dHQwdzFlMHptcmNlcXVwbTNxbmJyY3BjY3VuZzloZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ULfvKnN48BHMs/giphy.gif"
      message = "Continue à apprendre! L'IA est un outil puissant, mais il faut l'utiliser avec discernement.";
    }

    document.getElementById('score-gif').src = gif;
    document.getElementById('score-message').innerText = message;

    // Afficher l'écran de fin
    document.getElementById('prompt-game-end').style.display = 'block';
  },

  restart() {
    // Réinitialiser le jeu
    this.currentPromptIndex = 0;
    this.score = 0;
    document.getElementById('prompt-score').innerText = this.score;
    document.getElementById('prompt-game-end').style.display = 'none';

    // Mélanger à nouveau les prompts
    this.shufflePrompts();

    // Afficher le premier prompt
    this.showCurrentPrompt();
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

  // Calcul des empreintes par catégorie (en g CO2e)
  const emailFootprint = emailCount * 4; // ~4g CO2e par email
  const streamingFootprint = streamingHours * 55; // 55g CO2e par heure selon Carbon Trust
  const gamingFootprint = gamingHours * 130; // 130g CO2e par heure de jeu en ligne
  const aiFootprint = aiRequests * 4.32; // 4,32g CO2e par requête IA
  const cloudFootprint = cloudStorage * 0.015; // ~0.015g CO2e par Go par jour

  // Calcul pour les appareils
  let deviceFootprint = 0;
  if (document.getElementById('device-smartphone').checked) deviceFootprint += 61; // 61g CO2e par jour
  if (document.getElementById('device-laptop').checked) deviceFootprint += 560; // 560g CO2e par jour
  if (document.getElementById('device-tablet').checked) deviceFootprint += 56; // 56g CO2e par jour 
  if (document.getElementById('device-desktop').checked) deviceFootprint += 2780; //2780g CO2e par jour
  if (document.getElementById('device-smartwatch').checked) deviceFootprint += 5.4; //5.4g CO2e par jour

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
    tip = 'Réduire ton streaming de 30 minutes par jour économiserait ' + Math.round(0.5 * 55 * 365 / 1000) + ' kg de CO₂e par an.';
  } else if (highestImpact === gamingFootprint && gamingHours > 1) {
    tip = 'Réduire ton temps de jeu de 30 minutes par jour économiserait ' + Math.round(0.5 * 130 * 365 / 1000) + ' kg de CO₂e par an.';
  } else if (highestImpact === emailFootprint && emailCount > 10) {
    tip = 'Nettoie ta boîte mail et réduis tes envois pour économiser jusqu\'à ' + Math.round(emailCount * 0.2 * 4 * 365 / 1000) + ' kg de CO₂e par an.';
  } else if (highestImpact === aiFootprint && aiRequests > 5) {
    tip = 'Réduire tes requêtes IA de moitié économiserait ' + Math.round((aiRequests / 2) * 4.32 * 365 / 1000) + ' kg de CO₂e par an.';
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

  // Initialiser le calculateur
  if (document.getElementById('email-usage')) {
    updateCalculator();
  }

  // Initialiser le jeu de tri des prompts
  promptGame.init();
});
