import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NoteComponent } from '../../note/note.component';
import { SongNote } from '../../helpers/song-note';
import { SongParser } from '../../helpers/song-parser';

type PlaySongNoteFn = (noteComponent: NoteComponent, tact: number, octave: number) => void;

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeoutId: NodeJS.Timeout;

    constructor() { }

    public playSong(song: Song, noteComponents: QueryList<NoteComponent>, correctNotes: boolean) {
        this.reset();
        const songNotesList = SongParser.parseSongNotes(song);
        for (const songNotes of songNotesList) {
            let fn: PlaySongNoteFn = null;
            if (correctNotes) {
                fn = (noteComponent: NoteComponent, tact: number, octave: number) => noteComponent.playCorrectNoteFor(tact, octave);
            } else {
                fn = (noteComponent: NoteComponent, tact: number, octave: number) => noteComponent.playNoteFor(tact, octave);
            }
            this.playRecursive(song, songNotes, 0, noteComponents, fn);
        }
    }

    public reset(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    private playRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>,
        fn: PlaySongNoteFn): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];

        if (songNote.noteIndex !== null) {
            const noteComponent = (noteComponents.get(songNote.noteIndex) as NoteComponent);
            fn(noteComponent, (songNote.tact * song.secondsPerTact), songNote.octave);
        }

        this.timeoutId = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents, fn);
        }, (songNote.realTact * song.secondsPerTact) * 1000);
    }
}
