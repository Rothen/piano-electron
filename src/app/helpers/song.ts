export interface Song {
    name: string;
    tact: number;
    notes: string;
}

export const SONGS = [{
    name: 'Alle meine Entchen',
    tact: 1 / 3,
    notes: '1C3;1D3;1E3;1F3;2G3;2G3;1A3;1A3;1A3;1A3;4G3;1A3;1A3;1A3;1A3;4G3;1F3;1F3;1F3;1F3;2E3;2E3;1D3;1D3;1D3;1D3;4C3'
}, {
    name: 'Hänsel und Gretel',
    tact: 1 / 3,
    notes: '2G3;1E3;1F3;2G3;1E3;1C3;1D3;1D3;1D3;1E3;4C3;2G3;1E3;1F3;2G3;1E3;1C3;1D3;1D3;1D3;1E3;4C3\
;1C3;1D3;1D3;1D3;1E3;2F3;1D3;1D3;1E3;1E3;1E3;1F3;4G3;2G3;1E3;1F3;2G3;1E3;1C3;1D3;1D3;1D3;1E3;4C3'
}, {
    name: 'Ist ein Mann in\'n Brunnen gefallen',
    tact: 1 / 3,
    notes: '1C3;1D3;1E3;1F3;1G3;1G3;1G3;1G3;1C3;1D3;1E3;1F3;2G3;2G3;1C3;1D3;1E3;1F3;1G3;1G3;1G3;1G3;1G3;1F3;1E3;1D3;2C3;2C3'
}, {
    name: 'Hedwigs Theme',
    tact: 1 / 6,
    notes: '2E3;3A3;1C4;2H3;4A3;2E4;6D4;6H3;3A3;1C4;2H3;4G3;2H3;8E3;2E3;3A3;1C4;2H3;4A3;2E4;4G4;2F#4\
;4F4;2C#4;3F4;1E4;2D#4;4C3;2C4;8A3'
}];
