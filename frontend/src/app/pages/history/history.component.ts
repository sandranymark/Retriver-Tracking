import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { FormsModule } from '@angular/forms';
import { DogProfileService } from '../../core/dog-profile.service';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { TrainingSession, Training } from '../../models/training.model';
import { TrainingService } from '../../core/training.service';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { forkJoin } from 'rxjs'; // Är den mest idiotisk,enkla, pålitliga sättet Angular har att hantera flera parallella HTTP-anrop på.


@Component({
  standalone: true,
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [CalendarComponent, CommonModule, FormsModule, MatFormFieldModule, MatSelect, MatOption]
})

export class HistoryComponent implements OnInit {

  dogs: Dog[] = [];
  recentSessions: TrainingSession[] = [];
  selectedDogId: string = "";
  showAllDogs: boolean = false;

  constructor(
    private trainingService: TrainingService,
    private dogProfileService: DogProfileService
  ) { }

  ngOnInit() {
    this.dogProfileService.getAllDogs().subscribe({
      next: (dogs) => {
        this.dogs = dogs;
        if (dogs.length > 0) {
          this.selectedDogId = dogs[0]._id;
          this.loadTrainingsForDog(dogs[0]._id);
        }
      },
      error: (err) => console.error("Kunde inte hämta hundar:", err)
    });
  }

  onToggleShowAll() {
    if (this.showAllDogs) {
      this.loadTrainingsForAllDogs();
    } else {
      this.loadTrainingsForDog(this.selectedDogId);
    }
  }


  loadTrainingsForDog(dogId: string) {

    this.showAllDogs = false;

    const dogMap = new Map(this.dogs.map(dog => [dog._id.toString(), dog]));

    this.trainingService.getTrainingsForDog(dogId).subscribe({
      next: (trainings: Training[]) => {
        this.recentSessions = this.convertTrainingsToSessions(trainings, dogMap);
      },
      error: (err) => console.error(" Kunde inte hitta träningspassen:", err)
    });
  }


  loadTrainingsForAllDogs() {

    const dogMap = new Map(this.dogs.map(dog => [dog._id.toString(), dog]));
    const allRequests$ = this.dogs.map(dog =>
      this.trainingService.getTrainingsForDog(dog._id)

    );

    forkJoin(allRequests$).subscribe({
      next: (results: Training[][]) => {
        const allTrainings = results.flat();
        this.recentSessions = this.convertTrainingsToSessions(
          allTrainings,
          dogMap
        );
      },
      error: (err) => console.error("Fel vid hämtning av alla träningar:", err)
    });
  }


  convertTrainingsToSessions(trainings: Training[], dogMap: Map<string, Dog>): TrainingSession[] {
    return trainings.map(training => {
      const dogId = typeof training.dog === 'string'
        ? training.dog
        : training.dog._id.toString();

      const dog = dogMap.get(dogId);

      return {
        title: training.type,
        date: training.date ? new Date(training.date).toISOString().split("T")[0] : '',
        details: training.notes || 'Inga anteckningar',
        dogImageUrl: dog?.imageUrl,
      };
    });
  }





  trackByDate(index: number, session: TrainingSession): string {
    return session.date + session.title;
  }



  getDogImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/img/flatcoatedRetriever3.jpg'; // Dummybild om ingen finns
    }
    return `http://localhost:8181/${imagePath}`;
  }



}
