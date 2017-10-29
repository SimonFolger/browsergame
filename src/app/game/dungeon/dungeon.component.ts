import { Component, OnInit } from '@angular/core';
import { DungeonService } from './../../core/services/dungeon.service';
import { Dungeon } from './../../core/classes/dungeon';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component';
import { Observable } from 'rxjs/Observable';
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {

  dungeons: Observable<Dungeon[]>;
  player: Observable<Player>;
  playerData: Player;
  choosenDungeon: Dungeon;
  chooseDungeonDisplay: boolean = true;
  choosenDungeonDisplay: boolean = false;
  countdown: any;
  counter: number;
  circleDungeonProgress: number;
  playerDungeonPart: string;
  newDungeonData: string;
  currentChapter: number;

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

  dungeonStart(dungeon: Dungeon) {
    this.currentChapter = this.playerData.dungeons[dungeon.name];
    this.choosenDungeon = dungeon;
    this.chooseDungeonDisplay = false;
    this.choosenDungeonDisplay = true;
    let timer = TimerObservable.create(2000, 1000); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.counter = t;
      this.progressDungeonCircle(dungeon.time);
      if (this.counter == dungeon.time) {
        this.countdown.unsubscribe();
        this.playerData.dungeons[dungeon.name] += 1;
        this.update(); 
      }
    })
  }
    
  progressDungeonCircle(circleTime: number) {
    this.circleDungeonProgress = (this.counter / circleTime) * 100;
  }

  update() {
    while (this.playerData.silver >= 100) {
      this.playerData.gold = this.playerData.gold + 1;
      this.playerData.silver = this.playerData.silver - 100;
    }
    this.playerService.update(this.playerData);
  }

}
