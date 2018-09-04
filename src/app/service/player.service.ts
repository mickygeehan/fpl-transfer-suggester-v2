// tslint:disable:no-inferrable-types
import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// my imports
import {TeamStore} from '../models/stores/TeamStore';
import {Player} from '../models/player';
import {Team} from '../models/team';
import {Fixture} from '../models/fixture';
import {catchError, map} from 'rxjs/operators';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs';
import {PlayerStore} from '../models/stores/PlayerStore';
import {UserStore} from '../models/stores/UserStore';


// TODO - Create a store and put all functions into the store
// For eg Team store and all function goes into that store
// TESTS - Make sure getplayers works when it is false

@Injectable()
export class PlayerService {

  // stores
  private teamStore: TeamStore;
  private playerStore: PlayerStore;
  private userStore: UserStore;

  // final variables
  private dataURL: string = 'https://fantasy.premierleague.com/drf/bootstrap-static';
  private userTeamURL: string = 'https://fantasy.premierleague.com/drf/transfers';
  private fixtureURL: string = 'https://fantasy.premierleague.com/drf/fixtures/';

  // Data to be viewed in controllers
  private usersTeam: Player[];
  private players: Player[];
  private teams: Team[];
  private totalMinutesPlayed: number;

  // Data for this class only
  private picks: [any];
  private dataInitialised: boolean = false;
  private minMinutesPlayed: number;


  constructor(private http: HttpClient) {
    this.teamStore = new TeamStore();
    this.playerStore = new PlayerStore();
  }

  /** HTTP Requests */
  getBulkData(): any {
    // now returns an Observable of Config
    return this.http.get(this.dataURL).pipe(
      map((response) => {
          if (this.validateGetResponse(response)) {
            this.teamStore.setTeams(response['teams'] as Team[]);
            this.playerStore.setPlayers(response['elements'] as Player[])
            this.dataInitialised = true;
          }
        }
      )
    );
  }

  getFixtures(): any {
    // now returns an Observable of Config
    return this.http.get(this.fixtureURL).pipe(
      map((response) => {
          if (this.validateGetResponse(response)) {
            this.teamStore.setFixtures(response as Fixture[]);
            this.teamStore.addFixturesToTeams();
            this.teamStore.calculateFixtureDifficulty(2);
            this.playerStore.updateAllPlayers(this.teamStore.getTeams());
          }
        }
      )
    );
  }

  getUsersTeamFromUrl(): any {
    return this.http.get(this.userTeamURL).pipe(
      map((response) => {
        if (this.validateGetResponse(response)) {
          this.minMinutesPlayed = (response['entry'].current_event * 90) - 100;
          this.totalMinutesPlayed = response['entry'].current_event * 90;
          this.picks = response['picks'];
          this.usersTeam = this.getUsersPlayersFromBulk();
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
    return this.playerStore.getPlayers();
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

  /**
   * Returns the team store
   * @returns {TeamStore}
   */
  getTeamStore(): TeamStore {
    return this.teamStore;
  }

  getPlayerStore(): PlayerStore {
    return this.playerStore;
  }
}



