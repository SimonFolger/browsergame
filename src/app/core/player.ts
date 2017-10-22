import { Reward } from './reward';
import { Stats } from './stats';

export class Player {
    email: string;
    name: string;
    class: string;
    gold: number;
    stats: Stats;
    silver: number;
    last: number;
    offlinedata: Reward;
}
