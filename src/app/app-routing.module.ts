import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { HomeComponent } from './home/home.component';
import { FixtureComponent } from './fixture/fixture.component';
import { PlayerReplacementComponent } from './player-replacement/player-replacement.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';



const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'players',
    component: PlayerListComponent
  },
  {
    path: 'fixtures',
    component: FixtureComponent
  },
  {
    path: 'player/:id',
    component: PlayerReplacementComponent
  },
  {
    path: 'playerdetail/:id',
    component: PlayerDetailComponent
  },
  {
    path: 'new',
    component: WhatsNewComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {

}
