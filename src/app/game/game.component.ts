import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../core/services/player.service';
import { Player } from './../core/classes/player';
import {MatProgressBarModule} from '@angular/material';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  players: Observable<Player[]>;
  player: Observable<Player>;
  selectedNav: string = "Overview";
  playerLevelProgress: number;
  playerData: Player;
  levelPercent: number;

  email: string;
  classIconPath: string;

  constructor(private authService: AuthService, private playerService: PlayerService) { }

  ngOnInit() {
   this.players = this.playerService.getPlayers();
    if(this.authService.authState) {
      this.email = this.authService.currentUser['email'];
      this.getPlayer();
    } else {
      this.logout();
    }
  }

  getPlayer() {
    this.player = this.playerService.getPlayer(this.email);
    this.player.subscribe(val => {
      this.classIconPath = "../../assets/" + val.class + ".svg";
      this.playerData = val;
      this.getLevelProgress();
    })
    
  }
  
  setSelectedNav(clickedNav: string) {
    this.selectedNav = clickedNav;
  }

  logout() {
    this.authService.signOut();
  }

  getLevelProgress() {
    this.playerLevelProgress = (this.playerData.level.exp / (70 * ((this.playerData.level.level + 1) * (this.playerData.level.level + 1)) + 200 * (this.playerData.level.level + 1))) * 100;
    this.levelPercent = Math.round(this.playerLevelProgress);
  }

}
