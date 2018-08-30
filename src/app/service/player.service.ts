// tslint:disable:no-inferrable-types
import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// my imports
import {Player} from '../models/player';
import {Team} from '../models/team';
import {Fixture} from '../models/fixture';
import {catchError, map} from 'rxjs/operators';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Observable} from 'rxjs/internal/Observable';
import { of } from 'rxjs';


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
  private usersTeam: Player[];
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

  initialiseFixtures(): any {
    // now returns an Observable of Config
    return this.http.get(this.fixtureURL).pipe(
      map((response) => {
          if (this.validateGetResponse(response)) {
            this.fixtures = response as Fixture[];
            this.addFixturesToTeams();
            this.calculateFixtureDifficulty(2);
          }
        }
      )
    );
  }

  initialiseUsersTeam(): any {
    return this.http.get(this.userTeamURL).pipe(
      map((response) => {
        if (this.validateGetResponse(response)) {
          console.log(response)
          this.minMinutesPlayed = (response['entry'].current_event * 90) - 100;
          this.totalMinutesPlayed = response['entry'].current_event * 90;
          this.picks = response['picks'];
          this.usersTeam = this.getUsersPlayersFromBulk();
          console.log(this.usersTeam);
        }
      }),
      catchError(error => of(error.status))
    );
  }

  getUsersPlayersFromBulk(): Player[] {
    const toReturn: Player[] = new Array();
    for (const pick of this.picks) {
      for (const player of this.players) {
        if (player.id === pick.element) {
          toReturn.push(player);
        }
      }
    }
    return toReturn;
  }

  getPlayer(id: number): Player {
    for (const player of this.players) {
      if (player.id === id) {
        return player;
      }
    }
  }

  getReplacementPlayers(playerToReplace: Player): Player[] {
    const toReturn: Player[] = [];
    this.players.forEach(player => {
      // check same position
      if (player.element_type === playerToReplace.element_type) {
        // check player has easier FDR
        if (player.fdr < playerToReplace.fdr) {
          // check players plays regularly
          if (player.minutes >= this.minMinutesPlayed) {
            toReturn.push(player);
          }
        }
      }
    });
    return toReturn;
  }

  // Also add names to team array for typeahead
  addFixturesToTeams() {
    this.teams.forEach(team => {
      // add team name for typeahead
      this.teamNames.push(team.name);
      // make sure to initialse this
      const toAdd: Fixture[] = [];
      this.fixtures.forEach(fixture => {
        if (team.id === fixture.team_a || team.id === fixture.team_h) {
          toAdd.push(fixture);
        }
      });
      team.fixtures = toAdd;
    });
  }

  calculateFixtureDifficulty(futureGames: number) {
    const temp: number = futureGames;
    this.teams.forEach(team => {
      let fixDiff: number = 1;
      const fixArr: Fixture[] = team.fixtures;
      const oppAndDiff: any[] = [];
      for (const fixture of fixArr) {
        if (!fixture.finished) {
          // Deal with fixture - first get home or away then add difficulty to overall
          if (fixture.team_h === team.id) {
            fixDiff *= fixture.team_h_difficulty;
            const classDiff = this.getDifficultyClass(fixture.team_h_difficulty);
            const opponent = this.getOpponent(fixture.team_a) as string;
            const fixObj = {
              'name': opponent as string,
              'diff': fixture.team_h_difficulty,
              'class': classDiff
            };
            oppAndDiff.push(fixObj);
          } else {
            const classDiff = this.getDifficultyClass(fixture.team_a_difficulty);
            const opponent = this.getOpponent(fixture.team_h);
            fixDiff *= fixture.team_a_difficulty;
            const fixObj = {
              'name': opponent as string,
              'diff': fixture.team_a_difficulty,
              'class': classDiff
            };
            oppAndDiff.push(fixObj);
          }
          futureGames--;
          if (futureGames === 0) {
            break;
          }
        }
      }
      team.fixDiff = fixDiff;
      team.opponentsAndDiff = oppAndDiff;
      // reset variables
      futureGames = temp;
    });

    this.updateAllPlayers();
  }

  updateAllPlayers() {
    this.players.forEach(player => {
      this.teams.forEach(team => {
        if (team.code === player.team_code) {
          player.fdr = team.fixDiff;
          player.opponentsAndDiff = team.opponentsAndDiff;
        }
      });
    });
  }

  getOpponent(id: number): string {
    for (const team of this.teams) {
      if (team.id === id) {
        return team.name;
      }
    }
  }

  getDifficultyClass(diff: number): string {
    // Todo change to switch statement
    if (diff === 1) {
      return 'difficulty-1';
    } else if (diff === 2) {
      return 'difficulty-2';
    } else if (diff === 3) {
      return 'difficulty-3';
    } else if (diff === 4) {
      return 'difficulty-4';
    } else {
      return 'difficulty-5';
    }
  }

  validateGetResponse(response): boolean {
    if (response === 200) {
      console.log('The game is updating check back later! ');
      return false;
    } else if (response === 403) {
      console.log('Not Logged in');
    }
    return true;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getDataInitialised(): boolean {
    return this.dataInitialised;
  }

  getUsersTeam(): Player[] {
    return this.usersTeam;
  }

  getTotalMinutesPlayed(): number {
    return this.totalMinutesPlayed;
  }

  getTeamNames(): string[] {
    return this.teamNames;
}

  getTeamCode(input: string): number {
    for (const team of this.teams) {
      if (team.name.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
        return team.code;
      }
    }
  }

  getTeamId(input: string): number {
    for (const team of this.teams) {
      if (team.name.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
        return team.id;
      }
    }
  }
}



