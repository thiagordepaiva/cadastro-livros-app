import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Autor} from "./autor";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private readonly apiUrl = environment.apiUrl + 'autores';

  constructor(private readonly http: HttpClient) {
  }

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  salvarAutor(autor: Autor): Observable<void> {
    return this.http.post<any>(this.apiUrl, autor).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deletarAutor(cod: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cod}`);
  }
}
