import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../core/player.service';
import { Player } from './../core/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  players: Observable<Player[]>;
  player: Observable<Player>;

  email: string;

  constructor(private authService: AuthService, private playerService: PlayerService) { }

  ngOnInit() {
   this.players = this.playerService.getPlayers();
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

  logout() {
    this.authService.signOut();
  }

}
