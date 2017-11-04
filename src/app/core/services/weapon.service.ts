import { Injectable } from '@angular/core';
import { Weapon } from './../classes/weapon';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class WeaponService {

  private weaponsCol : AngularFirestoreCollection<Weapon>;
  private weaponDoc : AngularFirestoreDocument<Weapon>;

  constructor(private afs: AngularFirestore) {   }

  getWeapons() {
    this.weaponsCol = this.afs.collection<Weapon>('weapons');
    return this.weaponsCol.valueChanges();
  }

  getWeapon(name:string) {
    this.weaponDoc = this.afs.doc<Weapon>('weapons/'+name);
    return this.weaponDoc.valueChanges();

  }
}