import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { Observable } from 'rxjs/Observable';
import { GameComponent } from './../game.component';

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
  combatLog: string[] = [];

  constructor(
    private playerService: PlayerService,
    private gameComponent: GameComponent,
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
    });
  }

  fight(enemy: Player) {
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
  }

  endFightMode() {
    this.fightMode = false;
    this.combatLog = [];
  }

}
