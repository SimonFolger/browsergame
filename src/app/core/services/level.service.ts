import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Level } from './../classes/level'

import 'rxjs/add/operator/map';

@Injectable()
export class LevelService {

  private levelDoc : AngularFirestoreDocument<Level>;
  level: Level;
  

  constructor(private afs: AngularFirestore) { }

  getLevel(playerLevel:number) {
    this.levelDoc = this.afs.doc('level/level'+playerLevel);
    return this.levelDoc.valueChanges();
  }
}