import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, RouterModule, NavbarComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
