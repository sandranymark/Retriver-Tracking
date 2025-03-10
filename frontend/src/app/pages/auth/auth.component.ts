import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  isRegistering = false;


  users: User[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }



}
