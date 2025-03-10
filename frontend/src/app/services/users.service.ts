import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getAllUsers(): User[] {
    // Hämta alla användare från backend
    return [];
  }

}
