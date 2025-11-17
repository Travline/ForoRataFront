// search.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

type ApiResponse = UserCardData[] | ErrorState

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // 1. Signal para almacenar el término de búsqueda (valor ingresado)
  public searchTerm = signal<string>('');

  // 2. Signal para almacenar los resultados de la API
  public results = signal<UserCardData[]>([]);
  public isLoading = signal<boolean>(false);

 constructor(private http: HttpClient) {
    const searchTerm$ = toObservable(this.searchTerm);

    searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading.set(true);

        if (term.length < 1) {
          this.isLoading.set(false);
          // 🚀 CAMBIO CLAVE: Usamos 'of' y emitimos un array vacío tipado.
          return of<UserCardData[]>([]); 
        }

        // Llamada HTTP ya tipada
        return this.http.get<UserCardData[]>(
          `https://fororataback.onrender.com/users/searching?user_id=${term}`,
          {
            headers: { 'accept': 'application/json' }
          }
        ).pipe(
          // Opcional pero altamente recomendado: Manejar errores de la API
          catchError(error => {
            console.error('Error al buscar usuarios:', error);
            this.isLoading.set(false);
            // Devolvemos un observable con un array vacío para no romper la suscripción
            return of<UserCardData[]>([]); 
          })
        );
      })
    // 🚀 CAMBIO CLAVE: Especificar el tipo del valor que se espera en el subscribe
    ).subscribe((data: UserCardData[]) => { 
      this.results.set(data);
      // La bandera de loading ya debería estar en false dentro del switchMap/catchError
      // para la rama de término corto y para la rama de error.
      // Aquí la ponemos en false para el caso de éxito:
      this.isLoading.set(false); 
    });
  }

  // Método para actualizar el término desde el Header
  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }
}