import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/player.service';
import { Player } from './../../core/player';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Mission } from './../../core/mission';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { MissionService } from './../../core/mission.service';
import { Reward } from './../../core/reward';
import { GameComponent } from './../game.component';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})


export class MissionComponent implements OnInit {

  player: Observable<Player>;
  missions: Observable<Mission[]>;
  randomMissions: Mission[] = [];
  countdown: any;
  counter: number;
  questSuccessful: boolean = false;
  email: string ;
  heroName: string = "";
  heroClass: string = "";
  finishTime: number;
  goldReward: number;
  silverReward: number;
  playerData: Player;
 
  constructor(
    private playerService: PlayerService, 
    private missionService: MissionService,
    private gameComponent: GameComponent,
  ) { } 

  //Funktionen die beim Seitenaufruf gestartet werden
  ngOnInit() {
    this.player = this.playerService.getPlayer(this.gameComponent.email);
    this.getMissions();
    //this.compareOutstandingMissions();
    this.missions.subscribe(val => {
      let allMissions = val;
      let missionLength = allMissions.length;
      while(this.randomMissions.length < 3) {
        let random = Math.floor(Math.random() * missionLength);
        if (!this.randomMissions.includes(allMissions[random])) {
         this.randomMissions.push(allMissions[random]);
        }
      }    
    })
  } 
  
  //Lädt alle Missionen aus der Datenbank
  getMissions() {
    this.missions = this.missionService.getMissions();
  }

  //Holt sich die aktuelle Uhrzeit in Millisekunden
  getCurrentTime() {
    return new Date().getTime();
  }

  //Wenn Mission gestartet wird <Button> 1. Speichere bei Click Questdaten in DB 2, Führe aus wenn Zähler = Missionszeit
  missionStart (mission:Mission) {
    let currentTime = this.getCurrentTime();
    this.saveQuestData(currentTime + mission.timeq * 1000, mission.goldq, mission.silverq);
    let timer = TimerObservable.create(25, 12); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.counter = t;
      if (this.counter == mission.timeq) {
       this.countdown.unsubscribe();
       //.subscribe(val => player = val); dem Player werden die Daten aus dem PlayerObservable zugewiesen. Somit kann ich nun auf alle Daten die in der PlayerComponent sind zugreifen / abrufen
       let playerData:Player;
       this.player.subscribe(val=> playerData = val);
       console.log(this.player);
       console.log(this.playerData);
       
       this.playerData.gold += mission.goldq;
       this.playerData.silver += mission.silverq;
       this.questSuccessful = true;
       this.update(this.playerData.gold, this.playerData.silver); 
      }
    })
  }

  //Speichere QuestDaten in Datenbank
  saveQuestData(finishedQuestTime:number, missionsGold:number, missionsSilver:number) {
    this.finishTime = finishedQuestTime;
    this.goldReward = missionsGold;
    this.silverReward = missionsSilver;
    let playerObject:Player = {
      name:this.heroName, 
      email:this.email,
      class:this.heroClass,
      last:this.getCurrentTime(),
      gold:missionsGold,
      silver:missionsSilver,
      stats: null,
      offlinedata:{
        questrewardgold:missionsGold,
        questrewardsilver:missionsSilver,
        finishedquest:finishedQuestTime
      }
    }
    this.playerService.offlinereward(playerObject);
  }

  //Update aktuelle Spielerdaten in Datenbank
  update(gold:number, silver:number) {
    let playerObject:Player = {
      name:this.heroName, 
      email:this.email,
      class:this.heroClass,
      last:this.getCurrentTime(),
      gold:gold,
      silver:silver,
      offlinedata:null,
      stats: null
    }
    this.playerService.update(playerObject);
  }
/*
  //Vergleiche in Datenbank ob Missionen während der Offlinezeit abgeschlossen worden sind.
  compareOutstandingMissions() {
    if (this.getCurrentTime() >= this.finishTime)   {
      let playerObject:Player = {
        name:this.heroName, 
        email:this.email,
        class:this.heroClass,
        last:this.getCurrentTime(),
        stats: null,
        gold:this.gold + this.goldReward,
        silver:this.silver + this.silverReward,
        offlinedata:{
          questrewardgold:this.goldReward,
          questrewardsilver:this.silverReward,
          finishedquest:this.finishTime
        }
      } 
      this.playerService.update(playerObject);
    } 
  }
*/
}


