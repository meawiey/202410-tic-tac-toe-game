import { Component, OnInit } from '@angular/core';

import { HelperToolsService } from '../services/helper-tools.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})

export class GamePage implements OnInit {
  public winnner_condition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  public currentUser = "player";
  public player1: Array<number> = [];
  public player2: Array<number> = [];
  public selected =
    ["", "", "",
      "", "", "",
      "", "", ""];
  public count = 0;
  public level = "easy";
  public startGame = false;
  public endGame = false;

  constructor(
    public helperTools: HelperToolsService
  ) { }

  ngOnInit() {
    this.helperTools.resizeElement();
    this.helperTools.getCurrentLogin();
    this.resetGame();
  }

  ionViewDidEnter() {
    this.helperTools.getCurrentLogin();
  }

  ionViewWillLeave() {
    this.resetGame();
  }

  resetGame() {
    this.currentUser = "player";
    this.player1 = [];
    this.player2 = [];
    this.selected =
      ["", "", "",
        "", "", "",
        "", "", ""];
    this.count = 0;
    this.startGame = false;
    this.endGame = false;
  }

  cellClicked(id: number) {
    this.startGame = true;
    if (this.selected[id] == "" && this.count < 9) {
      this.count++;
      if (this.currentUser == "player") {
        this.selected[id] = "X"
        this.player1.push(id);
        this.checkWinner(this.player1);
        this.currentUser = "computer";
        this.computerMove()
      }
      else if (this.currentUser == "computer") {
        this.selected[id] = "O";
        this.player2.push(id);
        this.checkWinner(this.player2);
        this.currentUser = "player";
      }
    }
    return true;
  }

  computerMove() {
    if (!this.endGame) {
      if (this.level == "easy") {
        this.computerModeEasy();
      } else if (this.level == "hard") {
        this.computerModeHard();
      }
    }

  }

  computerModeEasy() {
    let condition = true
    while (condition) {
      let randomNumber = Math.floor(Math.random() * 9);
      if (this.selected[randomNumber] == "") {
        this.cellClicked(randomNumber);
        condition = false;
      }
    }
  }

  computerModeHard() {
    if (this.player2.length == 0) {
      this.calculateFirstPick();
    } else if (this.player2.length == 1) {
      this.calculateSecondPick();
    } else if (this.player2.length == 2) {
      this.calculateThirdPick();
    } else if (this.player2.length == 3) {
      this.calculatefourthPick();
    }
  }

  calculateFirstPick() {
    let condition = true;
    let arrayOfFirstPick = [0, 2, 4, 6, 8];
    while (condition) {
      let firstpick = arrayOfFirstPick[Math.floor(Math.random() * arrayOfFirstPick.length)];
      if (this.selected[firstpick] == "") {
        this.cellClicked(firstpick);
        condition = false;
      }
    }
  }

