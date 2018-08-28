import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// My imports
import { AppComponent } from './app.component';
import { PlayerService } from './service/player.service';
import { AppRoutingModule } from './app-routing.module';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FixtureComponent } from './fixture/fixture.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PlayerReplacementComponent } from './player-replacement/player-replacement.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PlayerListComponent } from './player-list/player-list.component';
import { GameFilterPipe } from './pipes/game-filter.pipe';
import { WhatsNewComponent } from './whats-new/whats-new.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerDetailComponent,
    HomeComponent,
    FilterPipe,
    FixtureComponent,
    PlayerReplacementComponent,
    SafeHtmlPipe,
    PlayerListComponent,
    GameFilterPipe,
    WhatsNewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
