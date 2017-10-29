import { Component, OnInit } from '@angular/core';
import { DungeonService } from './../../core/services/dungeon.service';
import { Dungeon } from './../../core/classes/dungeon';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {

  dungeons: Observable<Dungeon[]>;
  player: Observable<Player>;
  playerData: Player;


  constructor(
    private dungeonService: DungeonService,
    private playerService: PlayerService,
    private gameComponent: GameComponent,
  ) { }

  ngOnInit() {
    this.updatePlayer();
    this.updateDungeons();
  }

  updatePlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {this.playerData = val; console.log(this.playerData)});
    
  }

  updateDungeons() {
    this.dungeons = this.dungeonService.getDungeons();
    
  }

  getImagePath(name:string) {
    return "../../../assets/dungeon/" + name + ".jpg";
  }
}
