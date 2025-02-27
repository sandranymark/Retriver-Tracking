import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isRegistering = false;

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

}
