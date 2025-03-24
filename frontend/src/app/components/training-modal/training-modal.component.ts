
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Training } from '../../models/training.model';
import { TrainingService } from '../../core/training.service';
import { Dog } from '../../models/dog.model';

@Component({
  standalone: true,
  selector: 'app-training-modal',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' }
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './training-modal.component.html',
  styleUrls: ['./training-modal.component.css']
})
export class TrainingModalComponent implements OnInit {
  trainingForm!: FormGroup;
  dogs: Dog[] = [];
  trainingTypes: Training['type'][] = ['Markering', 'Sök', 'Dirigering', 'Vattenapport', 'Jaktlydnad', 'Annat'];

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    public dialogRef: MatDialogRef<TrainingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.dogs = this.data.dogs;

    this.trainingForm = this.fb.group({
      dog: [this.dogs.length > 0 ? this.dogs[0]._id : '', Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      notes: ['', Validators.maxLength(500)],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  submitTraining() {
    if (this.trainingForm.invalid) return;

    const formData = this.trainingForm.value;

    const trainingData = {
      dogId: formData.dog,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      notes: formData.notes,
      rating: formData.rating
    };


    this.trainingService.addTraining(trainingData).subscribe({
      next: (savedTraining) => {
        alert('Träningspass sparat!');
        this.dialogRef.close(savedTraining);
      },
      error: (err) => console.error('Kunde inte spara träningspass:', err)
    });
  }



  closeModal() {
    this.dialogRef.close();
  }
}
