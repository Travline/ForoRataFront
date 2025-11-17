import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Searching } from "./searching/searching";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Searching],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Foro Rata');
  
}
