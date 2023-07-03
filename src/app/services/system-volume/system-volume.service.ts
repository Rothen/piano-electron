import { Injectable } from '@angular/core';
import * as loudness from 'mwl-loudness';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemVolumeService {
    loudness: typeof loudness;

    constructor() {
        if (this.isElectron) {
            this.loudness = window.require('mwl-loudness');
        }
    }

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    public getVolume(): Observable<number> {
        return from(this.loudness.getVolume());
    }

    public setVolume(volume: number): Observable<void> {
        return from(this.loudness.setVolume(volume));
    }
}
