import { Component, OnInit, Inject } from '@angular/core';
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
import {MatSnackBar} from '@angular/material';

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
    public snackBar: MatSnackBar    
  ) {  } 


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

  //SnackBar funktioniert noch nicht richtig!! Öffnet sicher IMMER!
  purchaseClothes(cloth:Clothes) {
      for (let inventorySlot in this.playerData.inventar) {
      if (this.playerData.inventar[inventorySlot] == 0 && this.playerData.silver >= cloth.price) {
        this.playerData.inventar[inventorySlot] = cloth.id;
        this.playerData.silver -= cloth.price;
        this.playerService.update(this.playerData);
        this.openSnackBarSuccessful();
        break;
      } else {
          this.openSnackBar();
        
      }
    } 
  }

  purchaseWeapon(weapon:Weapon) {
    for (let inventorySlot in this.playerData.inventar) {
      if (this.playerData.inventar[inventorySlot] == 0 && this.playerData.silver >= weapon.price) {
        this.playerData.inventar[inventorySlot] = weapon.id;
        this.playerData.silver -= weapon.price;
        this.playerService.update(this.playerData);
        this.openSnackBarSuccessful();
        break;
      } else {
          this.openSnackBar(); 
      }
    } 
  }

  openSnackBar() {
    this.snackBar.open("Not enough Silver | Space in Inventory", "", {extraClasses:['test'],
      duration: 3000,
    });
  }

  openSnackBarSuccessful() {
    this.snackBar.open("Successful purchase!", "", {
      duration: 3000,
    });
  }
}













  /*
  purchaseClothes(cloth:Clothes) {
    if (this.playerData.inventar[this.inventorySlot] < 1 && this.inventorySlot <= 10 && this.playerData.silver >= cloth.price) {
      this.playerData.inventar[this.inventorySlot] = cloth.id;
      this.playerData.silver -= cloth.price;
    } else {
      if (this.inventorySlot < 10) {
        this.inventorySlot +=1;
        this.purchaseClothes(cloth);
      } 
    }
     this.playerService.update(this.playerData);
  }

  purchaseWeapon(weapon:Weapon) {
    if (this.playerData.inventar[this.inventorySlot] < 1 && this.inventorySlot <= 10 && this.playerData.silver >= weapon.price) {
      this.playerData.inventar[this.inventorySlot] = weapon.id;
      this.playerData.silver -= weapon.price;
    } else {
      if (this.inventorySlot < 10){
        this.inventorySlot +=1;
        this.purchaseWeapon(weapon);
      }  
    }
     this.playerService.update(this.playerData);
  }*/

