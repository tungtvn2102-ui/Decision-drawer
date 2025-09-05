// Game State Management
class GameState {
    constructor() {
        this.currentPage = 'main';
        this.balance = 0;
        this.selectedPrediction = null;
        this.betAmount = 0;
        this.gameStarted = false;
        this.isRolling = false;
    }

    reset() {
        this.balance = 0;
        this.selectedPrediction = null;
        this.betAmount = 0;
        this.gameStarted = false;
        this.isRolling = false;
    }
}

const gameState = new GameState();

// DOM Elements
const mainPage = document.getElementById('mainPage');
const diceDreamsPage = document.getElementById('diceDreamsPage');
const setupModal = document.getElementById('setupModal');
const bettingInterface = document.getElementById('bettingInterface');
const resultsDisplay = document.getElementById('resultsDisplay');
const gameOverDisplay = document.getElementById('gameOverDisplay');

// Main Page Elements
const gameCards = document.querySelectorAll('.game-card');

// Game Page Elements
const backToGamesBtn = document.getElementById('backToGames');
const newGameBtn = document.getElementById('newGameBtn');
const currentBalance = document.getElementById('currentBalance');
const startingBalanceInput = document.getElementById('startingBalance');
const startGameBtn = document.getElementById('startGame');
const predictionBtns = document.querySelectorAll('.prediction-btn');
const betAmountInput = document.getElementById('betAmount');
const placeBetBtn = document.getElementById('placeBetBtn');
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const diceTotal = document.getElementById('diceTotal');
const resultStatus = document.getElementById('resultStatus');
const resultMessage = document.getElementById('resultMessage');
const balanceUpdate = document.getElementById('balanceUpdate');
const restartGameBtn = document.getElementById('restartGame');

// Mystical Messages
const mysticalMessages = {
    win: [
        "The cosmic forces smile upon you!",
        "Destiny has chosen to favor you this time!",
        "The mystical dice have spoken in your favor!",
        "Fortune's wheel has turned in your direction!",
        "The ancient magic flows through your victory!"
    ],
    loss: [
        "The cosmic forces test your resolve...",
        "Even the greatest mystics face setbacks.",
        "The dice whisper of lessons yet to be learned.",
        "Fortune's wheel continues its eternal turn.",
        "The mystical realm demands patience and wisdom."
    ],
    jackpot: [
        "THE COSMIC DICE HAVE BLESSED YOU WITH UNIMAGINABLE FORTUNE!",
        "THE STARS THEMSELVES ALIGN IN YOUR FAVOR!",
        "THE ANCIENT MAGIC SURGES THROUGH YOUR VICTORY!",
        "DESTINY HAS CHOSEN YOU FOR GREATNESS!"
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showMainPage();
});

function initializeEventListeners() {
    // Main page game card clicks
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.dataset.game;
            if (gameType === 'dice-dreams') {
                showDiceDreamsPage();
            } else {
                // Show coming soon message for other games
                showComingSoonMessage(gameType);
            }
        });
    });

    // Game page navigation
    backToGamesBtn.addEventListener('click', showMainPage);
    newGameBtn.addEventListener('click', startNewGame);
    restartGameBtn.addEventListener('click', startNewGame);

    // Game setup
    startGameBtn.addEventListener('click', startGame);
    startingBalanceInput.addEventListener('input', validateStartingBalance);

    // Betting interface
    predictionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectPrediction(this.dataset.prediction);
        });
    });

    betAmountInput.addEventListener('input', validateBetAmount);
    placeBetBtn.addEventListener('click', placeBetAndRoll);
}

function showMainPage() {
    gameState.currentPage = 'main';
    mainPage.classList.add('active');
    diceDreamsPage.classList.remove('active');
}

function showDiceDreamsPage() {
    gameState.currentPage = 'dice-dreams';
    mainPage.classList.remove('active');
    diceDreamsPage.classList.add('active');
    
    if (!gameState.gameStarted) {
        showSetupModal();
    }
}

function showSetupModal() {
    setupModal.classList.add('active');
    bettingInterface.style.display = 'none';
    resultsDisplay.classList.remove('active');
    gameOverDisplay.classList.remove('active');
}

function showComingSoonMessage(gameType) {
    const gameNames = {
        'hearts-gamble': 'Heart\'s Gamble',
        'cosmic-cards': 'Cosmic Cards',
        'golden-chance': 'Golden Chance'
    };
    
    alert(`${gameNames[gameType]} is coming soon! The mystical realm is still being prepared for your arrival.`);
}

