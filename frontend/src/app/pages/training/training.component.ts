import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Dog } from '../../models/dog.model';
import { Training } from '../../models/training.model';
import { DogProfileService } from '../../core/dog-profile.service';
import { TrainingService } from '../../core/training.service';

@Component({
  standalone: true,
  selector: 'app-training',
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent implements OnInit {

  trainingForm!: FormGroup;
  dogs: Dog[] = [];
  trainings: Training[] = [];
  trainingTypes: Training['type'][] = ['Markering', 'Sök', 'Dirigering', 'Vattenapport', 'Jaktlydnad', 'Annat'];
  activeDogName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dogProfileService: DogProfileService,
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.trainingForm = this.fb.group({
      dogId: ['', Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      notes: ['', Validators.maxLength(500)], // Valfri anteckning (max 500 tecken)
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]] // Standardvärde = 3
    });

    this.loadDogs();
  }

  loadDogs() {
    this.dogProfileService.getAllDogs().subscribe({
      next: (dogs) => {
        this.dogs = dogs;
        if (dogs.length > 0) {
          const firstDog = dogs[0];
          this.trainingForm.patchValue({ dogId: firstDog._id });
          this.loadTrainings(firstDog._id);
          this.activeDogName = firstDog.nickname;
        }
      },
      error: (err) => console.error('❌ Error fetching dogs:', err)
    });
  }

  loadTrainings(dogId: string) {
    this.activeDogName = this.dogs.find(d => d._id === dogId)?.nickname || null;
    this.trainingService.getTrainingsForDog(dogId).subscribe({
      next: (trainings) => {
        this.trainings = trainings;
      },
      error: (err) => console.error('❌ Error fetching trainings:', err)
    });
  }

  submitTraining() {
    if (this.trainingForm.invalid) return;

    const formData = this.trainingForm.value;

    const trainingData: Training = {
      dogId: formData.dogId,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      notes: formData.notes,
      rating: formData.rating
    };

    this.trainingService.addTraining(trainingData).subscribe({
      next: (savedTraining) => {
        console.log('✅ Träningspass sparat:', savedTraining);
        alert('Träningspass sparat!');
        this.trainingForm.reset();
        this.trainingForm.patchValue({ dogId: formData.dogId }); // Behåll vald hund
        this.loadTrainings(formData.dogId); // Uppdatera listan
      },
      error: (err) => console.error('❌ Error saving training:', err)
    });
  }

  deleteTraining(trainingId: string) {
    this.trainingService.deleteTraining(trainingId).subscribe({
      next: () => {
        console.log('✅ Träningspass raderat');
        this.trainings = this.trainings.filter(t => t._id !== trainingId);
      },
      error: (err) => console.error('❌ Error deleting training:', err)
    });
  }
}
