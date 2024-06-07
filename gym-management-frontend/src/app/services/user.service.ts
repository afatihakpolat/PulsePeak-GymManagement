import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private adminUrl = 'http://localhost:8080/api/admin';
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getMembership(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/membership?email=${email}`);
  }

  purchaseMembership(email: string, membershipType: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/purchaseMembership?email=${email}&type=${membershipType}`, {});
  }

  getMeasurements(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/measurements`, { params: { email } });
  }

  addMeasurement(email: string, measurement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/measurements`, measurement, { params: { email } });
  }

  deleteMeasurement(email: string, measurementId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/measurements/${measurementId}`, {
      params: { email }
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/users`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.adminUrl}/deleteUser/${userId}`);
  }

  getAllCoaches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/coaches`);
  }

  addCoach(coach: any): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}/addCoach`, coach, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateCoach(coach: any): Observable<any> {
    return this.http.put<any>(`${this.adminUrl}/updateCoach`, coach, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteCoach(coachId: number): Observable<any> {
    return this.http.delete<any>(`${this.adminUrl}/deleteCoach/${coachId}`);
  }

  assignCoachToUser(userId: number, coachId: number | null): Observable<any> {
    let params = new HttpParams().set('userId', userId.toString());
    if (coachId !== null) {
        params = params.set('coachId', coachId.toString());
    } else {
        params = params.set('coachId', '');  // Use 'null' string to denote no coach
    }
    return this.http.post<any>(`${this.apiUrl}/assignCoach`, {}, { params });
  }

  assignWorkoutPlanToClient(clientId: number, workoutPlanId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/workout-plans/assignPlanToClient`, null, {
      params: { clientId: clientId.toString(), workoutPlanId: workoutPlanId.toString() }
    });
  }

  getClientsWithLatestBmi(coachId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coachClients/${coachId}`);
  }

  getMeasurementLogs(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/measurementLogs`);
  }

  getAssignedWorkoutPlan(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/assigned-workout-plan`);
  }
  
}
