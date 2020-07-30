import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService, Guess } from 'src/services/game.service';
import { User } from 'src/models/user.models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  @Input() currentStep$: Observable<number>;
  @Input() choices$: Observable<string[]>;

  step: number;
  choices: string[];
  subs: Subscription[];
  answers$: Observable<string[]>;
  win$: Observable<User>;
  lastGuesser: User;
  timeout: any;

  showFeedback = false;
  guessIsCorrect = false;
  gameOver = false;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.subs = [];
    this.subs.push(this.currentStep$.subscribe(step => this.step = step));
    this.subs.push(
      this.choices$.subscribe(choices => {
        this.choices = this.shuffle(choices);
      })
    );
    this.subs.push(
      this.gameService.guess$.subscribe((guess: Guess) => {
        this.handleGuess(guess);
      })
    );
    this.subs.push(
      this.gameService.win$.subscribe(user => {
        this.lastGuesser = user;
        this.gameOver = true;
      })
    )
    this.answers$ = this.gameService.getAnswers()
  }

  shuffle(choices) {
    var currentIndex = choices.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = choices[currentIndex];
      choices[currentIndex] = choices[randomIndex];
      choices[randomIndex] = temporaryValue;
    }

    return choices;
  }

  sendChoice(choice) {
    this.gameService.sendChoice(this.step, choice);
  }

  handleGuess(guess: Guess) {
    this.guessIsCorrect = guess.correct;
    this.lastGuesser = guess.user;
    this.timeoutFeedback();
  }

  private timeoutFeedback() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.showFeedback = true;
    this.timeout = setTimeout(() => {
      this.showFeedback = false;
    }, 3000);
  }

  ngOnDestroy() {
    for (let sub of this.subs) {
      sub.unsubscribe();
    }
  }

}
