import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Note } from '../helpers/note';
import { MidiKeyboardService, NoteEvent } from '../services/midi-keyboard/midi-keyboard.service';
import { Subscription } from 'rxjs';
import { NotePlayerService } from '../services/note-player/note-player.service';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoteComponent implements OnInit, OnDestroy {
    @Input() note: Note;
    @Input() audioContext: AudioContext;
    @Input() gainNode: GainNode;

    @Output() onpress: EventEmitter<any> = new EventEmitter();
    @Output() onrelease: EventEmitter<any> = new EventEmitter();
    @Output() onmovein: EventEmitter<any> = new EventEmitter();
    @Output() onmoveout: EventEmitter<any> = new EventEmitter();
    @Output() frequencyChanged: EventEmitter<number> = new EventEmitter();

    public isPlaying = false;

    private oscillators: Map<number, OscillatorNode> = new Map();
    private autoOscillators: Map<number, OscillatorNode> = new Map();
    private noteOnSubscription: Subscription;
    private noteOffSubscription: Subscription;

    constructor(
        private midiKeyboardService: MidiKeyboardService,
        private notePlayerService: NotePlayerService
    ) { }

    public ngOnInit(): void {
        this.noteOnSubscription = this.midiKeyboardService.noteOn().subscribe(noteEvent => this.noteOn(noteEvent));
        this.noteOffSubscription = this.midiKeyboardService.noteOff().subscribe(noteEvent => this.noteOff(noteEvent));
    }

    public ngOnDestroy(): void {
        this.noteOnSubscription.unsubscribe();
        this.noteOffSubscription.unsubscribe();
    }

    public playCorrectNoteFor(time: number, octave: number = 1): void {
        this.isPlaying = true;
        this.notePlayerService.playNoteFor(this.note.frequency * Math.pow(2, octave-1), time);
        setTimeout(_  => this.isPlaying = false, time*1000);
    }

    public playNoteFor(time: number, octave: number = 1): void {
        this.isPlaying = true;
        this.autoOscillators.set(octave, this.notePlayerService.playNoteFor(this.note.currentFrequency * Math.pow(2, octave - 1), time));
        setTimeout(_ => this.isPlaying = false, time * 1000);
    }

    public playCorrectNote(octave: number = 1): void {
        this.isPlaying = true;
        this.oscillators.set(octave, this.notePlayerService.playNote(this.note.frequency * Math.pow(2, octave-1)));
    }

    public playNote(octave: number = 1): void {
        this.isPlaying = true;
        this.oscillators.set(octave, this.notePlayerService.playNote(this.note.currentFrequency * Math.pow(2, octave-1)));
    }

    public stopPlayingNote(octave: number = 1): void {
        this.notePlayerService.stopPlayingNote(this.oscillators.get(octave));
        this.isPlaying = false;
    }

    public onSliderChange(event: any) {
        this.note.currentFrequency = parseInt(event.target.value, 10);
        this.oscillators.forEach((oscillator, cotave) => {
            this.notePlayerService.changeFrequency(oscillator, this.note.currentFrequency * Math.pow(2, cotave - 1));
        });
        this.autoOscillators.forEach((autoOscillator, cotave) => {
            this.notePlayerService.changeFrequency(autoOscillator, this.note.currentFrequency * Math.pow(2, cotave - 1));
        });
        this.frequencyChanged.next(event.target.value);
    }

    public changeFrequency() {
        this.oscillators.forEach((oscillator, cotave) => {
            this.notePlayerService.changeFrequency(oscillator, this.note.currentFrequency * Math.pow(2, cotave - 1));
        });
        this.autoOscillators.forEach((autoOscillator, cotave) => {
            this.notePlayerService.changeFrequency(autoOscillator, this.note.currentFrequency * Math.pow(2, cotave - 1));
        });
        this.frequencyChanged.next(this.note.currentFrequency);
    }

    public higher(): void {
        console.log(this.note.currentFrequency);
        this.note.currentFrequency = Math.min(500, this.note.currentFrequency+1);
        this.changeFrequency();
    }

    public lower(): void {
        this.note.currentFrequency = Math.max(260, this.note.currentFrequency-1);
        this.changeFrequency();
    }

    private noteOn(noteEvent: NoteEvent): void {
        if (noteEvent.note === this.note.midiNote) {
            this.playNote();
        }
    }

    private noteOff(noteEvent: NoteEvent): void {
        if (noteEvent.note === this.note.midiNote) {
            this.stopPlayingNote();
        }
    }
}
