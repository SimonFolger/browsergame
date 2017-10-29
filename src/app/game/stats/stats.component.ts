import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  player: Observable<Player>;

  constructor(
    private playerService: PlayerService, 
    private gameComponent: GameComponent
  ) { }

  ngOnInit() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
  }

}
