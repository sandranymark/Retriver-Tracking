import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthenticated = signal<boolean>(false); // Signal som håller koll på inloggningsstatus

    constructor() { }

    // 🏷️ Simulerad login (ingen backend)
    login(email: string, password: string): Observable<boolean> {
        console.log(`🔹 Fake login för ${email}`);
        return of(true).pipe(delay(500)); // Simulerar serverfördröjning
    }

    // 🏷️ Simulerad registrering (ingen backend)
    register(name: string, email: string, password: string): Observable<boolean> {
        console.log(`🔹 Fake register för ${name} (${email})`);
        return of(true).pipe(delay(500));
    }

    // 🏷️ Simulerad logout
    logout() {
        console.log(`🔹 Fake logout`);
        this.isAuthenticated.set(false);
    }
}
