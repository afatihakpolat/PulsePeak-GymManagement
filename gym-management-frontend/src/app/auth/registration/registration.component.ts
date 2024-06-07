import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  birthdate: string = '';
  gender: string = 'Male';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onSubmit() {
    if (!this.name || !this.surname || !this.email || !this.birthdate || !this.gender || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const registrationData = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      birthdate: this.birthdate,
      gender: this.gender,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/users/register', registrationData, { responseType: 'text' })
      .subscribe(response => {
        console.log('Registration successful', response);
        this.authService.login(registrationData); // Store user data
        this.successMessage = 'Registration successful, redirecting...';
        setTimeout(() => {
          this.router.navigate(['/profile']); // Redirect to profile page on successful registration
        }, 1500);
      }, error => {
        console.error('Registration failed', error);
        if (error.status === 409) {
          this.errorMessage = 'Email already registered';
        } else {
          this.errorMessage = 'Registration failed: ' + (error.error.message || error.message);
        }
      });
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}
