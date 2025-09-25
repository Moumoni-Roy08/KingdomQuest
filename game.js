// ==========================
// Create Medieval Coin & Lives Section
// ==========================
const topBar = document.createElement("div");
topBar.id = "top-bar";
topBar.innerHTML = `
    <div id="coins">💰 Coins: 0</div>
    <div id="lives">❤️ Lives: 3</div>
`;
document.body.appendChild(topBar);

// ==========================
// DOM Elements
// ==========================
const gameArea = document.querySelector(".game-area");
const restartBtn = document.getElementById("restart");

// ==========================
// Game Data - Medieval Themed
// ==========================
const cardFronts = [
    "images/Danger.png",
    "images/Danger1.png", 
    "images/jackpot.png",
    "images/jackpot1.png",
    "images/Mystery.png"
];

const backMessages = [
    { text: "+200 Gold 🎉", color: "gold" },
    { text: "-500 Gold 💀", color: "darkred" },
    { text: "+1000 Treasure 🤑", color: "goldenrod" },
    { text: "-200 Gold 😢", color: "brown" },
    { text: "+50 Bonus ⭐", color: "orange" }
];

// ==========================
// Game State
// ==========================
let coins = 0;
let lives = 3;
let selectedCards = [];

// ==========================
// Helper Functions - Medieval Themed
// ==========================
function getRandomBackMessage() {
    return backMessages[Math.floor(Math.random() * backMessages.length)];
}

function updateCoins(amount) {
    coins += amount;
    if (coins < 0) coins = 0;
    
    const coinCounter = document.getElementById("coins");
    coinCounter.textContent = `💰 Coins: ${coins}`;
    coinCounter.classList.add("coin-pop");
    setTimeout(() => coinCounter.classList.remove("coin-pop"), 500);
    
    // Special effects for large gains
    if (amount >= 500) {
        createTreasureEffect();
    }
}

function updateLives(amount) {
    lives += amount;
    if (lives < 0) lives = 0;

    const livesCounter = document.getElementById("lives");
    livesCounter.textContent = `❤️ Lives: ${lives}`;
    livesCounter.classList.add("lives-flash");
    setTimeout(() => livesCounter.classList.remove("lives-flash"), 500);

    // Game Over with medieval theme
    if (lives === 0) {
        showMedievalPopup("💀 The Kingdom Has Fallen! Starting anew...");
        setTimeout(() => {
            coins = 0;
            lives = 3;
            updateCoins(0);
            updateLives(0);
            initGame();
        }, 2500);
    }
}

function showMedievalPopup(message) {
    const oldPopup = document.querySelector(".popup-message");
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement("div");
    popup.classList.add("popup-message");
    popup.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">⚔️</div>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 10);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 2000);
}

function createFloatingCoin() {
    const coin = document.createElement("div");
    coin.classList.add("floating-coin");
    coin.textContent = "🪙";
    coin.style.left = `${Math.random() * window.innerWidth}px`;
    coin.style.fontSize = `${Math.random() * 2 + 1}rem`;
    document.body.appendChild(coin);

    setTimeout(() => coin.remove(), 2000);
}

function createTreasureEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingCoin(), i * 200);
    }
}

function disableRemainingCards() {
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
        if (!selectedCards.includes(card)) {
            card.style.pointerEvents = "none";
            card.style.opacity = "0.5";
        }
    });
}

function enableAllCards() {
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
        card.style.pointerEvents = "auto";
        card.style.opacity = "1";
        card.classList.remove("selected");
    });
}

