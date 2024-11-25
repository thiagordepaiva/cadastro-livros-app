import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Livro} from "./livro";

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly apiUrl = environment.apiUrl + 'livros';

  constructor(private readonly http: HttpClient) {
  }

  getLivros(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.apiUrl);
  }

  salvarLivro(livro: Livro): Observable<void> {
    return this.http.post<any>(this.apiUrl, livro).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deletarLivro(cod: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cod}`);
  }

  gerarRelatorio(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/listagem`, {
      responseType: 'blob',
    });
  }
}
