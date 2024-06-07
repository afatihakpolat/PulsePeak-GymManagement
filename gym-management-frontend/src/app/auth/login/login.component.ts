import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  login() {
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/users/login', loginData)
      .subscribe(
        response => {
          console.log('Login successful', response);
          this.authService.login(response); // Store user data
          this.successMessage = 'Login successful, redirecting...';
          setTimeout(() => {
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin']); // Redirect to admin page if the user is an admin
            } else if (this.authService.isUserCoach()) {
              this.router.navigate(['/coach-dashboard']); // Redirect to coach dashboard if the user is a coach
            } else {
              this.router.navigate(['/profile']); // Redirect to profile page on successful login
            }
          }, 1500);
        },
        error => {
          console.error('Login failed', error);
          if (error.status === 401) {
            this.errorMessage = 'Wrong password';
          } else if (error.status === 404) {
            this.errorMessage = 'User does not exist';
          } else {
            this.errorMessage = 'Login failed: ' + (error.error.message || error.message);
          }
        }
      );
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}
