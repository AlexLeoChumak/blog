import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from '../shared/interfaces';
import { PostsService } from '../shared/posts.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  posts$!: Observable<IPost[]>;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.posts$ = this.postService.getAll();
  }
}
