import { Injectable } from '@angular/core';
import { Mission } from './../classes/mission';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class MissionService {

  private missionsCol : AngularFirestoreCollection<Mission>;

  constructor(private afs: AngularFirestore) {   }

  getMissions() {
    this.missionsCol = this.afs.collection<Mission>('missions');
    return this.missionsCol.valueChanges();
  }
}