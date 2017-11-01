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
  playerSlot: number = 1;
  invSlot:number;

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

  purchaseWeapon(weapon:Weapon) {
    this.playerData.silver -= weapon.price;
  }

  purchaseClothes(cloth:Clothes) {
    this.playerData.silver -= cloth.price;
    if (this.playerData.inventar.slot[this.invSlot] < 1) {
      this.playerData.inventar.slot1 = cloth.id;
    } else if (this.playerData.inventar.slot2 < 1){
      this.playerData.inventar.slot2 = cloth.id;
    } else if (this.playerData.inventar.slot3 < 1) {
      this.playerData.inventar.slot3 = cloth.id;
    } else if (this.playerData.inventar.slot4 < 1) {
      this.playerData.inventar.slot4 = cloth.id;
    } else if (this.playerData.inventar.slot5 < 1) {
      this.playerData.inventar.slot5 = cloth.id;
    } else if (this.playerData.inventar.slot6 < 1) {
      this.playerData.inventar.slot6 = cloth.id;
    } else if (this.playerData.inventar.slot7 < 1) {
      this.playerData.inventar.slot7 = cloth.id;
    } else if (this.playerData.inventar.slot8 < 1) {
      this.playerData.inventar.slot8 = cloth.id;
    } else if (this.playerData.inventar.slot9 < 1) {
      this.playerData.inventar.slot9 = cloth.id;
    } else if (this.playerData.inventar.slot10 < 1) {
      this.playerData.inventar.slot10 = cloth.id;
    }
    this.playerService.update(this.playerData);
  } 
}

