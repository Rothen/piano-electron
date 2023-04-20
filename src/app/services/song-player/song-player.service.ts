import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NOTES } from '../../helpers/note';
import { NoteComponent } from '../../note/note.component';

interface SongNote {
    tact: number;
    noteIndex: number;
    octave: number;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;

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
        const songNotes: SongNote[] = song.notes.split(';').map(el => {
            let tact = 1/parseInt(el.charAt(0), 10);

            if (el.substring(1) === 'P') {
                return {
                    tact,
                    noteIndex: null,
                    octave: null
                };
            }

            let octave = parseInt(el.charAt(el.length - 1), 10) - 2;
            let noteName = el.substring(1, el.length - 1);

            if (noteName.endsWith('.')) {
                tact *= 1.5;
                noteName = noteName.replace('.', '');
            }

            let lower = false;
            let higher = false;

            if (noteName.startsWith('b')) {
                noteName = noteName.replace('b', '');
                lower = true;
            } else if (noteName.startsWith('#')) {
                noteName = noteName.replace('#', '');
                higher = true;
            }

            let noteIndex = NOTES.findIndex(note => note.name === noteName);

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
