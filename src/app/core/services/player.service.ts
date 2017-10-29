import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Player } from './../classes/player';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerService {

  private playersCol : AngularFirestoreCollection<Player>;
  private playerDoc: AngularFirestoreDocument<Player>;
  

  constructor(private afs: AngularFirestore) { }

  getPlayer(email: string) {
    this.playerDoc = this.afs.doc('players/'+email);
    return this.playerDoc.valueChanges();
  }

  getPlayers() {
    this.playersCol = this.afs.collection('players');
    return this.playersCol.valueChanges();
  }

  add(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set(
      {
        'email': playerObject.email,
        'name': playerObject.name, 
        'class': playerObject.class,
        'level': playerObject.level,
        'exp': playerObject.exp,
        'gold': playerObject.gold,
        'silver': playerObject.silver,
        'last': playerObject.last,
        'dungeons': {
          'moltenCore': 0,
          'shadowfangKeep': 0,
          'blackTemple': 0,
          'trialOfValor': 0,
          'theEmeraldNightmare': 0
        },
        'stats': playerObject.stats,
        'oflinedata': {
          'finishedquest': 0,
          'questrewardgold': 0,
          'questrewardsilver': 0
        }
      }
    );
  }

  update(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set(
      {
        'email': playerObject.email,
        'name': playerObject.name,
        'class': playerObject.class,
        'level': playerObject.level,
        'exp': playerObject.exp,
        'gold': playerObject.gold,
        'silver': playerObject.silver,
        'last': playerObject.last,
        'offlinedata': playerObject.offlinedata,
        'dungeons': playerObject.dungeons,
        'stats': playerObject.stats
      }
    );
  }
}
