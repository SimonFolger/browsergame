import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Player } from './player';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerService {

  private playersCol : AngularFirestoreCollection<Player>;
  players: any;
  private playerDoc: AngularFirestoreDocument<Player>;
  player: Observable<Player>;
  

  constructor(private afs: AngularFirestore) { 
    this.playersCol = afs.collection('players');
    //this.players = this.playersCol.valueChanges();
    this.players = this.playersCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Player;
          const id = a.payload.doc.id;
          return { id, data };
        })
      });
  }

  getPlayer(email: string) {
    this.playerDoc = this.afs.doc('players/'+email);
    return this.playerDoc.valueChanges();
  }

  add(email: string, heroName: string, heroClass: string) {
    this.afs.collection('players').doc(email).set({'name': heroName, 'class': heroClass});
  }

}
