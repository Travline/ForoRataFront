import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly logoImage = {
    src: '/assets/img/SmallRatCheese.webp',
    alt: 'logo'
  }
}
