import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { Post } from '@app/post/post';
import { catchError, Observable, of } from 'rxjs';

type ApiResponse = PostResponse[] | ErrorState

@Component({
  selector: 'app-home-posts',
  imports: [CommonModule, RouterLink, Post],
  templateUrl: './home-posts.html',
  styleUrl: './home-posts.scss',
})
export class HomePosts {
  private context = new HttpContext().set(SKIP_GLOBAL_AUTH_REDIRECT, true)
    private http = inject(HttpClient);
    res$: Observable<ApiResponse> = this.http.get<PostResponse[]>(
      'https://fororataback.onrender.com/posts/home',
      {
        headers: { 'accept': 'application/json' },
        withCredentials: true,
        context: this.context
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
