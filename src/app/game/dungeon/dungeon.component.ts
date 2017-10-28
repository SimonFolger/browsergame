import { Component, OnInit } from '@angular/core';
import { DungeonService } from './../../core/services/dungeon.service'
import { Dungeon } from './../../core/classes/dungeon'


@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit {

  dungeons:any;

  constructor(
    private dungeonService: DungeonService,
  ) { }

  ngOnInit() {
    this.getDungeons();
  }

  getDungeons() {
    this.dungeons = this.dungeonService.getDungeons();
  }
}
