export interface Song {
    name: string;
    countingTime: number;
    groundstroke: number;
    secondsPerTact: number;
    notes: string[];
    baseOctave: number;
}

export const SONGS: Song[] = [{
    name: 'Alle meine Entchen',
    countingTime: 2,
    groundstroke: 4,
    secondsPerTact: 2,
    baseOctave: 3,
    notes:
        ['8C;8D;8E;8F;\
4G;4G;\
8A;8A;8A;8A;\
4G;4P;\
8A;8A;8A;8A;\
4G;4P;\
8F;8F;8F;8F;\
4E;4E;\
8D;8D;8D;8D;\
4C']
}, {
    name: 'Hänsel und Gretel',
    countingTime: 4,
    groundstroke: 4,
    secondsPerTact: 3,
    baseOctave: 3,
    notes:
        ['4G;8E;8F;4G;8E;8C;\
8D;8D;8D;8E;4C;4P;\
4G;8E;8F;4G;8E;8C;\
8D;8D;8D;8E;4C;8P;8C;\
8D;8D;8D;8E;4F;8D;8D;\
8E;8E;8E;8F;4G;4P;\
4G;8E;8F;4G;8E;8C;\
8D;8D;8D;8E;4C']
}, {
    name: 'Ist ein Mann in\'n Brunnen gefallen',
    countingTime: 4,
    groundstroke: 4,
    secondsPerTact: 1.5,
    baseOctave: 3,
    notes:
        ['4C;4D;4E;4F;\
4G;4G;4G;4G;\
4C;4D;4E;4F;\
2G;2G;\
4C;4D;4E;4F;\
4G;4G;4G;4G;\
4G;4F;4E;4D;\
2C;2C']
}, {
    name: 'Hedwig\'s Theme',
    countingTime: 3,
    groundstroke: 4,
    secondsPerTact: 1.5,
    baseOctave: 3,
    notes:
        ['4H-1;\
4E.;8G;4#F;\
2E;4H;\
2A.;\
2#F.;\
4E.;8G;4#F;\
2bE;4F;\
2H.-1,;\
2H-1;4H-1;\
4E.;8G;4#F;\
2E;4H;\
2D1;4bD1;\
2C1;4bA;\
4C.1;8H;4bH;\
2bH-1;4G;\
2E.']
}];
