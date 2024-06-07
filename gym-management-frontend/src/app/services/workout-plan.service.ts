import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService {
  private baseUrl = 'http://localhost:8080/api/workout-plans';

  constructor(private http: HttpClient) { }

  addWorkoutPlan(coachId: number, workoutPlan: any): Observable<any> {
    let params = new HttpParams().set('coachId', coachId.toString());
    return this.http.post(`${this.baseUrl}/add`, workoutPlan, { params });
  }

  assignWorkoutPlan(workoutPlanId: number, clientId: number): Observable<any> {
    let params = new HttpParams().set('workoutPlanId', workoutPlanId.toString())
                                 .set('clientId', clientId.toString());
    return this.http.post(`${this.baseUrl}/assign`, null, { params });
  }

  getWorkoutPlans(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  updateWorkoutPlan(planId: number, workoutPlan: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${planId}`, workoutPlan);
  }

  deleteWorkoutPlan(planId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${planId}`);
  }
}
