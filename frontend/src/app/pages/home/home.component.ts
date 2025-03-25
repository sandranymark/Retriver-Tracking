import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showMore: boolean[] = [false, false, false];
  constructor() { }

  ngOnInit(): void {
  }

  toggleMore(index: number) {
    this.showMore[index] = !this.showMore[index];
  }

}
