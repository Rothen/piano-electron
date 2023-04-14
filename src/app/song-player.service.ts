import { Injectable, QueryList } from '@angular/core';
import { Song } from './song';
import { NOTES } from './note';
import { NoteComponent } from './note/note.component';

interface SongNote {
    tact: number;
    note_index: number;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;

    constructor() { }

    private getSongNotes(song: Song): SongNote[] {
        const songNotes: SongNote[] = song.notes.split(';').map(el => {
            return {
                tact: parseInt(el.charAt(0)),
                note_index: NOTES.findIndex(note => note.name == el.substring(1))
            }
        });

        return songNotes;
    }

    public playSong(song: Song, noteComponents: QueryList<NoteComponent>) {
        const songNotes = this.getSongNotes(song);

        this.playRecursive(song, songNotes, 0, noteComponents);
    }

    public playSongWithCustomNotes(song: Song, noteComponents: QueryList<NoteComponent>) {
        const songNotes = this.getSongNotes(song);

        this.playCustomRecursive(song, songNotes, 0, noteComponents);
    }

    private playCustomRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];
        (noteComponents.get(songNotes[currentIndex].note_index) as NoteComponent).playNoteFor((songNote.tact * song.tact - song.tact / 2))

        this.timeout = setTimeout(() => {
            this.playCustomRecursive(song, songNotes, currentIndex + 1, noteComponents)
        }, (songNote.tact * song.tact) * 1000);
    }

    private playRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];
        (noteComponents.get(songNotes[currentIndex].note_index) as NoteComponent).playCorrectNoteFor((songNote.tact * song.tact - song.tact / 2))

        this.timeout = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents)
        }, (songNote.tact * song.tact) * 1000);
    }

    public reset(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
}
