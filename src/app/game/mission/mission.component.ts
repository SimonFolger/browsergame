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
  maxExpData:Level;
  bonusGold: number;
  bonusSilver: number;
  bonusExp: number;


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

  progressCircle(circleTime:number) {
    this.circleProgress = (this.counter / circleTime) * 100;
  }

  raiseLevel () {
    if (this.playerData.exp >= this.maxExpData.exp) {
      this.playerData.level += 1;
    }
   }
  


}

/*
Level	Level XP	Total XP


Algo = 5 * (lvl ^ 2) + 50 * lvl + 100 

  0	  -   	  -   
  1	  100.00 	  100 
  2	  155.00 	  255 
  3	  220.00 	  475 
  4	  295.00 	  770 
  5	  380.00 	  1,150 
  6	  475.00 	  1,625 
  7	  580.00 	  2,205 
  8	  695.00 	  2,900 
  9	  820.00 	  3,720 
10	  955.00 	  4,675 
11	  1,100.00 	  5,775 
12	  1,255.00 	  7,030 
13	  1,420.00 	  8,450 
14	  1,595.00 	  10,045 
15	  1,780.00 	  11,825 
16	  1,975.00 	  13,800 
17	  2,180.00 	  15,980 
18	  2,395.00 	  18,375 
19	  2,620.00 	  20,995 
20	  2,855.00 	  23,850 
21	  3,100.00 	  26,950 
22	  3,355.00 	  30,305 
23	  3,620.00 	  33,925 
24	  3,895.00 	  37,820 
25	  4,180.00 	  42,000 
26	  4,475.00 	  46,475 
27	  4,780.00 	  51,255 
28	  5,095.00 	  56,350 
29	  5,420.00 	  61,770 
30	  5,755.00 	  67,525 
31	  6,100.00 	  73,625 
32	  6,455.00 	  80,080 
33	  6,820.00 	  86,900 
34	  7,195.00 	  94,095 
35	  7,580.00 	  101,675 
36	  7,975.00 	  109,650 
37	  8,380.00 	  118,030 
38	  8,795.00 	  126,825 
39	  9,220.00 	  136,045 
40	  9,655.00 	  145,700 
41	  10,100.00 	  155,800 
42	  10,555.00 	  166,355 
43	  11,020.00 	  177,375 
44	  11,495.00 	  188,870 
45	  11,980.00 	  200,850 
46	  12,475.00 	  213,325 
47	  12,980.00 	  226,305 
48	  13,495.00 	  239,800 
49	  14,020.00 	  253,820 
50	  14,555.00 	  268,375 
51	  15,100.00 	  283,475 
52	  15,655.00 	  299,130 
53	  16,220.00 	  315,350 
54	  16,795.00 	  332,145 
55	  17,380.00 	  349,525 
56	  17,975.00 	  367,500 
57	  18,580.00 	  386,080 
58	  19,195.00 	  405,275 
59	  19,820.00 	  425,095 
60	  20,455.00 	  445,550 
61	  21,100.00 	  466,650 
62	  21,755.00 	  488,405 
63	  22,420.00 	  510,825 
64	  23,095.00 	  533,920 
65	  23,780.00 	  557,700 
66	  24,475.00 	  582,175 
67	  25,180.00 	  607,355 
68	  25,895.00 	  633,250 
69	  26,620.00 	  659,870 
70	  27,355.00 	  687,225 
71	  28,100.00 	  715,325 
72	  28,855.00 	  744,180 
73	  29,620.00 	  773,800 
74	  30,395.00 	  804,195 
75	  31,180.00 	  835,375 
76	  31,975.00 	  867,350 
77	  32,780.00 	  900,130 
78	  33,595.00 	  933,725 
79	  34,420.00 	  968,145 
80	  35,255.00 	  1,003,400 
81	  36,100.00 	  1,039,500 
82	  36,955.00 	  1,076,455 
83	  37,820.00 	  1,114,275 
84	  38,695.00 	  1,152,970 
85	  39,580.00 	  1,192,550 
86	  40,475.00 	  1,233,025 
87	  41,380.00 	  1,274,405 
88	  42,295.00 	  1,316,700 
89	  43,220.00 	  1,359,920 
90	  44,155.00 	  1,404,075 
91	  45,100.00 	  1,449,175 
92	  46,055.00 	  1,495,230 
93	  47,020.00 	  1,542,250 
94	  47,995.00 	  1,590,245 
95	  48,980.00 	  1,639,225 
96	  49,975.00 	  1,689,200 
97	  50,980.00 	  1,740,180 
98	  51,995.00 	  1,792,175 
99	  53,020.00 	  1,845,195 
100	  54,055.00 	  1,899,250 
101	  55,100.00 	  1,954,350 
102	  56,155.00 	  2,010,505 
103	  57,220.00 	  2,067,725 
104	  58,295.00 	  2,126,020 
105	  59,380.00 	  2,185,400 
106	  60,475.00 	  2,245,875 
107	  61,580.00 	  2,307,455 
108	  62,695.00 	  2,370,150 
109	  63,820.00 	  2,433,970 
110	  64,955.00 	  2,498,925 
111	  66,100.00 	  2,565,025 
112	  67,255.00 	  2,632,280 
113	  68,420.00 	  2,700,700 
114	  69,595.00 	  2,770,295 
115	  70,780.00 	  2,841,075 
116	  71,975.00 	  2,913,050 
117	  73,180.00 	  2,986,230 
118	  74,395.00 	  3,060,625 
119	  75,620.00 	  3,136,245 
120	  76,855.00 	  3,213,100 
121	  78,100.00 	  3,291,200 
122	  79,355.00 	  3,370,555 
123	  80,620.00 	  3,451,175 
124	  81,895.00 	  3,533,070 
125	  83,180.00 	  3,616,250 
126	  84,475.00 	  3,700,725 
127	  85,780.00 	  3,786,505 
128	  87,095.00 	  3,873,600 
129	  88,420.00 	  3,962,020 
130	  89,755.00 	  4,051,775 
131	  91,100.00 	  4,142,875 
132	  92,455.00 	  4,235,330 
133	  93,820.00 	  4,329,150 
134	  95,195.00 	  4,424,345 
135	  96,580.00 	  4,520,925 
136	  97,975.00 	  4,618,900 
137	  99,380.00 	  4,718,280 
138	  100,795.00 	  4,819,075 
139	  102,220.00 	  4,921,295 
140	  103,655.00 	  5,024,950 
141	  105,100.00 	  5,130,050 
142	  106,555.00 	  5,236,605 
143	  108,020.00 	  5,344,625 
144	  109,495.00 	  5,454,120 
145	  110,980.00 	  5,565,100 
146	  112,475.00 	  5,677,575 
147	  113,980.00 	  5,791,555 
148	  115,495.00 	  5,907,050 
149	  117,020.00 	  6,024,070 
150	  118,555.00 	  6,142,625 
151	  120,100.00 	  6,262,725 
152	  121,655.00 	  6,384,380 
153	  123,220.00 	  6,507,600 
154	  124,795.00 	  6,632,395 
155	  126,380.00 	  6,758,775 
156	  127,975.00 	  6,886,750 
157	  129,580.00 	  7,016,330 
158	  131,195.00 	  7,147,525 
159	  132,820.00 	  7,280,345 
160	  134,455.00 	  7,414,800 
161	  136,100.00 	  7,550,900 
162	  137,755.00 	  7,688,655 
163	  139,420.00 	  7,828,075 
164	  141,095.00 	  7,969,170 
165	  142,780.00 	  8,111,950 
166	  144,475.00 	  8,256,425 
167	  146,180.00 	  8,402,605 
168	  147,895.00 	  8,550,500 
169	  149,620.00 	  8,700,120 
170	  151,355.00 	  8,851,475 
171	  153,100.00 	  9,004,575 
172	  154,855.00 	  9,159,430 
173	  156,620.00 	  9,316,050 
174	  158,395.00 	  9,474,445 
175	  160,180.00 	  9,634,625 
176	  161,975.00 	  9,796,600 
177	  163,780.00 	  9,960,380 
178	  165,595.00 	  10,125,975 
179	  167,420.00 	  10,293,395 
180	  169,255.00 	  10,462,650 
181	  171,100.00 	  10,633,750 
182	  172,955.00 	  10,806,705 
183	  174,820.00 	  10,981,525 
184	  176,695.00 	  11,158,220 
185	  178,580.00 	  11,336,800 
186	  180,475.00 	  11,517,275 
187	  182,380.00 	  11,699,655 
188	  184,295.00 	  11,883,950 
189	  186,220.00 	  12,070,170 
190	  188,155.00 	  12,258,325 
191	  190,100.00 	  12,448,425 
192	  192,055.00 	  12,640,480 
193	  194,020.00 	  12,834,500 
194	  195,995.00 	  13,030,495 
195	  197,980.00 	  13,228,475 
196	  199,975.00 	  13,428,450 
197	  201,980.00 	  13,630,430 
198	  203,995.00 	  13,834,425 
199	  206,020.00 	  14,040,445 
200	  208,055.00 	  14,248,500 
*/


