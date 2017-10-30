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
  chosenDungeon: Dungeon;
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
    this.getPlayer();
    this.getDungeons();
  }

  getPlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {this.playerData = val}); 
  }

  getDungeons() {
    this.dungeons = this.dungeonService.getDungeons();  
  }

  getImagePath(name:string) {
    return "../../../assets/dungeon/" + name + ".jpg";
  }

  startDungeon(dungeon: Dungeon) {
    this.currentChapter = this.playerData.dungeonProgress[dungeon.name];
    this.chosenDungeon = dungeon;
    let timer = TimerObservable.create(2000, 1000); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.counter = t;
      this.getProgress(dungeon.time);
      if (this.counter == dungeon.time) {
        this.countdown.unsubscribe();
        this.playerData.dungeonProgress[dungeon.name] += 1;
        this.updatePlayer(); 
      }
    })
  }
    
  getProgress(circleTime: number) {
    this.circleDungeonProgress = (this.counter / circleTime) * 100;
  }

  updatePlayer() {
    this.playerService.update(this.playerData);
  }

  goBackToOverview() {
    this.chosenDungeon = null;
  }
}
