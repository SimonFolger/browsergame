import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { Observable } from 'rxjs/Observable';
import { GameComponent } from './../game.component';
import { PlayerStats } from './../../core/classes/player-stats';
import 'rxjs/add/observable/interval'; 
import 'rxjs/add/operator/takeWhile'

@Component({
  selector: 'app-pvp',
  templateUrl: './pvp.component.html',
  styleUrls: ['./pvp.component.scss']
})
export class PvpComponent implements OnInit {

  players: Observable<Player[]>;
  playerObs: Observable<Player>;
  playerSelf: Player;
  fightMode: boolean = false;
  combatLogSelf: string[] = [];
  combatLogEnemy: string[] = [];
  enemyPlayer: Player;
  enemyHpBar: number = 100;
  playerHpBar: number = 100;
  enemyStats: any;
  playerStats: any;

  constructor(
    private playerService: PlayerService,
    private gameComponent: GameComponent
  ) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    this.getPlayer();
  }

  getPlayer() {
    this.gameComponent.getPlayer();
    this.playerObs = this.gameComponent.player;
    this.playerObs.subscribe(val => {
      this.playerSelf = val;
      this.playerStats = Object.assign({}, val.stats);
    });
  }

  /*fight(enemy: Player) {
    this.fightMode = true;
    let enemyStats = enemy.stats;
    let playerStats = this.playerSelf.stats;
    while (enemyStats.hp > 0 && playerStats.hp > 0) {
      if (enemyStats.hp > 0 && playerStats.hp > 0) {
          enemyStats.hp -= playerStats.attack;
          this.combatLog.push("You hit for " + playerStats.attack + ". Enemy has " + enemyStats.hp + " life points left.");
      }
      if (enemyStats.hp > 0 && playerStats.hp > 0) {
          playerStats.hp -= enemyStats.attack;
          this.combatLog.push("Enemy hits you for " + enemyStats.attack + ". You have " + playerStats.hp + " life points left.");
      }
      if (enemyStats.hp <= 0) {
        this.combatLog.push("You won!");
      } else if (playerStats.hp <= 0) {
        this.combatLog.push("You lost!");
      }
    }
  }*/

  fight(enemy: Player) {
    this.enemyPlayer = enemy;
    this.fightMode = true;
    let playerStats = this.playerSelf.stats;
    let enemyTurn = false;
    this.enemyStats = Object.assign({}, enemy.stats);
    let damage: number;
    Observable.interval(1000)
      .takeWhile(() => enemy.stats.health > 0 && playerStats.health > 0)
      .subscribe(i => {
        if (!enemyTurn) {
          damage = this.getDamage(playerStats);
          enemy.stats.health -= damage;
          this.combatLogSelf.unshift("You hit for " + damage + ". Enemy has " + enemy.stats.health + " life points left.");
          this.playerHpBar = (playerStats.health / this.playerStats.health) * 100;
          enemyTurn = !enemyTurn;
        } else {
          damage = this.getDamage(enemy.stats);
          playerStats.health -= damage;
          this.combatLogEnemy.unshift("Enemy hits you for " + damage + ". You have " + playerStats.health + " life points left.");
          this.enemyHpBar = (enemy.stats.health / this.enemyStats.health) * 100;
          enemyTurn = !enemyTurn;
        }
        if (enemy.stats.health <= 0) {
          this.combatLogSelf.unshift("You won!");
          this.enemyHpBar = 0;
        } else if (playerStats.health <= 0) {
          this.combatLogEnemy.unshift("Enemy won.");
          this.playerHpBar = 0;
        }
      }
    )
  }

  getDamage(stats: PlayerStats) {
    let random = Math.random();
    if (random < stats.crit) {
      console.log("CRIIIIITT");
      return stats.power * 2;
    } else {
      return stats.power;
    }
  }

  endFightMode() {
    this.fightMode = false;
    this.combatLogSelf = [];
    this.combatLogEnemy = [];
    this.enemyHpBar = 100;
    this.playerHpBar = 100;
    this.getPlayer();   
  }

}
