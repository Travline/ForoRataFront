import { Routes } from '@angular/router';
import { HomePosts } from './home-posts/home-posts';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: HomePosts },
  { path: 'login', component: Login }
];
