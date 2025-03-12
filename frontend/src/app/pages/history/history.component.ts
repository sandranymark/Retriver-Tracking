import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Training, TrainingSession } from '../../models/training.model';
import { CalendarComponent } from "../../components/calendar/calendar.component";
import { TrainingService } from '../../core/training.service';

@Component({
  standalone: true,
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [CalendarComponent, CommonModule]
})
export class HistoryComponent implements OnInit {
  recentSessions: TrainingSession[] = [];
  selectedDogId: string = "";

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    const dogId = "67d19bc181a434ac05b67d60";
    this.loadTrainings(dogId);
  }

  loadTrainings(dogId: string) {
    this.trainingService.getTrainingsForDog(dogId).subscribe({
      next: (trainings: Training[]) => {
        this.recentSessions = trainings.map(training => ({
          title: training.type,
          date: training.date ? new Date(training.date).toISOString().split('T')[0] : '',
          details: training.notes || 'Inga anteckningar'
        }));
      },
      error: (err) => console.error('❌ Error fetching trainings:', err)
    });
  }


  trackByDate(index: number, session: TrainingSession): string {
    return session.date + session.title;
  }

  addTraining(newSession: TrainingSession) {
    if (!this.selectedDogId) {
      console.error("❌ Ingen hund vald!");
      return;
    }

    // Skapa ett Training-objekt för API-anropet
    const trainingData: Training = {
      dogId: this.selectedDogId,
      type: newSession.title as 'Landapport' | 'Vattenapport' | 'Dirigering' | 'Annat', // Casta till rätt typ
      notes: newSession.details,
      rating: 5 // Eventuellt göra detta dynamiskt i framtiden
    };

    this.trainingService.addTraining(trainingData).subscribe({
      next: (savedTraining) => {
        console.log("✅ Träning sparad!", savedTraining);

        // Konvertera tillbaka till TrainingSession för UI
        const session: TrainingSession = {
          title: savedTraining.type,
          date: new Date(savedTraining.date ?? new Date()).toISOString().split("T")[0], // Datum från API eller "nu"
          details: savedTraining.notes || "Inga anteckningar"
        };

        this.recentSessions = [session, ...this.recentSessions];
      },
      error: (err) => console.error("❌ Fel vid sparande av träning:", err)
    });
  }


}


// TrackedbyDate är en metod som används för att identifiera varje träningspass i listan.
// Om du lägger till ett nytt träningspass,
// behåller Angular de gamla istället för att skapa om alla.
// Detta gör att sidan inte behöver laddas om varje gång du lägger till ett nytt träningspass.