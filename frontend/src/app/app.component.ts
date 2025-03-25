import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AuthService } from './core/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DogProfileService } from './core/dog-profile.service';
import { TrainingModalComponent } from './components/training-modal/training-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Training } from './models/training.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  standalone: true,
  selector: 'app-root',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' }
  ],
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RetrieverTracker';

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private dogProfileService: DogProfileService
  ) { }



  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  openTrainingModal() {
    this.dogProfileService.getAllDogs().subscribe(dogs => {
      const dialogRef = this.dialog.open(TrainingModalComponent, {
        width: '600px',
        data: { dogs }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log("Träningspass sparat:", result);
        }
      });
    });
  }
}
