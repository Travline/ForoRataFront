import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit {
  @Input({ required: true }) user!: string 
  
  url: string = '';
  
  constructor(private router: Router) {  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.url = this.router.url.split('/')[1] || '';
      switch (this.url) {
        // usar input para definir ruta de perfil
      }
    });
  } 
}
