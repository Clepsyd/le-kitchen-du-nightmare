import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { filter } from "rxjs/operators";
import { User } from 'src/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private socket: Socket) {
    this.user$ = this.socket.fromEvent('nameReceived')
    this.otherUsers$ = this.socket.fromEvent('users')
  }

  user: User;
  user$: Observable<User>;
  otherUsers$: Observable<User[]>;

  sendName(name: string): void {
    this.socket.emit('updateName', name);
  }

  getUser(): Observable<User> {
    return this.user$
  }

  getUsers(): Observable<User[]> {
    return this.otherUsers$
  }
}
