import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../core/player.service'
import { Player } from './../../core/player'
import { Observable } from 'rxjs/Observable';
import { GameComponent } from './../game.component';
import { PvpService } from './../../core/pvp.service';
import { HeroClass } from './../../core/hero-class';

@Component({
  selector: 'app-pvp',
  templateUrl: './pvp.component.html',
  styleUrls: ['./pvp.component.scss']
})
export class PvpComponent implements OnInit {

  players: Observable<Player[]>;
  player: Observable<Player>;
  classes: any;
  myClass: string;
  enemyClass: any;

  constructor(private playerService: PlayerService,
              private gameComponent: GameComponent,
              private pvpService: PvpService) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    this.player = this.gameComponent.player;
  }

  fight(player: Player) {
    console.log(player);

    this.classes = this.pvpService.getClasses();
    this.player.subscribe(val => {
      console.log(val);
      this.myClass = val.class; 
    });
    console.log(this.myClass)
    this.enemyClass = player;
    console.log(this.enemyClass)
  }

}
