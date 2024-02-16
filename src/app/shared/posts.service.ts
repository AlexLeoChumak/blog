import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFbCreateResponse, IPost } from './interfaces';
import { Observable, map } from 'rxjs';
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
}
