import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFbCreateResponse, IPost } from './interfaces';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: IPost): Observable<IPost> {
    return this.http
      .post<IFbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: IFbCreateResponse) => {
          return {
            ...post,
            id: response.name,
            date: new Date(post.date),
          };
        })
      );
  }

  getAll(): Observable<IPost[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`).pipe(
      catchError((error) => {
        console.error('Error fetching posts: ', error);
        return of([]);
      }),
      map((response: { [key: string]: any }) => {
        if (!response) return [];
        return Object.keys(response).map((key) => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date),
        }));
      })
    );
  }

  getById(id: string): Observable<IPost> {
    return this.http.get<IPost>(`${environment.fbDbUrl}/posts/${id}.json`).pipe(
      map((post: IPost) => {
        return {
          ...post,
          id,
          date: new Date(post.date),
        };
      })
    );
  }

  update(post: IPost): Observable<IPost> {
    return this.http.patch<IPost>(
      `${environment.fbDbUrl}/posts/${post.id}.json`,
      post
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
}
