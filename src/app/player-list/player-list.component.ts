import { Component, OnInit } from '@angular/core';

import { Player } from '../models/player';
import { PlayerService } from '../service/player.service';


@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

  public players: Player[] = [];
  private teamNames: string[];
  private totalMins: number;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    this.teamNames = this.playerService.getTeamStore().getTeamNames();
    this.totalMins = this.playerService.getTotalMinutesPlayed();
    console.log(this.players);
  }

}
