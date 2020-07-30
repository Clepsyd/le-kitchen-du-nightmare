import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user.models';

interface CurrentStepData {
  step: number;
  choices: string[];
}

export interface Guess {
  user: User,
  correct: boolean
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private step$: Observable<number>;
  private choices$: Observable<string[]>;
  private answers$: Observable<string[]>;
  guess$: Observable<Guess>;
  win$: Observable<User>;

  constructor(private socket: Socket) {
    this.step$ = this.socket
      .fromEvent('currentStep')
      .pipe(map((data: CurrentStepData) => data.step));
    this.choices$ = this.socket
      .fromEvent('currentStep')
      .pipe(map((data: CurrentStepData) => data.choices));
    this.guess$ = this.socket.fromEvent('guess');
    this.win$ = this.socket.fromEvent('win');
    this.answers$ = this.socket.fromEvent('answers');
  }

  getStep(): Observable<number> { return this.step$ }
  getChoices(): Observable<string[]> { return this.choices$ }
  getAnswers(): Observable<string[]> {
    return this.answers$
  }
  sendChoice(step: number, choice:string) {
    this.socket.emit('choice', {step: step, choice: choice});
  }

  restart() {
    this.socket.emit('restart')
  }
}
