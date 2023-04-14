import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotePlayerService {
    private audioContext: AudioContext;
    private gainNode: GainNode;

    private oscillators: OscillatorNode[] = [];

    constructor() { }

    public setAudioContext(audioContext: AudioContext): void {
        this.audioContext = audioContext;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0;
        this.gainNode.connect(this.audioContext.destination);
    }

    public playNoteFor(frequency: number, time: number): OscillatorNode {
        const oscillator = this.createOscillator(frequency);
        this.playFor(time, oscillator);
        return oscillator;
    }

    public playNote(frequency: number): OscillatorNode {
        const oscillator = this.createOscillator(frequency);
        this.play(oscillator);
        return oscillator;
    }

    public stopPlayingNote(oscillator: OscillatorNode): void {
        const index = this.oscillators.indexOf(oscillator);
        if (index >= 0) {
            this.oscillators.splice(index, 1);
            if (this.oscillators.length === 0) {
                this.gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            }
            oscillator.stop(this.audioContext.currentTime + 1);
        }
    }

    public changeFrequency(oscillator: OscillatorNode, newFrequency: number) {
        const index = this.oscillators.indexOf(oscillator);
        if (index >= 0) {
            this.oscillators[index].frequency.value = newFrequency;
        }
    }

    private createOscillator(frequency: number): OscillatorNode {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        const compressor = this.audioContext.createDynamicsCompressor();

        oscillator.connect(this.gainNode).connect(compressor);
        this.oscillators.push(oscillator);
        return oscillator;
    }

    private playFor(time: number, oscillator: OscillatorNode): void {
        oscillator.start();
        if (this.oscillators.length === 1) {
            this.gainNode.gain.linearRampToValueAtTime(1 / 5, this.audioContext.currentTime + 0.03);
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + time + 0.03);
        }
        oscillator.stop(this.audioContext.currentTime + time + 0.03);
        setTimeout(() => {
            this.oscillators.splice(this.oscillators.indexOf(oscillator), 1);
        }, (time + 0.03) * 1000);
    }

    private play(oscillator: OscillatorNode): OscillatorNode {
        oscillator.start();
        if (this.oscillators.length === 1) {
            this.gainNode.gain.cancelScheduledValues(0.001);
            this.gainNode.gain.linearRampToValueAtTime(1 / 5, this.audioContext.currentTime + 0.03);
        }
        return oscillator;
    }
}
