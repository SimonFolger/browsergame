import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './../core/player.service';
import { Player } from './../core/player';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Mission } from './mission';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class MissionService {

  private missionsCol : AngularFirestoreCollection<Mission[]>;
  missions: any;
  

  constructor(private afs: AngularFirestore) {   }

  getMissions() {
    this.missionsCol = this.afs.collection('missions');
   /* this.missions = this.missionsCol.snapshotChanges()
    .map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data() as Mission;
            const id = a.payload.doc.id;
            return { id, data};
        })
    })*/
    this.missions = this.missionsCol.valueChanges();

    return this.missions;
  }
}


//Doc ist einziges
//Col(Collection) sind mehrere