import { Injectable } from '@angular/core';
import { Weapon } from './../classes/weapon';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class WeaponService {

  private weaponsCol : AngularFirestoreCollection<Weapon>;

  constructor(private afs: AngularFirestore) {   }

  getWeapons() {
    this.weaponsCol = this.afs.collection<Weapon>('weapons');
    return this.weaponsCol.valueChanges();
  }
}