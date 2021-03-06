import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Player } from './../classes/player';

@Injectable()
export class PlayerService {

  private playersCol : AngularFirestoreCollection<Player>;
  private playerDoc: AngularFirestoreDocument<Player>;
  

  constructor(private afs: AngularFirestore) { }

  //get a single Player by email
  getPlayer(email: string) {
    this.playerDoc = this.afs.doc('players/'+email);
    return this.playerDoc.valueChanges();
  }

  //get all players
  getPlayers() {
    this.playersCol = this.afs.collection('players');
    return this.playersCol.valueChanges();
  }

  //add a new player to the database after registration
  add(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set(
      {
        'email': playerObject.email,
        'name': playerObject.name, 
        'class': playerObject.class,
        'silver': playerObject.silver,
        'tickets': playerObject.tickets,
        'level': {
          'level': 1,
          'exp': 0,
          'levelUps': 0
        },
        'dungeonProgress': {
          'moltenCore': 0,
          'shadowfangKeep': 0,
          'blackTemple': 0,
          'trialOfValor': 0,
          'theEmeraldNightmare': 0
        },
        'stats': playerObject.stats,
        'missionProgress': {
          'completionTime': 0,
          'silverReward': 0,
          'expReward': 0,
        },
        'equipment': {
          'leftHand': 0,
          'rightHand': 0,
          'head': 0,
          'chest': 0,
          'hands': 0,
          'legs': 0,
          'feet': 0,
          'ring': 0,
        },
        'inventar': {
          'slot1': 'empty',
          'slot2': 'empty',
          'slot3': 'empty',
          'slot4': 'empty',
          'slot5': 'empty',
          'slot6': 'empty',
          'slot7': 'empty',
          'slot8': 'empty',
          'slot9': 'empty',
          'slot10': 'empty',
        },
        'dungeonTicket': {
          'ticket1': 0,
          'ticket2': 0,
          'ticket3': 0,
        }
      }
    );
  }

  //update player data
  update(playerObject:Player) {
    this.afs.collection('players').doc(playerObject.email).set(
      {
        'email': playerObject.email,
        'name': playerObject.name,
        'class': playerObject.class,
        'tickets': playerObject.tickets,
        'level': playerObject.level,
        'silver': playerObject.silver,
        'equipment': playerObject.equipment,
        'missionProgress': playerObject.missionProgress,
        'dungeonProgress': playerObject.dungeonProgress,
        'stats': playerObject.stats,
        'inventar': playerObject.inventar,
        'dungeonTicket': playerObject.dungeonTicket,
      }
    );
  }
}
