import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TrainingEventService {

    // Emitter för när ett nytt träningspass har lagts till ( jag vill att andra komponenter ska kunna lyssna på detta )
    private trainingAddedSource = new Subject<string>(); // vi skickar med dogId

    // Observable som andra komponenter kan lyssna på
    trainingAdded$ = this.trainingAddedSource.asObservable();

    // Kallar på denna när ett nytt träningspass lagts till
    announceTrainingAdded(dogId: string) {
        this.trainingAddedSource.next(dogId);
    }
}

// SÅ JÄVLA COOLT, Jag lägger in detta i en service som jag sedan injectar i de komponenter som behöver lyssna på detta event.
// Detta är en av de mest användbara sätten att kommunicera mellan komponenter i Angular.
// FUNKAR hur jävla bra som helst, man märker knappt att det är asynkront!!!!! :D