import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Dog } from '../../models/dog.model'; // ✅ Importera Dog-modellen

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  editMode = false; // Styr om vi redigerar eller ej


  dogProfile: Dog = {
    id: '1',
    name: 'Almanza Grabs your Attention',
    nickname: 'Triton',
    breed: 'Flatcoated Retriever',
    age: 4,
    sex: 'Hane',
    image: 'assets/img/flatcoatedRetriever1.jpg',
    trainingHistory: [
      '2025-03-01: Träningspass - Bra framsteg med apportering.',
      '2025-03-03: Träningspass - Förbättring i lydnad.'
    ]
  };


  originalProfile: Dog = { ...this.dogProfile };

  profileFields: { key: keyof Dog; label: string }[] = [
    { key: 'name', label: 'Namn' },
    { key: 'breed', label: 'Ras' },
    { key: 'sex', label: 'Kön' },
    { key: 'age', label: 'Född' }
  ];

  toggleEditMode() {
    this.editMode = true;
  }

  saveChanges() {
    this.editMode = false;
    this.originalProfile = { ...this.dogProfile };
    console.log("Ändringar sparade:", this.dogProfile);
  }

  cancelEdit() {
    this.dogProfile = { ...this.originalProfile };
    this.editMode = false;
  }
}
