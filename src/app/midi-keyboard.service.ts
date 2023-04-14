import { Injectable } from '@angular/core';
import { Observable, from, fromEvent, Subject, Subscription } from 'rxjs';

const NOTE_ON_COMMAND = 144;
const NOTE_OFF_COMMAND = 128;

export interface NoteEvent {
    midiInput: any;
    key: string;
    note: number;
}

@Injectable({
    providedIn: 'root'
})
export class MidiKeyboardService {
    private midiAccess: any;
    private inputs: any;
    private outputs: any;

    private midiMessageSubscriptions: Map<string, Subscription> = new Map();
    private noteOnSubject: Subject<NoteEvent> = new Subject();
    private noteOffSubject: Subject<NoteEvent> = new Subject();

    constructor() { }

    public requestAccess(): Observable<any> {
        return from((navigator as any).requestMIDIAccess());
    }

    public onAccessSuccess(midiAccess: any): void {
        console.log('access success');
        this.midiAccess = midiAccess;
        this.inputs = midiAccess.inputs;
        this.outputs = midiAccess.outputs;

        this.inputs.forEach((midiInput: any, key: string, parent: any) => {
            const observable = fromEvent<any>(midiInput, 'midimessage');

            this.midiMessageSubscriptions.set(key, observable.subscribe(
                message => this.onMidiMessage(midiInput, key, message)
            ));
        });
    }

    private onAccessFailure(): void {
        console.log('Could not access your MIDI devices.');
    }

    private onMidiMessage(midiInput: any, key: string, message: any) {
        const command = message.data[0];
        const note = message.data[1];
        const velocity = (message.data.length > 2) ? message.data[2] : 0;

        if (command == NOTE_ON_COMMAND || command == NOTE_OFF_COMMAND) {
            const noteOn = command == NOTE_ON_COMMAND && velocity > 0;

            this.dispatchNoteEvent(noteOn, midiInput, key, note)
        }
    }

    private dispatchNoteEvent(noteOn: boolean, midiInput: any, key: string,  note: number): void {
        let subject: Subject<NoteEvent>;

        if (noteOn) {
            subject = this.noteOnSubject;
        } else {
            subject = this.noteOffSubject;
        }

        subject.next({midiInput, key, note});
    }

    public noteOn(): Subject<NoteEvent> {
        return this.noteOnSubject;
    }

    public noteOff(): Subject<NoteEvent> {
        return this.noteOffSubject;
    }
}
