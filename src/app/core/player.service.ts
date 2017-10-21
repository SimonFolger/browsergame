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
    /*this.playersCol = afs.collection('players');
    this.players = this.playersCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Player;
          const id = a.payload.doc.id;
          return { id, data };
        })
      });*/
  }

  getPlayer(email: string) {
    this.playerDoc = this.afs.doc('players/'+email);
    this.player = this.playerDoc.valueChanges();
    /**this.player.subscribe(val => {
      //val is null if empty
      console.log(val);
      if (val != null) {
        console.log(val.class);
        console.log(val.id);
        console.log(val.name);
        console.log(val.email);
      } else if ( val == null) {
        this.add(email, "", "");
      }
    })**/
    return this.player;
  }

  getPlayers() {
    this.playersCol = this.afs.collection('players');
    this.players = this.playersCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Player;
        const id = a.payload.doc.id;
        return { id, data };
      })
    });
    return this.players;
  }

  add(email: string, heroName: string, heroClass: string, date: number,) {
    this.afs.collection('players').doc(email).set({'name': heroName, 'class': heroClass, 'gold': 100, 'silver': 50, 'last': date});
  }

  update(email: string, heroName: string, heroClass: string, date: number, gold: number, silver: number,) {
    this.afs.collection('players').doc(email).set({'name': heroName, 'class': heroClass, 'gold': gold, 'silver': silver, 'last': date});
  }
}
