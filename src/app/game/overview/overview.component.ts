import { Component, OnInit, Input } from '@angular/core';
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

  //player: Observable<Player>;
  playerx: Player;

  players: Observable<Player[]>;

  constructor(
    private authService: AuthService, 
    private playerService: PlayerService,
    private gameComponent: GameComponent
  ) { }

  ngOnInit() {
    
  }



}
