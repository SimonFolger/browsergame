import { Injectable } from '@angular/core';
import { Clothes } from './../classes/clothes';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class ClothesService {

  private clothesCol : AngularFirestoreCollection<Clothes>;

  constructor(private afs: AngularFirestore) {   }

  getClothes() {
    this.clothesCol = this.afs.collection<Clothes>('clothes');
    return this.clothesCol.valueChanges();
  }
}