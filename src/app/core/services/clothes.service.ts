import { Injectable } from '@angular/core';
import { Clothes } from './../classes/clothes';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class ClothesService {

  private clothesCol : AngularFirestoreCollection<Clothes>;
  private clothDoc : AngularFirestoreDocument<Clothes>;

  constructor(private afs: AngularFirestore) {   }

  getClothes() {
    this.clothesCol = this.afs.collection<Clothes>('clothes');
    return this.clothesCol.valueChanges();
  }
  getCloth() {
    this.clothDoc = this.afs.doc<Clothes>('clothes/'+name);
    return this.clothDoc.valueChanges();

  }
}