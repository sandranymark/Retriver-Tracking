import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Training } from '../../models/training.model';
import { RatingComponent } from '../../shared/rating/rating.component';

@Component({
  selector: 'app-latest-training',
  standalone: true,
  imports: [CommonModule, MatIconModule, RatingComponent],
  templateUrl: './latest-training.component.html',
  styleUrl: './latest-training.component.css'
})
export class LatestTrainingComponent {

  @Input() training: Training | null = null;
  @Input() dogName: string | undefined = '';



  constructor() { }




}
