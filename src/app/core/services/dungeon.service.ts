import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Dungeon } from './../classes/dungeon';


@Injectable()
export class DungeonService {

  private dungeonsCol : AngularFirestoreCollection<Dungeon>;

  constructor(private afs: AngularFirestore) {   }

  getDungeons() {
    this.dungeonsCol = this.afs.collection<Dungeon>('dungeons');
    return this.dungeonsCol.valueChanges();
  }
}
