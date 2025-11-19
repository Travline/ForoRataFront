import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

interface HealthResponse {
  message: string;
}
type ApiResponse = HealthResponse | ErrorState;

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  body: UserLogin = {
    id_user: '',
    password_hash: ''
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const user = document.getElementById('user') as HTMLInputElement
    if (user) {
      if ((user.value).trim().length < 2) {
        return
    }
      this.body.id_user = user.value
    }
    const pass = document.getElementById('pass') as HTMLInputElement
    if (pass) {
      if ((pass.value).trim().length < 1) {
        return
    }
      this.body.password_hash = pass.value
    }
    
    const url = 'https://fororataback.onrender.com/users/login'

    this.http.post<HealthResponse>(
      url, this.body,
      {
        headers: { 'accept': 'application/json' },
        withCredentials: true
      }
    ).pipe(
      catchError((err: any) => { // 'any' temporalmente, ajusta el tipo real de error HTTP
        const errorState: ErrorState = {
          isError: true,
          status: err.status || 500 // Maneja status si no existe
        };
        // Aquí manejarías errores, por ejemplo, mostrando un mensaje al usuario
        alert(`Error al iniciar sesión. Status: ${errorState.status}`);
        return of(errorState as any); // Retorna un Observable con el estado de error
      })
    ).subscribe(response => {
      // 1. Aquí se ejecuta cuando la petición es EXITOSA (200, 201, etc.)
      // 2. La cookie ya DEBE estar guardada por el navegador si CORS está bien.
      if ('message' in response) {
        this.router.navigate(['/'])
      }
      // Si la respuesta es un ErrorState (manejado por catchError y re-emitido), haz algo aquí si es necesario
    });

  }
}
