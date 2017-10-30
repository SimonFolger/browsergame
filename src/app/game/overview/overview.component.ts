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

  constructor(
    private playerService: PlayerService,
    private gameComponent: GameComponent
  ) { }

  ngOnInit() {
    
  }



}
