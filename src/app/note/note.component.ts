import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Note } from '../helpers/note';
import { MidiKeyboardService, NoteEvent } from '../services/midi-keyboard/midi-keyboard.service';
import { Subscription } from 'rxjs';
import { NotePlayerService } from '../services/note-player/note-player.service';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss']
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

    private oscillator: OscillatorNode;
    private autoOscillator: OscillatorNode;
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

    public playCorrectNoteFor(time: number): void {
        this.isPlaying = true;
        this.notePlayerService.playNoteFor(this.note.frequency, time);
        setTimeout(_  => this.isPlaying = false, time*1000);
    }

    public playNoteFor(time: number): void {
        this.isPlaying = true;
        this.autoOscillator = this.notePlayerService.playNoteFor(this.note.currentFrequency, time);
        setTimeout(_ => this.isPlaying = false, time*1000);
    }

    public playCorrectNote(): void {
        this.isPlaying = true;
        this.oscillator = this.notePlayerService.playNote(this.note.frequency);
    }

    public playNote(): void {
        this.isPlaying = true;
        this.oscillator = this.notePlayerService.playNote(this.note.currentFrequency);
    }

    public stopPlayingNote(): void {
        this.notePlayerService.stopPlayingNote(this.oscillator);
        this.isPlaying = false;
    }

    public changeFrequency(event: any) {
        this.note.currentFrequency = event.target.value;
        this.notePlayerService.changeFrequency(this.oscillator, event.target.value);
        this.notePlayerService.changeFrequency(this.autoOscillator, event.target.value);
        this.frequencyChanged.next(event.target.value);
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
