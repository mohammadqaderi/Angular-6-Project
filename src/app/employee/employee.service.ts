import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import {Observable, throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  baseURL = 'http://localhost:3000/employees';
 
  getEmployee(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side error:', errorResponse.error);
    } else {
      console.error('Server side error:', errorResponse);
    }
    return throwError('There is a  problem with the server');
  }
  getEmployeeId(id: number): Observable<IEmployee> {
  return this.http.get<IEmployee>(`${this.baseURL}/${id}`)
  .pipe(catchError(this.handleError));
 } 

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.baseURL, employee, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(catchError(this.handleError));
    }

    
  updateEmployee(employee: IEmployee): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${employee.id}`, employee , {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(catchError(this.handleError));
    }

    deleteEmployee(id: number): Observable<void>{
      return this.http.delete<void>(`${this.baseURL}/${id}`)
      .pipe(catchError(this.handleError));
    }
}
