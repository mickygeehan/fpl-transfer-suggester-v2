import {Team} from '../team';
import {Fixture} from '../fixture';

export class TeamStore {
  private teams: Team[];
  private fixtures: Fixture[];
  private teamNames: string[];

  constructor() {
    this.teams = [];
    this.teamNames = [];
  }

  getTeams(): Team[] {
    return this.teams;
  }

  setTeams(teams: Team[]) {
    this.teams = teams;
  }

  setFixtures(fixtures: Fixture[]) {
    this.fixtures = fixtures;
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
      let fixDiff = 1;
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

    // this.updateAllPlayers();
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
}
