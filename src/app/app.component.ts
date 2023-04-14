import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NOTES, Note } from './note';
import { NoteComponent } from './note/note.component';
import { SONGS, Song } from './song';
import { MidiKeyboardService } from './midi-keyboard.service';
import { SongPlayerService } from './song-player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChildren(NoteComponent) noteCompnents: QueryList<NoteComponent>;

    public title = 'piano';
    public selectedSong: Song;
    public songs: Song[] = SONGS;
    public notes: Note[] = NOTES;
    public audioContext: AudioContext = null;
    public gainNode: GainNode;
    public pressedNote: Note | null = null;
    public score: number = null;

    constructor(private midiKeyboardService: MidiKeyboardService, private songPlayerService: SongPlayerService) {}

    public ngOnInit(): void {
        this.midiKeyboardService.requestAccess().subscribe(midiAccess => {
            const offset = 48;
            this.midiKeyboardService.onAccessSuccess(midiAccess);
            this.midiKeyboardService.noteOn().subscribe(note => {
                this.noteCompnents.get(note.note - offset).playNote();
            });
            this.midiKeyboardService.noteOff().subscribe(note => {
                this.noteCompnents.get(note.note - offset).stopPlayingNote();
            });
        });

        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 0.05;
        this.selectedSong = this.songs[0];

        document.addEventListener('mouseup', event => this.noteReleased(null));
    }

    public notePressed(note: Note) {
        if (this.pressedNote === null) {
            this.pressedNote = note;
            this.noteCompnents.get(this.notes.indexOf(note))?.playNote();
        }
    }

    public noteReleased(note: Note | null) {
        if (this.pressedNote !== null) {
            this.noteCompnents.get(this.notes.indexOf(this.pressedNote))?.stopPlayingNote();
            this.pressedNote = null;
        }
    }

    public noteEntered(note: Note): void {
        if (this.pressedNote !== null) {
            this.noteReleased(note);
            this.notePressed(note);
        }
    }

    public playSong() {
        this.songPlayerService.playSong(this.selectedSong, this.noteCompnents);
    }

    public playSongWithCustomNotes() {
        this.songPlayerService.playSongWithCustomNotes(this.selectedSong, this.noteCompnents);
    }

    public calculateScore(): number {
        let maxError = 0;
        let currentError = 0;

        for (const note of this.notes) {
            const furthestNote = note.frequency <= 400 ? 260 : 540;
            console.log(furthestNote, note.frequency);
            maxError += Math.abs(furthestNote - note.currentFrequency);
            currentError += Math.abs(note.currentFrequency - note.frequency);
        }

        const error = currentError / maxError;
        const score = Math.round((1 - error) * 100);

        console.log('Error: ' + Math.round(error * 100));
        console.log('Score: ' + score);

        this.score = score;

        return score;
    }

    public reset(): void {
        this.songPlayerService.reset();
        this.score = null;

        for (const note of this.notes) {
            if (note.name.indexOf('#') === -1) {
                note.currentFrequency = 260;
            }
        }
    }
}
