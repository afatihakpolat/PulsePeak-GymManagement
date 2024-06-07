import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  membership: any = {};
  measurements: any = {};
  successMessage: string = '';
  errorMessage: string = '';
  currentView: string = 'profile';
  assignedWorkoutPlan: any = null;

  newMeasurement: any = {
    weight: '',
    height: '',
    bmi: ''
  };

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadMembershipInfo();
    this.loadMeasurements();
    this.loadAssignedWorkoutPlan();
  }

  loadAssignedWorkoutPlan(): void {
    this.userService.getAssignedWorkoutPlan(this.user.id).subscribe(
      data => {
        this.assignedWorkoutPlan = data;
      },
      error => {
        this.errorMessage = 'Failed to load assigned workout plan';
      }
    );
  }

  loadMeasurements(): void {
    this.userService.getMeasurements(this.user.email).subscribe(
      data => {
        this.measurements = data;
      },
      error => {
        this.errorMessage = 'Failed to load measurements';
      }
    );
  }

  addMeasurement(): void {

    if (!this.newMeasurement.weight || !this.newMeasurement.height || isNaN(this.newMeasurement.weight) || isNaN(this.newMeasurement.height)) {
      this.errorMessage = 'Invalid measurement data';
      return;
    }

    this.userService.addMeasurement(this.user.email, this.newMeasurement).subscribe(
      response => {
        this.successMessage = 'Measurement added successfully';
        this.loadMeasurements(); // Update measurement log
        this.newMeasurement = { weight: '', height: '', bmi: '' }; // Reset the form
      },
      error => {
        this.errorMessage = 'Failed to add measurement: ' + (error.error.message || error.message);
      }
    );
  }

  deleteMeasurement(measurementId: number): void {
    this.userService.deleteMeasurement(this.user.email, measurementId).subscribe(
      response => {
        this.successMessage = response.message || 'Measurement deleted successfully';
        this.loadMeasurements(); // Refresh the measurements
      },
      error => {
        this.errorMessage = 'Failed to delete measurement: ' + (error.error.message || error.message);
      }
    );
  }

  loadMembershipInfo(): void {
    this.userService.getMembership(this.user.email).subscribe(
      data => {
        this.membership = data;
      },
      error => {
        this.errorMessage = 'Failed to load membership info';
      }
    );
  }


  purchaseMembership(membershipType: string): void {
    this.userService.purchaseMembership(this.user.email, membershipType).subscribe(
      response => {
        this.successMessage = 'Membership purchased successfully';
        this.loadMembershipInfo(); // Update membership info
      },
      error => {
        this.errorMessage = 'Failed to purchase membership: ' + (error.error.message || error.message);
        this.loadMembershipInfo();
      }
    );
  }


  onSubmit(): void {
    this.http.put('http://localhost:8080/api/users/update', this.user)
      .subscribe(
        response => {
          this.successMessage = 'Profile updated successfully';
          this.authService.login(this.user); // Update stored user data
        },
        error => {
          this.errorMessage = 'Failed to update profile: ' + (error.error.message || error.message);
        }
      );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/homepage']);
  }

  switchView(view: string): void {
    this.currentView = view;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
