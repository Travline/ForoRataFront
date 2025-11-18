import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  
}
