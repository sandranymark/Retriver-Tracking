
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Dog } from '../../models/dog.model';
import { DogProfileService } from '../../core/dog-profile.service';
import { Training } from '../../models/training.model';
import { TrainingService } from '../../core/training.service';

import { LatestTrainingComponent } from '../../shared/latest-training/latest-training.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    LatestTrainingComponent,

  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  editMode = false;
  showAddDogModal = false;
  dogForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  latestTraining: Training | null = null;


  dogs: Dog[] = [];
  activeDog: Dog | null = null;
  originalProfile: Dog | null = null;

  profileFields: { key: keyof Dog; label: string }[] = [
    { key: 'name', label: 'Namn' },
    { key: 'breed', label: 'Ras' },
    { key: 'sex', label: 'Kön' },
    { key: 'age', label: 'Ålder' }
  ];

  newDog: Partial<Dog> = {
    name: '',
    nickname: '',
    breed: '',
    age: 0,
    sex: 'male',

  };



  constructor(
    private fb: FormBuilder,
    private dogProfileService: DogProfileService,
    private trainingService: TrainingService) { }

  ngOnInit() {
    this.dogForm = this.fb.group({
      selectedDog: ['']
    });

    this.loadDogs();

  }

  loadDogs() {
    this.dogProfileService.getAllDogs().subscribe({
      next: (dogs) => {
        console.log("Hundar hämtade:", dogs);
        this.dogs = dogs;

        if (dogs.length > 0) {
          this.dogForm.patchValue({ selectedDog: dogs[0]._id }); // Sätt första hunden som default
          this.selectDog(dogs[0]._id);
        }

      },

      error: (err) => console.error(' Error fetching dogs:', err)
    });
  }


  selectDog(selectedDogId: string) {
    this.dogProfileService.setActiveDog(selectedDogId);

    this.dogProfileService.getActiveDog().subscribe({
      next: (dog) => {
        if (!dog) {
          console.error(" Ingen hund hittades!");
          return;
        }
        this.activeDog = { ...dog };
        this.originalProfile = { ...dog };
        this.getLatestTraining(dog._id);

      },
      error: (err) => console.error('Error fetching active dog:', err)
    });
  }


  loadActiveDog() {
    const activeDogId = this.dogProfileService.getActiveDogId();
    if (!activeDogId) {
      console.error("Ingen aktiv hund sparad.");
      return;
    }

    this.dogProfileService.getDogById(activeDogId).subscribe({
      next: (dog) => {
        this.activeDog = dog;
        this.originalProfile = { ...dog! };
      },
      error: (err) => console.error('Error fetching active dog:', err)
    });
  }

  toggleEditMode() {
    this.editMode = true;
  }

  saveChanges() {
    if (!this.activeDog) return;

    // Kopiera hunden men ta bort "_id" EFTERSOM SKITEN INTE FUNGERAR ANNARS!!!
    const { _id, ...updatedDogData } = this.activeDog;

    this.dogProfileService.updateDog(_id, updatedDogData).subscribe({
      next: () => {
        this.originalProfile = { ...this.activeDog! };
        this.editMode = false;
      },
      error: (err) => console.error('Error saving Shitty changes:', err)
    });
  }

  cancelEdit() {
    if (this.originalProfile) {
      this.activeDog = { ...this.originalProfile };
    }
    this.editMode = false;
  }

  openAddDogModal() {
    this.showAddDogModal = true;
  }

  closeAddDogModal() {
    this.showAddDogModal = false;
    this.newDog = {
      name: '',
      nickname: '',
      breed: '',
      age: 0,
      sex: 'male',

    };
  }



  addDog() {
    if (!this.newDog.name || !this.newDog.breed || this.newDog.age === undefined) {
      alert('Fyll i alla fält!');
      return;
    }

    const formData = new FormData();
    formData.append("name", this.newDog.name!);
    formData.append("nickname", this.newDog.nickname || '');
    formData.append("breed", this.newDog.breed!);
    formData.append("age", this.newDog.age.toString());
    formData.append("sex", this.newDog.sex!);

    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }
    this.closeAddDogModal();
    this.dogProfileService.addDog(formData).subscribe({
      next: (response) => {
        console.log("Ny hundJÄVEL tillagd:", response.dog);
        this.loadDogs();
      },
      error: (err) => console.error('Error adding dog:', err)
    });



  }


  // För att visa valt filnamn i inputfältet
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }


  getDogImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/img/flatcoatedRetriever3.jpg'; // Dummybild om ingen finns
    }
    return `http://localhost:8181/${imagePath}`;
  }


  getLatestTraining(dogId: string) {
    this.trainingService.getTrainingsForDog(dogId).subscribe({
      next: (trainings) => {
        if (trainings.length === 0) {
          this.latestTraining = null;
          return;
        }

        const sorted = trainings.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );

        this.latestTraining = sorted[0];
      },
      error: (err) => {
        console.error('Kunde inte hämta träningsdata:', err);
        this.latestTraining = null;
      }
    });
  }




}
