import { Pipe, PipeTransform } from '@angular/core';
import {PlayerService} from '../service/player.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private playerService: PlayerService){}

  transform(value: any, filterName): any {
    if (filterName) {
      // tslint:disable-next-line:label-position
      // tslint:disable-next-line:prefer-const
      let teamCode: number = this.playerService.getTeamCode(filterName);
      if (teamCode !== -1) {
        const toReturn = [];
        for (const pick of value) {
          if (pick.team_code === teamCode) {
            toReturn.push(pick);
          }
        }
        return toReturn;
      }
    }
      // tslint:disable-next-line:max-line-length
      return filterName ? value.filter(item => this.removeAccents(item.web_name).toLowerCase().indexOf(filterName.toLowerCase()) !== -1) : value;
  }

  // This function is for removing specials!
  removeAccents(value) {
    return value
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ú/g, 'u');
  }

  // This function is to gte team code via team
  // In future should get these from objects passed
  getTeamCode(input: string): number {
    switch (input.toLowerCase()) {
      case 'arsenal':
        return 3;
      case 'bournemouth':
        return 91;
      case 'southampton':
        return 20;
      case 'chelsea':
        return 8;
      case 'leicester':
        return 13;
      case 'man united':
        return 1;
      case 'man city':
        return 43;
      case 'crystal palace':
        return 31;
      case 'burnley':
        return 90;
      case 'liverpool':
        return 14;
      case 'brighton':
        return 36;
      case 'newcastle':
        return 4;
      case 'west brom':
        return 35;
      case 'west ham':
        return 21;
      case 'everton':
        return 11;
      case 'stoke city':
        return 110;
      case 'swansea':
        return 80;
      case 'huddersfield':
        return 38;
      case 'watford':
        return 57;
      case 'tottenham':
        return 6;
      default:
        return -1;
    }
  }
}
