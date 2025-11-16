import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface CustomApiError {
  status: number;
  apiMessage: string | null;
  userMessage: string;
  original: HttpErrorResponse;
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      const customError: CustomApiError = { // **ASIGNA LA INTERFAZ AQUÍ**
        status: err.status,
        apiMessage: err.error?.message ?? null,
        userMessage: getUserMessage(err),
        original: err
      };
      
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