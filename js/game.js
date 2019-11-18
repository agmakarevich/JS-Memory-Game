import {getRandomIcons, maxIconCount} from "./icons.js";

class Game {
  gameDetails = {
    userName: null,
    totalCards: 0,
    openCards: 0,
    actionCounter: 0
  };

  nodes = {
    gamePlace: null,
    form: null,
    nameField: null,
    cardsField: null,
    modal: null,
    scores: null
  };

  constructor() {
    this.nodes.gamePlace = document.getElementById('gameField');
    this.nodes.form = document.getElementById('gameForm');
    this.nodes.nameField = document.getElementById('userName');
    this.nodes.cardsField = document.getElementById('gameCardNumber');
    this.nodes.modal = document.getElementById('gameEndModal');
    this.showGameForm();

    if (this.validateForm()) {
      let cardsNames = getRandomIcons(this.gameDetails.totalCards);
      this.nodes.gamePlace.innerHTML = '';
      cardsNames = [...cardsNames, ...cardsNames];
      while (cardsNames.length !== 0) {
        const index = (cardsNames.length !== 1) ? Math.round(Math.random() * (cardsNames.length - 1)) : 0;
        const getName = cardsNames[index];
        const newEl = document.createElement('div');
        newEl.className = 'gameItem fa ' + getName;
        newEl.setAttribute('name', getName);
        this.nodes.gamePlace.appendChild(newEl);
        cardsNames.splice(index, 1);
      }
      this.showGamePlace();
      this.initGame();
    }
  }

  validateForm() {
    const nameValue = this.nodes.nameField.value;
    const cardsValue = Number(this.nodes.cardsField.value);
    const isNameValid = !!nameValue;
    const isCountValid = !isNaN(cardsValue) && 1 <= cardsValue && cardsValue <= maxIconCount();

    this.gameDetails.userName = nameValue;
    this.gameDetails.totalCards = cardsValue;

    this.nodes.nameField.classList[isNameValid ? 'remove' : 'add']('invalid');
    this.nodes.cardsField.classList[isCountValid ? 'remove' : 'add']('invalid');

    return isNameValid && isCountValid;
  }

  initGame() {
    const cards = document.querySelectorAll('.gameItem');
    cards.forEach(cardElement => {
      cardElement.addEventListener('click', this.onCardClick())
    })
  }

  onCardClick() {
    const game = this;
    return function () {
      if (this.classList.contains('locked')) return;
      if (!this.classList.contains('open')) {
        this.classList.add('open');
      }
      game.checkCard(this);
    }
  }

  checkCard(selected) {
    if (this.activeCard) {
      if (selected !== this.activeCard && selected.getAttribute('name') === this.activeCard.getAttribute('name')) {
        this.activeCard.classList.add('locked');
        selected.classList.add('locked');
        this.activeCard = null;
        this.gameDetails.openCards++;
        if (this.gameDetails.openCards === this.gameDetails.totalCards) {
          this.showEndModal()
        }
      } else {
        selected.classList.remove('open');
        this.activeCard.classList.remove('open');
        this.activeCard = null;
      }
    } else {
      this.gameDetails.actionCounter++;
      this.activeCard = selected;
    }
  }

  showGamePlace() {
    this.nodes.gamePlace.classList.remove('hidden');
    this.nodes.form.classList.add('hidden');
    this.nodes.modal.classList.add('hidden');
  }

  showGameForm() {
    this.nodes.gamePlace.classList.add('hidden');
    this.nodes.modal.classList.add('hidden');
    this.nodes.form.classList.remove('hidden');
  }

  showEndModal() {
    this.nodes.gamePlace.classList.add('hidden');
    this.nodes.form.classList.add('hidden');
    this.nodes.modal.classList.remove('hidden');
    this.nodes.modal.innerHTML = `<h5>Поздравляем ${this.gameDetails.userName}!</h5><p>Вам понадобилось ${this.gameDetails.actionCounter} ходов чтобы выиграть!</p>`;
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Закрыть';
    this.nodes.modal.append(closeBtn);
    const game = this;
    closeBtn.addEventListener('click', function () {
      game.showGameForm();
    })
  }
}

document.getElementById('startBtn').addEventListener('click', function () {
  new Game();
});

