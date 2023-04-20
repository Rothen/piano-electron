import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NOTES } from '../../helpers/note';
import { NoteComponent } from '../../note/note.component';

interface SongNote {
    tact: number;
    realTact: number;
    noteIndex: number;
    octave: number;
    holdTill: number;
    holdTillSongNote: SongNote;
    releaseSongNote: SongNote;
}

interface NoteGroups {
    halfNote: string;
    length: string;
    longer: string;
    negativeOctave: string;
    note: string;
    octave: string;
    hold: string;
    holdTill: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;
    /*eslint max-len: ["error", { "code": 800 }]*/
    private noteRegex = /^(?<length>\d+)(?<halfNote>b|\#)?(?<note>P|C|D|E|F|G|A|H)(?<longer>\.)?(?<negativeOctave>-)?(?<octave>\d+)?(?<hold>,)?(?<holdTill>\d+)?$/;

    constructor() { }

    public playSong(song: Song, noteComponents: QueryList<NoteComponent>) {
        this.reset();
        const songNotes = this.getSongNotes(song);
        this.playRecursive(song, songNotes, 0, noteComponents);
    }

    public playSongWithCustomNotes(song: Song, noteComponents: QueryList<NoteComponent>) {
        this.reset();
        const songNotes = this.getSongNotes(song);

        this.playCustomRecursive(song, songNotes, 0, noteComponents);
    }

    public reset(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    private getSongNotes(song: Song): SongNote[] {
        const songNotes: SongNote[] = song.notes.split(';').map(noteStr => {
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
                    holdTill: 0,
                    holdTillSongNote: null,
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
                    noteIndex = NOTES.length-1;
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

            let holdTill = 0;
            if (matches.hold) {
                holdTill = parseInt(matches.holdTill, 10);
            }

            return {
                tact,
                realTact: tact,
                noteIndex,
                octave,
                holdTill,
                holdTillSongNote: null,
                releaseSongNote: null
            };
        });

        for (let i = 0; i < songNotes.length; i++) {
            const songNote = songNotes[i];
            if (songNote.holdTill > 0) {
                if (i + songNote.holdTill < songNotes.length) {
                    for (let j = i+1; j <= i+songNote.holdTill; j++) {
                        songNote.tact += songNotes[j].tact;
                    }
                    songNote.holdTillSongNote = songNotes[i + songNote.holdTill];
                    songNotes[i + songNote.holdTill].noteIndex = null;
                    songNotes[i + songNote.holdTill].octave = null;
                    songNotes[i + songNote.holdTill].holdTill = 0;
                    songNotes[i + songNote.holdTill].holdTillSongNote = null;
                    songNotes[i + songNote.holdTill].releaseSongNote = null;
                    songNotes[i + songNote.holdTill+1].releaseSongNote = songNote;
                }
            }
        }

        return songNotes;
    }

    private playCustomRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];

        if (songNote.noteIndex !== null) {
            if (songNote.releaseSongNote) {
                const releaseNoteComponent = (noteComponents.get(songNote.releaseSongNote.noteIndex) as NoteComponent);
                releaseNoteComponent.stopPlayingNote(songNote.releaseSongNote.octave);
            }

            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            if (songNote.holdTillSongNote) {
                noteComponent.playNote(songNote.octave);
            } else {
                noteComponent.playNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
            }
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
            /*if (songNote.releaseSongNote) {
                const releaseNoteComponent = (noteComponents.get(songNote.releaseSongNote.noteIndex) as NoteComponent);
                releaseNoteComponent.stopPlayingNote(songNote.releaseSongNote.octave);
            }

            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            if (songNote.holdTillSongNote) {
                noteComponent.playCorrectNote(songNote.octave);
            } else if (!songNote.releaseSongNote) {
                noteComponent.playCorrectNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
            }*/
            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            noteComponent.playCorrectNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
        }

        this.timeout = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.realTact * song.secondsPerTact) * 1000);
    }
}
