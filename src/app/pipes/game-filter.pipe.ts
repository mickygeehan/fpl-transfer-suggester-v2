import { Pipe, PipeTransform } from '@angular/core';
import {PlayerService} from '../service/player.service';

@Pipe({
  name: 'gameFilter'
})
export class GameFilterPipe implements PipeTransform {

  constructor(private playerService: PlayerService) {}

  transform(value: any, args?: any): any {

    if (args) {
      const teamID = this.getTeamID(args);
      let toReturn = [];

      if (teamID !== -1) {
        value.forEach(game => {
          if (game['team_h'] === teamID || game['team_a'] === teamID) {
            toReturn.push(game);
          }
        });
        return toReturn;
      }
    }

    console.log(value);
    return value;
  }

  getTeamID(input: string): number {
    return this.playerService.getTeamId(input);
  }


}
