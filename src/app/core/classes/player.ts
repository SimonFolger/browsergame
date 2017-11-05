import { PlayerMissionProgress } from './player-mission-progress';
import { PlayerDungeonProgress } from './player-dungeon-progress';
import { PlayerStats } from './player-stats';
import { PlayerLevel } from './player-level';
import { PlayerEquipment } from './player-equipment';
import { PlayerInventar } from './player-inventar';
import { DungeonTickets } from './player-ticket';

export class Player {
    email: string;
    name: string;
    class: string;
    silver: number;
    missionProgress: PlayerMissionProgress;
    stats: PlayerStats;
    dungeonProgress: PlayerDungeonProgress;
    level: PlayerLevel;
    equipment: PlayerEquipment;
    inventar: PlayerInventar;
    dungeonTicket: DungeonTickets;
    tickets: number;
}
