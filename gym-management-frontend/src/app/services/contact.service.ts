import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  sendContactMessage(contactMessage: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send`, contactMessage);
  }

  deleteContactMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${messageId}`);
  }
}