function validateStartingBalance() {
    const value = parseInt(startingBalanceInput.value);
    const isValid = value >= 50;
    
    startGameBtn.disabled = !isValid;
    startGameBtn.style.opacity = isValid ? '1' : '0.5';
}

function startGame() {
    const balance = parseInt(startingBalanceInput.value);
    
    if (balance < 50) {
        alert('Minimum starting balance is $50');
        return;
    }
    
    gameState.balance = balance;
    gameState.gameStarted = true;
    
    updateBalanceDisplay();
    hideSetupModal();
    showBettingInterface();
}

function hideSetupModal() {
    setupModal.classList.remove('active');
}

function showBettingInterface() {
    bettingInterface.style.display = 'grid';
    resetBettingInterface();
}

function resetBettingInterface() {
    // Reset prediction selection
    predictionBtns.forEach(btn => btn.classList.remove('selected'));
    gameState.selectedPrediction = null;
    
    // Reset bet amount
    betAmountInput.value = '';
    gameState.betAmount = 0;
    
    // Reset dice display
    dice1.dataset.value = '';
    dice2.dataset.value = '';
    diceTotal.textContent = '';
    
    // Update place bet button
    updatePlaceBetButton();
}

function selectPrediction(prediction) {
    predictionBtns.forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`[data-prediction="${prediction}"]`).classList.add('selected');
    gameState.selectedPrediction = prediction;
    updatePlaceBetButton();
}

function validateBetAmount() {
    const value = parseInt(betAmountInput.value);
    gameState.betAmount = value || 0;
    updatePlaceBetButton();
}

function updatePlaceBetButton() {
    const canPlaceBet = gameState.selectedPrediction && 
                       gameState.betAmount > 0 && 
                       gameState.betAmount <= gameState.balance &&
                       !gameState.isRolling;
    
    placeBetBtn.disabled = !canPlaceBet;
}

function placeBetAndRoll() {
    if (gameState.isRolling) return;
    
    const betAmount = parseInt(betAmountInput.value);
    
    if (!gameState.selectedPrediction || betAmount <= 0 || betAmount > gameState.balance) {
        return;
    }
    
    gameState.betAmount = betAmount;
    gameState.balance -= betAmount;
    updateBalanceDisplay();
    
    rollDice();
}

function rollDice() {
    gameState.isRolling = true;
    updatePlaceBetButton();
    
    const cube1 = dice1.querySelector('.cube');
    const cube2 = dice2.querySelector('.cube');

    // Generate random dice values
    const dice1Value = Math.floor(Math.random() * 6) + 1;
    const dice2Value = Math.floor(Math.random() * 6) + 1;
    const total = dice1Value + dice2Value;

    // Add randomized pre-rotation for flair
    const extraTurnsX1 = 360 * (2 + Math.floor(Math.random() * 2));
    const extraTurnsY1 = 360 * (2 + Math.floor(Math.random() * 2));
    const extraTurnsX2 = 360 * (2 + Math.floor(Math.random() * 2));
    const extraTurnsY2 = 360 * (2 + Math.floor(Math.random() * 2));

    const rot1 = getRotationForFace(dice1Value);
    const rot2 = getRotationForFace(dice2Value);

    // Trigger the rotation
    requestAnimationFrame(() => {
        cube1.style.transform = `rotateX(${extraTurnsX1 + rot1.x}deg) rotateY(${extraTurnsY1 + rot1.y}deg)`;
        cube2.style.transform = `rotateX(${extraTurnsX2 + rot2.x}deg) rotateY(${extraTurnsY2 + rot2.y}deg)`;
    });

    // After animation completes, show totals and process result
    setTimeout(() => {
        dice1.dataset.value = dice1Value;
        dice2.dataset.value = dice2Value;
        diceTotal.textContent = `Total: ${total}`;

        // Glow bounce
        cube1.parentElement.style.filter = 'drop-shadow(0 0 10px #d4af37)';
        cube2.parentElement.style.filter = 'drop-shadow(0 0 10px #d4af37)';
        setTimeout(() => {
            cube1.parentElement.style.filter = 'none';
            cube2.parentElement.style.filter = 'none';
        }, 800);

        setTimeout(() => {
            processResult(total);
        }, 200);
    }, 2000);
}

