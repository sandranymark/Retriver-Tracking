import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dog } from '../models/dog.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DogProfileService {
    private apiUrl = 'api/dogs';
    private activeDogId = signal<string | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    // Hämta alla hundar för inloggad ägare
    getAllDogs(): Observable<Dog[]> {
        return this.http.get<Dog[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // Hämta en specifik hund
    getDogById(dogId: string): Observable<Dog> {
        return this.http.get<Dog>(`${this.apiUrl}/${dogId}`, { headers: this.getAuthHeaders() });
    }

    // Sätt en aktiv hund (för att byta mellan hundar)
    setActiveDog(dogId: string) {
        this.activeDogId.set(dogId);
    }

    // Hämta den aktiva hunden
    getActiveDog(): Observable<Dog | null> {
        const dogId = this.activeDogId();
        return dogId ? this.getDogById(dogId) : new Observable<null>((observer) => observer.next(null));
    }

    // Lägg till en ny hund
    // addDog(dogData: Partial<Dog>): Observable<Dog> {
    //     return this.http.post<Dog>(this.apiUrl, dogData, { headers: this.getAuthHeaders() });
    // }

    // addDog(dogData: FormData): Observable<Dog> {
    //     return this.http.post<Dog>(this.apiUrl, dogData, {
    //         headers: this.getAuthHeaders().delete('Content-Type') // Låter browsern sätta rätt Content-Type
    //     });
    // }

    addDog(dogData: FormData): Observable<{ dog: Dog }> {
        return this.http.post<{ dog: Dog }>(this.apiUrl, dogData, {
            headers: this.getAuthHeaders().delete('Content-Type')
        });
    }



    updateDog(dogId: string, updatedDog: Partial<Dog>): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
        return this.http.put<any>(`${this.apiUrl}/${dogId}`, updatedDog, { headers });
    }

    //  Ta bort en hund
    deleteDog(dogId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${dogId}`, { headers: this.getAuthHeaders() });
    }

    getActiveDogId(): string | null {
        return localStorage.getItem('activeDogId');
    }
}


