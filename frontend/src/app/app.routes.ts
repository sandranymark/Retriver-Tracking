import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { AppComponent } from './app.component';
import { HistoryComponent } from './pages/history/history.component';


export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    // { path: '', component: AppComponent },
    { path: 'home', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'history', component: HistoryComponent },
    { path: '**', redirectTo: '' }
];
