import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  standalone: true,
  imports: [MatIconModule, CommonModule]
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() max: number = 5;
  @Input() showValue: boolean = true;

  getStars(): string[] {
    const stars: string[] = [];
    for (let i = 0; i < this.max; i++) {
      stars.push(i < this.rating ? 'full-star' : 'empty-star');
    }
    return stars;
  }
}
