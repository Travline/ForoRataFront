import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UserCard } from '@app/user-card/user-card';
import { SearchService } from './search-service';

@Component({
  selector: 'app-searching',
  imports: [UserCard, CommonModule],
  templateUrl: './searching.html',
  styleUrl: './searching.scss',
})
export class Searching {
  private searchService = inject(SearchService);
  
  // Accede a las Signals directamente
  results = this.searchService.results;
  isLoading = this.searchService.isLoading;
}
