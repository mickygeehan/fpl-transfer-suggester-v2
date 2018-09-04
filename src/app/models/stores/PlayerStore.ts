import {Player} from '../player';
import {Team} from '../team';

export class PlayerStore {
  private players: Player[];

  constructor() {
    this.players = [];
  }

  setPlayers(players: Player[]) {
    this.players = players;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  updateAllPlayers(teams: Team[]) {
    this.players.forEach(player => {
      teams.forEach(team => {
        if (team.code === player.team_code) {
          player.fdr = team.fixDiff;
          player.opponentsAndDiff = team.opponentsAndDiff;
        }
      });
    });
  }



}
