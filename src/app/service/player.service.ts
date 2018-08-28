// tslint:disable:no-inferrable-types
import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// my imports
import {Player} from '../models/player';
import {Team} from '../models/team';
import {Fixture} from '../models/fixture';
import {catchError, map} from 'rxjs/operators';
import {validate} from 'codelyzer/walkerFactory/walkerFn';


// TODO - Create a store and put all functions into the store
// For eg Team store and all function goes into that store
// TESTS - Make sure getplayers works when it is false

@Injectable()
export class PlayerService {

  // final variables
  private dataURL: string = 'https://fantasy.premierleague.com/drf/bootstrap-static';
  private userTeamURL: string = 'https://fantasy.premierleague.com/drf/transfers';
  private fixtureURL: string = 'https://fantasy.premierleague.com/drf/fixtures/';

  // Data to be viewed in controllers
  private usersTeam: any[];
  private players: Player[];
  private teams: Team[];
  private fixtures: Fixture[];
  private teamNames: string[] = [];
  private totalMinutesPlayed: number;

  // Data for this class only
  private picks: [any];
  private dataInitialised: boolean = false;
  private minMinutesPlayed: number;


  constructor(private http: HttpClient) {
  }

  /** GET heroes from the server */
  initialiseData(): any {
    // now returns an Observable of Config
    return this.http.get(this.dataURL).pipe(
      map((response) => {
          if (this.validateGetResponse(response)) {
            this.players = response['elements'] as Player[];
            this.teams = response['teams'] as Team[];
            this.dataInitialised = true;
          }
        }
      )
    );
  }

  validateGetResponse(response): boolean {
    if (response === 200) {
      console.log('The game is updating check back later! ');
      return false;
    }
    return true;
  }

  getPlayers(): Player[] { return this.players; }
  getDataInitialised(): boolean { return this.dataInitialised; }
}



