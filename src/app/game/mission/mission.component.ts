import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../../core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../../core/services/player.service';
import { Player } from './../../core/classes/player';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Mission } from './../../core/classes/mission';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { MissionService } from './../../core/services/mission.service';
import { Reward } from './../../core/classes/reward';
import { GameComponent } from './../game.component';
import {MatGridListModule} from '@angular/material';
import { LevelService } from './../../core/services/level.service';
import { Level } from './../../core/classes/level';
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
  levels: Observable<Level>;
  dungeons: any;
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
  //maxExpData:Level;
  bonusGold: number;
  bonusSilver: number;
  bonusExp: number;
  totalLevelXP: number;
<<<<<<< Updated upstream
  currentLevel: number;
=======

>>>>>>> Stashed changes

  constructor(
    private playerService: PlayerService, 
    private missionService: MissionService,
    private gameComponent: GameComponent,
    private levelService: LevelService,
    private dungeonService: DungeonService,
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
  
  //Lädt aktuelle Spielerdaten aus Datenbank
  updatePlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {
      this.playerData = val;
      this.compareOutstandingMissions();
      // Zugriff LevelDB ->Wird nicht bennötigt das Level über Algo.
      // let maxExp = this.levelService.getLevel(this.playerData.level);
      // maxExp.subscribe( val => {
      //  this.maxExpData = val;
      // })
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
        this.bonusGold = (this.playerData.dungeons.moltenCore * 0.1 ) * mission.goldq;
        this.playerData.gold += (mission.goldq + this.bonusGold) ;
        this.bonusSilver = (this.playerData.dungeons.moltenCore * 0.15 ) * mission.silverq;
        this.playerData.silver += (mission.silverq + this.bonusSilver) ;
        this.bonusExp = (this.playerData.dungeons.shadowfangKeep * 0.04 ) * mission.expq;
        this.playerData.exp += (mission.expq + this.bonusExp) ;
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

  //aktueller Progress Missions
  progressCircle(circleTime:number) {
    this.circleProgress = (this.counter / circleTime) * 100;
  }

  //Berechnet das Level anhand aktueller Erfahrungspunkte
  raiseLevel () {
    this.totalLevelXP = (10*(this.playerData.level^2)+100*this.playerData.level+100)+(20*((this.playerData.level-1)^2)+100*(this.playerData.level-1));
<<<<<<< Updated upstream
    this.currentLevel = this.playerData.exp - (10*((this.playerData.level-1)^2)+100*(this.playerData.level-1)+100)+(20*((this.playerData.level-2)^2)+100*(this.playerData.level-2));
    console.log(this.totalLevelXP);
    console.log(this.currentLevel);
    if (this.currentLevel >= this.totalLevelXP) {
=======
    console.log(this.totalLevelXP);
    if (this.playerData.exp >= this.totalLevelXP) {
>>>>>>> Stashed changes
      this.playerData.level += 1;
      this.raiseLevel();
    }
  }
}

/*

=(10*(A4*A4)+100*A4+100)+(20*((A4-1)^2)+100*(A4-1))
<<<<<<< Updated upstream

Level | XP Total | XP next levelUp

=======

Level | XP Total | XP next levelUp

>>>>>>> Stashed changes
0	0	0
1	210	210
2	460	250
3	770	310
4	1140	370
5	1570	430
6	2060	490
7	2610	550
8	3220	610
9	3890	670
10	4620	730
11	5410	790
12	6260	850
13	7170	910
14	8140	970
15	9170	1030
16	10260	1090
17	11410	1150
18	12620	1210
19	13890	1270
20	15220	1330
21	16610	1390
22	18060	1450
23	19570	1510
24	21140	1570
25	22770	1630
26	24460	1690
27	26210	1750
28	28020	1810
29	29890	1870
30	31820	1930
31	33810	1990
32	35860	2050
33	37970	2110
34	40140	2170
35	42370	2230
36	44660	2290
37	47010	2350
38	49420	2410
39	51890	2470
40	54420	2530
41	57010	2590
42	59660	2650
43	62370	2710
44	65140	2770
45	67970	2830
46	70860	2890
47	73810	2950
48	76820	3010
49	79890	3070
50	83020	3130
51	86210	3190
52	89460	3250
53	92770	3310
54	96140	3370
55	99570	3430
56	103060	3490
57	106610	3550
58	110220	3610
59	113890	3670
60	117620	3730
61	121410	3790
62	125260	3850
63	129170	3910
64	133140	3970
65	137170	4030
66	141260	4090
67	145410	4150
68	149620	4210
69	153890	4270
70	158220	4330
71	162610	4390
72	167060	4450
73	171570	4510
74	176140	4570
75	180770	4630
76	185460	4690
77	190210	4750
78	195020	4810
79	199890	4870
80	204820	4930
81	209810	4990
82	214860	5050
83	219970	5110
84	225140	5170
85	230370	5230
86	235660	5290
87	241010	5350
88	246420	5410
89	251890	5470
90	257420	5530
91	263010	5590
92	268660	5650
93	274370	5710
94	280140	5770
95	285970	5830
96	291860	5890
97	297810	5950
98	303820	6010
99	309890	6070
100	316020	6130
101	322210	6190
102	328460	6250
103	334770	6310
104	341140	6370
105	347570	6430
106	354060	6490
107	360610	6550

*/


