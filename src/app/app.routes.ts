import { Routes } from '@angular/router';
import { HomePosts } from './home-posts/home-posts';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', component: HomePosts },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile/:id_user', component: Profile }
];
