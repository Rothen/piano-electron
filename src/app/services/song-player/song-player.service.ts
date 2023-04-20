import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NOTES } from '../../helpers/note';
import { NoteComponent } from '../../note/note.component';

interface SongNote {
    tact: number;
    noteIndex: number;
    octave: number;
}

interface NoteGroups {
    halfNote: string;
    length: string;
    longer: string;
    negativeOctave: string;
    note: string;
    octave: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;
    private noteRegex =
    /^(?<length>\d+)(?<halfNote>b|\#)?(?<note>P|C|D|E|F|G|A|H)(?<longer>\.)?(?<negativeOctave>-)?(?<octave>\d+)?$/;

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
                    noteIndex: null,
                    octave: null
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

            return {
                tact,
                noteIndex,
                octave
            };
        });

        return songNotes;
    }

    private playCustomRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];
        if (songNotes[currentIndex].noteIndex !== null) {
            (noteComponents.get(songNotes[currentIndex].noteIndex) as NoteComponent)
                .playNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
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

        if (songNotes[currentIndex].noteIndex !== null) {
            (noteComponents.get(songNotes[currentIndex].noteIndex) as NoteComponent)
                .playCorrectNoteFor((songNote.tact * song.secondsPerTact), songNote.octave);
        }

        this.timeout = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.tact * song.secondsPerTact) * 1000);
    }
}
