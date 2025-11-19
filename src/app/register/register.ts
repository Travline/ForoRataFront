import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

interface HealthResponse {
  message: string;
}
type ApiResponse = HealthResponse | ErrorState;

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  body: UserLogin = {
      id_user: '',
      password_hash: ''
    }
  
    constructor(private http: HttpClient) {}
  
    login(): Observable<ApiResponse> | ErrorState {
      const user = document.getElementById('user') as HTMLInputElement
      if (user) {
        if ((user.value).trim().length < 2) {
          return {
            isError: true,
            status: 400
          }
      }
        this.body.id_user = user.value
      }
      const pass = document.getElementById('pass') as HTMLInputElement
      if (pass) {
        if ((pass.value).trim().length < 8 || (pass.value).trim().includes(' ')) {
          return {
            isError: true,
            status: 400
          }
      }
        this.body.password_hash = pass.value
      }
      
      let res$: Observable<ApiResponse> = this.http.post<HealthResponse>(
        'https://fororataback.onrender.com/users/login', this.body,
        {
          headers: { 'accept': 'application/json' },
          withCredentials: true
        }
      ).pipe(
        catchError((err: { status: number }) => {
          const errorState: ErrorState = {
            isError: true,
            status: err.status 
          };
          console.error(errorState)
          return of(errorState);
        })
      );
  
      return res$
    }
}
