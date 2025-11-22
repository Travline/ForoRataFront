import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { ListPlus, LucideAngularModule } from 'lucide-angular';
import { catchError, Observable, of } from 'rxjs';

interface HealthResponse {
  id_user: string,
  profile_picture: string,
  description: string,
  followers: number,
  following: number
}

type ApiResponse = HealthResponse | ErrorState

@Component({
  selector: 'app-side-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './side-profile.html',
  styleUrl: './side-profile.scss',
})
export class SideProfile {
  @Input({ required: true }) user!: string;

  private context = new HttpContext().set(SKIP_GLOBAL_AUTH_REDIRECT, true);
  private http = inject(HttpClient);
  
  // Declara res$ sin inicializarlo, o inicialízalo como null/undefined/of(null)
  res$!: Observable<ApiResponse>; 

  ngOnInit(): void {
    // ESTO SE EJECUTA DESPUÉS DE QUE EL INPUT 'user' RECIBIÓ SU VALOR
    console.log('User ID en SideProfile:', this.user); // Esto ya no será undefined

    // Ahora inicializa res$ usando this.user
    this.res$ = this.http.get<HealthResponse>(
      `https://fororataback.onrender.com/users/profile_data/${this.user}`,
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
}