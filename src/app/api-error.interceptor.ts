import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpContextToken
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export interface CustomApiError {
  status: number;
  apiMessage: string | null;
  userMessage: string;
  original: HttpErrorResponse;
}

export const SKIP_GLOBAL_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false)

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      const customError: CustomApiError = { // **ASIGNA LA INTERFAZ AQUÍ**
        status: err.status,
        apiMessage: err.error?.message ?? null,
        userMessage: getUserMessage(err),
        original: err
      };
      
      if (err.status === 401) {
        const skipRedirect = req.context.get(SKIP_GLOBAL_AUTH_REDIRECT)
        if (!skipRedirect) {
          router.navigate(['/login'])
        }
      }

      return throwError(() => customError); 
    })
  );
};

function getUserMessage(err: HttpErrorResponse) {
  switch (err.status) {
    case 0: return "No hay conexión con el servidor.";
    case 400: return "La solicitud no es válida.";
    case 401: return "Debes iniciar sesión.";
    case 403: return "No tienes permiso.";
    case 404: return "No encontrado.";
    case 500: return "Error interno del servidor.";
    default: return "Error desconocido.";
  }
}