// ==========================
// Card Creation - Medieval Themed
// ==========================
function createCards() {
    gameArea.innerHTML = "";
    selectedCards = [];

    cardFronts.forEach((frontImg, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        
        const img = document.createElement("img");
        img.src = frontImg;
        img.alt = `Mystical Card ${index + 1}`;
        img.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140"><rect width="100" height="140" fill="%238b4513" stroke="%23b89450" stroke-width="3"/><text x="50" y="75" font-family="Arial" font-size="14" fill="%23f5e8c8" text-anchor="middle">Card ${index + 1}</text></svg>';
        };
        cardFront.appendChild(img);

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        const msg = getRandomBackMessage();
        cardBack.innerHTML = `<div class="back-message hidden" style="--msgColor:${msg.color}"><span>${msg.text}</span></div>`;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameArea.appendChild(card);

        // Card click selection with medieval feedback
        card.addEventListener("click", () => {
            if (selectedCards.includes(card)) {
                // Deselect card
                card.classList.remove("selected");
                selectedCards = selectedCards.filter(c => c !== card);
                enableAllCards();
                updateSelectionAlert();
            } else {
                if (selectedCards.length < 3) {
                    // Select card
                    selectedCards.push(card);
                    card.classList.add("selected");
                    
                    if (selectedCards.length === 3) {
                        disableRemainingCards();
                        showOpenCardsButton();
                    }
                    updateSelectionAlert();
                    
                    // Medieval sound effect (placeholder)
                    playMedievalSound();
                }
            }
        });
    });

    // Open Cards button
    const openBtn = document.createElement("button");
    openBtn.textContent = "🎯 Reveal Destiny";
    openBtn.id = "open-cards";
    openBtn.className = "quest-button";
    openBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        z-index: 9999;
    `;
    document.body.appendChild(openBtn);

    openBtn.addEventListener("click", revealSelectedCards);
}

function updateSelectionAlert() {
    const remaining = 3 - selectedCards.length;
    const messages = [
        "Choose your fate, brave one!",
        "The cards await your touch!",
        "Fortune favors the decisive!",
        "Select wisely, adventurer!"
    ];
    
    if (remaining > 0) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        showMedievalPopup(`${randomMsg} (${remaining} more card${remaining > 1 ? 's' : ''} needed)`);
    } else {
        showMedievalPopup("⚔️ Three cards chosen! Reveal your destiny!");
    }
}

function showOpenCardsButton() {
    const btn = document.getElementById("open-cards");
    btn.style.display = "block";
    btn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' }
    ], { duration: 1000, iterations: Infinity });
}

function revealSelectedCards() {
    let totalPoints = 0;
    let hasNegative = false;

    selectedCards.forEach((card, index) => {
        setTimeout(() => {
            const cardInner = card.querySelector(".card-inner");
            const cardBackSpan = card.querySelector(".card-back span");

            // Flip the card with delay
            cardInner.classList.add("flipped");

            // Reveal message
            setTimeout(() => {
                cardBackSpan.classList.remove("hidden");
                
                const points = parseInt(cardBackSpan.textContent.match(/-?\d+/)[0]);
                totalPoints += points;

                // Medieval effects
                if (points < 0) {
                    updateLives(-1);
                    hasNegative = true;
                    card.style.boxShadow = "0 0 20px darkred";
                } else {
                    createFloatingCoin();
                    card.style.boxShadow = "0 0 20px gold";
                }
            }, 300);

        }, index * 400);
    });

    // Final results
    setTimeout(() => {
        if (lives > 0) {
            updateCoins(totalPoints);
            
            const resultMessages = {
                positive: ["Magnificent fortune!", "The gods smile upon you!", "Royal treasury grows!"],
                negative: ["A costly lesson...", "The kingdom suffers...", "Fortune turns away..."],
                neutral: ["An interesting turn...", "The fates are mysterious...", "A balanced outcome..."]
            };
            
            let messageType = totalPoints > 0 ? "positive" : totalPoints < 0 ? "negative" : "neutral";
            const randomMsg = resultMessages[messageType][Math.floor(Math.random() * resultMessages[messageType].length)];
            
            showMedievalPopup(`${randomMsg} ${totalPoints >= 0 ? '+' : ''}${totalPoints} gold!`);
        }
        
        setTimeout(() => initGame(), 3000);
    }, 2000);
}

function playMedievalSound() {
    // Placeholder for medieval sound effects
    // In a real implementation, you would play an actual sound file
    console.log("🔊 Medieval selection sound played");
}

// ==========================
// Initialize Game
// ==========================
function initGame() {
    const oldBtn = document.getElementById("open-cards");
    if (oldBtn) oldBtn.remove();
    createCards();
    showMedievalPopup("🎯 The cards are laid! Choose your destiny!");
}

// ==========================
// Restart Button
// ==========================
restartBtn.addEventListener("click", () => {
    coins = 0;
    lives = 3;
    updateCoins(0);
    updateLives(0);
    initGame();
    showMedievalPopup("⚔️ The quest begins anew!");
});

// ==========================
// Start Game with Medieval Flair
// ==========================
window.addEventListener('load', () => {
    setTimeout(() => {
        showMedievalPopup("🏰 Welcome to Kingdom's Quest! 🏰");
        initGame();
    }, 1000);
});