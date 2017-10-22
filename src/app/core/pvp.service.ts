import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './../core/auth.service';
import { Observable } from 'rxjs/Observable';
import { HeroClass } from './hero-class';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class PvpService {

  private classesCol : AngularFirestoreCollection<HeroClass[]>;
  classes: any;
  

  constructor(private afs: AngularFirestore) {   }

  getClasses() {
    this.classesCol = this.afs.collection('classes');
    
    this.classes = this.classesCol.valueChanges();

    return this.classes;
  }
}

