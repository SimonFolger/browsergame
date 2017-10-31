import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Mission } from './../../core/classes/mission';
import { MissionService } from './../../core/services/mission.service';
import { PlayerMissionProgress } from './../../core/classes/player-mission-progress';
import { GameComponent } from './../game.component';
import { Dungeon } from './../../core/classes/dungeon';
import { DungeonService } from './../../core/services/dungeon.service';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})

export class MissionComponent implements OnInit {

  player: Observable<Player>;
  missions: Observable<Mission[]>;
  dungeons: any;
  randomMissions: Mission[] = [];
  countdown: any;
  counter: number;
  missionCompleted: boolean = false;
  email: string ;
  heroName: string = "";
  heroClass: string = "";
  finishTime: number;
  silverReward: number;
  playerData: Player;
  textq: boolean = true;
  chosenMission: Mission;
  circleProgress: number;
  bonusSilver: number;
  bonusExp: number;
  totalLevelXP: number;
  currentLevel: number;

  constructor(
    private playerService: PlayerService, 
    private missionService: MissionService,
    private gameComponent: GameComponent,
    private dungeonService: DungeonService,
  ) { } 

  //Funktionen die beim Seitenaufruf gestartet werden
  ngOnInit() {
    this.getPlayer();
    this.getMissions();
    this.missions.subscribe(val => {
      let allMissions = val;
      let missionLength = allMissions.length;
      this.getRandomMissions(allMissions);
    })
  } 
  
  //Lädt aktuelle Spielerdaten aus Datenbank
  getPlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {
      this.playerData = val;
    });  
  }
  
  //Lädt alle Missionen aus der Datenbank
  getMissions() {
    this.missions = this.missionService.getMissions();
  }

  getRandomMissions(allMissions: Mission[]) {
    if (this.randomMissions.length < 4) {
      let random = Math.floor(Math.random() * allMissions.length);
      if (!this.randomMissions.includes(allMissions[random])) {
        this.randomMissions.push(allMissions[random]);
      }
      this.getRandomMissions(allMissions);
    }
  }

  //Wenn Mission gestartet wird <Button> 1. Speichere bei Click Questdaten in DB 2, Führe aus wenn Zähler = Missionszeit
  missionStart (mission: Mission) {
    this.chosenMission = mission;
    let currentTime = this.gameComponent.getCurrentTime();
    let missionProgress: PlayerMissionProgress = {
      'completionTime': currentTime + mission.duration * 1000,
      'silverReward': mission.silverReward,
      'expReward': mission.expReward,
    };
    this.saveQuestData(missionProgress);
    let timer = TimerObservable.create(2000, 1000); // 2000, 1000
    this.countdown = timer.subscribe(t => {
      this.counter = t;
      this.getProgress(mission.duration);
      if (this.counter == mission.duration) {
        this.countdown.unsubscribe();
        this.bonusSilver = (this.playerData.dungeonProgress.moltenCore * 0.15 ) * mission.silverReward;
        this.playerData.silver += (mission.silverReward + this.bonusSilver);
        this.bonusExp = (this.playerData.dungeonProgress.shadowfangKeep * 0.04 ) * mission.expReward;
        this.playerData.level.exp += (mission.expReward + this.bonusExp);
        this.missionCompleted = true;
        this.playerData.missionProgress.completionTime = 0;
        this.updatePlayer();
      }
    })
  }

  //Speichere QuestDaten in Datenbank
  saveQuestData(missionProgress: PlayerMissionProgress) {
    this.playerData.missionProgress = missionProgress;
    this.updatePlayer();
  }

  //Update aktuelle Spielerdaten in Datenbank
  updatePlayer() {
    this.playerService.update(this.playerData);
  }

  //aktueller Progress Missions
  getProgress(circleTime: number) {
    this.circleProgress = (this.counter / circleTime) * 100;
  }

  goBackToOverview() {
    this.chosenMission = null;
  }

}

