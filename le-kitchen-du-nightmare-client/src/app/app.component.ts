import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private socket: Socket) {}

  step: String[];
  loaded: boolean;

  ngOnInit() {
    this.socket
      .fromEvent('current')
      .subscribe((data: any) => {
        this.step = data;
        this.loaded = true;
      });
  }
}
