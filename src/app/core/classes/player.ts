import { Reward } from './reward';
import { playerDungeon } from './playerDungeon'

export class Player {
    email: string;
    name: string;
    class: string;
    level: number;
    exp: number;
    gold: number;
    silver: number;
    last: number;
    offlinedata: Reward;
    dungeons: playerDungeon;
}
