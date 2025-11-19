import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Searching } from "./searching/searching";
import { SideMenu } from "./side-menu/side-menu";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Searching, SideMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Foro Rata');
  
  url: string = '';
  
  constructor(private router: Router) { 

  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.url = this.router.url.split('/')[1] || '';
      if (this.url === 'login' || this.url === 'register') {
        const main = document.getElementById('main-container') as HTMLHtmlElement
        main.className = "main-sides-off"
      } else {
        const main = document.getElementById('main-container') as HTMLHtmlElement
        main.className = ""
      }
    });
  } 

}
