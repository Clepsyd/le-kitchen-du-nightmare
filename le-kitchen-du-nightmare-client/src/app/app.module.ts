import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { UserService } from 'src/services/user.service';
import { UsernameComponent } from './username/username.component';
import { GameService } from 'src/services/game.service';
import { GameComponent } from './game/game.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.serverUrl, options: {} };

@NgModule({
  declarations: [AppComponent, UsernameComponent, GameComponent],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    GameService,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
