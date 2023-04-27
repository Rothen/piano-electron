export interface SongNote {
    tact: number;
    realTact: number;
    noteIndex: number;
    octave: number;
    tie: boolean;
    releaseSongNote: SongNote;
}
