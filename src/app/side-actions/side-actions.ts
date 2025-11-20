import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { catchError, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SideProfile } from '@app/side-profile/side-profile';
import { SideMenu } from '@app/side-menu/side-menu';

interface HealthResponse {
  me: string
}

type ApiResponse = HealthResponse | ErrorState

@Component({
  selector: 'app-side-actions',
  imports: [CommonModule, RouterLink, SideProfile, SideMenu],
  templateUrl: './side-actions.html',
  styleUrl: './side-actions.scss',
})
export class SideActions {
  private context = new HttpContext().set(SKIP_GLOBAL_AUTH_REDIRECT, true)
  private http = inject(HttpClient);
  res$: Observable<ApiResponse> = this.http.get<HealthResponse>(
    'https://fororataback.onrender.com/me',
    {
      headers: { 'accept': 'application/json' },
      withCredentials: true,
      context: this.context
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
