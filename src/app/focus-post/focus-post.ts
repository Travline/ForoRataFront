import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core'; // Ya no es necesario Input
import { ActivatedRoute, Router } from '@angular/router'; // <-- Importar ActivatedRoute
import { SKIP_GLOBAL_AUTH_REDIRECT } from '@app/api-error.interceptor';
import { Post } from '@app/post/post';
import { catchError, Observable, of, switchMap } from 'rxjs'; // <-- Importar switchMap

type ApiResponse = PostFocusResponse | ErrorState; // Asumo que estos tipos están definidos

interface HealthResponse {
  message: string
}
type ApiResponsePost = HealthResponse | ErrorState

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
  // Inyectar el ActivatedRoute para obtener acceso al Observable de la ruta
  private route = inject(ActivatedRoute); 
  id_post: string = ''

  ngOnInit(): void {
    // 1. Nos suscribimos al Observable de los parámetros de la ruta (paramMap)
    this.res$ = this.route.paramMap.pipe(
      // 2. Usamos switchMap: cuando el 'paramMap' emita un nuevo valor (un cambio de ruta):
      switchMap(params => {
        // Obtener el ID del parámetro de la ruta (asumiendo que se llama 'id_post')
        this.id_post = params.get('id_post') as string;

        if (!this.id_post) {
          console.error('ERROR: id_post no se encontró en la ruta.');
          return of({ isError: true, status: 400 } as ErrorState);
        }

        // 3. Devolver el Observable de la llamada HTTP
        return this.http.get<PostFocusResponse>(
          `https://fororataback.onrender.com/posts/focus/${this.id_post}`, // <-- Usamos el nuevo ID
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

  write() {
    const textarea = document.getElementById('text-reply') as HTMLTextAreaElement
    if(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const counter = document.getElementById('counter-reply') as HTMLSpanElement
      if(counter) {
        counter.textContent = `${textarea.textLength}/200`
      }
    }
  }

  showActions() {
    const footer = document.getElementById('footer-reply') as HTMLDivElement
    if (footer) {
      footer.style.display = 'flex'
    }
  }

  close() {
    const textarea = document.getElementById('text-reply') as HTMLTextAreaElement
    if(textarea) {
      textarea.value = ''
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const counter = document.getElementById('counter-reply') as HTMLSpanElement
      if(counter) {
        counter.innerText = `0/200`
      }
    }
  }

  constructor(private http: HttpClient, private router: Router) {}

  post() {
    const url = 'https://fororataback.onrender.com/posts/add_post'
    
    const textarea = document.getElementById('text-reply') as HTMLTextAreaElement
    if(textarea) {
      if (textarea.value.length < 1) {
        return
      }
      const body = { 
        content_post :textarea.value.trim(),
        reply_to: this.id_post
      }

      this.http.post<HealthResponse>(
        url, body,
        {
          headers: { 'accept': 'application/json' },
          withCredentials: true
        }
      ).pipe(
        catchError((err: any) => { // 'any' temporalmente, ajusta el tipo real de error HTTP
          const errorState: ErrorState = {
            isError: true,
            status: err.status || 500 // Maneja status si no existe
          };
          // Aquí manejarías errores, por ejemplo, mostrando un mensaje al usuario
          alert(`Error ${errorState.status}`)
          return of(errorState as any); // Retorna un Observable con el estado de error
        })
      ).subscribe(response => {
        // 1. Aquí se ejecuta cuando la petición es EXITOSA (200, 201, etc.)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/post', this.id_post]);
        });
        this.close()
        
        // Si la respuesta es un ErrorState (manejado por catchError y re-emitido), haz algo aquí si es necesario
      });
    }

  }
}