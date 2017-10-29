import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument,  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Dungeon } from './../classes/dungeon';


@Injectable()
export class DungeonService {

  private dungeonsCol : AngularFirestoreCollection<Dungeon>;
  

  constructor(private afs: AngularFirestore) {   }

  getDungeons() {
    this.dungeonsCol = this.afs.collection('dungeons');
    return this.dungeonsCol.valueChanges();
    
  }
}
