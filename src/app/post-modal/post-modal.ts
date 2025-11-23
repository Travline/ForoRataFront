import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

interface HealthResponse {
  message: string
}

type ApiResponse = HealthResponse | ErrorState

@Component({
  selector: 'app-post-modal',
  imports: [],
  templateUrl: './post-modal.html',
  styleUrl: './post-modal.scss',
})
export class PostModal {
  write() {
    const textarea = document.getElementById('text-post') as HTMLTextAreaElement
    if(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const counter = document.getElementById('counter') as HTMLSpanElement
      if(counter) {
        counter.textContent = `${textarea.textLength}/200`
      }
    }
  }

  close() {
    const textarea = document.getElementById('text-post') as HTMLTextAreaElement
    if(textarea) {
      textarea.value = ''
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const counter = document.getElementById('counter') as HTMLSpanElement
      if(counter) {
        counter.innerText = `0/200`
      }
    }
    const modal = document.getElementById('post-modal') as HTMLDivElement
    if (modal) {
      modal.style.display = 'none'
    }
  }

  constructor(private http: HttpClient, private router: Router) {}

  post() {
    const url = 'https://fororataback.onrender.com/posts/add_post'
    
    const textarea = document.getElementById('text-post') as HTMLTextAreaElement
    if(textarea) {
      if (textarea.value.length < 1) {
        return
      }
      const body = { content_post :textarea.value.trim()}

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
          alert(`Error al iniciar sesión. Status: ${errorState.status}`);
          return of(errorState as any); // Retorna un Observable con el estado de error
        })
      ).subscribe(response => {
        // 1. Aquí se ejecuta cuando la petición es EXITOSA (200, 201, etc.)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/']);
        });
        close()
        // 2. La cookie ya DEBE estar guardada por el navegador si CORS está bien.
        if ('message' in response) {
          window.location.href = '/';
        }
        // Si la respuesta es un ErrorState (manejado por catchError y re-emitido), haz algo aquí si es necesario
      });
    }

  }
}
