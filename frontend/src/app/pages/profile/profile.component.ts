
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

  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  editMode = false;
  showAddDogModal = false;
  dogForm!: FormGroup;

  dogs: Dog[] = [];
  activeDog: Dog | null = null;
  originalProfile: Dog | null = null;

  profileFields: { key: keyof Dog; label: string }[] = [
    { key: 'name', label: 'Namn' },
    { key: 'breed', label: 'Ras' },
    { key: 'sex', label: 'Kön' },
    { key: 'age', label: 'Född' }
  ];

  newDog: Partial<Dog> = {
    name: '',
    nickname: '',
    breed: '',
    age: 0,
    sex: 'male',
    image: ''
  };



  constructor(private fb: FormBuilder, private dogProfileService: DogProfileService) { }

  ngOnInit() {
    this.dogForm = this.fb.group({
      selectedDog: [''] // Initiera med tom sträng eller en default-hund
    });

    this.loadDogs();

  }

  loadDogs() {
    this.dogProfileService.getAllDogs().subscribe({
      next: (dogs) => {
        console.log("✅ Hundar hämtade:", dogs);
        this.dogs = dogs;

        if (dogs.length > 0) {
          this.dogForm.patchValue({ selectedDog: dogs[0]._id }); // ✅ Sätt första hunden som default
          this.selectDog(dogs[0]._id);
        }
      },
      error: (err) => console.error('❌ Error fetching dogs:', err)
    });
  }


  selectDog(selectedDogId: string) {
    console.log("🔍 Vald hund ID:", selectedDogId);
    this.dogProfileService.setActiveDog(selectedDogId);

    this.dogProfileService.getActiveDog().subscribe({
      next: (dog) => {
        if (!dog) {
          console.error("❌ Ingen hund hittades i API-svaret!");
          return;
        }
        console.log("✅ Hittade hund:", dog);
        this.activeDog = { ...dog };
        this.originalProfile = { ...dog };
      },
      error: (err) => console.error('❌ Error fetching active dog:', err)
    });
  }


  loadActiveDog() {
    const activeDogId = this.dogProfileService.getActiveDogId();

    if (!activeDogId) {
      console.error("❌ Ingen aktiv hund sparad.");
      return;
    }

    this.dogProfileService.getDogById(activeDogId).subscribe({
      next: (dog) => {
        this.activeDog = dog;
        this.originalProfile = { ...dog! };
      },
      error: (err) => console.error('❌ Error fetching active dog:', err)
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
      error: (err) => console.error('❌ Error saving changes:', err)
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
      image: ''
    };
  }

  addDog() {
    if (!this.newDog.name || !this.newDog.breed || this.newDog.age === undefined) {
      alert('Fyll i alla obligatoriska fält!');
      return;
    }

    this.dogProfileService.addDog(this.newDog as Dog).subscribe({
      next: (newDog) => {
        console.log("✅ Ny hund tillagd:", newDog);

        // 🔹 Stäng modalen OMEDELBART
        this.closeAddDogModal();

        // 🔹 Uppdatera hundlistan
        this.loadDogs();

        // 🔹 Välj den nya hunden automatiskt
        this.selectDog(newDog._id);
      },
      error: (err) => console.error('❌ Error adding dog:', err)
    });
  }




}
