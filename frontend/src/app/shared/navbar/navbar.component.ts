import { Component, inject, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [MatIconModule, RouterModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Lyssnar på klick vart som helst på dokumentet för att stänga navbar-menyn
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const menu = document.querySelector('.side-menu');
    const button = document.querySelector('.hamburger-menu');
    if (menu && !menu.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
      this.closeMenu();
    }
  }


}
