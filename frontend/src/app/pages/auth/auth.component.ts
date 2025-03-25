import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, FormsModule, MatSnackBarModule],
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // login() {
  //   this.authService.login({ email: this.email, password: this.password }).subscribe({
  //     next: (res) => {
  //       console.log('Login successful!', res);
  //       this.router.navigate(['/home']);
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Felaktigt användarnamn eller lösenord';
  //     }
  //   });
  // }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login successful!', res);
        this.snackBar.open('Inloggning lyckades!', 'Stäng', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Fel e-post eller lösenord.', 'Stäng', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }


  // register() {
  //   this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
  //     next: (res) => {
  //       console.log('Registration successful!', res);
  //       this.successMessage = 'Lyckad registrering!';
  //       setTimeout(() => {
  //         this.toggleForm();
  //       }, 2000);
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Misslyckad registrering MOHAHA';
  //     }
  //   });
  // }

  register() {
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Registration successful!', res);
        this.snackBar.open('Registreringen lyckades!', 'Stäng', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        setTimeout(() => {
          this.toggleForm();
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Registreringen misslyckades – kontrollera uppgifterna.', 'Stäng', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

}