  calculateSecondPick() {
    let computerPick = this.player2[0];
    let sceondPick = 0;
    let humanPick1 = this.player1[0];
    let humanPick2 = this.player1[1];
    let arrayOfSecondPick: number[] = [];

    //for block
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if (!this.winnner_condition[i].includes(computerPick) && this.winnner_condition[i].includes(humanPick1) && this.winnner_condition[i].includes(humanPick2)) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfSecondPick.push(a);
        arrayOfSecondPick.push(b);
        arrayOfSecondPick.push(c);
      }
    }
    arrayOfSecondPick = arrayOfSecondPick.filter((e, i) => e !== humanPick1);
    arrayOfSecondPick = arrayOfSecondPick.filter((e, i) => e !== humanPick2);

    if (arrayOfSecondPick.length > 0) {
      this.cellClicked(arrayOfSecondPick[0]);
      return;
    }

    //for win
    arrayOfSecondPick = [];
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if (this.winnner_condition[i].includes(computerPick) && !this.winnner_condition[i].includes(humanPick1) && !this.winnner_condition[i].includes(humanPick2)) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfSecondPick.push(a);
        arrayOfSecondPick.push(b);
        arrayOfSecondPick.push(c);
      }
    }
    arrayOfSecondPick = this.removeDup(arrayOfSecondPick);
    arrayOfSecondPick = arrayOfSecondPick.filter((e, i) => e !== computerPick);
    sceondPick = arrayOfSecondPick[Math.floor(Math.random() * arrayOfSecondPick.length)];
    this.cellClicked(sceondPick);
  }

  calculateThirdPick() {
    let computerPick1 = this.player2[0];
    let computerPick2 = this.player2[1];
    let thridPick = 0;
    let humanPick1 = this.player1[0];
    let humanPick2 = this.player1[1];
    let humanPick3 = this.player1[2];
    let arrayOfThirdPick: number[] = [];

    //for win
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if (this.winnner_condition[i].includes(computerPick1) && 
      this.winnner_condition[i].includes(computerPick2) && 
      !this.winnner_condition[i].includes(humanPick1) && 
      !this.winnner_condition[i].includes(humanPick2) &&
      !this.winnner_condition[i].includes(humanPick3)) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfThirdPick.push(a);
        arrayOfThirdPick.push(b);
        arrayOfThirdPick.push(c);
      }
    }
    arrayOfThirdPick = this.removeDup(arrayOfThirdPick);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== computerPick1);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== computerPick2);
    thridPick = arrayOfThirdPick[Math.floor(Math.random() * arrayOfThirdPick.length)];
    if (arrayOfThirdPick.length > 0) {
      this.cellClicked(arrayOfThirdPick[0]);
      return;
    }

    //for block
    arrayOfThirdPick = [];
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if (
        !this.winnner_condition[i].includes(computerPick1) &&
        !this.winnner_condition[i].includes(computerPick2) &&
        ((this.winnner_condition[i].includes(humanPick1) && this.winnner_condition[i].includes(humanPick2)) ||
          (this.winnner_condition[i].includes(humanPick2) && this.winnner_condition[i].includes(humanPick3)) ||
          (this.winnner_condition[i].includes(humanPick1) && this.winnner_condition[i].includes(humanPick3)))
      ) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfThirdPick.push(a);
        arrayOfThirdPick.push(b);
        arrayOfThirdPick.push(c);
      }
    }
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== humanPick1);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== humanPick2);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== humanPick3);
    if (arrayOfThirdPick.length > 0) {
      this.cellClicked(arrayOfThirdPick[0]);
      return;
    }

    //for new solution
    arrayOfThirdPick = [];
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if (
        !this.winnner_condition[i].includes(humanPick1) && 
        !this.winnner_condition[i].includes(humanPick2) && 
        !this.winnner_condition[i].includes(humanPick3)
      ) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfThirdPick.push(a);
        arrayOfThirdPick.push(b);
        arrayOfThirdPick.push(c);
      }
    }
    arrayOfThirdPick = this.removeDup(arrayOfThirdPick);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== computerPick1);
    arrayOfThirdPick = arrayOfThirdPick.filter((e, i) => e !== computerPick2);
    thridPick = arrayOfThirdPick[Math.floor(Math.random() * arrayOfThirdPick.length)];
    if (arrayOfThirdPick.length > 0) {
      this.cellClicked(thridPick);
      return;
    }
  }

  calculatefourthPick() {
    let condition = true;
    let computerPick1 = this.player2[0];
    let computerPick2 = this.player2[1];
    let computerPick3 = this.player2[2];
    let fourthPick = 0;
    let humanPick1 = this.player1[0];
    let humanPick2 = this.player1[1];
    let humanPick3 = this.player1[2];
    let humanPick4 = this.player1[3];
    let arrayOfFourthPick: number[] = [];

    //for win
    for (let i = 0; i < this.winnner_condition.length; i++) {
      if ((this.winnner_condition[i].includes(computerPick1) && this.winnner_condition[i].includes(computerPick2)) ||
      (this.winnner_condition[i].includes(computerPick1) && this.winnner_condition[i].includes(computerPick3)) || 
      (this.winnner_condition[i].includes(computerPick2) && this.winnner_condition[i].includes(computerPick3)) 
    ) {
        let [a, b, c] = this.winnner_condition[i]
        arrayOfFourthPick.push(a);
        arrayOfFourthPick.push(b);
        arrayOfFourthPick.push(c);
      }
    }
    arrayOfFourthPick = this.removeDup(arrayOfFourthPick);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== computerPick1);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== computerPick2);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== computerPick3);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== humanPick1);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== humanPick2);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== humanPick3);
    arrayOfFourthPick = arrayOfFourthPick.filter((e, i) => e !== humanPick4);

    fourthPick = arrayOfFourthPick[Math.floor(Math.random() * arrayOfFourthPick.length)];
    if (arrayOfFourthPick.length > 0) {
      this.cellClicked(arrayOfFourthPick[0]);
      return;
    }
    
    while (condition) {
      let fourthPick = Math.floor(Math.random() * this.selected.length);
      if (this.selected[fourthPick] == "") {
        this.cellClicked(fourthPick);
        condition = false;
      }
    }
  }

  removeDup(arr: number[]) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }

  checkWinner(player: Array<number>) {
    for (let i = 0; i < this.winnner_condition.length; i++) {
      const [a, b, c] = this.winnner_condition[i]
      if (player.includes(a) &&
        player.includes(b) &&
        player.includes(c)) {
        if (this.currentUser == "player") {
          if (this.helperTools.userScore?.stack == 2) {
            let newScore = this.helperTools.userScore?.score + 2;
            this.helperTools.updateScore(newScore, 0);
          } else {
            let newScore = this.helperTools.userScore?.score + 1;
            let newStack = this.helperTools?.userScore?.stack + 1;
            this.helperTools.updateScore(newScore, newStack);
          }
        } else if (this.currentUser == "computer") {
          let newScore = this.helperTools.userScore?.score;
          if (newScore > 0) {
            newScore--;
          }
          this.helperTools.updateScore(newScore, 0);
        }
        this.endGame = true;
        this.alertMessage(this.currentUser + " is winner");
        return true
      }
    }

    if (this.count == 9) {
      this.endGame = true;
      setTimeout(() => {
        alert("TIE")
      }, 1000);
    }
    return false
  }

  alertMessage(message: string) {
    setTimeout(() => {
      alert(message)
    }, 200);
  }

  logoutGame() {
    this.helperTools.logout();
  }

}
