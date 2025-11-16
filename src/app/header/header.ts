import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';

// Define la estructura de la respuesta exitosa
interface HealthResponse {
  message: string;
}

type ApiResponse = HealthResponse | ErrorState;

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly logoImage = {
    src: '/assets/img/SmallRatCheese.webp',
    alt: 'logo'
  }
  
  private http = inject(HttpClient);
  res$: Observable<ApiResponse> = this.http.get<HealthResponse>(
    'http://127.0.0.1:8000/health',
    {
      headers: { 'accept': 'application/json' }
    }
  ).pipe(
    catchError((err: { status: number }) => {
      const errorState: ErrorState = {
         isError: true,
        status: err.status 
      };
      return of(errorState);
    })
  );
}
