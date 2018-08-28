import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../models/player';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-player-replacement',
  templateUrl: './player-replacement.component.html',
  styleUrls: ['./player-replacement.component.css']
})
export class PlayerReplacementComponent implements OnInit, OnDestroy {

  private routeSub: any;
  private id: number;
  private player: Player;
  private replacementPlayers: Player[];
  private playerPosition: number;

  constructor(private route: ActivatedRoute, private playerService: PlayerService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = Number.parseInt(params['id']);
      this.player = this.playerService.getPlayer(this.id);
      this.replacementPlayers = this.playerService.getReplacementPlayers(this.player);
      this.playerPosition = this.player.element_type;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
