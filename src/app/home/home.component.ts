import {Component, OnInit, OnDestroy} from '@angular/core';

// my imports
import {PlayerService} from '../service/player.service';
import {Player} from '../models/player';
import {SafeHtmlPipe} from '../pipes/safe-html.pipe';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // This component will display all players in the users team

  // variables
  private req: any;
  private usersTeam: Player[];
  public notLoggedIn = false;
  private players: Player[];

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    /* initialise the data
       Once initialised then we can get the usersTeam
     */
    this.initialiseData();
  }

  initialiseData() {
    this.playerService.initialiseData().subscribe(() => {
      if (this.playerService.getDataInitialised()) {
        console.log('We have the data okay!');
        this.getUsersTeam();
      }
    });
  }

  getUsersTeam() {
    this.playerService.initialiseUsersTeam().subscribe((response) => {
      if (response === 403) {
        this.notLoggedIn = true;
      } else if (response === 200) {
        this.getUsersTeam();
      } else {
        console.log("we got your team");
        console.log(response);
        this.usersTeam = this.playerService.getUsersTeam();
        console.log(this.usersTeam);
      }
    });
  }

  myEvent(id: number) {
    this.playerService.calculateFixtureDifficulty(id);
    this.getUsersTeam();
  }

  // initialiseData() {
  //   if (this.playerService.getDataInitialised()) {
  //     this.getUserTeam();
  //   } else {
  //     this.req = this.playerService.initiliseData().subscribe(initialised => {
  //       if (initialised === 200) {
  //         console.log('The game is updating check back later! ');
  //       } else {
  //        // this.req = this.playerService.initialiseFixtures().subscribe(gotFixtures => {
  //         //  if (gotFixtures) {
  //          //   this.getUserTeam();
  //         //  }
  //         });
  //       }
  //     });
  //   }
  // }

  /*
   * 200 is a weird bug that you must open fantasy website before getting data so recall
   * 403 is no logged in
   */
  // getUserTeam() {
  //   this.req = this.playerService.getUsersTeam().subscribe(response => {
  //     if (response === 200) {
  //       this.getUserTeam();
  //     } else if (response === 403) {
  //       // set an error tag
  //       this.notLoggedIn = true;
  //     } else {
  //       this.usersTeam = response as [Player];
  //     }
  //   });
  // }
  //
  // myEvent(id: number) {
  //   this.playerService.calculateFixtureDifficulty(id);
  //   this.getUserTeam();
  // }

  ngOnDestroy() {
    this.req.unsubscribe();
  }

}
