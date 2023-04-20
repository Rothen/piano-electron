export interface Song {
    name: string;
    countingTime: number;
    groundstroke: number;
    secondsPerTact: number;
    notes: string;
}

export const SONGS: Song[] = [{
    name: 'Alle meine Entchen',
    countingTime: 2,
    groundstroke: 4,
    secondsPerTact: 2,
    notes:
'8C3;8D3;8E3;8F3;\
4G3;4G3;\
8A3;8A3;8A3;8A3;\
4G3;4P;\
8A3;8A3;8A3;8A3;\
4G3;4P;\
8F3;8F3;8F3;8F3;\
4E3;4E3;\
8D3;8D3;8D3;8D3;\
4C3'
}, {
    name: 'Hänsel und Gretel',
    countingTime: 4,
    groundstroke: 4,
    secondsPerTact: 3,
    notes:
'4G3;8E3;8F3;4G3;8E3;8C3;\
8D3;8D3;8D3;8E3;4C3;4P;\
4G3;8E3;8F3;4G3;8E3;8C3;\
8D3;8D3;8D3;8E3;4C3;8P;8C3;\
8D3;8D3;8D3;8E3;4F3;8D3;8D3;\
8E3;8E3;8E3;8F3;4G3;4P;\
4G3;8E3;8F3;4G3;8E3;8C3;\
8D3;8D3;8D3;8E3;4C3'
}, {
    name: 'Ist ein Mann in\'n Brunnen gefallen',
    countingTime: 4,
    groundstroke: 4,
    secondsPerTact: 1.5,
    notes:
'4C3;4D3;4E3;4F3;\
4G3;4G3;4G3;4G3;\
4C3;4D3;4E3;4F3;\
2G3;2G3;\
4C3;4D3;4E3;4F3;\
4G3;4G3;4G3;4G3;\
4G3;4F3;4E3;4D3;\
2C3;2C3'
}, {
    name: 'Hedwig\'s Theme',
    countingTime: 3,
    groundstroke: 4,
    secondsPerTact: 1.5,
    notes:
'4H2;\
4E.3;8G3;4#F3;\
2E3;4H3;\
2A.3;\
2#F.3;\
4E.3;8G3;4#F3;\
2bE3;4F3;\
2H.2;\
2P;4H2;\
4E.3;8G3;4#F3;\
2E3;4H3;\
2D4;4bD4;\
2C4;4bA3;\
4C.4;8H3;4bH3;\
2bH2;4G3;\
2E.3'
}];
