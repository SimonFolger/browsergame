import { Component, OnInit } from '@angular/core';
import { DungeonService } from './../../core/services/dungeon.service';
import { Dungeon } from './../../core/classes/dungeon';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component';
import { Observable } from 'rxjs/Observable';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { PlayerStats } from './../../core/classes/player-stats';
import 'rxjs/add/observable/interval'; 
import 'rxjs/add/operator/takeWhile';

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
  bossEnemy: Dungeon;
  playerStats: any;
  bossStats: any;

  fightMode: boolean = false;
  combatLogSelf: string[] = [];
  combatLogEnemy: string[] = [];
  bossHpBar: number = 100;
  playerHpBar: number = 100;
 
 

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
    this.player.subscribe(val => {
      this.playerData = val;
      this.playerStats = Object.assign({}, val.stats);
    }); 
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

  //Level-Path skalierung fehlt noch -> d.h je höher der Path dester stärker der Boss (Power ist drinnen)(health: dungeonPath+1 * 0,5*baseHealth)
  fight(boss:Dungeon) {
    this.playerData.tickets -= 1;
    if (this.playerData.tickets !==-1 && this.playerData.tickets > -1){
      if (this.playerData.dungeonTicket.ticket1 == 0) {
        this.playerData.dungeonTicket.ticket1 = this.gameComponent.getCurrentTime();
      } else if (this.playerData.dungeonTicket.ticket2 == 0) {
        this.playerData.dungeonTicket.ticket2 = this.gameComponent.getCurrentTime();
      } else if (this.playerData.dungeonTicket.ticket3 == 0) {
        this.playerData.dungeonTicket.ticket3 = this.gameComponent.getCurrentTime();
      } this.updatePlayer();
      this.bossEnemy = boss;
      this.fightMode = true;
      let playerStats = this.playerData.stats;
      let bossTurn = false;
      this.bossStats =Object.assign({}, boss.stats);
      let damage: number;
      let damageBoss: number;
      Observable.interval(1000)
      .takeWhile(() => boss.stats.health > 0 && playerStats.health > 0)
      .subscribe(i => {
        if (!bossTurn) {
          damage = this.getDamage(playerStats);
          boss.stats.health -= damage;
          this.combatLogSelf.unshift("You hit for " + damage + ". " + boss.bossName + " has " + boss.stats.health + " life points left.");
          this.playerHpBar = (playerStats.health / this.playerStats.health) * 100;
          bossTurn = !bossTurn;
        } else {
          damage = this.getDamage(boss.stats);
          damageBoss = ((this.playerData.dungeonProgress[boss.name] +1) * (0.4 * damage));
          playerStats.health -= damageBoss;
          this.combatLogEnemy.unshift(boss.bossName + " hits you for " + damageBoss + ". You have " + playerStats.health + " life points left.");
          this.bossHpBar = (boss.stats.health / this.bossStats.health) * 100;
          bossTurn = !bossTurn;
        }
        if (boss.stats.health <= 0) {
          this.combatLogSelf.unshift("You won!");
          this.bossHpBar = 0;
          this.playerData.dungeonProgress[boss.name] += 1;
          this.playerData.silver += boss.silver;
          this.playerData.level.exp += boss.exp;
          this.updatePlayer(); 
        } else if (playerStats.health <= 0) {
          this.combatLogEnemy.unshift(boss.bossName + " won!");
          this.playerHpBar = 0;
        }
      })
    }
  }


  getDamage(stats: PlayerStats) {
    let random = Math.random();
    if (random < stats.crit) {
      return stats.power * 2;
    } else {
      return stats.power;
    }
  }

  endFightMode() {
    this.fightMode = false;
    this.combatLogSelf = [];
    this.combatLogEnemy = [];
    this.bossHpBar = 100;
    this.playerHpBar = 100;
    this.getPlayer();   
  }
}
