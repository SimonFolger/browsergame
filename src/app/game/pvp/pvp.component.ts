import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../../core/player.service'
import { Player } from './../../core/player'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pvp',
  templateUrl: './pvp.component.html',
  styleUrls: ['./pvp.component.scss']
})
export class PvpComponent implements OnInit {

  players: Observable<Player[]>;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
  }

  fight(name: string) {

  }

}
