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
  //maxExpData:Level;
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
      /**while(this.randomMissions.length < 4) {
        let random = Math.floor(Math.random() * missionLength);
        if (!this.randomMissions.includes(allMissions[random])) {
         this.randomMissions.push(allMissions[random]);
        }
      }*/    
    })
  } 
  
  //Lädt aktuelle Spielerdaten aus Datenbank
  getPlayer() {
    this.gameComponent.getPlayer();
    this.player = this.gameComponent.player;
    this.player.subscribe(val => {
      this.playerData = val;
      this.checkForFinishedQuests();
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

  getRandomMissions(allMissions: Mission[]) {
    if (this.randomMissions.length < 4) {
      let random = Math.floor(Math.random() * allMissions.length);
      if (!this.randomMissions.includes(allMissions[random])) {
        this.randomMissions.push(allMissions[random]);
      }
      this.getRandomMissions(allMissions);
    }
  }

  //Holt sich die aktuelle Uhrzeit in Millisekunden
  getCurrentTime() {
    return new Date().getTime();
  }

  //Wenn Mission gestartet wird <Button> 1. Speichere bei Click Questdaten in DB 2, Führe aus wenn Zähler = Missionszeit
  missionStart (mission: Mission) {
    this.chosenMission = mission;
    let currentTime = this.getCurrentTime();
    let missinProgress: PlayerMissionProgress = {
      'completionTime': currentTime + mission.duration * 1000,
      'silverReward': mission.silverReward
    };
    this.saveQuestData(missinProgress);
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
        this.checkForLevelUp();
        this.missionCompleted = true;
        this.updatePlayer(); 
      }
    })
  }

  //Speichere QuestDaten in Datenbank
  saveQuestData(missinProgress: PlayerMissionProgress) {
    this.playerData.missionProgress = missinProgress;
    this.updatePlayer();
  }

  //Update aktuelle Spielerdaten in Datenbank
  updatePlayer() {
    this.playerService.update(this.playerData);
  }

  // TODO !!!
  //!!! Sollte in gameComponent !!!! Wird kein Gold/Exp hinzugefügt??
  //Vergleiche in Datenbank ob Missionen während der Offlinezeit abgeschlossen worden sind.
  checkForFinishedQuests() {       
    if (this.getCurrentTime() >= this.playerData.missionProgress.completionTime && this.playerData.missionProgress.completionTime != 0)   {
     this.playerData.missionProgress.completionTime = 0;
     this.updatePlayer();
    }
  }

  //aktueller Progress Missions
  getProgress(circleTime: number) {
    this.circleProgress = (this.counter / circleTime) * 100;
  }

  //Berechnet das Level anhand aktueller Erfahrungspunkte ALT!
  /*raiseLevel () {
    this.totalLevelXP = 70*((this.playerData.level+1)*(this.playerData.level+1))+200*(this.playerData.level+1)
    this.currentLevel = this.playerData.exp - 70*((this.playerData.level)*(this.playerData.level))+200*(this.playerData.level)
    console.log(this.totalLevelXP);
    console.log(this.currentLevel);
    if (this.currentLevel >= this.totalLevelXP) {
      this.playerData.level += 1;
      this.raiseLevel();
    }
  }*/

  //Berechnet das Level anhand aktueller Erfahrungspunkte
  checkForLevelUp() {
    this.totalLevelXP = 70 * ((this.playerData.level.level + 1) * (this.playerData.level.level + 1)) + 200 * (this.playerData.level.level + 1);
    console.log(this.totalLevelXP);
    if (this.playerData.level.exp >= this.totalLevelXP) {
      this.playerData.level.exp -= 70 * ((this.playerData.level.level) * (this.playerData.level.level)) + 200 * (this.playerData.level.level);
      console.log(this.playerData.level.exp);
      this.playerData.level.level += 1;
      this.playerData.level.levelUps += 1;
      this.checkForLevelUp();
    }
  }

  goBackToOverview() {
    this.chosenMission = null;
  }



}

/*
Neue Stufe:
=70*((A3+1)*(A3+1))+200*(A3+1)

Alte Stufe:
=70*((A3)*(A3))+200*(A3)



	neue stufe		alte Stufe
0       	270	 	0
1	  680 	410 	270
2	  1230	550 	680
3	  1920	690	  1230
4	  2750	830	  1920
5	  3720	970	  2750
6	  4830	1110	3720
7	  6080	1250	4830
8	  7470	1390	6080
9	  9000	1530	7470
10	10670	1670	9000
11	12480	1810	10670
12	14430	1950	12480
13	16520	2090	14430
14	18750	2230	16520
15	21120	2370	18750
16	23630	2510	21120
17	26280	2650	23630
18	29070	2790	26280
19	32000	2930	29070
20	35070	3070	32000
21	38280	3210	35070
22	41630	3350	38280
23	45120	3490	41630
24	48750	3630	45120
25	52520	3770	48750
26	56430	3910	52520
27	60480	4050	56430
28	64670	4190	60480
29	69000	4330	64670
30	73470	4470	69000
31	78080	4610	73470
32	82830	4750	78080
33	87720	4890	82830
34	92750	5030	87720
35	97920	5170	92750
36	103230	5310	97920
37	108680	5450	103230
38	114270	5590	108680
39	120000	5730	114270
40	125870	5870	120000
41	131880	6010	125870
42	138030	6150	131880
43	144320	6290	138030
44	150750	6430	144320
45	157320	6570	150750
46	164030	6710	157320
47	170880	6850	164030
48	177870	6990	170880
49	185000	7130	177870
50	192270	7270	185000
51	199680	7410	192270
52	207230	7550	199680
53	214920	7690	207230
54	222750	7830	214920
55	230720	7970	222750
56	238830	8110	230720
57	247080	8250	238830
58	255470	8390	247080
59	264000	8530	255470
60	272670	8670	264000
61	281480	8810	272670
62	290430	8950	281480
63	299520	9090	290430
64	308750	9230	299520
65	318120	9370	308750
66	327630	9510	318120
67	337280	9650	327630
68	347070	9790	337280
69	357000	9930	347070
70	367070	10070	357000
71	377280	10210	367070
72	387630	10350	377280
73	398120	10490	387630
74	408750	10630	398120
75	419520	10770	408750
76	430430	10910	419520
77	441480	11050	430430
78	452670	11190	441480
79	464000	11330	452670
80	475470	11470	464000
81	487080	11610	475470
82	498830	11750	487080
83	510720	11890	498830
84	522750	12030	510720
85	534920	12170	522750
86	547230	12310	534920
87	559680	12450	547230
88	572270	12590	559680
89	585000	12730	572270
90	597870	12870	585000
91	610880	13010	597870
92	624030	13150	610880
93	637320	13290	624030
94	650750	13430	637320
95	664320	13570	650750
96	678030	13710	664320
97	691880	13850	678030
98	705870	13990	691880
99	720000	14130	705870
100	734270	14270	720000
101	748680	14410	734270
102	763230	14550	748680
103	777920	14690	763230
104	792750	14830	777920
105	807720	14970	792750
106	822830	15110	807720
107	838080	15250	822830


*/


