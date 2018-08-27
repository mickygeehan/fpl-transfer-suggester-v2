// tslint:disable:no-inferrable-types
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// my imports
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs';

import { Player } from '../models/player';
import { Team } from '../models/team';
import { Fixture } from '../models/fixture';
import { map } from 'rxjs/operators';



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



  constructor(private http: HttpClient) { }

  /* INITIALISEDATA(){}
     This is called by starting component,
     initialises all players and teams
     needed for when we get users pick data
   */
  initiliseData(): any {
    if (this.dataInitialised) {
      return Observable.of(this.dataInitialised);
    } else {
      return this.http.get(this.dataURL)
        .map(response => {
          this.players = response['elements'] as Player[];
          this.teams = response['teams'] as Team[];
          this.dataInitialised = true;
          return this.dataInitialised;
        })
        .catch(this.handleError);
    }
  }

  initialiseFixtures(): any {
    if (this.dataInitialised) {
      return this.http.get(this.fixtureURL)
        .map(response => {
          this.fixtures = response as Fixture[];
          // once got fixtures we can add to teams and then calculate fix diff
          this.addFixturesToTeams();
          this.calculateFixtureDifficulty(2);

          return true;
        });
    }
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

  /* Calculate fix diff based on upcoming games
     upcoming games is a number that is set to two
     Loop through each team get fixtures
  */
  calculateFixtureDifficulty(futureGames: number) {
    const temp: number = futureGames;
    this.teams.forEach(team => {
      let fixDiff: number = 1;
      const fixArr: Fixture[] = team.fixtures;
      let oppAndDiff: any[] = [];
      for (const fixture of fixArr) {
        if (!fixture.finished) {
          // Deal with fixture - first get home or away then add difficulty to overall
          if (fixture.team_h === team.id) {
            fixDiff *= fixture.team_h_difficulty;
            const classDiff = this.getDifficultyClass(fixture.team_h_difficulty);
            const opponent = this.getOpponent(fixture.team_a) as string;
            let fixObj = {
              'name': opponent as string,
              'diff': fixture.team_h_difficulty,
              'class': classDiff
            };
            oppAndDiff.push(fixObj);
          } else {
            const classDiff = this.getDifficultyClass(fixture.team_a_difficulty);
            const opponent = this.getOpponent(fixture.team_h);
            fixDiff *= fixture.team_a_difficulty;
            let fixObj = {
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


  // These fucntions below just return data to controllers
  getTotalMinutesPlayed(): number {
    return this.totalMinutesPlayed;
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

  getTeamId(input: string): number {
    for (const team of this.teams) {
      if (team.name.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
        return team.id;
      }
    }
  }

  getTeamName(id: number): string {
    for (const team of this.teams) {
      if (id === team.id) {
        return team.name;
      }
    }
  }

  getTeamNames(): string[] {
    return this.teamNames;
  }

  getDataInitialised(): boolean {
    return this.dataInitialised;
  }

  getPlayerFixDiffCss(playerTeamCode: number) {
    for (const team of this.teams) {
      if (team.code === playerTeamCode) {
        return team.fixDiffCss;
      }
    }
  }

  getPlayers(): Player[] {
    if (this.players) {
      return this.players;
    } else {
      console.log('There are no players TED');
      return [];
    }
  }

  getFixtures(): Fixture[] {
    if (this.fixtures) {
      return this.fixtures;
    } else {
      console.log('No fixtures mate');
      return [];
    }
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

  /* GETUSERSTEAM(){}
   This is called by the home component,
   gets the users picks and gives us 15 players ID,
   Then have to get the players info via that id
 */
  getUsersTeam(): any {
    // make sure data is initialised
    if (this.usersTeam) {
      return Observable.of(this.usersTeam);
    } else {
      if (this.dataInitialised) {
        return this.http.get(this.userTeamURL)
          .map(response => {
            this.minMinutesPlayed = (response['entry'].current_event * 90) - 100;
            this.totalMinutesPlayed = response['entry'].current_event * 90;
            this.picks = response['picks'];
            this.usersTeam = this.initialiseUsersTeamViaPicks();
            return this.usersTeam;
          })
          .catch(this.handleError);
      } else {
        console.log('data hasnt been initialised');
      }
    }
  }


  private initialiseUsersTeamViaPicks(): any[] {
    const toReturn = [];

    for (const pick of this.picks) {
      for (const player of this.players){
        if (player.id === pick.element) {
          toReturn.push(player);
        }
      }
    }
    return toReturn;
  }

  private handleError(error: any, caught: any): any {
    return Observable.of(error.status);
  }

}



