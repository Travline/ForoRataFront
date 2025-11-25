import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core'; // Ya no es necesario Input
import { ActivatedRoute } from '@angular/router'; // <-- Importar ActivatedRoute
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { Post } from '@app/post/post';
import { catchError, Observable, of, switchMap } from 'rxjs'; // <-- Importar switchMap

type ApiResponse = PostFocusResponse | ErrorState; // Asumo que estos tipos están definidos

@Component({
  selector: 'app-focus-post',
  imports: [Post, CommonModule],
  templateUrl: './focus-post.html',
  styleUrl: './focus-post.scss',
  standalone: true, 
})
export class FocusPost implements OnInit {
  // Ya no necesitamos @Input(), lo obtendremos del ActivatedRoute
  
  res$!: Observable<ApiResponse>; 

  private context = new HttpContext().set(SKIP_GLOBAL_AUTH_REDIRECT, true);
  private http = inject(HttpClient);
  // Inyectar el ActivatedRoute para obtener acceso al Observable de la ruta
  private route = inject(ActivatedRoute); 

  ngOnInit(): void {
    // 1. Nos suscribimos al Observable de los parámetros de la ruta (paramMap)
    this.res$ = this.route.paramMap.pipe(
      // 2. Usamos switchMap: cuando el 'paramMap' emita un nuevo valor (un cambio de ruta):
      switchMap(params => {
        // Obtener el ID del parámetro de la ruta (asumiendo que se llama 'id_post')
        const id_post = params.get('id_post');

        if (!id_post) {
          console.error('ERROR: id_post no se encontró en la ruta.');
          return of({ isError: true, status: 400 } as ErrorState);
        }

        // 3. Devolver el Observable de la llamada HTTP
        return this.http.get<PostFocusResponse>(
          `https://fororataback.onrender.com/posts/focus/${id_post}`, // <-- Usamos el nuevo ID
          {
            headers: { 'accept': 'application/json' },
            withCredentials: true,
            context: this.context
          }
        ).pipe(
          // 4. Manejo de errores para la solicitud HTTP
          catchError((err: { status: number }) => {
            const errorState: ErrorState = {
              isError: true,
              status: err.status 
            };
            return of(errorState);
          })
        );
      })
      // NOTA: No necesitamos llamar a .subscribe().
      // La suscripción se realiza en la plantilla con el pipe | async.
    );
  }
}