import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user.models';

interface CurrentStepData {
  step: number;
  choices: string[];
}

interface Guess {
  user: User,
  correct: boolean
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private step$: Observable<number>;
  private choices$: Observable<string[]>;
  guess$: Observable<Guess>;
  winner$: Observable<User>;

  constructor(private socket: Socket) {
    this.step$ = this.socket
      .fromEvent('currentStep')
      .pipe(map((data: CurrentStepData) => data.step));
    this.choices$ = this.socket
      .fromEvent('currentStep')
      .pipe(map((data: CurrentStepData) => data.choices));
    this.guess$ = this.socket.fromEvent('guess');
    this.winner$ = this.socket.fromEvent('win');
  }

  getStep(): Observable<number> { return this.step$ }
  getChoices(): Observable<string[]> { return this.choices$ }

  sendChoice(step: number, choice:string) {
    this.socket.emit('choice', {step: step, choice: choice});
  }

  restart() {
    this.socket.emit('restart')
  }
}
