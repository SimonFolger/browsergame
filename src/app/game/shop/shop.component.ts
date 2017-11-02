import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { GameComponent } from './../game.component';
import { ClothesService } from './../../core/services/clothes.service';
import { Clothes } from './../../core/classes/clothes';
import { WeaponService } from './../../core/services/weapon.service';
import { Weapon } from './../../core/classes/weapon';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  player: Observable<Player>;
  playerData: Player;
  weapons: Observable<Weapon[]>;
  clothes: Observable<Clothes[]>;
  weaponData: Weapon;
  clothData: Clothes;
  inventorySlot:number = 1;

  constructor(
    private playerService: PlayerService, 
    private gameComponent: GameComponent,
    private clothesService: ClothesService,
    private weaponService: WeaponService,
  ) { } 

  ngOnInit() {
    this.getPlayer();
    this.getWeapons();
    this.getClothes();
  }

  //Lädt aktuelle Spielerdaten aus Datenbank
  getPlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {
      this.playerData = val;
    });  
  }

  getWeapons() {
    this.weapons = this.weaponService.getWeapons();
  }

  getClothes() {
    this.clothes = this.clothesService.getClothes();
  }

  purchaseClothes(cloth:Clothes) {
    if (this.playerData.inventar[this.inventorySlot] < 1 && this.inventorySlot <= 10 ) {
      if (this.playerData.silver >= cloth.price) {
      this.playerData.inventar[this.inventorySlot] = cloth.id;
      this.playerData.silver -= cloth.price;
      }
    } else {
      this.inventorySlot +=1;
      this.purchaseClothes(cloth);
    }
     this.playerService.update(this.playerData);
  }

  purchaseWeapon(weapon:Weapon) {
    if (this.playerData.inventar[this.inventorySlot] < 1 && this.inventorySlot <= 10) {
      if (this.playerData.silver >= weapon.price){
      this.playerData.inventar[this.inventorySlot] = weapon.id;
      this.playerData.silver -= weapon.price;
      }
    } else {
      this.inventorySlot +=1;
      this.purchaseWeapon(weapon);
    }
     this.playerService.update(this.playerData);
  }
}

