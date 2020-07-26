import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from "src/models/user.models";
// import {  } from 'src/models/messages.models';
import { UserService } from 'src/services/user.service';
import { GameService } from 'src/services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private userService: UserService
  ) {}

  user$: Observable<User>
  users$: Observable<User[]>
  step$: Observable<number>;
  choices$: Observable<string[]>;

  ngOnInit() {
    this.user$ = this.userService.getUser();
    this.users$ = this.userService.getUsers();
    this.step$ = this.gameService.getStep();
    this.choices$ = this.gameService.getChoices();
  }

  sendName(name: string) {
    this.userService.sendName(name)
  }

  restart() {
    this.gameService.restart();
  }
}
