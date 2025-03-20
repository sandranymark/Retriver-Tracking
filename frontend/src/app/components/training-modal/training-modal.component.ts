// import { Component, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatOptionModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatIconModule } from '@angular/material/icon';
// import { Training } from '../../models/training.model';
// import { TrainingService } from '../../core/training.service'; // ✅ Vi använder din existerande service!

// @Component({
//   standalone: true,
//   selector: 'app-training-modal',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatSelectModule,
//     MatOptionModule,
//     MatInputModule,
//     MatButtonModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatIconModule
//   ],
//   templateUrl: './training-modal.component.html',
//   styleUrls: ['./training-modal.component.css']
// })
// export class TrainingModalComponent {
//   trainingForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private trainingService: TrainingService,  // ✅ Lägg till TrainingService
//     public dialogRef: MatDialogRef<TrainingModalComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.trainingForm = this.fb.group({
//       dogId: [data.dogs.length > 0 ? data.dogs[0]._id : ''], // ✅ Förval första hunden om det finns
//       type: [''],
//       notes: [''],
//       date: [''],
//       rating: [3] // ✅ Default-betyg 3
//     });
//   }

//   submitTraining() {
//     if (this.trainingForm.valid) {
//       const trainingData: Training = this.trainingForm.value;

//       this.trainingService.addTraining(trainingData).subscribe({
//         next: (response) => {
//           console.log("✅ Träningspass sparat i databasen:", response);
//           this.dialogRef.close(response); // ✅ Stänger modalen och skickar tillbaka datan
//         },
//         error: (err) => {
//           console.error("❌ Fel vid sparande av träningspass:", err);
//         }
//       });
//     }
//   }

//   closeModal() {
//     this.dialogRef.close();
//   }
// }

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
      dogId: [this.dogs.length > 0 ? this.dogs[0]._id : '', Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      notes: ['', Validators.maxLength(500)],
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
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
        console.log(' Träningspass sparat:', savedTraining);
        alert('Träningspass sparat!');
        this.dialogRef.close(savedTraining);
      },
      error: (err) => console.error('Error fucking shit cant save training:', err)
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
