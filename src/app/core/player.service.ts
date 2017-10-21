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

  add(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set({'name': playerObject.name, 'class': playerObject.class, 'gold': 100, 'silver': 50, 'last': playerObject.last});
  }

  update(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set({'name': playerObject.name, 'class': playerObject.class, 'gold': playerObject.gold, 'silver': playerObject.silver, 'last': playerObject.last});
  }

  offlinereward(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set( 
      { 
      'name': playerObject.name, 
      'class': playerObject.class, 
      'gold': playerObject.gold, 
      'silver': playerObject.silver, 
      'last': playerObject.last, 
      'offlinedata': {
       'finishedquest': playerObject.offlinedata.finishedquest,
       'questrewardgold':playerObject.offlinedata.questrewardgold,
       'questrewarsilver': playerObject.offlinedata.questrewardsilver
      }
     }
   )}

}
