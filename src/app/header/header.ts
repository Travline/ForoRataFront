import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '@app/searching/search-service';
import { LucideAngularModule, Hamburger } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';

// Define la estructura de la respuesta exitosa
interface HealthResponse {
  me: string;
}

type ApiResponse = HealthResponse | ErrorState;

@Component({
  selector: 'app-header',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private searchService = inject(SearchService)
  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchService.updateSearchTerm(term);
  }

  protected readonly logoImage = {
    src: '/assets/img/SmallRatCheese.webp',
    alt: 'logo'
  }
  
  readonly hamburguer = Hamburger

  public searchControl = new FormControl('');

    url: string = '';
  
  constructor(private router: Router) { 

  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.url = this.router.url.split('/')[1] || '';
    });
  } 

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
