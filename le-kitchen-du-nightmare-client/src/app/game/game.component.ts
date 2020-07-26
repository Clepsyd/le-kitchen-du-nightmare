import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/services/game.service';

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
  stepSub: Subscription;
  choiceSub: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.stepSub = this.currentStep$.subscribe(step => this.step = step);
    this.choiceSub = this.choices$.subscribe(choices => {
      this.choices = this.shuffle(choices);
    });
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

  ngOnDestroy() {
    this.choiceSub.unsubscribe();
    this.stepSub.unsubscribe();
  }

}
