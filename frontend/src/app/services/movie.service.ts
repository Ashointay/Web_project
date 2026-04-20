import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private api = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/movies/`);
  }

  getMovie(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/movies/${id}/`);
  }

  aiSearch(description: string): Observable<any> {
    return this.http.post<any>(`${this.api}/ai-search/`, { query: description });
  }
}