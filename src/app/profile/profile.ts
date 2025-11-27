import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { Post } from '@app/post/post';
import { catchError, Observable, of, switchMap } from 'rxjs';

type ApiResponse = ErrorState | ProfileData
type PostApiUser = PostResponse[] | ErrorState

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, Post],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  res$!: Observable<ApiResponse>; 
  resp$!: Observable<PostApiUser>

  constructor(private http: HttpClient, private router: Router) {}
  
    private context = new HttpContext().set(SKIP_GLOBAL_AUTH_REDIRECT, true);
    // Inyectar el ActivatedRoute para obtener acceso al Observable de la ruta
    private route = inject(ActivatedRoute); 
    id_user: string = ''
  
    ngOnInit(): void {
      // 1. Nos suscribimos al Observable de los parámetros de la ruta (paramMap)
      this.res$ = this.route.paramMap.pipe(
        // 2. Usamos switchMap: cuando el 'paramMap' emita un nuevo valor (un cambio de ruta):
        switchMap(params => {
          // Obtener el ID del parámetro de la ruta (asumiendo que se llama 'id_post')
          this.id_user = params.get('id_user') as string;
  
          if (!this.id_user) {
            console.error('ERROR: id_post no se encontró en la ruta.');
            return of({ isError: true, status: 400 } as ErrorState);
          }
  
          // 3. Devolver el Observable de la llamada HTTP
          return this.http.get<ProfileData>(
            `https://fororataback.onrender.com/users/profile_data/${this.id_user}`, // <-- Usamos el nuevo ID
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
      this.res$ = this.route.paramMap.pipe(
    // 2. switchMap para reaccionar al cambio de ruta
    switchMap(params => {
      // Obtener y almacenar el ID
      this.id_user = params.get('id_user') as string;

      if (!this.id_user) {
        console.error('ERROR: id_user no se encontró en la ruta.');
        return of({ isError: true, status: 400 } as ErrorState);
      }

      // 3. Devolver el Observable de la primera llamada HTTP (Datos de Perfil)
      return this.http.get<ProfileData>(
        `https://fororataback.onrender.com/users/profile_data/${this.id_user}`,
        {
          headers: { 'accept': 'application/json' },
          withCredentials: true,
          context: this.context
        }
      ).pipe(
        // 4. Encadenar la Lógica para los Posts (resp$)
        switchMap(profileData => {
          // Asignamos el Observable de los Posts a this.resp$ AQUÍ
          this.resp$ = this.http.get<PostResponse[]>(
            `https://fororataback.onrender.com/posts/user/${this.id_user}`, // <-- ¡Ahora this.id_user ya tiene el valor!
            {
              headers: { 'accept': 'application/json' },
              withCredentials: true,
              context: this.context
            }
          ).pipe(
            catchError((err: { status: number }) => {
              const errorState: ErrorState = { isError: true, status: err.status };
              return of(errorState as PostApiUser);
            })
          );
          
          // 5. Devolvemos los datos del perfil para el pipe | async de res$
          return of(profileData as ApiResponse);
        }),
        // 6. Manejo de errores para la solicitud HTTP de Perfil
        catchError((err: { status: number }) => {
          const errorState: ErrorState = { isError: true, status: err.status };
          return of(errorState as ApiResponse);
        })
      );
    })
  );

    }
  
}
