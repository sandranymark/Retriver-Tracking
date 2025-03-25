
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DogEventService {
    private dogAddedSource = new Subject<void>();
    dogAdded$ = this.dogAddedSource.asObservable();

    announceDogAdded() {
        this.dogAddedSource.next();
    }
}
