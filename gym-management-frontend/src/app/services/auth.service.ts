import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  }

  isUserCoach(): boolean {
    const user = this.getUser();
    return user && user.role === 'COACH';
  }

  getUserId(): number {
    const user = this.getUser();
    return user ? user.id : null;
  }
}
