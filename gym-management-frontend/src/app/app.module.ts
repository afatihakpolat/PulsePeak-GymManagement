import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CoachDashboardComponent } from './coach/coach-dashboard/coach-dashboard.component'; // Import the new component

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { UserService } from './services/user.service'; // Import the UserService
import { WorkoutPlanService } from './services/workout-plan.service'; // Import the WorkoutPlanService

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RegistrationComponent,
    UserProfileComponent,
    AdminDashboardComponent,
    CoachDashboardComponent // Declare the new component
  ],
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule, // Add ReactiveFormsModule here
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthGuard, AdminGuard, UserService, WorkoutPlanService], // Provide the necessary services
  bootstrap: [AppComponent]
})
export class AppModule { }
