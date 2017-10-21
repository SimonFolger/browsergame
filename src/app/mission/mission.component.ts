import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../core/player.service';
import { Player } from './../core/player';
import {TimerObservable} from "rxjs/observable/TimerObservable";






@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})


export class MissionComponent implements OnInit {

  player: Observable<Player>;
  
    players: Observable<Player[]>;
  
    email: string;
    heroName: string = "";
    heroClass: string = "";
    created: boolean = true;
    timer = 0;
    private tick: any;
    private subscription: any;
    gold:number;
    silver:number;
    gewinn:boolean=false;
  
  
    constructor(private authService: AuthService, private playerService: PlayerService) { }
  
    ngOnInit() {
      //this.players = this.playerService.players;
      if(this.authService.authState) {
        this.email = this.authService.currentUser['email'];
        this.getPlayer();
      } else {
        this.logout();
      }
    }

    ticks () {
      let timer = TimerObservable.create(2000, 1000);
      this.subscription = timer.subscribe(t => {
        this.tick = t;
        if (this.tick == 30) {
          this.subscription.unsubscribe();
          this.silver = this.silver + 30;
          this.update();       
         }
      });
    }

    ticks2 () {
      let timer = TimerObservable.create(2000, 1000);
      this.subscription = timer.subscribe(t => {
        this.tick = t;
        if (this.tick == 30) {
          this.subscription.unsubscribe();
          this.gold = this.gold + 5;
          this.silver = this.silver + 10;
          this.update();  
          this.gewinn = true;   
         }
      });
    }

  
  



    //Interessiert mich erstmal nicht
    getPlayer() {
      this.player = this.playerService.getPlayer(this.email);
      this.player.subscribe(val => {
        //val is null if empty
        console.log(val);
        if (val != null) {
          this.gold = val.gold;
          this.silver = val.silver;
          this.created = true;
          console.log(this.created);
        } else if ( val == null) {
          this.created = false;
        }
      })
    }
  
    date = new Date().getTime();
  
  
    add() {
      console.log(this.date);
      this.playerService.add(this.email, this.heroName, this.heroClass, this.date);
    }

    update() {
      this.playerService.update(this.email, this.heroName, this.heroClass, this.date, this.gold, this.silver);
    }
  
    logout() {
      this.authService.signOut();
    }
  
}
