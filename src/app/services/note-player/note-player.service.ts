import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotePlayerService {
    private audioContext: AudioContext;

    private oscillators: OscillatorNode[] = [];
    private gainNodes: GainNode[] = [];

    constructor() {
        this.audioContext = new AudioContext();
    }

    public playNoteFor(frequency: number, time: number): OscillatorNode {
        const {oscillator, gainNode} = this.createOscillator(frequency);
        this.playFor(time, oscillator, gainNode);
        return oscillator;
    }

    public playNote(frequency: number): OscillatorNode {
        const { oscillator, gainNode } = this.createOscillator(frequency);
        this.oscillators.push(oscillator);
        this.gainNodes.push(gainNode);
        this.play(oscillator, gainNode);
        return oscillator;
    }

    public stopPlayingNote(oscillator: OscillatorNode): void {
        const index = this.oscillators.indexOf(oscillator);
        if (index >= 0) {
            const gainNode = this.gainNodes[index];
            this.oscillators.splice(index, 1);
            this.gainNodes.splice(index, 1);
            gainNode.gain.linearRampToValueAtTime(0., this.audioContext.currentTime + 0.5);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }

    public changeFrequency(oscillator: OscillatorNode, newFrequency: number) {
        const index = this.oscillators.indexOf(oscillator);
        if (index >= 0) {
            this.oscillators[index].frequency.value = newFrequency;
        }
    }

    private createOscillator(frequency: number): { oscillator: OscillatorNode; gainNode: GainNode } {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode).connect(this.audioContext.createDynamicsCompressor());
        return {oscillator, gainNode};
    }

    private playFor(time: number, oscillator: OscillatorNode, gainNode: GainNode): void {
        oscillator.start();
        gainNode.gain.linearRampToValueAtTime(1 / 5, this.audioContext.currentTime + 0.03);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + time + 0.03);
        oscillator.stop(this.audioContext.currentTime + time + 0.03);
        setTimeout(() => {
            this.oscillators.splice(this.oscillators.indexOf(oscillator), 1);
        }, (time + 0.03) * 1000);
    }

    private play(oscillator: OscillatorNode, gainNode: GainNode): OscillatorNode {
        oscillator.start();
        gainNode.gain.linearRampToValueAtTime(1 / 5, this.audioContext.currentTime + 0.03);
        return oscillator;
    }
}
