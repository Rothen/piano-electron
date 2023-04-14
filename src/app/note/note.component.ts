import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Note } from '../helpers/note';
import { MidiKeyboardService, NoteEvent } from '../services/midi-keyboard/midi-keyboard.service';
import { Subscription } from 'rxjs';

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
    private vol: GainNode;

    private noteOnSubscription: Subscription;
    private noteOffSubscription: Subscription;

    constructor(private midiKeyboardService: MidiKeyboardService) { }

    public ngOnInit(): void {
        this.noteOnSubscription = this.midiKeyboardService.noteOn().subscribe(noteEvent => this.noteOn(noteEvent));
        this.noteOffSubscription = this.midiKeyboardService.noteOff().subscribe(noteEvent => this.noteOff(noteEvent));
    }

    public ngOnDestroy(): void {
        this.noteOnSubscription.unsubscribe();
        this.noteOffSubscription.unsubscribe();
    }

    public playCorrectNoteFor(time: number): void {
        const oscillator = this.createOscillator(this.note.frequency);
        this.playFor(time, oscillator);
    }

    public playNoteFor(time: number): void {
        this.autoOscillator = this.createOscillator(this.note.currentFrequency);
        this.playFor(time, this.autoOscillator);
    }

    public playCorrectNote(): void {
        this.play(this.note.frequency);
    }

    public playNote(): void {
        this.play(this.note.currentFrequency);
    }

    public stopPlayingNote(): void {
        if (this.oscillator) {
            this.vol.gain.linearRampToValueAtTime(0.001/5, this.audioContext.currentTime + 0.5);
            this.oscillator.stop(this.audioContext.currentTime + 1);
            this.isPlaying = false;
            this.oscillator = null;
        }
    }

    public changeFrequency(event: any) {
        this.note.currentFrequency = event.target.value;
        if (this.oscillator) {
            this.oscillator.frequency.value = event.target.value;
        }
        if (this.autoOscillator) {
            this.autoOscillator.frequency.value = event.target.value;
        }
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

    private createOscillator(frequency: number): OscillatorNode {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        this.vol = this.audioContext.createGain();
        this.vol.gain.value = 0;
        const compressor = this.audioContext.createDynamicsCompressor();

        oscillator.connect(this.vol).connect(compressor);
        this.vol.connect(this.audioContext.destination);
        return oscillator;
    }

    private playFor(time: number, oscillator: OscillatorNode): void {
        this.isPlaying = true;
        oscillator.start();
        this.vol.gain.linearRampToValueAtTime(1/5, this.audioContext.currentTime + 0.03);
        this.vol.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + time + 0.03);
        oscillator.stop(this.audioContext.currentTime + time + 0.03);
        setTimeout(() => {
            this.isPlaying = (!this.oscillator) ? false : true;
        }, (time + 0.03) * 1000);
    }

    private play(frequency: number): void {
        if (!this.oscillator) {
            this.isPlaying = true;
            this.oscillator = this.createOscillator(frequency);

            this.oscillator.start();
            this.vol.gain.linearRampToValueAtTime(1/5, this.audioContext.currentTime + 0.03);
        }
    }
}