// Map desired face to rotation that brings that face to the front (face.one is front)
function getRotationForFace(value) {
    // Values set so that the specified face becomes front after rotation
    // These work with the face transforms defined in CSS
    switch (value) {
        case 1: return { x: 0, y: 0 };            // one/front
        case 2: return { x: 0, y: -90 };          // two/right -> rotate -90 Y
        case 3: return { x: 0, y: 180 };          // three/back -> 180 Y
        case 4: return { x: 0, y: 90 };           // four/left -> 90 Y
        case 5: return { x: -90, y: 0 };          // five/top -> -90 X
        case 6: return { x: 90, y: 0 };           // six/bottom -> 90 X
        default: return { x: 0, y: 0 };
    }
}

function processResult(total) {
    const prediction = gameState.selectedPrediction;
    let won = false;
    let multiplier = 0;
    
    // Determine win/loss
    switch (prediction) {
        case 'under':
            won = total < 7;
            multiplier = won ? 2 : 0;
            break;
        case 'exactly':
            won = total === 7;
            multiplier = won ? 5 : 0;
            break;
        case 'over':
            won = total > 7;
            multiplier = won ? 2 : 0;
            break;
    }
    
    // Calculate winnings
    const winnings = won ? gameState.betAmount * multiplier : 0;
    gameState.balance += winnings;
    
    // Show results
    showResults(won, winnings, total, multiplier);
    
    // Check for game over
    if (gameState.balance <= 0) {
        setTimeout(() => {
            showGameOver();
        }, 3000);
    } else {
        // Return to betting after showing results
        setTimeout(() => {
            hideResults();
            resetBettingInterface();
            updatePlaceBetButton();
        }, 3000);
    }
}

function showResults(won, winnings, total, multiplier) {
    const isJackpot = multiplier === 5 && won;
    
    // Set result status
    resultStatus.textContent = won ? (isJackpot ? 'JACKPOT!' : 'YOU WIN!') : 'YOU LOSE';
    resultStatus.className = `result-status ${won ? (isJackpot ? 'jackpot' : 'win') : 'loss'}`;
    
    // Set result message
    const messages = won ? (isJackpot ? mysticalMessages.jackpot : mysticalMessages.win) : mysticalMessages.loss;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    resultMessage.textContent = randomMessage;
    
    // Set balance update
    if (won) {
        balanceUpdate.textContent = `+$${winnings} (New Balance: $${gameState.balance})`;
        balanceUpdate.style.color = '#4ade80';
    } else {
        // Show actual loss equal to bet amount already deducted
        balanceUpdate.textContent = `-$${gameState.betAmount} (New Balance: $${gameState.balance})`;
        balanceUpdate.style.color = '#f87171';
    }
    
    // Show results display
    resultsDisplay.classList.add('active');
    
    // Update balance display
    updateBalanceDisplay();
}

function hideResults() {
    resultsDisplay.classList.remove('active');
    gameState.isRolling = false;
}

function showGameOver() {
    gameOverDisplay.classList.add('active');
    gameState.isRolling = false;
}

function startNewGame() {
    gameState.reset();
    showSetupModal();
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    currentBalance.textContent = `$${gameState.balance}`;
    
    // Add counting animation for balance changes
    if (gameState.balance > 0) {
        currentBalance.style.color = '#d4af37';
    } else {
        currentBalance.style.color = '#f87171';
    }
}

// Particle Effects (placeholder for future enhancement)
function createParticleEffect(element, type = 'sparkle') {
    // This would create magical particle effects
    // For now, we'll use CSS animations and transforms
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'sparkle 1s ease-in-out';
}

// Sound Effects (placeholder for future enhancement)
function playSound(soundType) {
    // This would play mystical sound effects
    // For now, we'll use visual feedback only
    console.log(`Playing ${soundType} sound`);
}

// Add some magical interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('sparkle') || e.target.classList.contains('heart')) {
        createParticleEffect(e.target);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (gameState.currentPage === 'dice-dreams' && gameState.gameStarted && !gameState.isRolling) {
        switch(e.key) {
            case '1':
                selectPrediction('under');
                break;
            case '2':
                selectPrediction('exactly');
                break;
            case '3':
                selectPrediction('over');
                break;
            case 'Enter':
                if (!placeBetBtn.disabled) {
                    placeBetAndRoll();
                }
                break;
            case 'Escape':
                if (resultsDisplay.classList.contains('active')) {
                    hideResults();
                    resetBettingInterface();
                    updatePlaceBetButton();
                }
                break;
        }
    }
});

// Add some mystical hover effects
document.querySelectorAll('.game-card, .prediction-btn, .back-button, .new-game-btn').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Initialize the game
console.log('🎲 Decision Drawer - Mystical Decision Making App Initialized ✨');
