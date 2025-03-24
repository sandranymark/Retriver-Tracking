import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../models/training.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private apiUrl = 'api/trainings';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getTrainingsForDog(dogId: string): Observable<Training[]> {
        return this.http.get<Training[]>(`${this.apiUrl}/${dogId}`, { headers: this.getAuthHeaders() });
    }

    getLatestTrainingForDog(dogId: string): Observable<Training> {
        return this.http.get<Training>(`${this.apiUrl}/${dogId}/latest`, {
            headers: this.getAuthHeaders()
        });
    }



    // addTraining(trainingData: Training): Observable<Training> {
    //     return this.http.post<Training>(`${this.apiUrl}`, trainingData, { headers: this.getAuthHeaders() });
    // }
    addTraining(trainingData: any): Observable<Training> {
        return this.http.post<Training>(`${this.apiUrl}`, trainingData, {
            headers: this.getAuthHeaders()
        });
    }


    deleteTraining(trainingId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${trainingId}`, { headers: this.getAuthHeaders() });
    }
}
