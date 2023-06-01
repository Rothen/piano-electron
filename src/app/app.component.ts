import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NOTES, Note } from './helpers/note';
import { NoteComponent } from './note/note.component';
import { SONGS, Song } from './helpers/song';
import { MidiKeyboardService } from './services/midi-keyboard/midi-keyboard.service';
import { SongPlayerService } from './services/song-player/song-player.service';
import { NotePlayerService } from './services/note-player/note-player.service';
import { KonamiService } from './services/konami/konami.service';
import { SystemVolumeService } from './services/system-volume/system-volume.service';

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
    public pressedNote: Note | null = null;
    public score: number = null;
    public scoreText: string = null;
    public systemVolume = 0;
    public showResults = false;
    public selectedPlayType = 'custom';

    private isBlocked = false;

    constructor(
        private midiKeyboardService: MidiKeyboardService,
        private songPlayerService: SongPlayerService,
        public systemVolumeService: SystemVolumeService,
        private konamiService: KonamiService
    ) {}

    public ngOnInit(): void {
        this.loadSystemVolume();
        this.konamiService.konami.subscribe(_ => this.notes.forEach(note => note.currentFrequency = note.frequency));
        this.midiKeyboardService.requestAccess().subscribe(midiAccess => {
            const offset = 48;
            this.midiKeyboardService.onAccessSuccess(midiAccess);
            this.midiKeyboardService.noteOn().subscribe(note => {
                const noteComponent = this.noteCompnents.get((note.note - offset)%12);
                const octave = Math.floor((note.note - offset) / 12) + 1;
                if (noteComponent) {
                    noteComponent.playNote(octave);
                }
            });
            this.midiKeyboardService.noteOff().subscribe(note => {
                const noteComponent = this.noteCompnents.get((note.note - offset) % 12);
                const octave = Math.floor((note.note - offset) / 12) + 1;
                if (noteComponent) {
                    noteComponent.stopPlayingNote(octave);
                }
            });
        });

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
        this.songPlayerService.playSong(this.selectedSong, this.noteCompnents, this.selectedPlayType === 'correct');
    }

    public calculateScore(): number {
        let score = 0;

        for (const note of this.notes) {
            if (this.selectedSong.relevantKeys.indexOf(note.name) > -1) {
                score += Math.abs(note.frequency - note.currentFrequency);
            }
        }

        score = Math.round(score);

        if (score < 2) {
            this.scoreText = 'Wow, perfekt eingestellt!';
        } else if (score < 10) {
            this.scoreText = 'Ausgezeichnet gestimmt! Gratuliere!';
        } else if (score < 30) {
            this.scoreText = 'Super gemacht! Tönt fast perfekt!';
        } else if (score < 50) {
            this.scoreText = 'Nicht schlecht, aber hör nochmals genau hin!';
        } else {
            this.scoreText = 'Schöne Melodie, aber fast wie Katzenmusik. Probiere es doch noch einmal!';
        }

        this.score = score;
        this.showResults = true;

        return score;
    }

    public reset(): void {
        this.showResults = false;
    }

    public hardReset(): void {
        this.showResults = false;
        this.songPlayerService.reset();
        this.score = null;

        for (const note of this.notes) {
            if (note.name.indexOf('#') === -1 && note.name !== 'C') {
                note.currentFrequency = 260;
            }
        }
    }

    public onSystemVolumeChanged(event: any): void {
        if (!this.isBlocked) {
            this.isBlocked = true;
            this.systemVolumeService.setVolume(this.systemVolume).subscribe(_ => {
                this.isBlocked = false;
                this.loadSystemVolume();
            });
        }
    }

    private loadSystemVolume(): void {
        this.systemVolumeService.getVolume().subscribe(volume => this.systemVolume = volume);
    }
}
