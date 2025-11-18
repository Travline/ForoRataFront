import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { Searching } from '@app/searching/searching';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '@app/searching/search-service';
import { LucideAngularModule, Hamburger } from 'lucide-angular';

// Define la estructura de la respuesta exitosa
interface HealthResponse {
  message: string;
}

type ApiResponse = HealthResponse | ErrorState;

@Component({
  selector: 'app-header',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
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

  private http = inject(HttpClient);
  res$: Observable<ApiResponse> = this.http.get<HealthResponse>(
    'https://fororataback.onrender.com/health',
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
