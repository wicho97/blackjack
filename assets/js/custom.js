class Card {
    constructor(suit, name, faceValue) {
        this.suit = suit;
        this.name = name;
        this.faceValue = faceValue;
    }
}

class Hand {
    constructor(cards) {
        this.cards = cards || [];
    }

    getScore() {
        let score = 0;
        let numberOfAces = 0;

        this.cards.forEach(card => {
            if (card.name === "A") {
                numberOfAces++;
            } else {
                score += card.faceValue;
            }
        });

        for (let i = 0; i < numberOfAces; i++) {
            if (score + 11 <= 21) {
                score += 11;
            } else {
                score += 1;
            }
        }

        return score;
    }

    addCard(card) {
        this.cards.push(card);
    }
}

const SUITS = {
    "HEART": "♥",
    "SPADE": "♠",
    "CLUB": "♣",
    "DIAMOND": "♦",
};

const cards = {
    "A": [1, 11],
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10,
};

const btnAddCard = document.getElementById("add-card");
const btnStopAddCard = document.getElementById("stop-add-card");
const btnResetGame = document.getElementById("reset-game");
const PlayerDeckContainer = document.getElementById("player-deck");
const DealerDeckContainer = document.getElementById("dealer-deck");
const WinLoseTitle = document.getElementById("win-lose-title");
const PlayerScoreText = document.getElementById("player-score-text");
const DealerScoreText = document.getElementById("dealer-score-text");

let deck = [];

Object.entries(cards).forEach(([name, faceValue]) => {
    Object.entries(SUITS).forEach(([suit, suitIcon]) => {
        deck.push(new Card(suit, name, faceValue));
    });
});

let playerHand = new Hand();
let dealerHand = new Hand();

function getRandomCard() {
    return deck[Math.floor(Math.random() * deck.length)];
}

function updateScoreText(playerHand, dealerHand) {
    PlayerScoreText.innerHTML = `Puntaje acumulado: ${playerHand.getScore()}`;
    DealerScoreText.innerHTML = `Puntaje acumulado: ${dealerHand.getScore()}`;
}

function getGameResultText(text) {
    WinLoseTitle.innerHTML = text;
    btnAddCard.style.display = "none";
    btnStopAddCard.style.display = "none";
}

function getResultGame(playerScore, dealerScore) {

    let isPlayerBlackJack = playerScore == 21;
    let isDealerBlackJack = dealerScore == 21;
    let isPlayerExceed21 = playerScore > 21;
    let isDealerExceed21 = dealerScore > 21;

    if (isPlayerBlackJack) {
        getGameResultText("Ganaste");
    } else if (isPlayerExceed21) {
        getGameResultText("Perdiste");
    } else {
        // PlayerScore < 21
        let isDealerPlaying = dealerScore !== undefined;

        if (!isDealerPlaying) {
            return;
        }

        if (isDealerBlackJack) {
            getGameResultText("Dealer Gana");
        } else if (isDealerExceed21) {
            getGameResultText("Ganaste");
        } else {
            // DealderScore < 21
            if (playerScore > dealerScore) {
                getGameResultText("Ganaste");
            } else {
                getGameResultText("Dealer Gana");
            }
        }
    }
}

function resetGame() {
    playerHand = new Hand([]);
    dealerHand = new Hand([]);

    deleteCards();

    WinLoseTitle.innerHTML = "";
    btnAddCard.style.display = "inline-block";
    btnStopAddCard.style.display = "inline-block";

    btnAddCard.dispatchEvent(new Event('click'));
    btnAddCard.dispatchEvent(new Event('click'));
}

function deleteCards() {
    while (PlayerDeckContainer.lastElementChild) {
        PlayerDeckContainer.removeChild(PlayerDeckContainer.lastElementChild);
    }

    while (DealerDeckContainer.lastElementChild) {
        DealerDeckContainer.removeChild(DealerDeckContainer.lastElementChild);
    }
}

btnAddCard.addEventListener("click", function () {
    cardTemplate(playerHand, PlayerDeckContainer);

    if (playerHand.cards.length >= 2) {
        cardTemplate(dealerHand, DealerDeckContainer);
    }

    updateScoreText(playerHand, dealerHand);
    getResultGame(playerHand.getScore());
});

function cardTemplate(userHand, userDeckContainer) {

    const randomCard = getRandomCard();
    userHand.addCard(randomCard);
    const suitIcon = SUITS[randomCard.suit];

    const board = document.createElement('div');
    board.classList.add('grid-item');
    board.innerHTML = `
        <div class="top-left">${randomCard.name}<br><div style="color:red;">${suitIcon}</div></div>
        <div class="heart">${suitIcon}</div><div></div><div></div>
        <div class="heart">${suitIcon}</div><div></div><div></div>
        <div class="heart">${suitIcon}</div>
        <div class="bottom-right">${randomCard.name}<br><div style="color:red;">${suitIcon}</div></div>`;
    userDeckContainer.appendChild(board);
}

btnStopAddCard.addEventListener("click", function () {
    while (dealerHand.getScore() < playerHand.getScore()) {
        cardTemplate(dealerHand, DealerDeckContainer)
        updateScoreText(playerHand, dealerHand);
    }

    getResultGame(playerHand.getScore(), dealerHand.getScore())
});

btnResetGame.addEventListener("click", resetGame);

resetGame();