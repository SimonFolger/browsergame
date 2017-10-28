import { Component, OnInit } from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Mission } from './../classes/mission';
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
    this.missions = this.missionsCol.valueChanges();
    return this.missions;
  }
}

//Doc ist einziges
//Col(Collection) sind mehrere