import { HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KonamiService {
    public konami: Subject<void>;

    private sequence: string[];

    private konamiCode: string[];

    constructor() {
        this.konami = new Subject<void>();
        this.sequence = [];
        this.konamiCode = [
            'arrowup', 'arrowup',
            'arrowdown', 'arrowdown',
            'arrowleft', 'arrowright',
            'arrowleft', 'arrowright',
            'b', 'a'
        ];
        window.addEventListener('keydown', event => this.handleKeyboardEvent(event));
    }

    @HostListener('window:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key) {
            this.sequence.push(event.key.toLowerCase());

            if (this.sequence.length > this.konamiCode.length) {
                this.sequence.shift();
            }

            if (this.isKonamiCode()) {
                this.konami.next();
            }
        }
    }

    private isKonamiCode(): boolean {
        return this.konamiCode.every((code: string, index: number) => code === this.sequence[index]);
    }
}
