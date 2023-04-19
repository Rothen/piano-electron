export interface Song {
    name: string;
    tact: number;
    notes: string;
}

export const SONGS = [{
    name: 'Alle meine Entchen',
    tact: 1 / 3,
    notes: '1C3;1D;1E;1F;2G;2G;1A;1A;1A;1A;4G;1A;1A;1A;1A;4G;1F;1F;1F;1F;2E;2E;1D;1D;1D;1D;4C3'
}, {
    name: 'Hänsel und Gretel',
    tact: 1 / 3,
    notes: '2G;1E;1F;2G;1E;1C3;1D;1D;1D;1E;4C3;2G;1E;1F;2G;1E;1C3;1D;1D;1D;1E;4C3\
    ;1C3;1D;1D;1D;1E;2F;1D;1D;1E;1E;1E;1F;4G;2G;1E;1F;2G;1E;1C3;1D;1D;1D;1E;4C3'
}, {
    name: 'Ist ein Mann in\'n Brunnen gefallen',
    tact: 1 / 3,
    notes: '1C3;1D;1E;1F;1G;1G;1G;1G;1C3;1D;1E;1F;2G;2G;1C3;1D;1E;1F;1G;1G;1G;1G;1G;1F;1E;1D;2C3;2C3'
}];
