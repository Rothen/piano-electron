import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NOTES } from '../../helpers/note';
import { NoteComponent } from '../../note/note.component';

interface SongNote {
    tact: number;
    realTact: number;
    noteIndex: number;
    octave: number;
    tie: boolean;
    releaseSongNote: SongNote;
}

interface NoteGroups {
    halfNote: string;
    length: string;
    longer: string;
    negativeOctave: string;
    note: string;
    octave: string;
    tie: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;
    /*eslint max-len: ["error", { "code": 800 }]*/
    private noteRegex = /^(?<length>\d+)(?<halfNote>b|\#)?(?<note>P|C|D|E|F|G|A|H)(?<longer>\.)?(?<negativeOctave>-)?(?<octave>\d+)?(?<tie>,)?$/;

    constructor() { }

    public playSong(song: Song, noteComponents: QueryList<NoteComponent>) {
        this.reset();
        const songNotesList = this.getSongNotes(song);
        for (const songNotes of songNotesList) {
            this.playRecursive(song, songNotes, 0, noteComponents);
        }
    }

    public playSongWithCustomNotes(song: Song, noteComponents: QueryList<NoteComponent>) {
        this.reset();
        const songNotesList = this.getSongNotes(song);
        for (const songNotes of songNotesList) {
            this.playCustomRecursive(song, songNotes, 0, noteComponents);
        }
    }

    public reset(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    private parseSongNotes(song: Song): SongNote[][] {
        const songNotes: SongNote[][] = song.notes.map(songNoteStr => songNoteStr.split(';').map(noteStr => {
            const matches: NoteGroups = noteStr.match(this.noteRegex).groups as any as NoteGroups;
            const length = parseInt(matches.length, 10);
            let tact = 1 / length;

            if (matches.longer) {
                tact *= 1.5;
            }

            if (matches.note === 'P') {
                return {
                    tact,
                    realTact: tact,
                    noteIndex: null,
                    octave: null,
                    tie: false,
                    releaseSongNote: null
                };
            }

            let octave = song.baseOctave - 2;
            let octaveModifier = (matches.octave) ? parseInt(matches.octave, 10) : 0;
            if (matches.negativeOctave) {
                octaveModifier *= -1;
            }
            octave += octaveModifier;

            let lower = false;
            let higher = false;

            if (matches.halfNote === 'b') {
                lower = true;
            } else if (matches.halfNote === '#') {
                higher = true;
            }

            let noteIndex = NOTES.findIndex(note => note.name === matches.note);

            if (lower) {
                if (noteIndex === 0) {
                    octave -= 1;
                    noteIndex = NOTES.length - 1;
                } else {
                    noteIndex--;
                }
            } else if (higher) {
                if (noteIndex === NOTES.length - 1) {
                    octave += 1;
                    noteIndex = 0;
                } else {
                    noteIndex++;
                }
            }

            let tie = false;
            if (matches.tie) {
                tie = true;
            }

            return {
                tact,
                realTact: tact,
                noteIndex,
                octave,
                tie,
                releaseSongNote: null
            };
        }));

        return songNotes;
    }

    private handleTies(songNotes: SongNote[]): void {
        for (let i = 0; i < songNotes.length; i++) {
            const songNote = songNotes[i];
            if (songNote.tie) {
                let foundTie: SongNote = null;
                let foundTieIndex = -1;
                let sum = songNote.realTact;
                for (let j = i + 1; j < songNotes.length; j++) {
                    const tieSongNote = songNotes[j];
                    sum += tieSongNote.realTact;
                    if (tieSongNote.noteIndex === songNote.noteIndex && tieSongNote.octave === songNote.octave) {
                        foundTie = tieSongNote;
                        foundTieIndex = j;
                        break;
                    }
                }
                if (foundTie) {
                    songNote.tact = sum;
                    foundTie.noteIndex = null;
                    foundTie.octave = null;
                    foundTie.tie = false;
                    foundTie.releaseSongNote = null;
                    if (foundTieIndex + 1 < songNotes.length) {
                        songNotes[foundTieIndex + 1].releaseSongNote = songNote;
                    } else {
                        songNotes.push({
                            tact: 0.01,
                            realTact: 0.01,
                            noteIndex: null,
                            octave: null,
                            tie: false,
                            releaseSongNote: null
                        });
                    }
                }
            }
        }
    }

    private getSongNotes(song: Song): SongNote[][] {
        const songNotes: SongNote[][] = this.parseSongNotes(song);
        songNotes.forEach(songNoteList => this.handleTies(songNoteList));

        return songNotes;
    }

    private playCustomRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];

        if (songNote.noteIndex !== null) {
            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            noteComponent.playNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
        }

        this.timeout = setTimeout(() => {
            this.playCustomRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.tact * song.secondsPerTact) * 1000);
    }

    private playRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];

        if (songNote.noteIndex !== null) {
            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            noteComponent.playCorrectNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
        }

        this.timeout = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.realTact * song.secondsPerTact) * 1000);
    }
}
