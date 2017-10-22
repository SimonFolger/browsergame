import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/player.service';
import { Player } from './../../core/player';
import { GameComponent } from './../game.component'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  player: Observable<Player>;

  players: Observable<Player[]>;

  email: string;
  heroName: string = "";
  heroClass: string = "";
  created: boolean = true;

  date = new Date().getTime();

  constructor(
    private authService: AuthService, 
    private playerService: PlayerService,
    private game: GameComponent
  ) { }

  ngOnInit() {
    this.getPlayer();
  }

  getPlayer() {
    this.game.getPlayer();
    this.player = this.game.player;
    this.player.subscribe(val => {
      if (val != null) {
        this.created = true;
      } else if ( val == null) {
        this.created = false;
      }
    })
  }

  add() {
    let playerObject:Player = {
      name:this.heroName, 
      email:this.email,
      class:this.heroClass,
      last:this.date,
      gold:null,
      silver:null,
      offlinedata:null
    }
    this.playerService.add(playerObject);
  }

}
