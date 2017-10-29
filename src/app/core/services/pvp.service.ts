import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HeroClass } from './../classes/hero-class';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class PvpService {

  private classesCol : AngularFirestoreCollection<HeroClass>;
  classes: Observable<HeroClass[]>;
  

  constructor(private afs: AngularFirestore) {   }

  getClasses() {
    this.classesCol = this.afs.collection<HeroClass>('classes');
    
    this.classes = this.classesCol.valueChanges();

    return this.classes;
  }
}

