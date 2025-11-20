import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  @Input({ required: true }) user!: UserCardData;

  cleanSearch() {
    const searchBar = document.getElementById('search-input') as HTMLInputElement
    if (searchBar) {
      searchBar.value = ''
    }
    const searching = document.getElementById('searching-container') as HTMLHtmlElement
    if (searching) {
      searching.style.display = "none"
    }
  }
}
