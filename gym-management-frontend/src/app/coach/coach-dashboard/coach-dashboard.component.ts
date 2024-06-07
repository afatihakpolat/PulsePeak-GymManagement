import { Component, OnInit } from '@angular/core';
import { WorkoutPlanService } from '../../services/workout-plan.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css']
})
export class CoachDashboardComponent implements OnInit {
  currentView: string = 'workoutPlans';
  workoutPlans: any[] = [];
  filteredWorkoutPlans: any[] = [];
  clients: any[] = [];
  measurementLogs: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  newPlan: any = {};
  assignment: any = {};
  selectedPlan: any = null;
  selectedClient: any = null; // Added to track selected client

  constructor(
    private workoutPlanService: WorkoutPlanService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadWorkoutPlans();
    this.loadClients();
  }

  switchView(view: string): void {
    this.currentView = view;
    this.clearMessages();
  }

  loadWorkoutPlans(): void {
    this.workoutPlanService.getWorkoutPlans().subscribe(
      data => {
        this.workoutPlans = data;
        this.filteredWorkoutPlans = data;
      },
      error => {
        this.errorMessage = 'Failed to load workout plans: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  loadClients(): void {
    const coachId = this.authService.getUser().id;
    this.userService.getAllUsers().subscribe(
      data => {
        this.clients = data.filter(user => user.coachId === coachId && user.role === 'USER');
        this.filteredClients = this.clients;
        this.filteredClients.forEach(client => {
          console.log(`Client: ${client.name}, Assigned Workout Plans: ${client.assignedWorkoutPlans}`);
        });
      },
      error => {
        console.error('Error loading clients:', error); // Log the error to debug
        this.errorMessage = 'Failed to load clients: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  filterWorkoutPlans(): void {
    this.filteredWorkoutPlans = this.workoutPlans.filter(plan =>
      plan.planName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addWorkoutPlan(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.newPlan.coachId = user.id;
      this.workoutPlanService.addWorkoutPlan(this.newPlan.coachId, this.newPlan).subscribe(
        response => {
          this.successMessage = 'Workout plan added successfully';
          this.loadWorkoutPlans();
          this.newPlan = {};
          this.clearMessagesAfterTimeout();
        },
        error => {
          this.errorMessage = 'Failed to add workout plan: ' + (error.error.message || error.message);
          this.clearMessagesAfterTimeout();
        }
      );
    }
  }

  assignWorkoutPlan(): void {
    this.workoutPlanService.assignWorkoutPlan(this.assignment.workoutPlanId, this.assignment.clientId).subscribe(
      response => {
        this.successMessage = 'Workout plan assigned successfully';
        this.assignment = {};
        this.loadClients(); // Reload clients to reflect changes
        this.clearMessagesAfterTimeout();
      },
      error => {
        this.errorMessage = 'Failed to assign workout plan: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  editWorkoutPlan(plan: any): void {
    this.selectedPlan = { ...plan };
  }

  saveWorkoutPlan(): void {
    if (this.selectedPlan) {
      this.workoutPlanService.updateWorkoutPlan(this.selectedPlan.id, this.selectedPlan).subscribe(
        response => {
          this.successMessage = 'Workout plan updated successfully';
          this.loadWorkoutPlans();
          this.selectedPlan = null;
          this.clearMessagesAfterTimeout();
        },
        error => {
          this.errorMessage = 'Failed to update workout plan: ' + (error.error.message || error.message);
          this.clearMessagesAfterTimeout();
        }
      );
    }
  }

  deleteWorkoutPlan(planId: number): void {
    this.workoutPlanService.deleteWorkoutPlan(planId).subscribe(
      response => {
        this.successMessage = 'Workout plan deleted successfully';
        this.loadWorkoutPlans();
        this.clearMessagesAfterTimeout();
      },
      error => {
        this.errorMessage = 'Failed to delete workout plan: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  assignWorkoutPlanToClient(clientId: number, workoutPlanId: number): void {
    this.userService.assignWorkoutPlanToClient(clientId, workoutPlanId).subscribe(
      response => {
        this.successMessage = 'Workout plan assigned successfully';
        this.loadClients(); // Reload clients to reflect changes
        this.clearMessagesAfterTimeout();
      },
      error => {
        this.errorMessage = 'Failed to assign workout plan: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  viewMeasurementLogs(client: any): void {
    this.selectedClient = client;
    this.userService.getMeasurementLogs(client.id).subscribe(
      data => {
        this.measurementLogs = data;
        console.log('Measurement logs:', this.measurementLogs);
      },
      error => {
        console.error('Error loading measurement logs:', error);
        this.errorMessage = 'Failed to load measurement logs: ' + (error.error.message || error.message);
        this.clearMessagesAfterTimeout();
      }
    );
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  logout(): void {
    this.authService.logout();
  }

  clearMessagesAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}
