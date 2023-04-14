import { Injectable, QueryList } from '@angular/core';
import { Song } from '../../helpers/song';
import { NOTES } from '../../helpers/note';
import { NoteComponent } from '../../note/note.component';

interface SongNote {
    tact: number;
    noteIndex: number;
}

@Injectable({
    providedIn: 'root'
})
export class SongPlayerService {
    private timeout: NodeJS.Timeout;

    constructor() { }

    public playSong(song: Song, noteComponents: QueryList<NoteComponent>) {
        const songNotes = this.getSongNotes(song);

        this.playRecursive(song, songNotes, 0, noteComponents);
    }

    public playSongWithCustomNotes(song: Song, noteComponents: QueryList<NoteComponent>) {
        const songNotes = this.getSongNotes(song);

        this.playCustomRecursive(song, songNotes, 0, noteComponents);
    }

    public reset(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    private getSongNotes(song: Song): SongNote[] {
        const songNotes: SongNote[] = song.notes.split(';').map(el => ({
            tact: parseInt(el.charAt(0), 10),
            noteIndex: NOTES.findIndex(note => note.name === el.substring(1))
        }));

        return songNotes;
    }

    private playCustomRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];
        (noteComponents.get(songNotes[currentIndex].noteIndex) as NoteComponent).playNoteFor((songNote.tact * song.tact - song.tact / 2));

        this.timeout = setTimeout(() => {
            this.playCustomRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.tact * song.tact) * 1000);
    }

    private playRecursive(song: Song, songNotes: SongNote[], currentIndex: number, noteComponents: QueryList<NoteComponent>): void {
        if (currentIndex >= songNotes.length) {
            return;
        }

        const songNote = songNotes[currentIndex];
        (noteComponents.get(songNotes[currentIndex].noteIndex) as NoteComponent)
            .playCorrectNoteFor((songNote.tact * song.tact - song.tact / 2));

        this.timeout = setTimeout(() => {
            this.playRecursive(song, songNotes, currentIndex + 1, noteComponents);
        }, (songNote.tact * song.tact) * 1000);
    }
}
