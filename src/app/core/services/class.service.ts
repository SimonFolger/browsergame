import { BaseClass } from './../classes/base-class';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class ClassService {

  private classesCol : AngularFirestoreCollection<BaseClass>;

  constructor(private afs: AngularFirestore) {   }

  getClasses() {
    this.classesCol = this.afs.collection<BaseClass>('classes');
    return this.classesCol.valueChanges();
  }
}

