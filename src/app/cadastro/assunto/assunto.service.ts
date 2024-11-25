import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Assunto} from "./assunto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AssuntoService {

  private readonly apiUrl = environment.apiUrl + 'assuntos';

  constructor(private readonly http: HttpClient) {
  }

  getAssuntos(): Observable<Assunto[]> {
    return this.http.get<Assunto[]>(this.apiUrl);
  }

  salvarAssunto(assunto: Assunto): Observable<void> {
    return this.http.post<any>(this.apiUrl, assunto).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deletarAssunto(cod: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cod}`);
  }
}
