import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isRegistering = false;
  email = '';
  password = '';
  username = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.successMessage = '';
  }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Login successful!', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Felaktigt användarnamn eller lösenord';
      }
    });
  }

  register() {
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Registration successful!', res);
        this.successMessage = 'Lyckad registrering!';
        setTimeout(() => {
          this.toggleForm();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Misslyckad registrering MOHAHA';
      }
    });
  }
}
