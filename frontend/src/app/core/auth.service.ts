import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'api/auth';

    // Signal för att hålla koll på om användaren är inloggad
    isAuthenticated = signal<boolean>(!!localStorage.getItem('authToken'));
    userToken = signal<string | null>(localStorage.getItem('authToken'));

    constructor(private http: HttpClient) { }

    // Registrera en användare
    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    // Logga in en användare
    // login(credentials: any): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    //         tap((res: any) => {
    //             this.setToken(res.token);
    //         })
    //     );
    // }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
            tap((res: any) => {
                this.setToken(res.token);
            })
        );
    }


    // Spara token och uppdatera Signal
    setToken(token: string): void {
        localStorage.setItem('authToken', token);
        this.userToken.set(token);
        this.isAuthenticated.set(true);
    }

    // Hämta token
    getToken(): string | null {
        return this.userToken();
    }

    refreshToken(): Observable<any> {
        return this.http.post<{ token: string }>(
            'api/auth/refresh-token',
            {},
            { withCredentials: true }
        ).pipe(
            tap(res => this.setToken(res.token))
        );
    }



    //  Kolla om användaren är inloggad
    isLoggedIn(): boolean {
        return this.isAuthenticated();
    }

    //  Logga ut användaren
    // logout(): void {
    //     localStorage.removeItem('authToken');
    //     this.userToken.set(null);
    //     this.isAuthenticated.set(false);
    // }

    logout(): void {
        this.http.post('api/auth/logout', {}, { withCredentials: true }).subscribe({
            next: () => {
                console.log("Logged out on server.");
            },
            error: (err) => {
                console.error("Error logging out:", err);
            }
        });

        localStorage.removeItem('authToken');
        this.userToken.set(null);
        this.isAuthenticated.set(false);
    }



}
