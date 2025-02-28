import { Component } from '@angular/core';
import { CalendarComponent } from "../../components/calendar/calendar.component";

@Component({
  selector: 'app-profile',
  imports: [CalendarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
