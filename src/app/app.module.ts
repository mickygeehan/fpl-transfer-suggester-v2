import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FixtureComponent } from './fixture/fixture.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerReplacementComponent } from './player-replacement/player-replacement.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { FilterPipe } from './pipes/filter.pipe';
import { GameFilterPipe } from './pipes/game-filter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { AppRoutingModule } from './/app-routing.module';
import {PlayerService} from './service/player.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FixtureComponent,
    PlayerDetailComponent,
    PlayerListComponent,
    PlayerReplacementComponent,
    WhatsNewComponent,
    FilterPipe,
    GameFilterPipe,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
