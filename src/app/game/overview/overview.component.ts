import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { GameComponent } from './../game.component';
import { ClothesService } from './../../core/services/clothes.service';
import { Clothes } from './../../core/classes/clothes';
import { WeaponService } from './../../core/services/weapon.service';
import { Weapon } from './../../core/classes/weapon';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  playerObs: Observable<Player>;
  player: Player;
  weapons: Observable<Weapon[]>;
  clothes: Observable<Clothes[]>;
  weaponData: Weapon[];
  clothesData: Clothes[];
  inventarIds: number[] = [];
  inventar: any[] = [];
  dungeonTime: number;


  constructor(
    private playerService: PlayerService,
    private gameComponent: GameComponent,
    private weaponService: WeaponService,
    private clothesService: ClothesService,
  ) { }

  ngOnInit() {
    this.getPlayer();
    console.log(this.dungeonTime);
  }

  getPlayer() {
    this.gameComponent.getPlayer();
    this.playerObs = this.gameComponent.player;
    this.playerObs.subscribe(val => {
      this.player = val; 
      this.getNextDungeonTicket();   
      for (let item in this.player.inventar) {
        //this.inventarIds.push(this.player.inventar[item]);
        //this.getClothes();
        //this.getWeapons();
        this.inventar.push(this.weaponService.getWeapon(this.player.inventar[item]));
        
      }
    });
  }

  /*
  getWeapons() {
    this.weapons = this.weaponService.getWeapons();
    this.weapons.subscribe(val => {
      this.weaponData = val;
    })
  }

  getClothes() {
    this.clothes = this.clothesService.getClothes();
    this.clothes.subscribe(val => {
      this.clothesData = val;
    })
  }
  */

  levelUpStat(stat: string) {
    if (stat == "power"){
      this.player.stats.power += 5;
    } else if (stat == "health"){
      this.player.stats.health += 10;
    } else if(stat == "crit"){
      this.player.stats.crit += 0.01;
    }
    this.player.level.levelUps--;
    this.playerService.update(this.player);
  }
  
  getItemById(item:number) {
    return this.weaponData.find( weapon => weapon.id == item).name;
    

  } 
// funktioniert nur wenn alle drei tickets ausgefühlt sind!
  getNextDungeonTicket() {
    let ticket1 = this.player.dungeonTicket.ticket1;
    let ticket2 = this.player.dungeonTicket.ticket2;
    let ticket3 = this.player.dungeonTicket.ticket3;
    if (ticket1 > 0 && ticket2 == 0 && ticket3 == 0) {
      let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket1);
      this.dungeonTime = Math.round(time / 60000);
    } else if (ticket1 > 0 && ticket2 > 0 && ticket3 == 0)
     { if (ticket1 < ticket2) {
      let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket1);
      this.dungeonTime = Math.round(time / 60000);
     } else if (ticket1 > ticket2) {
      let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket2);
      this.dungeonTime = Math.round(time / 60000);
     }
      
    }else if (ticket1 > 0 && ticket2 > 0 && ticket3 > 0) {
      if (ticket1 <ticket2 && ticket1 < ticket3) {
        let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket1);
        this.dungeonTime = Math.round(time / 60000);
      } else if (ticket2 < ticket1 && ticket2 < ticket3) {
        let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket2);
        this.dungeonTime = Math.round(time / 60000);
      } else if (ticket3 <ticket2 && ticket3 < ticket1) {
        let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket3);
        this.dungeonTime = Math.round(time / 60000);
      }
      
    } else if (ticket1 == 0 && ticket2 > 0 && ticket3 >0) {
      if (ticket2 < ticket3) {
        let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket2);
        this.dungeonTime = Math.round(time / 60000);
      } else if (ticket3 < ticket2) {
        let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket3);
        this.dungeonTime = Math.round(time / 60000);
      } 
    } else if (ticket1 == 0 && ticket2 == 0 && ticket3 > 0) {
      let time = 10800000 - (this.gameComponent.getCurrentTime() - ticket3);
      this.dungeonTime = Math.round(time / 60000);
    }
  }
}
