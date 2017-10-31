import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  playerObs: Observable<Player>;
  player: Player;

  constructor(
    private playerService: PlayerService,
    private gameComponent: GameComponent
  ) { }

  ngOnInit() {
    this.getPlayer();
  }

  getPlayer() {
    this.gameComponent.getPlayer();
    this.playerObs = this.gameComponent.player;
    this.playerObs.subscribe(val => {
      this.player = val;
    });
  }

  levelUpStat(stat: string) {
    if (stat == "power"){
      this.player.stats.power += 10;
    } else if (stat == "health"){
      this.player.stats.health += 10;
    } else if(stat == "crit"){
      this.player.stats.crit += 0.01;
    }
    this.player.level.levelUps--;
    this.playerService.update(this.player);
  }

}
