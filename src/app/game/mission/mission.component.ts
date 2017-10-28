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
import {MatGridListModule} from '@angular/material';
import { LevelService } from './../../core/level.service';
import { Level } from './../../core/level';


@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})


export class MissionComponent implements OnInit {

  player: Observable<Player>;
  missions: Observable<Mission[]>;
  levels: Observable<Level>;
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
  textq: boolean = true;
  chooseQuestDisplay: boolean = true;
  choosenQuestDisplay: boolean = false;
  choosenQuest: Mission;
  circleProgress: number;
  maxExpData:Level;


  constructor(
    private playerService: PlayerService, 
    private missionService: MissionService,
    private gameComponent: GameComponent,
    private levelService: LevelService,
  ) { } 

  //Funktionen die beim Seitenaufruf gestartet werden
  ngOnInit() {
    this.updatePlayer();
    this.getMissions();
    this.missions.subscribe(val => {
      let allMissions = val;
      let missionLength = allMissions.length;
      while(this.randomMissions.length < 4) {
        let random = Math.floor(Math.random() * missionLength);
        if (!this.randomMissions.includes(allMissions[random])) {
         this.randomMissions.push(allMissions[random]);
        }
      }    
    })
  } 
  
  updatePlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {
      this.playerData = val;
      this.compareOutstandingMissions();
      let maxExp = this.levelService.getLevel(this.playerData.level);
      maxExp.subscribe( val => {
        this.maxExpData = val;
      })
    });
      
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
  missionStart (mission: Mission) {
    this.choosenQuest = mission;
    /*console.log(this.choosenQuest)
    console.log(this.playerData.exp);
    console.log(typeof this.playerData.exp);
    console.log(mission.expq);
    console.log(typeof mission.expq);*/
    this.chooseQuestDisplay = false;
    this.choosenQuestDisplay = true;
    let currentTime = this.getCurrentTime();
    let newReward: Reward = {
      finishedquest: currentTime + mission.timeq * 1000,
      questrewardgold: mission.goldq,
      questrewardsilver: mission.silverq
    };
    this.saveQuestData(newReward);
    let timer = TimerObservable.create(2000, 1000); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.counter = t;
      this.progressCircle(mission.timeq);
      if (this.counter == mission.timeq) {
        this.countdown.unsubscribe();
        /*console.log(this.playerData.exp);
        console.log(typeof this.playerData.exp);
        console.log(mission.expq);
        console.log(typeof mission.expq);*/
        this.playerData.gold += mission.goldq;
        this.playerData.silver += mission.silverq;
        this.playerData.exp += mission.expq;
        this.raiseLevel();
        this.questSuccessful = true;
        this.update(); 
      }
    })
  }

  //Speichere QuestDaten in Datenbank
  saveQuestData(newReward: Reward) {
    this.playerData.offlinedata = newReward;
    this.update();
  }

  //Update aktuelle Spielerdaten in Datenbank
  update() {
    if (this.playerData.silver >= 100) {
      this.playerData.gold = this.playerData.gold + 1;
      this.playerData.silver = this.playerData.silver - 100;
    }
    this.playerService.update(this.playerData);
  }

  //Vergleiche in Datenbank ob Missionen während der Offlinezeit abgeschlossen worden sind.
  compareOutstandingMissions() {       
      if (this.getCurrentTime() >= this.playerData.offlinedata.finishedquest && this.playerData.offlinedata.finishedquest != 0)   {
        this.playerData.offlinedata.finishedquest = 0;
        this.update();
      }
    }

  progressCircle(circleTime:number) {
    this.circleProgress = (this.counter / circleTime) * 100;
  }

  raiseLevel () {
    if (this.playerData.exp >= this.maxExpData.exp) {
      this.playerData.level += 1;
    }
   }
  


}


