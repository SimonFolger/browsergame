import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../core/player.service';
import { Player } from './../core/player';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  player: Observable<Player>;

  players: Observable<Player[]>;

  email: string;
  heroName: string;
  heroClass: string;


  constructor(private authService: AuthService, private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.players;
    if(this.authService.authState) {
      this.email = this.authService.currentUser['email'];
      this.getPlayer();
    } else {
      this.logout();
    }
  }

  getPlayer() {
      this.player = this.playerService.getPlayer(this.email);
  }

  add() {
    this.playerService.add(this.email, this.heroName, this.heroClass);
  }

  logout() {
    this.authService.signOut();
  }

}
